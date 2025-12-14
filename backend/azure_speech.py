"""
Azure Speech Services integration for native Hausa voice synthesis
Provides enhanced Text-to-Speech capabilities with native accents and intonation
"""

import os
import base64
from typing import Optional, Dict, List
import logging
import azure.cognitiveservices.speech as speechsdk

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AzureSpeechService:
    """Azure Speech Service for Hausa TTS and STT"""
    
    # Available Hausa voices in Azure
    HAUSA_VOICES = {
        'female': 'ha-NG-AbeoNaural',  # Female voice for Hausa (Nigeria)
        'male': 'ha-NG-SamuelNeural'   # Male voice for Hausa (Nigeria)
    }
    
    def __init__(self, 
                 subscription_key: Optional[str] = None,
                 region: Optional[str] = None):
        """
        Initialize Azure Speech Service
        
        Args:
            subscription_key: Azure Speech API key
            region: Azure region (e.g., 'eastus', 'westeurope')
        """
        self.subscription_key = subscription_key or os.getenv('AZURE_SPEECH_KEY')
        self.region = region or os.getenv('AZURE_SPEECH_REGION', 'eastus')
        
        if not self.subscription_key:
            logger.warning("Azure Speech API key not found. TTS/STT will not work.")
            self.speech_config = None
        else:
            self.speech_config = speechsdk.SpeechConfig(
                subscription=self.subscription_key,
                region=self.region
            )
            logger.info(f"Azure Speech Service initialized in region: {self.region}")
    
    def text_to_speech(self,
                      text: str,
                      voice_name: str = 'female',
                      language_code: str = 'ha-NG',
                      output_format: str = 'mp3',
                      speaking_rate: float = 1.0,
                      pitch: str = 'default') -> Optional[bytes]:
        """
        Convert text to speech using Azure TTS
        
        Args:
            text: Text to synthesize
            voice_name: Voice identifier ('female' or 'male') or full voice name
            language_code: Language code (ha-NG for Hausa Nigeria)
            output_format: Output format ('mp3', 'wav')
            speaking_rate: Speech rate (0.5 to 2.0)
            pitch: Pitch adjustment ('x-low', 'low', 'default', 'high', 'x-high')
        
        Returns:
            Audio bytes or None if error
        """
        if not self.speech_config:
            logger.error("Azure Speech Service not initialized")
            return None
        
        try:
            # Get full voice name
            if voice_name in self.HAUSA_VOICES:
                full_voice_name = self.HAUSA_VOICES[voice_name]
            else:
                full_voice_name = voice_name
            
            # Set output format
            if output_format == 'mp3':
                self.speech_config.set_speech_synthesis_output_format(
                    speechsdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3
                )
            else:  # wav
                self.speech_config.set_speech_synthesis_output_format(
                    speechsdk.SpeechSynthesisOutputFormat.Audio16Khz16BitMonoPcm
                )
            
            # Create synthesizer
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config,
                audio_config=None  # Return audio data instead of playing
            )
            
            # Build SSML for better control
            ssml = self._build_ssml(text, full_voice_name, language_code, speaking_rate, pitch)
            
            # Synthesize
            result = synthesizer.speak_ssml_async(ssml).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                logger.info(f"Speech synthesized: {len(result.audio_data)} bytes")
                return result.audio_data
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation = result.cancellation_details
                logger.error(f"Speech synthesis canceled: {cancellation.reason}")
                if cancellation.reason == speechsdk.CancellationReason.Error:
                    logger.error(f"Error details: {cancellation.error_details}")
                return None
            
        except Exception as e:
            logger.error(f"Error in text-to-speech: {e}")
            return None
    
    def text_to_speech_base64(self,
                             text: str,
                             voice_name: str = 'female',
                             **kwargs) -> Optional[str]:
        """
        Convert text to speech and return as base64 string
        
        Args:
            text: Text to synthesize
            voice_name: Voice identifier
            **kwargs: Additional arguments for text_to_speech
        
        Returns:
            Base64 encoded audio or None
        """
        audio_data = self.text_to_speech(text, voice_name, **kwargs)
        
        if audio_data:
            return base64.b64encode(audio_data).decode('utf-8')
        return None
    
    def speech_to_text(self,
                      audio_data: bytes,
                      language_code: str = 'ha-NG') -> Optional[Dict]:
        """
        Convert speech to text using Azure STT
        
        Args:
            audio_data: Audio data bytes
            language_code: Language code (ha-NG for Hausa Nigeria)
        
        Returns:
            Dictionary with transcription results or None
        """
        if not self.speech_config:
            logger.error("Azure Speech Service not initialized")
            return None
        
        try:
            # Set recognition language
            self.speech_config.speech_recognition_language = language_code
            
            # Create audio config from bytes
            audio_format = speechsdk.audio.AudioStreamFormat(
                samples_per_second=16000,
                bits_per_sample=16,
                channels=1
            )
            
            # Create push stream
            push_stream = speechsdk.audio.PushAudioInputStream(audio_format)
            push_stream.write(audio_data)
            push_stream.close()
            
            audio_config = speechsdk.audio.AudioConfig(stream=push_stream)
            
            # Create recognizer
            recognizer = speechsdk.SpeechRecognizer(
                speech_config=self.speech_config,
                audio_config=audio_config
            )
            
            # Recognize
            result = recognizer.recognize_once_async().get()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return {
                    'text': result.text,
                    'confidence': 1.0,  # Azure doesn't provide confidence in single recognition
                    'language': language_code
                }
            elif result.reason == speechsdk.ResultReason.NoMatch:
                logger.warning("No speech could be recognized")
                return None
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation = result.cancellation_details
                logger.error(f"Speech recognition canceled: {cancellation.reason}")
                return None
            
        except Exception as e:
            logger.error(f"Error in speech-to-text: {e}")
            return None
    
    def _build_ssml(self,
                   text: str,
                   voice_name: str,
                   language: str,
                   rate: float = 1.0,
                   pitch: str = 'default') -> str:
        """
        Build SSML (Speech Synthesis Markup Language) for fine-tuned speech
        
        Args:
            text: Text to synthesize
            voice_name: Full voice name
            language: Language code
            rate: Speaking rate
            pitch: Pitch level
        
        Returns:
            SSML string
        """
        # Convert rate to percentage
        rate_percent = f"{int((rate - 1) * 100):+d}%"
        
        # Build prosody attributes
        prosody_attrs = f'rate="{rate_percent}"'
        if pitch != 'default':
            prosody_attrs += f' pitch="{pitch}"'
        
        ssml = f'''
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{language}">
            <voice name="{voice_name}">
                <prosody {prosody_attrs}>
                    {text}
                </prosody>
            </voice>
        </speak>
        '''
        
        return ssml.strip()
    
    def get_available_voices(self) -> List[Dict]:
        """
        Get list of available Hausa voices
        
        Returns:
            List of voice information dictionaries
        """
        voices = []
        for key, voice_name in self.HAUSA_VOICES.items():
            voices.append({
                'id': key,
                'name': voice_name,
                'language': 'ha-NG',
                'gender': key,
                'neural': 'Neural' in voice_name
            })
        
        return voices
    
    def test_connection(self) -> bool:
        """
        Test Azure Speech Service connection
        
        Returns:
            True if connection successful
        """
        try:
            if not self.speech_config:
                return False
            
            # Try a simple TTS request
            test_text = "Sannu"
            result = self.text_to_speech(test_text, voice_name='female')
            
            return result is not None
            
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False


def main():
    """Example usage"""
    # Initialize service
    service = AzureSpeechService()
    
    # Test connection
    if service.test_connection():
        print("✓ Azure Speech Service connected successfully")
    else:
        print("✗ Azure Speech Service connection failed")
        return
    
    # Get available voices
    voices = service.get_available_voices()
    print("\nAvailable Hausa voices:")
    for voice in voices:
        print(f"  - {voice['name']} ({voice['gender']}, neural: {voice['neural']})")
    
    # Test TTS
    test_text = "Sannu, ina kwana? Lafiya lau. Na gode."
    print(f"\nSynthesizing: {test_text}")
    
    audio_base64 = service.text_to_speech_base64(
        test_text,
        voice_name='female',
        speaking_rate=0.9
    )
    
    if audio_base64:
        print(f"✓ Audio generated: {len(audio_base64)} characters (base64)")
    else:
        print("✗ Audio generation failed")


if __name__ == '__main__':
    main()
