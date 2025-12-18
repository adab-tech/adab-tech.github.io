"""
Secure API Key Validation Service
Provides server-side API key validation without exposing keys to the frontend
"""

import os
import hashlib
import secrets
from typing import Optional, Dict
from flask import session
from datetime import datetime, timedelta
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SecureAPIKeyManager:
    """
    Manages API key validation without storing full keys on client side
    Uses session-based authentication tokens instead
    """
    
    def __init__(self, session_timeout_minutes: int = 60):
        """
        Initialize secure API key manager
        
        Args:
            session_timeout_minutes: Session timeout in minutes
        """
        self.session_timeout = timedelta(minutes=session_timeout_minutes)
        self.active_sessions = {}  # In production, use Redis or similar
        
        logger.info(f"Secure API Key Manager initialized with {session_timeout_minutes}min timeout")
    
    def _hash_api_key(self, api_key: str) -> str:
        """
        Hash an API key for secure storage
        
        Args:
            api_key: API key to hash
        
        Returns:
            Hashed key
        """
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    def validate_api_key(self, api_key: str, provider: str = 'openai') -> Dict:
        """
        Validate an API key by attempting to use it
        
        Args:
            api_key: API key to validate
            provider: Provider name ('openai', 'gemini', etc.)
        
        Returns:
            Dictionary with validation result
        """
        try:
            if provider == 'openai':
                return self._validate_openai_key(api_key)
            elif provider == 'gemini':
                return self._validate_gemini_key(api_key)
            elif provider == 'google_cloud':
                return self._validate_google_cloud_key(api_key)
            else:
                return {
                    'valid': False,
                    'error': f'Unknown provider: {provider}'
                }
        except Exception as e:
            logger.error(f"Error validating API key: {e}")
            return {
                'valid': False,
                'error': str(e)
            }
    
    def _validate_openai_key(self, api_key: str) -> Dict:
        """Validate OpenAI API key"""
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            
            # Try a simple API call
            response = client.models.list()
            
            return {
                'valid': True,
                'provider': 'openai',
                'message': 'API key is valid'
            }
        except Exception as e:
            return {
                'valid': False,
                'provider': 'openai',
                'error': 'Invalid API key'
            }
    
    def _validate_gemini_key(self, api_key: str) -> Dict:
        """Validate Gemini API key"""
        try:
            import google.generativeai as genai
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Try a simple generation
            response = model.generate_content("Hello")
            
            return {
                'valid': True,
                'provider': 'gemini',
                'message': 'API key is valid'
            }
        except Exception as e:
            return {
                'valid': False,
                'provider': 'gemini',
                'error': 'Invalid API key'
            }
    
    def _validate_google_cloud_key(self, api_key: str) -> Dict:
        """Validate Google Cloud API key"""
        # For Google Cloud, typically use service account credentials
        # This is a placeholder for API key validation
        return {
            'valid': False,
            'provider': 'google_cloud',
            'error': 'Google Cloud uses service account credentials, not API keys'
        }
    
    def create_session_token(self, user_id: str = 'default') -> str:
        """
        Create a secure session token
        
        Args:
            user_id: User identifier
        
        Returns:
            Session token
        """
        token = secrets.token_urlsafe(32)
        
        self.active_sessions[token] = {
            'user_id': user_id,
            'created_at': datetime.now(),
            'expires_at': datetime.now() + self.session_timeout
        }
        
        logger.info(f"Session token created for user: {user_id}")
        return token
    
    def validate_session_token(self, token: str) -> bool:
        """
        Validate a session token
        
        Args:
            token: Session token
        
        Returns:
            True if valid and not expired
        """
        if token not in self.active_sessions:
            return False
        
        session_data = self.active_sessions[token]
        
        # Check expiration
        if datetime.now() > session_data['expires_at']:
            del self.active_sessions[token]
            return False
        
        return True
    
    def invalidate_session(self, token: str):
        """
        Invalidate a session token
        
        Args:
            token: Session token to invalidate
        """
        if token in self.active_sessions:
            del self.active_sessions[token]
            logger.info("Session token invalidated")
    
    def get_session_info(self, token: str) -> Optional[Dict]:
        """
        Get session information
        
        Args:
            token: Session token
        
        Returns:
            Session data or None
        """
        if not self.validate_session_token(token):
            return None
        
        session_data = self.active_sessions[token]
        
        return {
            'user_id': session_data['user_id'],
            'created_at': session_data['created_at'].isoformat(),
            'expires_at': session_data['expires_at'].isoformat(),
            'time_remaining': (session_data['expires_at'] - datetime.now()).total_seconds()
        }
    
    def cleanup_expired_sessions(self):
        """Remove expired sessions"""
        now = datetime.now()
        expired_tokens = [
            token for token, data in self.active_sessions.items()
            if now > data['expires_at']
        ]
        
        for token in expired_tokens:
            del self.active_sessions[token]
        
        if expired_tokens:
            logger.info(f"Cleaned up {len(expired_tokens)} expired sessions")


# Global instance
_api_key_manager = None


def get_api_key_manager() -> SecureAPIKeyManager:
    """
    Get the global API key manager instance
    
    Returns:
        SecureAPIKeyManager instance
    """
    global _api_key_manager
    if _api_key_manager is None:
        _api_key_manager = SecureAPIKeyManager()
    return _api_key_manager


if __name__ == '__main__':
    # Test API key manager
    print("=" * 60)
    print("Secure API Key Manager Test")
    print("=" * 60)
    
    manager = SecureAPIKeyManager()
    
    # Create a session token
    print("\nCreating session token...")
    token = manager.create_session_token('test_user')
    print(f"Token: {token[:20]}...")
    
    # Validate token
    print("\nValidating token...")
    is_valid = manager.validate_session_token(token)
    print(f"Valid: {is_valid}")
    
    # Get session info
    print("\nSession info:")
    info = manager.get_session_info(token)
    for key, value in info.items():
        print(f"  {key}: {value}")
    
    # Invalidate session
    print("\nInvalidating session...")
    manager.invalidate_session(token)
    
    # Validate again
    print("Validating after invalidation...")
    is_valid = manager.validate_session_token(token)
    print(f"Valid: {is_valid}")
    
    print("\n" + "=" * 60)
