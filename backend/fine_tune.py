"""
Fine-tuning script for Hausa GPT model
This script handles the complete fine-tuning workflow for both OpenAI and Gemini Pro
"""

from openai import OpenAI
import os
import json
import time
from dotenv import load_dotenv
from typing import Optional
import logging

# Import Gemini service
try:
    from gemini_service import GeminiProService, GeminiFineTuner
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logging.warning("Gemini service not available")

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


class HausaFineTuner:
    """Handles fine-tuning of GPT models for Hausa language with Gemini Pro support"""
    
    def __init__(self, training_file_path, provider='openai'):
        """
        Initialize fine-tuner
        
        Args:
            training_file_path: Path to training data file
            provider: 'openai' or 'gemini' (default: 'openai')
        """
        self.training_file_path = training_file_path
        self.provider = provider.lower()
        self.file_id = None
        self.job_id = None
        self.model_id = None
        
        # Initialize provider-specific components
        if self.provider == 'gemini':
            if not GEMINI_AVAILABLE:
                raise ImportError("Gemini service not available. Install google-generativeai package.")
            self.gemini_tuner = GeminiFineTuner(training_file_path)
            logger.info("Initialized Gemini Pro fine-tuner")
        else:
            self.gemini_tuner = None
            logger.info("Initialized OpenAI fine-tuner")
    
    def upload_training_file(self):
        """Upload training data to OpenAI or prepare for Gemini"""
        if self.provider == 'gemini':
            logger.info("Loading training data for Gemini few-shot learning...")
            num_examples = self.gemini_tuner.load_training_data()
            logger.info(f"✓ Loaded {num_examples} training examples")
            return num_examples
        
        # OpenAI upload
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
        """Validate the uploaded file or training data"""
        if self.provider == 'gemini':
            logger.info("Preparing few-shot examples for Gemini...")
            self.gemini_tuner.prepare_few_shot_examples()
            logger.info("✓ Training data validated and prepared")
            return True
        
        # OpenAI validation
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
        """Create a fine-tuning job for OpenAI or prepare Gemini prompt"""
        if self.provider == 'gemini':
            logger.info("Creating enhanced prompt template for Gemini...")
            template_file = self.gemini_tuner.save_prompt_template(
                f'gemini_prompt_{suffix}.txt'
            )
            self.model_id = f'gemini-{suffix}'
            logger.info(f"✓ Prompt template created: {template_file}")
            logger.info(f"Model ID: {self.model_id}")
            return self.model_id
        
        # OpenAI fine-tuning
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
        if self.provider == 'gemini':
            logger.info("Gemini uses few-shot learning - no job monitoring needed")
            logger.info("✓ Training preparation complete!")
            return
        
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
        
        print(f"\nTesting model: {self.model_id}")
        print(f"Test message: {test_message}")
        
        try:
            if self.provider == 'gemini':
                # Test Gemini model with few-shot learning
                gemini_service = GeminiProService()
                
                # Build system prompt with few-shot examples
                base_prompt = """You are a helpful Hausa language assistant."""
                enhanced_prompt = self.gemini_tuner.build_enhanced_system_prompt(base_prompt)
                
                response_text = gemini_service.generate_chat_response(
                    test_message,
                    system_prompt=enhanced_prompt
                )
                
                print(f"\nGemini response:")
                print(response_text)
            else:
                # Test OpenAI model
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
            'provider': self.provider,
            'job_id': self.job_id if self.provider == 'openai' else None,
            'file_id': self.file_id if self.provider == 'openai' else None,
            'timestamp': time.time()
        }
        
        with open(output_file, 'w') as f:
            json.dump(info, f, indent=2)
        
        print(f"\n✓ Model information saved to {output_file}")


def main():
    """Main fine-tuning workflow"""
    print("=" * 60)
    print("Hausa Model Fine-Tuning Script")
    print("Supports: OpenAI GPT and Google Gemini Pro")
    print("=" * 60)
    
    # Determine provider
    provider = os.getenv('FINE_TUNE_PROVIDER', 'openai').lower()
    print(f"\nProvider: {provider}")
    
    # Check for API keys
    if provider == 'openai':
        if not os.getenv('OPENAI_API_KEY'):
            print("\n✗ Error: OPENAI_API_KEY not found in environment")
            print("Please set your API key in .env file")
            return
    elif provider == 'gemini':
        if not (os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')):
            print("\n✗ Error: GEMINI_API_KEY or GOOGLE_API_KEY not found in environment")
            print("Please set your API key in .env file")
            return
        if not GEMINI_AVAILABLE:
            print("\n✗ Error: Gemini service not available")
            print("Install with: pip install google-generativeai")
            return
    
    # Training file path
    training_file = 'hausa_training.jsonl'
    
    if not os.path.exists(training_file):
        print(f"\n✗ Error: Training file not found: {training_file}")
        print("Please prepare your training data first using data_preprocessing.py")
        return
    
    # Initialize fine-tuner
    tuner = HausaFineTuner(training_file, provider=provider)
    
    # Step 1: Upload/load training file
    file_id = tuner.upload_training_file()
    if not file_id:
        return
    
    # Step 2: Validate file
    if not tuner.validate_file():
        return
    
    # Step 3: Create fine-tuning job or prepare prompt
    if provider == 'openai':
        job_id = tuner.create_fine_tuning_job(
            model='gpt-3.5-turbo',
            suffix='hausa-chatbot'
        )
        if not job_id:
            return
    else:
        model_id = tuner.create_fine_tuning_job(
            suffix='hausa-chatbot'
        )
        if not model_id:
            return
    
    # Step 4: Monitor progress (OpenAI only)
    tuner.monitor_job(check_interval=60)
    
    # Step 5: List events (OpenAI only)
    if provider == 'openai' and tuner.job_id:
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
