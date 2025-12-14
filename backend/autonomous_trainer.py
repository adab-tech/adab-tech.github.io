"""
Autonomous Training System for Hausa Chatbot
Continuously collects conversation data and triggers fine-tuning jobs
"""

from openai import OpenAI
import os
import json
import time
from datetime import datetime
from threading import Thread, Lock
import schedule
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


class AutonomousTrainer:
    """Manages autonomous training of the Hausa chatbot"""
    
    def __init__(self, 
                 data_dir='training_data',
                 min_conversations=50,
                 training_interval_hours=24):
        """
        Initialize autonomous trainer
        
        Args:
            data_dir: Directory to store conversation logs
            min_conversations: Minimum conversations before triggering training
            training_interval_hours: Hours between training checks
        """
        self.data_dir = data_dir
        self.min_conversations = min_conversations
        self.training_interval_hours = training_interval_hours
        self.lock = Lock()
        self.is_running = False
        self.current_job_id = None
        self.last_training_time = None
        self.conversation_count = 0
        
        # Create data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        # Load existing conversation count
        self._load_state()
    
    def _load_state(self):
        """Load training state from file"""
        state_file = os.path.join(self.data_dir, 'training_state.json')
        if os.path.exists(state_file):
            try:
                with open(state_file, 'r') as f:
                    state = json.load(f)
                    self.last_training_time = state.get('last_training_time')
                    self.conversation_count = state.get('conversation_count', 0)
                    self.current_job_id = state.get('current_job_id')
            except Exception as e:
                print(f"Error loading state: {e}")
    
    def _save_state(self):
        """Save training state to file"""
        state_file = os.path.join(self.data_dir, 'training_state.json')
        state = {
            'last_training_time': self.last_training_time,
            'conversation_count': self.conversation_count,
            'current_job_id': self.current_job_id,
            'updated_at': datetime.now().isoformat()
        }
        with open(state_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def log_conversation(self, user_message, assistant_response, metadata=None):
        """
        Log a conversation for future training
        
        Args:
            user_message: User's message
            assistant_response: Chatbot's response
            metadata: Optional metadata (model, timestamp, etc.)
        """
        with self.lock:
            timestamp = datetime.now().isoformat()
            conversation = {
                'messages': [
                    {'role': 'system', 'content': 'You are a helpful Hausa language assistant.'},
                    {'role': 'user', 'content': user_message},
                    {'role': 'assistant', 'content': assistant_response}
                ],
                'timestamp': timestamp,
                'metadata': metadata or {}
            }
            
            # Append to conversations log
            log_file = os.path.join(self.data_dir, f'conversations_{datetime.now().strftime("%Y%m")}.jsonl')
            with open(log_file, 'a') as f:
                f.write(json.dumps(conversation, ensure_ascii=False) + '\n')
            
            self.conversation_count += 1
            self._save_state()
            
            print(f"Logged conversation #{self.conversation_count}")
    
    def _collect_training_data(self):
        """Collect all logged conversations into a single training file"""
        all_conversations = []
        
        # Read all conversation log files
        for filename in os.listdir(self.data_dir):
            if filename.startswith('conversations_') and filename.endswith('.jsonl'):
                filepath = os.path.join(self.data_dir, filename)
                with open(filepath, 'r') as f:
                    for line in f:
                        try:
                            conversation = json.loads(line)
                            all_conversations.append(conversation)
                        except Exception as e:
                            print(f"Error parsing conversation: {e}")
        
        return all_conversations
    
    def _prepare_training_file(self, conversations):
        """Prepare training file in OpenAI format"""
        training_file = os.path.join(self.data_dir, f'training_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jsonl')
        
        with open(training_file, 'w') as f:
            for conv in conversations:
                f.write(json.dumps({'messages': conv['messages']}, ensure_ascii=False) + '\n')
        
        return training_file
    
    def trigger_training(self):
        """Trigger a fine-tuning job with collected data"""
        print("\n" + "="*60)
        print("AUTONOMOUS TRAINING TRIGGERED")
        print("="*60)
        
        with self.lock:
            # Collect all conversations
            conversations = self._collect_training_data()
            
            if len(conversations) < self.min_conversations:
                print(f"Not enough conversations ({len(conversations)}/{self.min_conversations})")
                return False
            
            print(f"Collected {len(conversations)} conversations for training")
            
            # Prepare training file
            training_file = self._prepare_training_file(conversations)
            print(f"Training file prepared: {training_file}")
            
            try:
                # Upload training file
                print("Uploading training file to OpenAI...")
                with open(training_file, 'rb') as f:
                    file_response = client.files.create(
                        file=f,
                        purpose='fine-tune'
                    )
                
                print(f"✓ File uploaded: {file_response.id}")
                
                # Create fine-tuning job
                print("Creating fine-tuning job...")
                job_response = client.fine_tuning.jobs.create(
                    training_file=file_response.id,
                    model='gpt-3.5-turbo',
                    suffix=f'hausa-auto-{datetime.now().strftime("%Y%m%d")}'
                )
                
                self.current_job_id = job_response.id
                self.last_training_time = datetime.now().isoformat()
                self.conversation_count = 0  # Reset counter after training
                self._save_state()
                
                print(f"✓ Fine-tuning job created: {job_response.id}")
                print(f"Status: {job_response.status}")
                print("="*60 + "\n")
                
                return True
                
            except Exception as e:
                print(f"✗ Error during training: {e}")
                return False
    
    def check_and_train(self):
        """Check if training should be triggered and do it"""
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking training conditions...")
        
        # Check if we have enough conversations
        if self.conversation_count >= self.min_conversations:
            print(f"Conversation threshold reached: {self.conversation_count}/{self.min_conversations}")
            self.trigger_training()
        else:
            print(f"Conversations collected: {self.conversation_count}/{self.min_conversations}")
    
    def get_job_status(self):
        """Get status of current training job"""
        if not self.current_job_id:
            return {'status': 'no_job', 'message': 'No training job in progress'}
        
        try:
            job = client.fine_tuning.jobs.retrieve(self.current_job_id)
            return {
                'status': job.status,
                'job_id': self.current_job_id,
                'created_at': job.created_at,
                'finished_at': getattr(job, 'finished_at', None),
                'fine_tuned_model': getattr(job, 'fine_tuned_model', None)
            }
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def start(self):
        """Start the autonomous training scheduler"""
        if self.is_running:
            print("Autonomous training already running")
            return
        
        self.is_running = True
        print(f"\n{'='*60}")
        print("AUTONOMOUS TRAINING SYSTEM STARTED")
        print(f"{'='*60}")
        print(f"Data directory: {self.data_dir}")
        print(f"Min conversations: {self.min_conversations}")
        print(f"Training interval: {self.training_interval_hours} hours")
        print(f"Current conversations: {self.conversation_count}")
        print(f"{'='*60}\n")
        
        # Schedule periodic training checks
        schedule.every(self.training_interval_hours).hours.do(self.check_and_train)
        
        # Also check immediately on startup
        self.check_and_train()
        
        # Run scheduler in background thread
        def run_scheduler():
            while self.is_running:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        
        scheduler_thread = Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()
        
        print("✓ Scheduler started in background")
    
    def stop(self):
        """Stop the autonomous training scheduler"""
        self.is_running = False
        schedule.clear()
        print("\nAutonomous training system stopped")
    
    def get_status(self):
        """Get current status of autonomous training"""
        return {
            'is_running': self.is_running,
            'conversation_count': self.conversation_count,
            'min_conversations': self.min_conversations,
            'last_training_time': self.last_training_time,
            'current_job': self.get_job_status(),
            'training_interval_hours': self.training_interval_hours
        }


# Global trainer instance
autonomous_trainer = None


def get_trainer():
    """Get or create autonomous trainer instance"""
    global autonomous_trainer
    if autonomous_trainer is None:
        autonomous_trainer = AutonomousTrainer(
            min_conversations=int(os.getenv('AUTO_TRAIN_MIN_CONVERSATIONS', 50)),
            training_interval_hours=int(os.getenv('AUTO_TRAIN_INTERVAL_HOURS', 24))
        )
    return autonomous_trainer
