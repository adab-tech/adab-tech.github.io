"""
Evaluation and accuracy metrics for Hausa speech and text
Includes phoneme alignment validation and tonal accuracy metrics
"""

import re
from typing import List, Dict, Tuple, Optional
import logging
from jiwer import wer, cer
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HausaEvaluator:
    """Evaluation metrics for Hausa language processing"""
    
    # Hausa phoneme inventory
    HAUSA_CONSONANTS = [
        'b', 'ɓ', 'd', 'ɗ', 'f', 'g', 'h', 'j', 'k', 'ƙ', 
        'l', 'm', 'n', 'r', 's', 'sh', 't', 'ts', 'w', 'y', 'z', "'"
    ]
    
    HAUSA_VOWELS = [
        'a', 'e', 'i', 'o', 'u'
    ]
    
    # Hausa tone patterns (High, Low, Falling)
    TONE_MARKERS = {
        'high': '\u0301',      # Acute accent
        'low': '\u0300',       # Grave accent
        'falling': '\u0302'    # Circumflex
    }
    
    # Special Hausa characters
    HAUSA_SPECIAL_CHARS = ['ɓ', 'ɗ', 'ƙ', 'ƴ']
    
    def __init__(self):
        self.phoneme_errors = []
        self.tone_errors = []
    
    def validate_hausa_text(self, text: str) -> Dict:
        """
        Validate Hausa text for proper character usage
        
        Args:
            text: Hausa text to validate
        
        Returns:
            Dictionary with validation results
        """
        results = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'special_chars_used': [],
            'phoneme_coverage': {}
        }
        
        # Check for proper Hausa special characters
        for char in self.HAUSA_SPECIAL_CHARS:
            if char in text:
                results['special_chars_used'].append(char)
        
        # Check for common substitution errors using word boundaries
        # Look for regular 'b', 'd', 'k' where special characters might be needed
        import re
        
        # These are hints, not strict rules, since context matters
        if re.search(r'\bb\w', text, re.IGNORECASE) and 'ɓ' not in text:
            results['warnings'].append(
                "Found 'b' at word start - check if implosive ɓ is needed"
            )
        
        if re.search(r'\bd\w', text, re.IGNORECASE) and 'ɗ' not in text:
            results['warnings'].append(
                "Found 'd' at word start - check if implosive ɗ is needed"
            )
        
        if re.search(r'\bk\w', text, re.IGNORECASE) and 'ƙ' not in text:
            results['warnings'].append(
                "Found 'k' in text - check if ejective ƙ is needed"
            )
        
        # Analyze phoneme usage
        text_lower = text.lower()
        for consonant in self.HAUSA_CONSONANTS:
            if consonant in text_lower:
                results['phoneme_coverage'][consonant] = text_lower.count(consonant)
        
        return results
    
    def calculate_phoneme_alignment(self, 
                                   reference: str, 
                                   hypothesis: str) -> Dict:
        """
        Calculate phoneme alignment accuracy between reference and hypothesis
        
        Args:
            reference: Reference text (ground truth)
            hypothesis: Hypothesis text (predicted)
        
        Returns:
            Dictionary with alignment metrics
        """
        # Normalize texts
        ref_clean = self._normalize_text(reference)
        hyp_clean = self._normalize_text(hypothesis)
        
        # Calculate WER (Word Error Rate)
        word_error_rate = wer(ref_clean, hyp_clean)
        
        # Calculate CER (Character Error Rate)
        char_error_rate = cer(ref_clean, hyp_clean)
        
        # Phoneme-level analysis
        ref_phonemes = self._extract_phonemes(ref_clean)
        hyp_phonemes = self._extract_phonemes(hyp_clean)
        
        phoneme_accuracy = self._calculate_phoneme_accuracy(ref_phonemes, hyp_phonemes)
        
        # Special character accuracy
        special_char_accuracy = self._calculate_special_char_accuracy(reference, hypothesis)
        
        results = {
            'word_error_rate': round(word_error_rate * 100, 2),
            'character_error_rate': round(char_error_rate * 100, 2),
            'phoneme_accuracy': round(phoneme_accuracy, 2),
            'special_char_accuracy': round(special_char_accuracy, 2),
            'reference_length': len(ref_clean.split()),
            'hypothesis_length': len(hyp_clean.split()),
            'alignment_score': round((1 - word_error_rate) * 100, 2)
        }
        
        return results
    
    def calculate_tonal_accuracy(self, 
                                 reference: str, 
                                 hypothesis: str) -> Dict:
        """
        Calculate tonal accuracy for Hausa text
        
        Args:
            reference: Reference text with tone marks
            hypothesis: Hypothesis text with tone marks
        
        Returns:
            Dictionary with tonal accuracy metrics
        """
        ref_tones = self._extract_tones(reference)
        hyp_tones = self._extract_tones(hypothesis)
        
        # Calculate tone accuracy
        total_tones = len(ref_tones)
        if total_tones == 0:
            return {
                'tonal_accuracy': 0.0,
                'tone_matches': 0,
                'tone_mismatches': 0,
                'missing_tones': 0,
                'extra_tones': 0,
                'note': 'No tone marks found in reference'
            }
        
        matches = 0
        mismatches = 0
        
        # Compare tones position by position
        min_len = min(len(ref_tones), len(hyp_tones))
        for i in range(min_len):
            if ref_tones[i] == hyp_tones[i]:
                matches += 1
            else:
                mismatches += 1
        
        missing_tones = max(0, len(ref_tones) - len(hyp_tones))
        extra_tones = max(0, len(hyp_tones) - len(ref_tones))
        
        tonal_accuracy = (matches / total_tones) * 100 if total_tones > 0 else 0
        
        return {
            'tonal_accuracy': round(tonal_accuracy, 2),
            'tone_matches': matches,
            'tone_mismatches': mismatches,
            'missing_tones': missing_tones,
            'extra_tones': extra_tones,
            'total_reference_tones': total_tones
        }
    
    def evaluate_cultural_context(self, text: str) -> Dict:
        """
        Evaluate cultural and contextual appropriateness of Hausa text
        
        Args:
            text: Hausa text to evaluate
        
        Returns:
            Dictionary with cultural validation results
        """
        results = {
            'cultural_greetings': [],
            'polite_expressions': [],
            'common_phrases': [],
            'cultural_score': 0.0
        }
        
        # Common Hausa greetings
        greetings = [
            'sannu', 'ina kwana', 'ina wuni', 'barka da yamma', 
            'barka da safiya', 'ina gajiya'
        ]
        
        # Polite expressions
        polite = [
            'don allah', 'na gode', 'madalla', 'na ji daɗi',
            'allah ya kara', 'allah ya saka', 'to madalla'
        ]
        
        # Common responses
        common = [
            'lafiya lau', 'lafiya kalau', 'ba komai', 
            'wallahi', 'ai', 'fa'
        ]
        
        text_lower = text.lower()
        
        # Check for greetings
        for greeting in greetings:
            if greeting in text_lower:
                results['cultural_greetings'].append(greeting)
        
        # Check for polite expressions
        for expression in polite:
            if expression in text_lower:
                results['polite_expressions'].append(expression)
        
        # Check for common phrases
        for phrase in common:
            if phrase in text_lower:
                results['common_phrases'].append(phrase)
        
        # Calculate cultural score
        total_markers = len(results['cultural_greetings']) + \
                       len(results['polite_expressions']) + \
                       len(results['common_phrases'])
        
        # Normalize by text length (words)
        word_count = len(text.split())
        if word_count > 0:
            results['cultural_score'] = min(100, (total_markers / word_count) * 100)
        
        return results
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        # Convert to lowercase
        text = text.lower()
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        # Remove punctuation except apostrophes (used in Hausa)
        text = re.sub(r'[^\w\s\'\u0300-\u036f]', '', text)
        return text
    
    def _extract_phonemes(self, text: str) -> List[str]:
        """Extract phonemes from text"""
        # Simple phoneme extraction (can be enhanced with phonemizer library)
        phonemes = []
        text = text.lower()
        
        i = 0
        while i < len(text):
            # Check for digraphs first (sh, ts)
            if i < len(text) - 1:
                digraph = text[i:i+2]
                if digraph in ['sh', 'ts']:
                    phonemes.append(digraph)
                    i += 2
                    continue
            
            # Single character
            char = text[i]
            if char in self.HAUSA_CONSONANTS or char in self.HAUSA_VOWELS:
                phonemes.append(char)
            i += 1
        
        return phonemes
    
    def _calculate_phoneme_accuracy(self, 
                                   ref_phonemes: List[str], 
                                   hyp_phonemes: List[str]) -> float:
        """Calculate phoneme-level accuracy"""
        if not ref_phonemes:
            return 0.0
        
        matches = 0
        min_len = min(len(ref_phonemes), len(hyp_phonemes))
        
        for i in range(min_len):
            if ref_phonemes[i] == hyp_phonemes[i]:
                matches += 1
        
        accuracy = (matches / len(ref_phonemes)) * 100
        return accuracy
    
    def _calculate_special_char_accuracy(self, reference: str, hypothesis: str) -> float:
        """Calculate accuracy of Hausa special characters"""
        ref_special = sum(1 for char in reference if char in self.HAUSA_SPECIAL_CHARS)
        
        if ref_special == 0:
            return 100.0  # No special chars to match
        
        matches = 0
        for char in self.HAUSA_SPECIAL_CHARS:
            ref_count = reference.count(char)
            hyp_count = hypothesis.count(char)
            matches += min(ref_count, hyp_count)
        
        accuracy = (matches / ref_special) * 100
        return accuracy
    
    def _extract_tones(self, text: str) -> List[str]:
        """Extract tone markers from text"""
        tones = []
        
        for char in text:
            # Check for combining diacritical marks (tone markers)
            if '\u0300' <= char <= '\u036f':
                tones.append(char)
        
        return tones
    
    def generate_evaluation_report(self, 
                                  reference: str, 
                                  hypothesis: str,
                                  include_cultural: bool = True) -> Dict:
        """
        Generate comprehensive evaluation report
        
        Args:
            reference: Reference text
            hypothesis: Hypothesis text
            include_cultural: Whether to include cultural evaluation
        
        Returns:
            Complete evaluation report
        """
        from datetime import datetime
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'phoneme_alignment': self.calculate_phoneme_alignment(reference, hypothesis),
            'tonal_accuracy': self.calculate_tonal_accuracy(reference, hypothesis),
            'text_validation': self.validate_hausa_text(hypothesis)
        }
        
        if include_cultural:
            report['cultural_context'] = self.evaluate_cultural_context(hypothesis)
        
        # Overall score
        overall_score = (
            report['phoneme_alignment']['alignment_score'] * 0.5 +
            report['tonal_accuracy']['tonal_accuracy'] * 0.3 +
            (report['cultural_context'].get('cultural_score', 0) if include_cultural else 0) * 0.2
        )
        
        report['overall_score'] = round(overall_score, 2)
        
        return report


def main():
    """Example usage"""
    evaluator = HausaEvaluator()
    
    # Example texts
    reference = "Sannu, ina kwana? Na ji daɗi."
    hypothesis = "Sannu, ina kwana? Na ji dadi."
    
    # Generate evaluation report
    report = evaluator.generate_evaluation_report(reference, hypothesis)
    
    print("\nEvaluation Report:")
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
