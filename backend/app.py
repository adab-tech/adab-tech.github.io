"""
Hausa GPT Chatbot Backend API
This Flask application provides the backend for the Hausa AI chatbot,
integrating GPT models, Google Cloud Speech APIs, Azure Speech Services, and Gemini Pro.
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from openai import OpenAI
import os
from google.cloud import speech_v1 as speech
from google.cloud import texttospeech
import io
import base64
from dotenv import load_dotenv
from autonomous_trainer import get_trainer
from azure_speech import AzureSpeechService
from evaluation_metrics import HausaEvaluator
from config_manager import get_config

# Import Gemini service if available
try:
    from gemini_service import GeminiProService
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Get unified configuration
config = get_config()

# Configuration
GOOGLE_APPLICATION_CREDENTIALS = config.google_cloud_credentials

# Initialize clients
openai_client = None
if config.is_service_available('openai'):
    openai_client = OpenAI(api_key=config.openai_api_key)

speech_client = None
tts_client = None
if config.is_service_available('google_cloud'):
    try:
        speech_client = speech.SpeechClient()
        tts_client = texttospeech.TextToSpeechClient()
    except Exception as e:
        print(f"Warning: Could not initialize Google Cloud clients: {e}")

# Initialize Gemini Pro if available
gemini_client = None
if config.is_service_available('gemini') and GEMINI_AVAILABLE:
    try:
        gemini_client = GeminiProService()
    except Exception as e:
        print(f"Warning: Could not initialize Gemini Pro: {e}")

# Initialize Azure Speech Service
azure_speech = AzureSpeechService(enable_google_fallback=True)

# Initialize evaluator
evaluator = HausaEvaluator()

# Initialize autonomous trainer
trainer = get_trainer()

# System prompt for Hausa language model
HAUSA_SYSTEM_PROMPT = """You are a helpful AI assistant that is fluent in Hausa language.
You should:
1. Respond primarily in Hausa language
2. Be culturally aware of Hausa traditions and customs
3. Provide helpful and accurate information
4. Be respectful and polite
5. If the user speaks in English, you can respond in both English and Hausa

Key Hausa phrases to use:
- Sannu (Hello)
- Na gode (Thank you)
- Don Allah (Please)
- Ina bukatar taimako (I need help)
- Lafiya lau (I am well)
"""


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint with service availability info"""
    return jsonify({
        'status': 'healthy',
        'service': 'Hausa Chatbot API',
        'version': '2.0.0',
        'available_services': config.get_available_services(),
        'tts_config': config.get_tts_config()
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chat endpoint that processes user messages and returns GPT/Gemini responses
    
    Request body:
    {
        "message": "User message text",
        "history": [{"role": "user/assistant", "content": "..."}],
        "model": "gpt-3.5-turbo" or "gemini-pro" (optional),
        "provider": "openai" or "gemini" (optional)
    }
    """
    try:
        data = request.json
        user_message = data.get('message')
        chat_history = data.get('history', [])
        model = data.get('model', 'gpt-3.5-turbo')
        provider = data.get('provider', 'openai').lower()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Determine which provider to use
        if provider == 'gemini' or model.startswith('gemini'):
            if not gemini_client:
                return jsonify({'error': 'Gemini Pro service not available'}), 503
            
            # Use Gemini Pro
            assistant_message = gemini_client.generate_chat_response(
                user_message,
                chat_history=chat_history,
                system_prompt=HAUSA_SYSTEM_PROMPT
            )
            
            # Log conversation for autonomous training
            try:
                trainer.log_conversation(
                    user_message=user_message,
                    assistant_response=assistant_message,
                    metadata={'model': model, 'provider': 'gemini'}
                )
            except Exception as log_error:
                print(f"Error logging conversation: {log_error}")
            
            return jsonify({
                'response': assistant_message,
                'model': model,
                'provider': 'gemini',
                'usage': {
                    'note': 'Gemini Pro does not provide token usage details'
                }
            })
        
        else:
            # Use OpenAI
            if not openai_client:
                return jsonify({'error': 'OpenAI service not available'}), 503
            
            # Build messages for GPT API
            messages = [
                {'role': 'system', 'content': HAUSA_SYSTEM_PROMPT}
            ]
            
            # Add chat history (limit to last 10 messages for context window)
            messages.extend(chat_history[-10:])
            
            # Add current user message
            messages.append({'role': 'user', 'content': user_message})
            
            # Call OpenAI API
            response = openai_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            assistant_message = response.choices[0].message.content
            
            # Log conversation for autonomous training
            try:
                metadata = {
                    'model': model,
                    'provider': 'openai',
                    'tokens': response.usage.total_tokens if response.usage else 0
                }
                trainer.log_conversation(
                    user_message=user_message,
                    assistant_response=assistant_message,
                    metadata=metadata
                )
            except Exception as log_error:
                print(f"Error logging conversation: {log_error}")
            
            return jsonify({
                'response': assistant_message,
                'model': model,
                'provider': 'openai',
                'usage': {
                    'prompt_tokens': response.usage.prompt_tokens if response.usage else 0,
                    'completion_tokens': response.usage.completion_tokens if response.usage else 0,
                    'total_tokens': response.usage.total_tokens if response.usage else 0
                }
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/speech-to-text', methods=['POST'])
def speech_to_text():
    """
    Speech-to-Text endpoint using Google Cloud Speech API
    
    Request body:
    {
        "audio": "base64 encoded audio data",
        "encoding": "LINEAR16/FLAC/etc",
        "sample_rate": 16000,
        "language_code": "ha-NG"
    }
    """
    try:
        data = request.json
        audio_content = base64.b64decode(data.get('audio'))
        encoding = data.get('encoding', 'LINEAR16')
        sample_rate = data.get('sample_rate', 16000)
        language_code = data.get('language_code', 'ha-NG')
        
        # Configure audio settings
        audio = speech.RecognitionAudio(content=audio_content)
        
        config = speech.RecognitionConfig(
            encoding=getattr(speech.RecognitionConfig.AudioEncoding, encoding),
            sample_rate_hertz=sample_rate,
            language_code=language_code,
            alternative_language_codes=['en-US'],  # Fallback to English
            enable_automatic_punctuation=True
        )
        
        # Perform speech recognition
        response = speech_client.recognize(config=config, audio=audio)
        
        # Extract transcription
        transcriptions = []
        for result in response.results:
            transcriptions.append({
                'transcript': result.alternatives[0].transcript,
                'confidence': result.alternatives[0].confidence
            })
        
        if not transcriptions:
            return jsonify({'error': 'No speech detected'}), 400
        
        return jsonify({
            'transcriptions': transcriptions,
            'best_transcript': transcriptions[0]['transcript'] if transcriptions else ''
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    """
    Text-to-Speech endpoint using Google Cloud TTS API
    
    Request body:
    {
        "text": "Text to convert to speech",
        "language_code": "ha-NG",
        "voice_name": "ha-NG-Standard-A"
    }
    """
    try:
        data = request.json
        text = data.get('text')
        language_code = data.get('language_code', 'ha-NG')
        voice_name = data.get('voice_name', 'ha-NG-Standard-A')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Set the text input to be synthesized
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        # Build the voice request
        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=voice_name
        )
        
        # Select the type of audio file
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=0.9,
            pitch=0.0
        )
        
        # Perform the text-to-speech request
        response = tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        # Return audio as base64 encoded string
        audio_base64 = base64.b64encode(response.audio_content).decode('utf-8')
        
        return jsonify({
            'audio': audio_base64,
            'format': 'mp3'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/fine-tune/status', methods=['GET'])
def fine_tune_status():
    """
    Get status of autonomous training system and current fine-tuning job
    """
    try:
        return jsonify(trainer.get_status())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/autonomous-training/start', methods=['POST'])
def start_autonomous_training():
    """
    Start the autonomous training system
    """
    try:
        trainer.start()
        return jsonify({
            'status': 'started',
            'message': 'Autonomous training system started',
            'config': trainer.get_status()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/autonomous-training/stop', methods=['POST'])
def stop_autonomous_training():
    """
    Stop the autonomous training system
    """
    try:
        trainer.stop()
        return jsonify({
            'status': 'stopped',
            'message': 'Autonomous training system stopped'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/autonomous-training/status', methods=['GET'])
def autonomous_training_status():
    """
    Get current status of autonomous training system
    """
    try:
        return jsonify(trainer.get_status())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/autonomous-training/trigger', methods=['POST'])
def trigger_training_now():
    """
    Manually trigger a training job with current data
    """
    try:
        success = trainer.trigger_training()
        if success:
            return jsonify({
                'status': 'triggered',
                'message': 'Training job initiated',
                'job_status': trainer.get_job_status()
            })
        else:
            return jsonify({
                'status': 'skipped',
                'message': 'Not enough data or training failed',
                'current_status': trainer.get_status()
            }), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/azure/text-to-speech', methods=['POST'])
def azure_text_to_speech():
    """
    Azure Text-to-Speech endpoint with native Hausa voices
    
    Request body:
    {
        "text": "Text to convert to speech",
        "voice_name": "female" or "male",
        "language_code": "ha-NG",
        "speaking_rate": 0.9,
        "pitch": "default"
    }
    """
    try:
        data = request.json
        text = data.get('text')
        voice_name = data.get('voice_name', 'female')
        language_code = data.get('language_code', 'ha-NG')
        speaking_rate = data.get('speaking_rate', 0.9)
        pitch = data.get('pitch', 'default')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Synthesize speech using Azure
        audio_base64 = azure_speech.text_to_speech_base64(
            text=text,
            voice_name=voice_name,
            language_code=language_code,
            speaking_rate=speaking_rate,
            pitch=pitch
        )
        
        if not audio_base64:
            return jsonify({'error': 'Failed to generate speech'}), 500
        
        return jsonify({
            'audio': audio_base64,
            'format': 'mp3',
            'voice': voice_name,
            'service': 'azure'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/azure/speech-to-text', methods=['POST'])
def azure_speech_to_text():
    """
    Azure Speech-to-Text endpoint for Hausa
    
    Request body:
    {
        "audio": "base64 encoded audio data",
        "language_code": "ha-NG"
    }
    """
    try:
        data = request.json
        audio_content = base64.b64decode(data.get('audio'))
        language_code = data.get('language_code', 'ha-NG')
        
        # Recognize speech using Azure
        result = azure_speech.speech_to_text(audio_content, language_code)
        
        if not result:
            return jsonify({'error': 'Failed to recognize speech'}), 400
        
        return jsonify({
            'text': result['text'],
            'confidence': result['confidence'],
            'language': result['language'],
            'service': 'azure'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/azure/voices', methods=['GET'])
def get_azure_voices():
    """
    Get list of available Azure Hausa voices
    """
    try:
        voices = azure_speech.get_available_voices()
        return jsonify({
            'voices': voices,
            'count': len(voices)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluate/text', methods=['POST'])
def evaluate_text():
    """
    Evaluate Hausa text for phoneme alignment and cultural accuracy
    
    Request body:
    {
        "reference": "Reference text",
        "hypothesis": "Text to evaluate",
        "include_cultural": true
    }
    """
    try:
        data = request.json
        reference = data.get('reference')
        hypothesis = data.get('hypothesis')
        include_cultural = data.get('include_cultural', True)
        
        if not reference or not hypothesis:
            return jsonify({'error': 'Both reference and hypothesis are required'}), 400
        
        # Generate evaluation report
        report = evaluator.generate_evaluation_report(
            reference=reference,
            hypothesis=hypothesis,
            include_cultural=include_cultural
        )
        
        return jsonify(report)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluate/phoneme-alignment', methods=['POST'])
def evaluate_phoneme_alignment():
    """
    Evaluate phoneme alignment between reference and hypothesis
    
    Request body:
    {
        "reference": "Reference text",
        "hypothesis": "Text to evaluate"
    }
    """
    try:
        data = request.json
        reference = data.get('reference')
        hypothesis = data.get('hypothesis')
        
        if not reference or not hypothesis:
            return jsonify({'error': 'Both reference and hypothesis are required'}), 400
        
        # Calculate phoneme alignment
        metrics = evaluator.calculate_phoneme_alignment(reference, hypothesis)
        
        return jsonify(metrics)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluate/tonal-accuracy', methods=['POST'])
def evaluate_tonal_accuracy():
    """
    Evaluate tonal accuracy for Hausa text
    
    Request body:
    {
        "reference": "Reference text with tone marks",
        "hypothesis": "Text to evaluate"
    }
    """
    try:
        data = request.json
        reference = data.get('reference')
        hypothesis = data.get('hypothesis')
        
        if not reference or not hypothesis:
            return jsonify({'error': 'Both reference and hypothesis are required'}), 400
        
        # Calculate tonal accuracy
        metrics = evaluator.calculate_tonal_accuracy(reference, hypothesis)
        
        return jsonify(metrics)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/validate/hausa-text', methods=['POST'])
def validate_hausa_text():
    """
    Validate Hausa text for proper character usage
    
    Request body:
    {
        "text": "Hausa text to validate"
    }
    """
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Validate text
        validation = evaluator.validate_hausa_text(text)
        
        return jsonify(validation)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/evaluate/cultural-context', methods=['POST'])
def evaluate_cultural_context():
    """
    Evaluate cultural and contextual appropriateness of Hausa text
    
    Request body:
    {
        "text": "Hausa text to evaluate"
    }
    """
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Evaluate cultural context
        evaluation = evaluator.evaluate_cultural_context(text)
        
        return jsonify(evaluation)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/rate-limit/status', methods=['GET'])
def rate_limit_status():
    """
    Get current rate limit status for Google Cloud API usage
    """
    try:
        status = azure_speech.get_rate_limit_status()
        
        if status:
            return jsonify(status)
        else:
            return jsonify({
                'enabled': False,
                'message': 'Rate limiting is not enabled'
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Start autonomous training on app startup if enabled
    if os.getenv('AUTO_TRAIN_ENABLED', 'true').lower() == 'true':
        trainer.start()
    
    # Debug mode should only be enabled in development
    # In production, use a proper WSGI server like gunicorn
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
