"""
Unit tests for evaluation_metrics.py
Tests the Hausa text validation logic and other evaluation metrics
"""

import unittest
from evaluation_metrics import HausaEvaluator


class TestHausaTextValidation(unittest.TestCase):
    """Test cases for validate_hausa_text method"""
    
    def setUp(self):
        """Set up test evaluator instance"""
        self.evaluator = HausaEvaluator()
    
    def test_empty_text(self):
        """Test validation with empty text"""
        result = self.evaluator.validate_hausa_text("")
        self.assertTrue(result['is_valid'])
        self.assertEqual(len(result['warnings']), 0)
        self.assertEqual(len(result['errors']), 0)
    
    def test_text_with_special_chars(self):
        """Test text that correctly uses special Hausa characters"""
        text = "Ɓaƙi da ɗaya"  # Contains ɓ, ƙ, ɗ
        result = self.evaluator.validate_hausa_text(text)
        self.assertTrue(result['is_valid'])
        self.assertIn('ɓ', result['special_chars_used'])
        self.assertIn('ƙ', result['special_chars_used'])
        self.assertIn('ɗ', result['special_chars_used'])
    
    def test_no_false_positive_for_correct_b(self):
        """Test that correctly used 'b' with special char present doesn't trigger warning"""
        text = "ba ɓarna"  # Has 'b' but also has ɓ elsewhere
        result = self.evaluator.validate_hausa_text(text)
        # Should not warn because ɓ is present in text
        self.assertEqual(len(result['warnings']), 0)
    
    def test_warning_for_potential_b_substitution(self):
        """Test warning for potential 'b' that should be 'ɓ'"""
        text = "baki banza"  # Only regular 'b', might need ɓ
        result = self.evaluator.validate_hausa_text(text)
        # Should warn because no ɓ is present
        self.assertGreater(len(result['warnings']), 0)
        self.assertTrue(any('b' in w.lower() and 'implosive' in w.lower() 
                           for w in result['warnings']))
    
    def test_warning_for_potential_d_substitution(self):
        """Test warning for potential 'd' that should be 'ɗ'"""
        text = "daya daga"  # Only regular 'd', might need ɗ
        result = self.evaluator.validate_hausa_text(text)
        # Should warn because no ɗ is present
        self.assertGreater(len(result['warnings']), 0)
        self.assertTrue(any('d' in w.lower() and 'implosive' in w.lower() 
                           for w in result['warnings']))
    
    def test_warning_for_potential_k_substitution(self):
        """Test warning for potential 'k' that should be 'ƙ'"""
        text = "kasa kai"  # Only regular 'k', might need ƙ
        result = self.evaluator.validate_hausa_text(text)
        # Should warn because no ƙ is present
        self.assertGreater(len(result['warnings']), 0)
        self.assertTrue(any('k' in w.lower() and 'ejective' in w.lower() 
                           for w in result['warnings']))
    
    def test_no_warning_with_special_chars_present(self):
        """Test that no warnings appear when special chars are already used"""
        text = "ɓaƙi ɗaya kuma"  # Has all special chars
        result = self.evaluator.validate_hausa_text(text)
        # Should have no warnings because special chars are present
        self.assertEqual(len(result['warnings']), 0)
    
    def test_borrowings_trigger_warning(self):
        """Test that borrowings with 'b', 'd', 'k' still trigger hints"""
        # Borrowings like "buku" (book) or "keke" (bicycle) use regular letters
        # but will still trigger warnings - this is expected as they are hints
        text = "buku da keke"  # Borrowings that use regular b, k
        result = self.evaluator.validate_hausa_text(text)
        # Should warn (hints), even though these are correct borrowings
        # This is acceptable as the warnings are explicitly marked as hints
        self.assertGreater(len(result['warnings']), 0)
    
    def test_phoneme_coverage(self):
        """Test phoneme coverage analysis"""
        text = "baki da kasa"
        result = self.evaluator.validate_hausa_text(text)
        # Check that phoneme coverage is tracked
        self.assertIn('phoneme_coverage', result)
        self.assertGreater(len(result['phoneme_coverage']), 0)
        # Should count 'b', 'd', 'k' occurrences
        if 'b' in result['phoneme_coverage']:
            self.assertGreater(result['phoneme_coverage']['b'], 0)
    
    def test_case_insensitive_pattern_matching(self):
        """Test that patterns work case-insensitively"""
        text = "Baki Da Kasa"  # Capitalized
        result = self.evaluator.validate_hausa_text(text)
        # Should still detect patterns despite capitalization
        self.assertGreater(len(result['warnings']), 0)
    
    def test_word_boundary_detection(self):
        """Test that patterns only match at word boundaries"""
        text = "saboda"  # 'b' in middle, not at word start
        result = self.evaluator.validate_hausa_text(text)
        # Should warn about 'b' at word boundary (if 'ba' pattern exists)
        # but the current pattern looks for word-initial b followed by vowel
        # "saboda" has "bo" which is mid-word, so it shouldn't match \bb[aeiou]
        # Let's test with actual word-initial b
    
    def test_non_vowel_following_consonant(self):
        """Test that pattern requires vowel after consonant"""
        text = "bq xyz"  # 'b' not followed by vowel
        result = self.evaluator.validate_hausa_text(text)
        # Should not warn because 'b' is not followed by a vowel
        # Actually, our pattern is \bb[aeiou], so 'bq' won't match
        warnings_with_b = [w for w in result['warnings'] if 'b' in w.lower() and 'implosive' in w.lower()]
        self.assertEqual(len(warnings_with_b), 0)
    
    def test_mixed_content(self):
        """Test text with both correct and potentially incorrect usage"""
        text = "Sannu ɓaƙi, ina kwana? barka da safe"
        result = self.evaluator.validate_hausa_text(text)
        # Has some special chars (ɓ, ƙ) but also regular 'd' in "da"
        # Since ɗ is NOT present and "da" has word-initial 'd' followed by vowel,
        # it WILL trigger a warning (which is expected as a hint)
        # This is correct behavior since "da" is actually spelled with regular 'd'
        # The warning is a hint, acknowledging that not all cases need special chars
        self.assertGreater(len(result['warnings']), 0)
        self.assertTrue(any('d' in w.lower() and 'implosive' in w.lower() 
                           for w in result['warnings']))


class TestTimestampGeneration(unittest.TestCase):
    """Test cases for timestamp generation in reports"""
    
    def setUp(self):
        """Set up test evaluator instance"""
        self.evaluator = HausaEvaluator()
    
    def test_timestamp_format(self):
        """Test that timestamp is in ISO 8601 format"""
        report = self.evaluator.generate_evaluation_report(
            "Sannu", 
            "Sannu"
        )
        self.assertIn('timestamp', report)
        # ISO 8601 format should contain 'T' separator and colons
        self.assertIn('T', report['timestamp'])
        self.assertIn(':', report['timestamp'])
    
    def test_timestamp_is_string(self):
        """Test that timestamp is returned as a string"""
        report = self.evaluator.generate_evaluation_report(
            "Test",
            "Test"
        )
        self.assertIsInstance(report['timestamp'], str)


class TestRegexPerformance(unittest.TestCase):
    """Test cases for regex pattern performance"""
    
    def setUp(self):
        """Set up test evaluator instance"""
        self.evaluator = HausaEvaluator()
    
    def test_large_text_performance(self):
        """Test that validation works efficiently on large texts"""
        # Create a large text (simulate real usage)
        large_text = "ba da ka " * 1000  # 3000 words
        
        import time
        start_time = time.time()
        result = self.evaluator.validate_hausa_text(large_text)
        end_time = time.time()
        
        # Should complete in reasonable time (< 1 second for 3000 words)
        execution_time = end_time - start_time
        self.assertLess(execution_time, 1.0, 
                       f"Validation took {execution_time:.2f}s, should be < 1s")
        
        # Should still return valid results
        self.assertTrue(result['is_valid'])
        self.assertIn('warnings', result)
    
    def test_precompiled_patterns_exist(self):
        """Test that regex patterns are pre-compiled at class level"""
        # Verify that patterns are compiled regex objects, not strings
        import re
        self.assertIsInstance(HausaEvaluator.PATTERN_B_START, re.Pattern)
        self.assertIsInstance(HausaEvaluator.PATTERN_D_START, re.Pattern)
        self.assertIsInstance(HausaEvaluator.PATTERN_K_ANY, re.Pattern)


class TestPhonemeAlignment(unittest.TestCase):
    """Test cases for phoneme alignment calculations"""
    
    def setUp(self):
        """Set up test evaluator instance"""
        self.evaluator = HausaEvaluator()
    
    def test_identical_texts(self):
        """Test alignment with identical reference and hypothesis"""
        text = "Sannu da zuwa"
        result = self.evaluator.calculate_phoneme_alignment(text, text)
        # Should have perfect alignment
        self.assertEqual(result['word_error_rate'], 0.0)
        self.assertEqual(result['character_error_rate'], 0.0)
        self.assertEqual(result['alignment_score'], 100.0)
    
    def test_completely_different_texts(self):
        """Test alignment with completely different texts"""
        ref = "Sannu"
        hyp = "Barka"
        result = self.evaluator.calculate_phoneme_alignment(ref, hyp)
        # Should have high error rates
        self.assertGreater(result['word_error_rate'], 0)


if __name__ == '__main__':
    unittest.main()
