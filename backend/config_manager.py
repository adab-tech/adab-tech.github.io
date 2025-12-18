"""
Unified Configuration Manager for Hausa Chatbot API
Centralizes management of all API keys and service configurations
"""

import os
from typing import Optional, Dict
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConfigManager:
    """Centralized configuration management for all API integrations"""
    
    _instance = None
    
    def __new__(cls):
        """Singleton pattern to ensure single instance"""
        if cls._instance is None:
            cls._instance = super(ConfigManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize configuration manager"""
        if self._initialized:
            return
            
        # Load environment variables
        load_dotenv()
        
        # OpenAI Configuration
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        
        # Google Cloud Configuration
        self.google_cloud_credentials = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        self.google_cloud_project = os.getenv('GOOGLE_CLOUD_PROJECT')
        self.google_api_key = os.getenv('GOOGLE_API_KEY')  # For Gemini Pro
        
        # Azure Speech Configuration
        self.azure_speech_key = os.getenv('AZURE_SPEECH_KEY')
        self.azure_speech_region = os.getenv('AZURE_SPEECH_REGION', 'eastus')
        
        # Gemini Pro Configuration
        self.gemini_api_key = os.getenv('GEMINI_API_KEY') or self.google_api_key
        self.gemini_model = os.getenv('GEMINI_MODEL', 'gemini-pro')
        
        # Service Priority Configuration
        self.tts_primary_provider = os.getenv('TTS_PRIMARY_PROVIDER', 'azure').lower()
        self.tts_fallback_provider = os.getenv('TTS_FALLBACK_PROVIDER', 'google').lower()
        
        # Rate Limiting Configuration
        self.google_cloud_monthly_limit = int(os.getenv('GOOGLE_CLOUD_MONTHLY_LIMIT', '300'))  # USD
        self.enable_rate_limiting = os.getenv('ENABLE_RATE_LIMITING', 'true').lower() == 'true'
        
        # Flask Configuration
        self.flask_env = os.getenv('FLASK_ENV', 'development')
        self.flask_debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
        self.port = int(os.getenv('PORT', 5000))
        self.host = os.getenv('HOST', '0.0.0.0')
        
        # CORS Configuration
        self.cors_origins = os.getenv('CORS_ORIGINS', '*')
        
        # Autonomous Training Configuration
        self.auto_train_enabled = os.getenv('AUTO_TRAIN_ENABLED', 'true').lower() == 'true'
        self.auto_train_min_conversations = int(os.getenv('AUTO_TRAIN_MIN_CONVERSATIONS', '50'))
        self.auto_train_interval_hours = int(os.getenv('AUTO_TRAIN_INTERVAL_HOURS', '24'))
        self.auto_train_model = os.getenv('AUTO_TRAIN_MODEL', 'gpt-3.5-turbo')
        
        # Dataset Configuration
        self.dataset_cache_dir = os.getenv('DATASET_CACHE_DIR', './data_cache')
        self.use_mozilla_common_voice = os.getenv('USE_MOZILLA_COMMON_VOICE', 'true').lower() == 'true'
        self.use_jw300_corpus = os.getenv('USE_JW300_CORPUS', 'true').lower() == 'true'
        self.use_opus_corpus = os.getenv('USE_OPUS_CORPUS', 'true').lower() == 'true'
        self.use_hausanlp_corpus = os.getenv('USE_HAUSANLP_CORPUS', 'false').lower() == 'true'
        
        # Evaluation Settings
        self.enable_phoneme_validation = os.getenv('ENABLE_PHONEME_VALIDATION', 'true').lower() == 'true'
        self.enable_tonal_validation = os.getenv('ENABLE_TONAL_VALIDATION', 'true').lower() == 'true'
        self.enable_cultural_validation = os.getenv('ENABLE_CULTURAL_VALIDATION', 'true').lower() == 'true'
        
        self._initialized = True
        self._validate_config()
    
    def _validate_config(self):
        """Validate critical configuration values"""
        warnings = []
        
        # Check OpenAI API key
        if not self.openai_api_key:
            warnings.append("OPENAI_API_KEY not set - OpenAI features will not work")
        
        # Check Google Cloud configuration
        if not self.google_cloud_credentials and not self.google_api_key:
            warnings.append("Neither GOOGLE_APPLICATION_CREDENTIALS nor GOOGLE_API_KEY set - Google Cloud features may not work")
        
        # Check Azure Speech configuration
        if not self.azure_speech_key:
            warnings.append("AZURE_SPEECH_KEY not set - Azure Speech features will not work")
        
        # Check Gemini configuration
        if not self.gemini_api_key:
            warnings.append("GEMINI_API_KEY not set - Gemini Pro features will not work")
        
        # Log warnings
        for warning in warnings:
            logger.warning(f"Configuration warning: {warning}")
        
        if warnings:
            logger.info("Some API keys are missing. Set them in .env file for full functionality.")
    
    def get_openai_config(self) -> Dict[str, Optional[str]]:
        """Get OpenAI configuration"""
        return {
            'api_key': self.openai_api_key
        }
    
    def get_google_cloud_config(self) -> Dict[str, Optional[str]]:
        """Get Google Cloud configuration"""
        return {
            'credentials_path': self.google_cloud_credentials,
            'project_id': self.google_cloud_project,
            'api_key': self.google_api_key
        }
    
    def get_azure_speech_config(self) -> Dict[str, Optional[str]]:
        """Get Azure Speech configuration"""
        return {
            'subscription_key': self.azure_speech_key,
            'region': self.azure_speech_region
        }
    
    def get_gemini_config(self) -> Dict[str, Optional[str]]:
        """Get Gemini Pro configuration"""
        return {
            'api_key': self.gemini_api_key,
            'model': self.gemini_model
        }
    
    def get_tts_config(self) -> Dict[str, str]:
        """Get Text-to-Speech configuration"""
        return {
            'primary_provider': self.tts_primary_provider,
            'fallback_provider': self.tts_fallback_provider
        }
    
    def get_rate_limiting_config(self) -> Dict:
        """Get rate limiting configuration"""
        return {
            'enabled': self.enable_rate_limiting,
            'google_cloud_monthly_limit': self.google_cloud_monthly_limit
        }
    
    def is_service_available(self, service: str) -> bool:
        """
        Check if a service is available (has required configuration)
        
        Args:
            service: Service name ('openai', 'google_cloud', 'azure_speech', 'gemini')
        
        Returns:
            True if service is available
        """
        service = service.lower()
        
        if service == 'openai':
            return bool(self.openai_api_key)
        elif service == 'google_cloud':
            return bool(self.google_cloud_credentials or self.google_api_key)
        elif service == 'azure_speech':
            return bool(self.azure_speech_key)
        elif service == 'gemini':
            return bool(self.gemini_api_key)
        else:
            return False
    
    def get_available_services(self) -> list:
        """Get list of available services"""
        services = []
        for service in ['openai', 'google_cloud', 'azure_speech', 'gemini']:
            if self.is_service_available(service):
                services.append(service)
        return services
    
    def get_config_summary(self) -> Dict:
        """Get summary of current configuration"""
        return {
            'available_services': self.get_available_services(),
            'tts_primary': self.tts_primary_provider,
            'tts_fallback': self.tts_fallback_provider,
            'rate_limiting_enabled': self.enable_rate_limiting,
            'auto_train_enabled': self.auto_train_enabled,
            'flask_env': self.flask_env
        }


# Global instance
_config_manager = None


def get_config() -> ConfigManager:
    """
    Get the global configuration manager instance
    
    Returns:
        ConfigManager instance
    """
    global _config_manager
    if _config_manager is None:
        _config_manager = ConfigManager()
    return _config_manager


# Convenience functions for backward compatibility
def get_openai_api_key() -> Optional[str]:
    """Get OpenAI API key"""
    return get_config().openai_api_key


def get_google_cloud_credentials() -> Optional[str]:
    """Get Google Cloud credentials path"""
    return get_config().google_cloud_credentials


def get_azure_speech_key() -> Optional[str]:
    """Get Azure Speech API key"""
    return get_config().azure_speech_key


def get_gemini_api_key() -> Optional[str]:
    """Get Gemini API key"""
    return get_config().gemini_api_key


if __name__ == '__main__':
    # Test configuration manager
    config = get_config()
    
    print("=" * 60)
    print("Configuration Manager Test")
    print("=" * 60)
    
    print("\nConfiguration Summary:")
    summary = config.get_config_summary()
    for key, value in summary.items():
        print(f"  {key}: {value}")
    
    print("\nService Availability:")
    for service in ['openai', 'google_cloud', 'azure_speech', 'gemini']:
        available = config.is_service_available(service)
        status = "✓" if available else "✗"
        print(f"  {status} {service}: {'Available' if available else 'Not configured'}")
    
    print("\nTTS Configuration:")
    tts_config = config.get_tts_config()
    print(f"  Primary: {tts_config['primary_provider']}")
    print(f"  Fallback: {tts_config['fallback_provider']}")
    
    print("\n" + "=" * 60)
