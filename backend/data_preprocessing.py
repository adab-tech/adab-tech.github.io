"""
Data preprocessing utilities for Hausa language fine-tuning
"""

import json
import re
from typing import List, Dict
import csv


class HausaDataPreprocessor:
    """Preprocessor for Hausa text data for GPT fine-tuning"""
    
    def __init__(self):
        self.cleaned_count = 0
        self.total_count = 0
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize Hausa text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Normalize Hausa special characters
        # Hausa uses modified Latin alphabet with special characters
        replacements = {
            'ɓ': 'ɓ',  # Ensure proper encoding
            'ɗ': 'ɗ',
            'ƙ': 'ƙ',
            'ƴ': 'ƴ',
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def prepare_conversation_pair(self, prompt: str, completion: str) -> Dict:
        """Prepare a conversation pair for GPT fine-tuning"""
        return {
            "messages": [
                {"role": "system", "content": "You are a helpful Hausa language assistant."},
                {"role": "user", "content": self.clean_text(prompt)},
                {"role": "assistant", "content": self.clean_text(completion)}
            ]
        }
    
    def load_from_csv(self, file_path: str) -> List[Dict]:
        """
        Load training data from CSV file
        Expected format: prompt, completion
        """
        data = []
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.total_count += 1
                if 'prompt' in row and 'completion' in row:
                    pair = self.prepare_conversation_pair(
                        row['prompt'],
                        row['completion']
                    )
                    data.append(pair)
                    self.cleaned_count += 1
        
        return data
    
    def load_from_json(self, file_path: str) -> List[Dict]:
        """
        Load training data from JSON file
        Expected format: [{"prompt": "...", "completion": "..."}, ...]
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        
        data = []
        for item in raw_data:
            self.total_count += 1
            if 'prompt' in item and 'completion' in item:
                pair = self.prepare_conversation_pair(
                    item['prompt'],
                    item['completion']
                )
                data.append(pair)
                self.cleaned_count += 1
        
        return data
    
    def save_for_finetuning(self, data: List[Dict], output_path: str):
        """Save preprocessed data in JSONL format for OpenAI fine-tuning"""
        with open(output_path, 'w', encoding='utf-8') as f:
            for item in data:
                f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        print(f"Saved {len(data)} training examples to {output_path}")
        print(f"Cleaned {self.cleaned_count} out of {self.total_count} total items")
    
    def validate_data(self, data: List[Dict]) -> bool:
        """Validate the prepared data format"""
        if not data:
            print("Error: No data to validate")
            return False
        
        for i, item in enumerate(data):
            if 'messages' not in item:
                print(f"Error at item {i}: Missing 'messages' key")
                return False
            
            if len(item['messages']) != 3:
                print(f"Error at item {i}: Expected 3 messages, got {len(item['messages'])}")
                return False
            
            roles = [msg['role'] for msg in item['messages']]
            if roles != ['system', 'user', 'assistant']:
                print(f"Error at item {i}: Invalid role sequence")
                return False
        
        print(f"Validation passed for {len(data)} items")
        return True


def main():
    """Example usage of the preprocessor"""
    preprocessor = HausaDataPreprocessor()
    
    # Example: Load from CSV
    # data = preprocessor.load_from_csv('hausa_training_data.csv')
    
    # Example: Load from JSON
    # data = preprocessor.load_from_json('hausa_training_data.json')
    
    # Create sample data for demonstration
    sample_data = [
        preprocessor.prepare_conversation_pair(
            "Sannu, ina kwana?",
            "Lafiya lau. Na gode. Yaya kake?"
        ),
        preprocessor.prepare_conversation_pair(
            "Ina bukatar taimako",
            "Babu matsala. Zan taimaka maka. Me kake bukata?"
        )
    ]
    
    # Validate
    if preprocessor.validate_data(sample_data):
        # Save for fine-tuning
        preprocessor.save_for_finetuning(sample_data, 'hausa_training.jsonl')


if __name__ == '__main__':
    main()
