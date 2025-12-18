"""
Tests for unified configuration manager
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from config_manager import ConfigManager, get_config


def test_singleton_pattern():
    """Test that ConfigManager follows singleton pattern"""
    config1 = get_config()
    config2 = get_config()
    
    assert config1 is config2, "ConfigManager should be a singleton"


def test_service_availability():
    """Test service availability detection"""
    config = get_config()
    
    # Test is_service_available method
    # Note: Actual availability depends on environment variables
    result = config.is_service_available('openai')
    assert isinstance(result, bool)
    
    result = config.is_service_available('gemini')
    assert isinstance(result, bool)
    
    result = config.is_service_available('unknown_service')
    assert result is False


def test_get_available_services():
    """Test getting list of available services"""
    config = get_config()
    services = config.get_available_services()
    
    assert isinstance(services, list)
    # All items should be strings
    assert all(isinstance(s, str) for s in services)


def test_config_getters():
    """Test configuration getter methods"""
    config = get_config()
    
    # Test OpenAI config
    openai_config = config.get_openai_config()
    assert isinstance(openai_config, dict)
    assert 'api_key' in openai_config
    
    # Test Google Cloud config
    gc_config = config.get_google_cloud_config()
    assert isinstance(gc_config, dict)
    assert 'credentials_path' in gc_config
    assert 'project_id' in gc_config
    
    # Test Azure config
    azure_config = config.get_azure_speech_config()
    assert isinstance(azure_config, dict)
    assert 'subscription_key' in azure_config
    assert 'region' in azure_config
    
    # Test Gemini config
    gemini_config = config.get_gemini_config()
    assert isinstance(gemini_config, dict)
    assert 'api_key' in gemini_config
    assert 'model' in gemini_config


def test_tts_config():
    """Test TTS configuration"""
    config = get_config()
    tts_config = config.get_tts_config()
    
    assert isinstance(tts_config, dict)
    assert 'primary_provider' in tts_config
    assert 'fallback_provider' in tts_config
    assert tts_config['primary_provider'] in ['azure', 'google']
    assert tts_config['fallback_provider'] in ['azure', 'google']


def test_rate_limiting_config():
    """Test rate limiting configuration"""
    config = get_config()
    rl_config = config.get_rate_limiting_config()
    
    assert isinstance(rl_config, dict)
    assert 'enabled' in rl_config
    assert 'google_cloud_monthly_limit' in rl_config
    assert isinstance(rl_config['enabled'], bool)
    assert isinstance(rl_config['google_cloud_monthly_limit'], (int, float))


def test_config_summary():
    """Test configuration summary"""
    config = get_config()
    summary = config.get_config_summary()
    
    assert isinstance(summary, dict)
    assert 'available_services' in summary
    assert 'tts_primary' in summary
    assert 'tts_fallback' in summary
    assert 'rate_limiting_enabled' in summary


if __name__ == '__main__':
    # Run tests
    print("Running Configuration Manager Tests...")
    print("=" * 60)
    
    test_singleton_pattern()
    print("✓ Singleton pattern test passed")
    
    test_service_availability()
    print("✓ Service availability test passed")
    
    test_get_available_services()
    print("✓ Get available services test passed")
    
    test_config_getters()
    print("✓ Configuration getters test passed")
    
    test_tts_config()
    print("✓ TTS configuration test passed")
    
    test_rate_limiting_config()
    print("✓ Rate limiting configuration test passed")
    
    test_config_summary()
    print("✓ Configuration summary test passed")
    
    print("=" * 60)
    print("All tests passed!")
