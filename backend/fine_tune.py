"""
Fine-tuning script for Hausa GPT model
This script handles the complete fine-tuning workflow
"""

from openai import OpenAI
import os
import json
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


class HausaFineTuner:
    """Handles fine-tuning of GPT models for Hausa language"""
    
    def __init__(self, training_file_path):
        self.training_file_path = training_file_path
        self.file_id = None
        self.job_id = None
        self.model_id = None
    
    def upload_training_file(self):
        """Upload training data to OpenAI"""
        print(f"Uploading training file: {self.training_file_path}")
        
        with open(self.training_file_path, 'rb') as f:
            response = client.files.create(
                file=f,
                purpose='fine-tune'
            )
        
        self.file_id = response.id
        print(f"✓ File uploaded successfully. File ID: {self.file_id}")
        return self.file_id
    
    def validate_file(self):
        """Validate the uploaded file"""
        print(f"Validating file: {self.file_id}")
        
        file_info = client.files.retrieve(self.file_id)
        print(f"File status: {file_info.status}")
        print(f"File size: {file_info.bytes} bytes")
        
        # Wait for file to be processed
        while file_info.status == 'processing':
            print("Waiting for file processing...")
            time.sleep(5)
            file_info = client.files.retrieve(self.file_id)
        
        if file_info.status == 'processed':
            print("✓ File validated and ready for fine-tuning")
            return True
        else:
            print(f"✗ File validation failed: {file_info.status}")
            return False
    
    def create_fine_tuning_job(self, model='gpt-3.5-turbo', suffix='hausa-v1'):
        """Create a fine-tuning job"""
        print(f"\nCreating fine-tuning job for model: {model}")
        
        try:
            response = client.fine_tuning.jobs.create(
                training_file=self.file_id,
                model=model,
                suffix=suffix,
                hyperparameters={
                    "n_epochs": 3  # Adjust based on dataset size
                }
            )
            
            self.job_id = response.id
            print(f"✓ Fine-tuning job created: {self.job_id}")
            print(f"Status: {response.status}")
            return self.job_id
            
        except Exception as e:
            print(f"✗ Error creating fine-tuning job: {str(e)}")
            return None
    
    def monitor_job(self, check_interval=60):
        """Monitor fine-tuning job progress"""
        if not self.job_id:
            print("No job ID available")
            return
        
        print(f"\nMonitoring job: {self.job_id}")
        print("This may take several minutes to hours depending on dataset size...")
        
        while True:
            job = client.fine_tuning.jobs.retrieve(self.job_id)
            status = job.status
            
            print(f"\nStatus: {status}")
            
            if status == 'succeeded':
                self.model_id = job.fine_tuned_model
                print(f"\n✓ Fine-tuning completed successfully!")
                print(f"Fine-tuned model ID: {self.model_id}")
                break
            
            elif status == 'failed':
                print(f"\n✗ Fine-tuning failed")
                if hasattr(job, 'error'):
                    print(f"Error: {job.error}")
                break
            
            elif status == 'cancelled':
                print("\n✗ Fine-tuning was cancelled")
                break
            
            # Still running
            print(f"Checking again in {check_interval} seconds...")
            time.sleep(check_interval)
    
    def list_events(self, limit=10):
        """List recent events for the fine-tuning job"""
        if not self.job_id:
            print("No job ID available")
            return
        
        events = client.fine_tuning.jobs.list_events(
            fine_tuning_job_id=self.job_id,
            limit=limit
        )
        
        print(f"\nRecent events for job {self.job_id}:")
        for event in events.data:
            print(f"  [{event.created_at}] {event.message}")
    
    def test_model(self, test_message="Sannu, yaya kake?"):
        """Test the fine-tuned model"""
        if not self.model_id:
            print("No model ID available. Fine-tuning may not be complete.")
            return
        
        print(f"\nTesting fine-tuned model: {self.model_id}")
        print(f"Test message: {test_message}")
        
        try:
            response = client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": "You are a helpful Hausa language assistant."},
                    {"role": "user", "content": test_message}
                ]
            )
            
            print(f"\nModel response:")
            print(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error testing model: {str(e)}")
    
    def save_model_info(self, output_file='model_info.json'):
        """Save model information for later use"""
        if not self.model_id:
            print("No model information to save")
            return
        
        info = {
            'model_id': self.model_id,
            'job_id': self.job_id,
            'file_id': self.file_id,
            'timestamp': time.time()
        }
        
        with open(output_file, 'w') as f:
            json.dump(info, f, indent=2)
        
        print(f"\n✓ Model information saved to {output_file}")


def main():
    """Main fine-tuning workflow"""
    print("=" * 60)
    print("Hausa GPT Fine-Tuning Script")
    print("=" * 60)
    
    # Check for API key
    if not os.getenv('OPENAI_API_KEY'):
        print("\n✗ Error: OPENAI_API_KEY not found in environment")
        print("Please set your API key in .env file")
        return
    
    # Training file path
    training_file = 'hausa_training.jsonl'
    
    if not os.path.exists(training_file):
        print(f"\n✗ Error: Training file not found: {training_file}")
        print("Please prepare your training data first using data_preprocessing.py")
        return
    
    # Initialize fine-tuner
    tuner = HausaFineTuner(training_file)
    
    # Step 1: Upload training file
    file_id = tuner.upload_training_file()
    if not file_id:
        return
    
    # Step 2: Validate file
    if not tuner.validate_file():
        return
    
    # Step 3: Create fine-tuning job
    job_id = tuner.create_fine_tuning_job(
        model='gpt-3.5-turbo',
        suffix='hausa-chatbot'
    )
    if not job_id:
        return
    
    # Step 4: Monitor progress
    tuner.monitor_job(check_interval=60)
    
    # Step 5: List events
    tuner.list_events(limit=20)
    
    # Step 6: Test the model
    if tuner.model_id:
        test_messages = [
            "Sannu, ina kwana?",
            "Ina bukatar taimako",
            "Yaya aiki?",
            "Tell me about Hausa culture"
        ]
        
        for msg in test_messages:
            tuner.test_model(msg)
            time.sleep(2)
        
        # Save model info
        tuner.save_model_info()
    
    print("\n" + "=" * 60)
    print("Fine-tuning process complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
