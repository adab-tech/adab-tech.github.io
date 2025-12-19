"""
Rate Limiter for Google Cloud API Usage
Helps manage the $300 free trial credits by tracking and limiting API usage
"""

import os
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Optional
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RateLimiter:
    """
    Rate limiter for Google Cloud API usage to protect free trial credits
    """
    
    # Estimated costs (in USD per 1000 characters for TTS, per minute for STT)
    COST_TTS_PER_1K_CHARS = 0.000004  # Standard voices
    COST_STT_PER_MINUTE = 0.006  # Standard recognition
    
    def __init__(self, 
                 monthly_budget: float = 300.0,
                 usage_file: str = 'google_cloud_usage.json',
                 enabled: bool = True):
        """
        Initialize rate limiter
        
        Args:
            monthly_budget: Maximum monthly spending limit in USD
            usage_file: File to store usage data
            enabled: Whether rate limiting is enabled
        """
        self.monthly_budget = monthly_budget
        self.usage_file = usage_file
        self.enabled = enabled
        self.usage_data = self._load_usage_data()
        
        logger.info(f"Rate limiter initialized: Budget=${monthly_budget}/month, Enabled={enabled}")
    
    def _load_usage_data(self) -> Dict:
        """Load usage data from file"""
        if not os.path.exists(self.usage_file):
            return self._create_new_usage_data()
        
        try:
            with open(self.usage_file, 'r') as f:
                data = json.load(f)
            
            # Reset if we're in a new month
            last_reset = datetime.fromisoformat(data.get('last_reset', datetime.now().isoformat()))
            if last_reset.month != datetime.now().month or last_reset.year != datetime.now().year:
                logger.info("New month detected - resetting usage data")
                return self._create_new_usage_data()
            
            return data
        except Exception as e:
            logger.error(f"Error loading usage data: {e}")
            return self._create_new_usage_data()
    
    def _create_new_usage_data(self) -> Dict:
        """Create new usage data structure"""
        return {
            'last_reset': datetime.now().isoformat(),
            'total_cost': 0.0,
            'tts_requests': 0,
            'tts_characters': 0,
            'tts_cost': 0.0,
            'stt_requests': 0,
            'stt_minutes': 0.0,
            'stt_cost': 0.0,
            'daily_usage': {}
        }
    
    def _save_usage_data(self):
        """Save usage data to file"""
        try:
            with open(self.usage_file, 'w') as f:
                json.dump(self.usage_data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving usage data: {e}")
    
    def _get_today_key(self) -> str:
        """Get today's date key for daily usage tracking"""
        return datetime.now().strftime('%Y-%m-%d')
    
    def check_tts_allowed(self, text_length: int) -> tuple[bool, str]:
        """
        Check if TTS request is allowed under budget
        
        Args:
            text_length: Length of text in characters
        
        Returns:
            Tuple of (allowed, message)
        """
        if not self.enabled:
            return True, "Rate limiting disabled"
        
        # Calculate estimated cost
        estimated_cost = (text_length / 1000) * self.COST_TTS_PER_1K_CHARS
        projected_cost = self.usage_data['total_cost'] + estimated_cost
        
        # Check if within budget
        if projected_cost > self.monthly_budget:
            remaining = self.monthly_budget - self.usage_data['total_cost']
            return False, f"Budget exceeded. Remaining: ${remaining:.4f}"
        
        # Check daily limit (10% of monthly budget per day)
        daily_limit = self.monthly_budget * 0.1
        today = self._get_today_key()
        daily_usage = self.usage_data['daily_usage'].get(today, 0.0)
        
        if daily_usage + estimated_cost > daily_limit:
            return False, f"Daily limit reached. Limit: ${daily_limit:.2f}/day"
        
        return True, "Request allowed"
    
    def log_tts_usage(self, text_length: int):
        """
        Log TTS usage
        
        Args:
            text_length: Length of text in characters
        """
        if not self.enabled:
            return
        
        cost = (text_length / 1000) * self.COST_TTS_PER_1K_CHARS
        today = self._get_today_key()
        
        self.usage_data['tts_requests'] += 1
        self.usage_data['tts_characters'] += text_length
        self.usage_data['tts_cost'] += cost
        self.usage_data['total_cost'] += cost
        
        # Update daily usage
        if today not in self.usage_data['daily_usage']:
            self.usage_data['daily_usage'][today] = 0.0
        self.usage_data['daily_usage'][today] += cost
        
        self._save_usage_data()
        
        logger.info(f"TTS usage logged: {text_length} chars, ${cost:.6f}, Total: ${self.usage_data['total_cost']:.4f}")
    
    def check_stt_allowed(self, audio_duration_seconds: float) -> tuple[bool, str]:
        """
        Check if STT request is allowed under budget
        
        Args:
            audio_duration_seconds: Duration of audio in seconds
        
        Returns:
            Tuple of (allowed, message)
        """
        if not self.enabled:
            return True, "Rate limiting disabled"
        
        # Calculate estimated cost
        audio_minutes = audio_duration_seconds / 60.0
        estimated_cost = audio_minutes * self.COST_STT_PER_MINUTE
        projected_cost = self.usage_data['total_cost'] + estimated_cost
        
        # Check if within budget
        if projected_cost > self.monthly_budget:
            remaining = self.monthly_budget - self.usage_data['total_cost']
            return False, f"Budget exceeded. Remaining: ${remaining:.4f}"
        
        # Check daily limit (10% of monthly budget per day)
        daily_limit = self.monthly_budget * 0.1
        today = self._get_today_key()
        daily_usage = self.usage_data['daily_usage'].get(today, 0.0)
        
        if daily_usage + estimated_cost > daily_limit:
            return False, f"Daily limit reached. Limit: ${daily_limit:.2f}/day"
        
        return True, "Request allowed"
    
    def log_stt_usage(self, audio_duration_seconds: float):
        """
        Log STT usage
        
        Args:
            audio_duration_seconds: Duration of audio in seconds
        """
        if not self.enabled:
            return
        
        audio_minutes = audio_duration_seconds / 60.0
        cost = audio_minutes * self.COST_STT_PER_MINUTE
        today = self._get_today_key()
        
        self.usage_data['stt_requests'] += 1
        self.usage_data['stt_minutes'] += audio_minutes
        self.usage_data['stt_cost'] += cost
        self.usage_data['total_cost'] += cost
        
        # Update daily usage
        if today not in self.usage_data['daily_usage']:
            self.usage_data['daily_usage'][today] = 0.0
        self.usage_data['daily_usage'][today] += cost
        
        self._save_usage_data()
        
        logger.info(f"STT usage logged: {audio_minutes:.2f} min, ${cost:.6f}, Total: ${self.usage_data['total_cost']:.4f}")
    
    def get_usage_summary(self) -> Dict:
        """Get usage summary"""
        budget_used_pct = (self.usage_data['total_cost'] / self.monthly_budget) * 100
        remaining_budget = self.monthly_budget - self.usage_data['total_cost']
        
        # Calculate days remaining in month
        now = datetime.now()
        days_in_month = (datetime(now.year, now.month + 1, 1) - timedelta(days=1)).day if now.month < 12 else 31
        days_remaining = days_in_month - now.day + 1
        
        # Calculate daily budget remaining
        daily_budget_remaining = remaining_budget / days_remaining if days_remaining > 0 else 0
        
        return {
            'enabled': self.enabled,
            'monthly_budget': self.monthly_budget,
            'total_cost': self.usage_data['total_cost'],
            'remaining_budget': remaining_budget,
            'budget_used_percentage': budget_used_pct,
            'days_remaining_in_month': days_remaining,
            'suggested_daily_budget': daily_budget_remaining,
            'tts': {
                'requests': self.usage_data['tts_requests'],
                'characters': self.usage_data['tts_characters'],
                'cost': self.usage_data['tts_cost']
            },
            'stt': {
                'requests': self.usage_data['stt_requests'],
                'minutes': self.usage_data['stt_minutes'],
                'cost': self.usage_data['stt_cost']
            },
            'last_reset': self.usage_data['last_reset']
        }
    
    def reset_usage(self):
        """Manually reset usage data"""
        self.usage_data = self._create_new_usage_data()
        self._save_usage_data()
        logger.info("Usage data manually reset")


# Global instance
_rate_limiter = None


def get_rate_limiter(
    monthly_budget: Optional[float] = None,
    enabled: Optional[bool] = None
) -> RateLimiter:
    """
    Get the global rate limiter instance
    
    Args:
        monthly_budget: Override monthly budget
        enabled: Override enabled state
    
    Returns:
        RateLimiter instance
    """
    global _rate_limiter
    
    if _rate_limiter is None:
        # Get settings from environment
        from config_manager import get_config
        config = get_config()
        
        budget = monthly_budget or config.google_cloud_monthly_limit
        is_enabled = enabled if enabled is not None else config.enable_rate_limiting
        
        _rate_limiter = RateLimiter(
            monthly_budget=budget,
            enabled=is_enabled
        )
    
    return _rate_limiter


if __name__ == '__main__':
    # Test rate limiter
    print("=" * 60)
    print("Rate Limiter Test")
    print("=" * 60)
    
    limiter = RateLimiter(monthly_budget=300.0, enabled=True)
    
    # Test TTS check
    print("\nTesting TTS check (1000 chars):")
    allowed, msg = limiter.check_tts_allowed(1000)
    print(f"  Allowed: {allowed}, Message: {msg}")
    
    if allowed:
        limiter.log_tts_usage(1000)
    
    # Test STT check
    print("\nTesting STT check (60 seconds):")
    allowed, msg = limiter.check_stt_allowed(60)
    print(f"  Allowed: {allowed}, Message: {msg}")
    
    if allowed:
        limiter.log_stt_usage(60)
    
    # Get summary
    print("\nUsage Summary:")
    summary = limiter.get_usage_summary()
    for key, value in summary.items():
        if isinstance(value, dict):
            print(f"  {key}:")
            for k, v in value.items():
                print(f"    {k}: {v}")
        else:
            print(f"  {key}: {value}")
    
    print("\n" + "=" * 60)
