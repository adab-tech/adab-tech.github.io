"""
Azure Speech Services integration for native Hausa voice synthesis
Provides enhanced Text-to-Speech capabilities with native accents and intonation
Includes Google Cloud TTS as fallback for reliability and cost optimization
"""

import os
import base64
from typing import Optional, Dict, List
import logging
import azure.cognitiveservices.speech as speechsdk
from google.cloud import texttospeech

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AzureSpeechService:
    """Azure Speech Service for Hausa TTS and STT with Google Cloud fallback"""
    
    # Available Hausa voices in Azure
    HAUSA_VOICES = {
        'female': 'ha-NG-AbeoNaural',  # Female voice for Hausa (Nigeria)
        'male': 'ha-NG-SamuelNeural'   # Male voice for Hausa (Nigeria)
    }
    
    # Available Hausa voices in Google Cloud TTS
    GOOGLE_HAUSA_VOICES = {
        'female': 'ha-NG-Standard-A',  # Female voice for Hausa (Nigeria)
        'male': 'ha-NG-Standard-B'     # Male voice for Hausa (Nigeria) - if available
    }
    
    def __init__(self, 
                 subscription_key: Optional[str] = None,
                 region: Optional[str] = None,
                 enable_google_fallback: bool = True):
        """
        Initialize Azure Speech Service with optional Google Cloud fallback
        
        Args:
            subscription_key: Azure Speech API key
            region: Azure region (e.g., 'eastus', 'westeurope')
            enable_google_fallback: Enable Google Cloud TTS as fallback
        """
        self.subscription_key = subscription_key or os.getenv('AZURE_SPEECH_KEY')
        self.region = region or os.getenv('AZURE_SPEECH_REGION', 'eastus')
        self.enable_google_fallback = enable_google_fallback
        
        # Initialize Azure Speech
        if not self.subscription_key:
            logger.warning("Azure Speech API key not found. Using Google Cloud fallback if available.")
            self.speech_config = None
        else:
            self.speech_config = speechsdk.SpeechConfig(
                subscription=self.subscription_key,
                region=self.region
            )
            logger.info(f"Azure Speech Service initialized in region: {self.region}")
        
        # Initialize Google Cloud TTS client for fallback
        self.google_tts_client = None
        if self.enable_google_fallback:
            try:
                self.google_tts_client = texttospeech.TextToSpeechClient()
                logger.info("Google Cloud TTS fallback initialized")
            except Exception as e:
                logger.warning(f"Could not initialize Google Cloud TTS fallback: {e}")
                self.google_tts_client = None
    
    def text_to_speech(self,
                      text: str,
                      voice_name: str = 'female',
                      language_code: str = 'ha-NG',
                      output_format: str = 'mp3',
                      speaking_rate: float = 1.0,
                      pitch: str = 'default',
                      use_fallback: bool = True) -> Optional[bytes]:
        """
        Convert text to speech using Azure TTS with Google Cloud fallback
        
        Args:
            text: Text to synthesize
            voice_name: Voice identifier ('female' or 'male') or full voice name
            language_code: Language code (ha-NG for Hausa Nigeria)
            output_format: Output format ('mp3', 'wav')
            speaking_rate: Speech rate (0.5 to 2.0)
            pitch: Pitch adjustment ('x-low', 'low', 'default', 'high', 'x-high')
            use_fallback: Use Google Cloud fallback if Azure fails
        
        Returns:
            Audio bytes or None if error
        """
        # Try Azure first
        if self.speech_config:
            try:
                return self._azure_text_to_speech(
                    text, voice_name, language_code, 
                    output_format, speaking_rate, pitch
                )
            except Exception as e:
                logger.warning(f"Azure TTS failed: {e}")
                if not use_fallback or not self.enable_google_fallback:
                    return None
                logger.info("Attempting Google Cloud TTS fallback...")
        
        # Try Google Cloud fallback
        if use_fallback and self.google_tts_client:
            try:
                return self._google_text_to_speech(
                    text, voice_name, language_code, 
                    output_format, speaking_rate, pitch
                )
            except Exception as e:
                logger.error(f"Google Cloud TTS fallback failed: {e}")
                return None
        
        logger.error("No TTS service available")
        return None
    
    def _azure_text_to_speech(self,
                             text: str,
                             voice_name: str,
                             language_code: str,
                             output_format: str,
                             speaking_rate: float,
                             pitch: str) -> Optional[bytes]:
        """
        Azure-specific text-to-speech implementation
        """
        if not self.speech_config:
            raise Exception("Azure Speech Service not initialized")
        
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
            logger.info(f"Azure TTS: Speech synthesized: {len(result.audio_data)} bytes")
            return result.audio_data
        elif result.reason == speechsdk.ResultReason.Canceled:
            cancellation = result.cancellation_details
            logger.error(f"Azure TTS canceled: {cancellation.reason}")
            if cancellation.reason == speechsdk.CancellationReason.Error:
                logger.error(f"Error details: {cancellation.error_details}")
            raise Exception(f"Azure TTS failed: {cancellation.reason}")
        
        return None
    
    def _google_text_to_speech(self,
                              text: str,
                              voice_name: str,
                              language_code: str,
                              output_format: str,
                              speaking_rate: float,
                              pitch: str) -> Optional[bytes]:
        """
        Google Cloud-specific text-to-speech implementation
        """
        if not self.google_tts_client:
            raise Exception("Google Cloud TTS not initialized")
        
        # Get Google voice name
        if voice_name in self.GOOGLE_HAUSA_VOICES:
            google_voice_name = self.GOOGLE_HAUSA_VOICES[voice_name]
        else:
            # Default to first available voice
            google_voice_name = self.GOOGLE_HAUSA_VOICES.get('female', 'ha-NG-Standard-A')
        
        # Set the text input to be synthesized
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        # Build the voice request
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=google_voice_name
        )
        
        # Convert pitch to numeric value for Google
        pitch_values = {
            'x-low': -10.0,
            'low': -5.0,
            'default': 0.0,
            'high': 5.0,
            'x-high': 10.0
        }
        pitch_value = pitch_values.get(pitch, 0.0)
        
        # Select the type of audio file
        audio_encoding = (texttospeech.AudioEncoding.MP3 
                         if output_format == 'mp3' 
                         else texttospeech.AudioEncoding.LINEAR16)
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=audio_encoding,
            speaking_rate=speaking_rate,
            pitch=pitch_value
        )
        
        # Perform the text-to-speech request
        response = self.google_tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        logger.info(f"Google Cloud TTS: Speech synthesized: {len(response.audio_content)} bytes")
        return response.audio_content
    
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
        Get list of available Hausa voices from both Azure and Google Cloud
        
        Returns:
            List of voice information dictionaries
        """
        voices = []
        
        # Add Azure voices
        for key, voice_name in self.HAUSA_VOICES.items():
            voices.append({
                'id': key,
                'name': voice_name,
                'language': 'ha-NG',
                'gender': key,
                'neural': 'Neural' in voice_name,
                'provider': 'azure'
            })
        
        # Add Google Cloud voices if available
        if self.google_tts_client:
            for key, voice_name in self.GOOGLE_HAUSA_VOICES.items():
                voices.append({
                    'id': f'google_{key}',
                    'name': voice_name,
                    'language': 'ha-NG',
                    'gender': key,
                    'neural': False,
                    'provider': 'google'
                })
        
        return voices
    
    def test_connection(self) -> Dict[str, bool]:
        """
        Test both Azure Speech Service and Google Cloud TTS connections
        
        Returns:
            Dictionary with test results for each provider
        """
        results = {
            'azure': False,
            'google': False
        }
        
        # Test Azure
        try:
            if self.speech_config:
                test_text = "Sannu"
                result = self._azure_text_to_speech(
                    test_text, 'female', 'ha-NG', 'mp3', 1.0, 'default'
                )
                results['azure'] = result is not None
        except Exception as e:
            logger.error(f"Azure connection test failed: {e}")
        
        # Test Google Cloud
        try:
            if self.google_tts_client:
                test_text = "Sannu"
                result = self._google_text_to_speech(
                    test_text, 'female', 'ha-NG', 'mp3', 1.0, 'default'
                )
                results['google'] = result is not None
        except Exception as e:
            logger.error(f"Google Cloud connection test failed: {e}")
        
        return results


def main():
    """Example usage"""
    # Initialize service with Google fallback enabled
    service = AzureSpeechService(enable_google_fallback=True)
    
    # Test connections
    test_results = service.test_connection()
    print("\n" + "=" * 60)
    print("Speech Service Connection Test")
    print("=" * 60)
    
    if test_results['azure']:
        print("✓ Azure Speech Service connected successfully")
    else:
        print("✗ Azure Speech Service connection failed")
    
    if test_results['google']:
        print("✓ Google Cloud TTS connected successfully")
    else:
        print("✗ Google Cloud TTS connection failed")
    
    if not any(test_results.values()):
        print("\n✗ No speech services available")
        return
    
    # Get available voices
    voices = service.get_available_voices()
    print("\nAvailable Hausa voices:")
    for voice in voices:
        provider_icon = "🔵" if voice['provider'] == 'azure' else "🟢"
        print(f"  {provider_icon} {voice['name']} ({voice['gender']}, {voice['provider']}, neural: {voice['neural']})")
    
    # Test TTS with fallback
    test_text = "Sannu, ina kwana? Lafiya lau. Na gode."
    print(f"\nSynthesizing: {test_text}")
    
    audio_base64 = service.text_to_speech_base64(
        test_text,
        voice_name='female',
        speaking_rate=0.9,
        use_fallback=True
    )
    
    if audio_base64:
        print(f"✓ Audio generated: {len(audio_base64)} characters (base64)")
    else:
        print("✗ Audio generation failed")
    
    print("\n" + "=" * 60)


if __name__ == '__main__':
    main()
