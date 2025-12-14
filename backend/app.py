"""
Hausa GPT Chatbot Backend API
This Flask application provides the backend for the Hausa AI chatbot,
integrating GPT models and Google Cloud Speech APIs.
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

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Initialize clients
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
speech_client = speech.SpeechClient()
tts_client = texttospeech.TextToSpeechClient()

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
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Hausa Chatbot API',
        'version': '1.0.0'
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chat endpoint that processes user messages and returns GPT responses
    
    Request body:
    {
        "message": "User message text",
        "history": [{"role": "user/assistant", "content": "..."}],
        "model": "gpt-3.5-turbo" (optional)
    }
    """
    try:
        data = request.json
        user_message = data.get('message')
        chat_history = data.get('history', [])
        model = data.get('model', 'gpt-3.5-turbo')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
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


if __name__ == '__main__':
    # Start autonomous training on app startup if enabled
    if os.getenv('AUTO_TRAIN_ENABLED', 'true').lower() == 'true':
        trainer.start()
    
    # Debug mode should only be enabled in development
    # In production, use a proper WSGI server like gunicorn
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
