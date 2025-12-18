"""
Gemini Pro integration for Hausa language fine-tuning and chat
Provides Google's Generative AI capabilities as an alternative to OpenAI GPT
"""

import os
import json
import time
from typing import Optional, List, Dict
from dotenv import load_dotenv
import logging

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logging.warning("google-generativeai package not installed. Gemini Pro features will not work.")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


class GeminiProService:
    """Gemini Pro service for Hausa language processing"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini Pro service
        
        Args:
            api_key: Gemini API key (falls back to GEMINI_API_KEY or GOOGLE_API_KEY env var)
        """
        if not GENAI_AVAILABLE:
            raise ImportError("google-generativeai package not installed. Install with: pip install google-generativeai")
        
        self.api_key = api_key or os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
        
        if not self.api_key:
            raise ValueError("Gemini API key not found. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize model
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-pro')
        self.model = genai.GenerativeModel(self.model_name)
        
        logger.info(f"Gemini Pro service initialized with model: {self.model_name}")
    
    def generate_chat_response(self,
                              message: str,
                              chat_history: Optional[List[Dict]] = None,
                              system_prompt: Optional[str] = None) -> str:
        """
        Generate a chat response using Gemini Pro
        
        Args:
            message: User message
            chat_history: Previous chat history (list of {role, content} dicts)
            system_prompt: System prompt to guide the model
        
        Returns:
            Generated response text
        """
        try:
            # Build the conversation context
            conversation = []
            
            # Add system prompt as first user message if provided
            if system_prompt:
                conversation.append({
                    'role': 'user',
                    'parts': [system_prompt]
                })
                conversation.append({
                    'role': 'model',
                    'parts': ['I understand. I will follow these guidelines.']
                })
            
            # Add chat history
            if chat_history:
                for msg in chat_history[-10:]:  # Limit to last 10 messages
                    role = 'model' if msg['role'] == 'assistant' else 'user'
                    conversation.append({
                        'role': role,
                        'parts': [msg['content']]
                    })
            
            # Start chat session
            chat = self.model.start_chat(history=conversation)
            
            # Generate response
            response = chat.send_message(message)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating chat response: {e}")
            raise
    
    def generate_text(self, prompt: str, **kwargs) -> str:
        """
        Generate text using Gemini Pro
        
        Args:
            prompt: Input prompt
            **kwargs: Additional generation parameters
        
        Returns:
            Generated text
        """
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(**kwargs)
            )
            return response.text
        except Exception as e:
            logger.error(f"Error generating text: {e}")
            raise
    
    def test_connection(self) -> bool:
        """
        Test Gemini Pro API connection
        
        Returns:
            True if connection successful
        """
        try:
            response = self.generate_text("Say 'Sannu' in Hausa")
            return bool(response)
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False


class GeminiFineTuner:
    """
    Handles fine-tuning workflow for Gemini models
    
    Note: As of now, Gemini Pro doesn't support fine-tuning the same way as OpenAI.
    This class provides compatibility layer and preparation for future fine-tuning capabilities.
    For now, it focuses on prompt engineering and few-shot learning.
    """
    
    def __init__(self, training_file_path: str):
        """
        Initialize Gemini fine-tuner
        
        Args:
            training_file_path: Path to training data file
        """
        self.training_file_path = training_file_path
        self.training_data = None
        self.few_shot_examples = []
        
        logger.info("Gemini Fine-Tuner initialized")
        logger.warning("Note: Gemini Pro currently uses few-shot learning instead of traditional fine-tuning")
    
    def load_training_data(self):
        """Load and parse training data"""
        logger.info(f"Loading training data from: {self.training_file_path}")
        
        if not os.path.exists(self.training_file_path):
            raise FileNotFoundError(f"Training file not found: {self.training_file_path}")
        
        self.training_data = []
        with open(self.training_file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    self.training_data.append(json.loads(line))
        
        logger.info(f"Loaded {len(self.training_data)} training examples")
        return len(self.training_data)
    
    def prepare_few_shot_examples(self, num_examples: int = 10):
        """
        Prepare few-shot examples from training data
        
        Args:
            num_examples: Number of examples to use for few-shot learning
        """
        if not self.training_data:
            self.load_training_data()
        
        # Select diverse examples
        import random
        selected = random.sample(self.training_data, min(num_examples, len(self.training_data)))
        
        self.few_shot_examples = []
        for item in selected:
            messages = item.get('messages', [])
            user_msg = None
            assistant_msg = None
            
            for msg in messages:
                if msg['role'] == 'user':
                    user_msg = msg['content']
                elif msg['role'] == 'assistant':
                    assistant_msg = msg['content']
            
            if user_msg and assistant_msg:
                self.few_shot_examples.append({
                    'user': user_msg,
                    'assistant': assistant_msg
                })
        
        logger.info(f"Prepared {len(self.few_shot_examples)} few-shot examples")
        return self.few_shot_examples
    
    def build_enhanced_system_prompt(self, base_prompt: str) -> str:
        """
        Build enhanced system prompt with few-shot examples
        
        Args:
            base_prompt: Base system prompt
        
        Returns:
            Enhanced prompt with examples
        """
        if not self.few_shot_examples:
            self.prepare_few_shot_examples()
        
        prompt = base_prompt + "\n\nHere are some examples of how to respond:\n\n"
        
        for i, example in enumerate(self.few_shot_examples[:5], 1):
            prompt += f"Example {i}:\n"
            prompt += f"User: {example['user']}\n"
            prompt += f"Assistant: {example['assistant']}\n\n"
        
        prompt += "Now, please respond to user messages in a similar manner."
        
        return prompt
    
    def save_prompt_template(self, output_file: str = 'gemini_prompt_template.txt'):
        """
        Save the enhanced prompt template
        
        Args:
            output_file: Output file path
        """
        base_prompt = """You are a helpful AI assistant that is fluent in Hausa language.
You should:
1. Respond primarily in Hausa language
2. Be culturally aware of Hausa traditions and customs
3. Provide helpful and accurate information
4. Be respectful and polite
5. If the user speaks in English, you can respond in both English and Hausa"""
        
        enhanced_prompt = self.build_enhanced_system_prompt(base_prompt)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(enhanced_prompt)
        
        logger.info(f"Prompt template saved to: {output_file}")
        return output_file
    
    def get_status(self) -> Dict:
        """Get current status"""
        return {
            'status': 'ready',
            'method': 'few-shot learning',
            'training_data_loaded': bool(self.training_data),
            'num_training_examples': len(self.training_data) if self.training_data else 0,
            'num_few_shot_examples': len(self.few_shot_examples),
            'note': 'Gemini Pro uses few-shot learning instead of traditional fine-tuning'
        }


def main():
    """Example usage"""
    print("=" * 60)
    print("Gemini Pro Service Test")
    print("=" * 60)
    
    # Check if API key is available
    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    if not api_key:
        print("\n✗ Error: GEMINI_API_KEY or GOOGLE_API_KEY not found in environment")
        print("Please set your API key in .env file")
        return
    
    if not GENAI_AVAILABLE:
        print("\n✗ Error: google-generativeai package not installed")
        print("Install with: pip install google-generativeai")
        return
    
    try:
        # Initialize service
        service = GeminiProService()
        
        # Test connection
        print("\nTesting connection...")
        if service.test_connection():
            print("✓ Gemini Pro service connected successfully")
        else:
            print("✗ Gemini Pro service connection failed")
            return
        
        # Test chat
        print("\nTesting chat functionality...")
        
        system_prompt = """You are a helpful Hausa language assistant. 
Respond in Hausa and be culturally aware."""
        
        test_messages = [
            "Sannu, yaya kake?",
            "Ina bukatar taimako",
            "Tell me about Hausa culture"
        ]
        
        for msg in test_messages:
            print(f"\nUser: {msg}")
            response = service.generate_chat_response(
                msg,
                system_prompt=system_prompt
            )
            print(f"Assistant: {response}")
            time.sleep(1)
        
        # Test fine-tuning preparation
        print("\n" + "=" * 60)
        print("Testing Fine-Tuning Preparation")
        print("=" * 60)
        
        training_file = 'hausa_training.jsonl'
        if os.path.exists(training_file):
            tuner = GeminiFineTuner(training_file)
            tuner.load_training_data()
            tuner.prepare_few_shot_examples(5)
            tuner.save_prompt_template()
            
            status = tuner.get_status()
            print("\nFine-tuner status:")
            for key, value in status.items():
                print(f"  {key}: {value}")
        else:
            print(f"\n⚠ Training file not found: {training_file}")
            print("Skipping fine-tuning test")
        
        print("\n" + "=" * 60)
        print("Test complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
