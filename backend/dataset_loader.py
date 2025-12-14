"""
Dataset loaders for Hausa language training data
Supports multiple sources: Mozilla Common Voice, JW300, OPUS, HausaNLP
"""

import os
import json
import csv
from typing import List, Dict, Optional, Tuple
from datasets import load_dataset
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatasetLoader:
    """Unified dataset loader for multiple Hausa data sources"""
    
    def __init__(self, cache_dir: str = "./data_cache"):
        """
        Initialize dataset loader
        
        Args:
            cache_dir: Directory to cache downloaded datasets
        """
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
        self.loaded_data = []
    
    def load_mozilla_common_voice(self, split: str = "train") -> List[Dict]:
        """
        Load Mozilla Common Voice Hausa dataset
        
        Args:
            split: Dataset split (train, validation, test)
        
        Returns:
            List of dictionaries with audio path and transcription
        """
        logger.info(f"Loading Mozilla Common Voice Hausa dataset ({split})...")
        
        try:
            # Load Common Voice dataset for Hausa
            dataset = load_dataset(
                "mozilla-foundation/common_voice_13_0",
                "ha",  # Hausa language code
                split=split,
                cache_dir=self.cache_dir,
                trust_remote_code=True
            )
            
            data = []
            for item in dataset:
                data.append({
                    'text': item['sentence'],
                    'audio_path': item.get('path', ''),
                    'audio_array': item.get('audio', {}).get('array'),
                    'sampling_rate': item.get('audio', {}).get('sampling_rate'),
                    'source': 'mozilla_common_voice',
                    'metadata': {
                        'age': item.get('age', ''),
                        'gender': item.get('gender', ''),
                        'accent': item.get('accent', '')
                    }
                })
            
            logger.info(f"Loaded {len(data)} samples from Mozilla Common Voice")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading Mozilla Common Voice: {e}")
            return []
    
    def load_jw300_corpus(self, file_path: Optional[str] = None) -> List[Dict]:
        """
        Load JW300 parallel corpus for Hausa
        
        Args:
            file_path: Path to JW300 Hausa corpus file
        
        Returns:
            List of conversation pairs
        """
        logger.info("Loading JW300 Hausa corpus...")
        
        try:
            # Try to load from Hugging Face datasets
            dataset = load_dataset(
                "allenai/nllb",
                "ha-en",  # Hausa-English pair
                split="train",
                cache_dir=self.cache_dir,
                trust_remote_code=True
            )
            
            data = []
            for item in dataset:
                if 'translation' in item:
                    # Extract Hausa text
                    hausa_text = item['translation'].get('ha', '')
                    english_text = item['translation'].get('en', '')
                    
                    if hausa_text:
                        data.append({
                            'text': hausa_text,
                            'translation': english_text,
                            'source': 'jw300',
                            'type': 'parallel_corpus'
                        })
            
            logger.info(f"Loaded {len(data)} samples from JW300")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.warning(f"Could not load JW300 from HuggingFace: {e}")
            
            # Fallback to local file if provided
            if file_path and os.path.exists(file_path):
                return self._load_from_text_file(file_path, 'jw300')
            
            return []
    
    def load_opus_corpus(self, corpus_name: str = "GNOME") -> List[Dict]:
        """
        Load OPUS corpus for Hausa
        
        Args:
            corpus_name: Name of OPUS corpus (GNOME, Ubuntu, etc.)
        
        Returns:
            List of text samples
        """
        logger.info(f"Loading OPUS {corpus_name} corpus for Hausa...")
        
        try:
            # Try loading from OPUS via Hugging Face
            dataset = load_dataset(
                "opus100",
                "ha-en",  # Hausa-English
                split="train",
                cache_dir=self.cache_dir,
                trust_remote_code=True
            )
            
            data = []
            for item in dataset:
                if 'translation' in item:
                    hausa_text = item['translation'].get('ha', '')
                    english_text = item['translation'].get('en', '')
                    
                    if hausa_text:
                        data.append({
                            'text': hausa_text,
                            'translation': english_text,
                            'source': f'opus_{corpus_name.lower()}',
                            'type': 'parallel_corpus'
                        })
            
            logger.info(f"Loaded {len(data)} samples from OPUS {corpus_name}")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading OPUS corpus: {e}")
            return []
    
    def load_hausanlp_corpus(self, file_path: Optional[str] = None) -> List[Dict]:
        """
        Load HausaNLP corpus
        
        Args:
            file_path: Path to HausaNLP corpus file
        
        Returns:
            List of text samples
        """
        logger.info("Loading HausaNLP corpus...")
        
        # HausaNLP may be in various formats (CSV, JSON, TXT)
        if not file_path or not os.path.exists(file_path):
            logger.warning("HausaNLP corpus file not found")
            return []
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.json' or file_ext == '.jsonl':
            return self._load_from_json(file_path, 'hausanlp')
        elif file_ext == '.csv':
            return self._load_from_csv(file_path, 'hausanlp')
        elif file_ext == '.txt':
            return self._load_from_text_file(file_path, 'hausanlp')
        else:
            logger.error(f"Unsupported file format: {file_ext}")
            return []
    
    def load_conversational_dialogues(self, file_path: str) -> List[Dict]:
        """
        Load conversational dialogue datasets
        
        Args:
            file_path: Path to dialogue dataset (JSON/JSONL format)
        
        Returns:
            List of dialogue exchanges
        """
        logger.info("Loading conversational dialogue dataset...")
        
        if not os.path.exists(file_path):
            logger.warning(f"Dialogue file not found: {file_path}")
            return []
        
        data = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if file_path.endswith('.jsonl'):
                    # JSONL format
                    for line in f:
                        item = json.loads(line)
                        data.append({
                            'text': item.get('text', ''),
                            'context': item.get('context', []),
                            'response': item.get('response', ''),
                            'source': 'conversational_dialogue',
                            'type': 'dialogue'
                        })
                else:
                    # JSON format
                    dataset = json.load(f)
                    for item in dataset:
                        data.append({
                            'text': item.get('text', ''),
                            'context': item.get('context', []),
                            'response': item.get('response', ''),
                            'source': 'conversational_dialogue',
                            'type': 'dialogue'
                        })
            
            logger.info(f"Loaded {len(data)} dialogue samples")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading conversational dialogues: {e}")
            return []
    
    def _load_from_json(self, file_path: str, source: str) -> List[Dict]:
        """Load data from JSON/JSONL file"""
        data = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if file_path.endswith('.jsonl'):
                    for line in f:
                        item = json.loads(line)
                        data.append({
                            'text': item.get('text', ''),
                            'source': source,
                            **item
                        })
                else:
                    dataset = json.load(f)
                    for item in dataset:
                        data.append({
                            'text': item.get('text', ''),
                            'source': source,
                            **item
                        })
            
            logger.info(f"Loaded {len(data)} samples from {file_path}")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading JSON file: {e}")
            return []
    
    def _load_from_csv(self, file_path: str, source: str) -> List[Dict]:
        """Load data from CSV file"""
        data = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    data.append({
                        'text': row.get('text', row.get('sentence', '')),
                        'source': source,
                        **row
                    })
            
            logger.info(f"Loaded {len(data)} samples from {file_path}")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading CSV file: {e}")
            return []
    
    def _load_from_text_file(self, file_path: str, source: str) -> List[Dict]:
        """Load data from plain text file (one sample per line)"""
        data = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    text = line.strip()
                    if text:
                        data.append({
                            'text': text,
                            'source': source
                        })
            
            logger.info(f"Loaded {len(data)} samples from {file_path}")
            self.loaded_data.extend(data)
            return data
            
        except Exception as e:
            logger.error(f"Error loading text file: {e}")
            return []
    
    def get_all_data(self) -> List[Dict]:
        """Get all loaded data"""
        return self.loaded_data
    
    def get_statistics(self) -> Dict:
        """Get statistics about loaded datasets"""
        stats = {
            'total_samples': len(self.loaded_data),
            'by_source': {},
            'by_type': {}
        }
        
        for item in self.loaded_data:
            source = item.get('source', 'unknown')
            item_type = item.get('type', 'text')
            
            stats['by_source'][source] = stats['by_source'].get(source, 0) + 1
            stats['by_type'][item_type] = stats['by_type'].get(item_type, 0) + 1
        
        return stats
    
    def export_for_training(self, output_path: str, format: str = 'openai') -> str:
        """
        Export loaded data in format suitable for training
        
        Args:
            output_path: Path to save exported data
            format: Export format ('openai', 'jsonl', 'csv')
        
        Returns:
            Path to exported file
        """
        logger.info(f"Exporting {len(self.loaded_data)} samples to {output_path}")
        
        if format == 'openai':
            # OpenAI fine-tuning format
            with open(output_path, 'w', encoding='utf-8') as f:
                for item in self.loaded_data:
                    training_item = {
                        'messages': [
                            {'role': 'system', 'content': 'You are a helpful Hausa language assistant.'},
                            {'role': 'user', 'content': item.get('text', '')},
                            {'role': 'assistant', 'content': item.get('response', item.get('text', ''))}
                        ]
                    }
                    f.write(json.dumps(training_item, ensure_ascii=False) + '\n')
        
        elif format == 'jsonl':
            with open(output_path, 'w', encoding='utf-8') as f:
                for item in self.loaded_data:
                    f.write(json.dumps(item, ensure_ascii=False) + '\n')
        
        elif format == 'csv':
            with open(output_path, 'w', encoding='utf-8', newline='') as f:
                if self.loaded_data:
                    writer = csv.DictWriter(f, fieldnames=self.loaded_data[0].keys())
                    writer.writeheader()
                    writer.writerows(self.loaded_data)
        
        logger.info(f"Data exported to {output_path}")
        return output_path


def main():
    """Example usage"""
    loader = DatasetLoader()
    
    # Load from various sources
    # loader.load_mozilla_common_voice(split='train')
    # loader.load_jw300_corpus()
    # loader.load_opus_corpus()
    
    # Get statistics
    stats = loader.get_statistics()
    print("\nDataset Statistics:")
    print(json.dumps(stats, indent=2))
    
    # Export for training
    # loader.export_for_training('combined_training.jsonl', format='openai')


if __name__ == '__main__':
    main()
