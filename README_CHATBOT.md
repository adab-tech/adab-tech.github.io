# Hausa GPT Chatbot - Complete Implementation Guide

## 🌍 Overview

A comprehensive AI-powered chatbot system for fluent Hausa language conversation, integrating:
- **GPT Models & Gemini Pro** for natural language understanding (multi-provider support)
- **Google Cloud Speech-to-Text** for voice input
- **Google Cloud & Azure Text-to-Speech** with intelligent fallback for voice output
- **Microsoft Azure Speech Services** for native Hausa voice synthesis
- **Unified Configuration Management** for centralized API key handling
- **Secure Session-Based Authentication** replacing localStorage
- **Rate Limiting** to optimize Google Cloud's $300 free trial
- **Mozilla Common Voice Hausa Dataset** for enhanced training
- **Multiple Dataset Sources** (JW300, OPUS, HausaNLP)
- **Evaluation Metrics** for phoneme alignment and tonal accuracy
- **Interactive Web Interface** for seamless user experience
- **Autonomous Training System** for continuous self-improvement

## ✨ Features

### Core Capabilities
- ✅ **Multi-Provider AI**: Support for both OpenAI GPT and Google Gemini Pro
- ✅ **Hausa Language Processing**: Fine-tuned models for Hausa understanding and generation
- ✅ **Dual Speech-to-Text**: Google Cloud + Azure STT for improved accuracy
- ✅ **Intelligent TTS Fallback**: Azure primary with Google Cloud fallback
- ✅ **Rate Limiting**: Smart budget management for Google Cloud's $300 free trial
- ✅ **Secure Authentication**: Session-based API key management
- ✅ **Unified Configuration**: Centralized management of all API keys and settings
- ✅ **Native Voice Synthesis**: Azure neural voices (ha-NG-AbeoNaural, ha-NG-SamuelNeural)
- ✅ **Multiple Dataset Support**: Mozilla Common Voice, JW300, OPUS, HausaNLP
- ✅ **Quality Evaluation**: Phoneme alignment and tonal accuracy validation
- ✅ **Bilingual Support**: Handle both Hausa and English inputs
- ✅ **Real-time Chat**: Instant responses with conversation history
- ✅ **Voice Visualization**: Audio waveform animation during recording
- ✅ **Autonomous Training**: Continuous self-improvement through automatic fine-tuning

### Enhanced Voice Capabilities 🎙️ NEW
- **Native Hausa Accents**: Azure neural voices fine-tuned for authentic pronunciation
- **Dual TTS Providers**: Google Cloud and Azure for reliability and quality
- **Adjustable Speech Parameters**: Control speaking rate, pitch, and tone
- **Voice Selection**: Multiple Hausa voices (male/female)
- **Superior Intonation**: Proper tonal patterns for Hausa language

### Dataset Integration 📚 NEW
- **Mozilla Common Voice**: 10,000+ validated Hausa speech samples
- **JW300 Parallel Corpus**: 100,000+ Hausa-English sentence pairs
- **OPUS Multi-Domain**: Technical, conversational, and formal Hausa text
- **HausaNLP Resources**: Specialized linguistic datasets
- **Automated Loading**: One-click dataset download and integration
- **Format Conversion**: Unified preprocessing across all sources

### Evaluation & Quality Metrics 📊 NEW
- **Phoneme Alignment**: Validates pronunciation at phoneme level
- **Tonal Accuracy**: Measures tone mark correctness
- **Cultural Validation**: Assesses cultural appropriateness
- **Special Character Detection**: Validates Hausa characters (ɓ, ɗ, ƙ, ƴ)
- **WER/CER Metrics**: Word and character error rates
- **Comprehensive Reports**: Detailed evaluation with overall scores

### Autonomous Training System 🔥
The chatbot now includes a revolutionary autonomous training system that allows it to train itself continuously:
- **Automatic Data Collection**: Every conversation is logged for future training
- **Scheduled Training**: Automatically triggers fine-tuning when enough data is collected
- **Non-Stop Learning**: Runs in the background even when not actively chatting
- **Configurable Thresholds**: Set minimum conversations and training intervals
- **Real-time Monitoring**: Track training status, conversation count, and job progress
- **Manual Control**: Start/stop autonomous training or trigger immediate training

### Security & Configuration Management 🔒 NEW
- **Session-Based Authentication**: Secure token-based authentication replacing localStorage
- **Server-Side API Key Validation**: Keys are validated server-side and never stored in browser
- **Session Tokens**: Short-lived tokens for enhanced security
- **Unified Configuration**: Single configuration manager for all API keys and settings
- **Auto-Session Recovery**: Validates and restores sessions on page reload
- **Secure Logout**: Properly invalidates sessions on logout

### Rate Limiting & Cost Management 💰 NEW
- **Budget Tracking**: Monitors Google Cloud API usage against $300 free trial
- **Daily Limits**: Prevents exceeding 10% of monthly budget per day
- **Usage Analytics**: Detailed tracking of TTS and STT API calls
- **Cost Estimation**: Real-time cost calculations for each request
- **Automatic Alerts**: Warns when approaching budget limits
- **Monthly Reset**: Automatically resets usage data each month

### Technical Features
- Modern, responsive UI built with Tailwind CSS
- Flask-based REST API backend with session support
- Secure API key management with validation endpoints
- Multi-cloud integration (Google Cloud + Azure)
- Intelligent provider fallback system
- Cross-platform compatibility
- Easy deployment to cloud platforms

## 📁 Project Structure

```
adab-tech.github.io/
├── hausa_chatbot.html          # Frontend application with secure auth
├── hausa_chatbot_docs.html     # Complete documentation
├── backend/
│   ├── app.py                  # Flask API server with session support
│   ├── config_manager.py       # Unified configuration management (NEW)
│   ├── secure_api_key.py       # Secure API key validation (NEW)
│   ├── rate_limiter.py         # Rate limiting for Google Cloud (NEW)
│   ├── gemini_service.py       # Gemini Pro integration (NEW)
│   ├── data_preprocessing.py   # Data preparation utilities
│   ├── dataset_loader.py       # Multi-dataset loader
│   ├── azure_speech.py         # Azure + Google TTS with fallback
│   ├── evaluation_metrics.py   # Evaluation framework
│   ├── fine_tune.py            # OpenAI + Gemini fine-tuning
│   ├── autonomous_trainer.py   # Autonomous training system
│   ├── test_config_manager.py  # Configuration tests (NEW)
│   ├── test_evaluation_metrics.py # Evaluation tests
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variables template
│   └── Procfile                # Heroku deployment
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
└── README_CHATBOT.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- OpenAI API account ([Get API key](https://platform.openai.com))
- Google Cloud Platform account ([Setup Guide](https://console.cloud.google.com))
- Modern web browser with microphone support

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 5. Run the server
python app.py
```

### Frontend Setup

Simply open `hausa_chatbot.html` in your browser, or deploy to GitHub Pages:

```bash
git add hausa_chatbot.html hausa_chatbot_docs.html
git commit -m "Add Hausa chatbot"
git push origin main
```

Access at: `https://adab-tech.github.io/hausa_chatbot.html`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
GOOGLE_CLOUD_PROJECT=your_project_id

# Azure Speech Services Configuration (NEW)
AZURE_SPEECH_KEY=your_azure_speech_api_key
AZURE_SPEECH_REGION=eastus  # or your preferred region

# Flask Configuration
FLASK_ENV=development
PORT=5000

# Dataset Configuration (NEW)
DATASET_CACHE_DIR=./data_cache
USE_MOZILLA_COMMON_VOICE=true
USE_JW300_CORPUS=true
USE_OPUS_CORPUS=true

# Evaluation Settings (NEW)
ENABLE_PHONEME_VALIDATION=true
ENABLE_TONAL_VALIDATION=true
ENABLE_CULTURAL_VALIDATION=true
```

### Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the following APIs:
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
4. Create service account credentials
5. Download JSON key file
6. Set path in `GOOGLE_APPLICATION_CREDENTIALS`

### Azure Speech Services Setup (NEW)

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Speech resource
3. Navigate to "Keys and Endpoint"
4. Copy one of the keys and the region
5. Add to `.env` file as `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`

Benefits of Azure integration:
- Native Hausa neural voices (ha-NG-AbeoNaural, ha-NG-SamuelNeural)
- Superior accent and intonation accuracy
- SSML support for fine-grained control
- Automatic failover with Google Cloud

### OpenAI API Setup

1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `.env` file

## 📚 Dataset Integration (NEW)

### Automatic Dataset Loading

The system can automatically download and integrate multiple Hausa datasets:

```python
from dataset_loader import DatasetLoader

loader = DatasetLoader(cache_dir='./data_cache')

# Load Mozilla Common Voice Hausa
mozilla_data = loader.load_mozilla_common_voice(split='train')

# Load JW300 parallel corpus
jw300_data = loader.load_jw300_corpus()

# Load OPUS dataset
opus_data = loader.load_opus_corpus()

# Get statistics
stats = loader.get_statistics()
print(f"Total samples: {stats['total_samples']}")

# Export for training
loader.export_for_training('combined_training.jsonl', format='openai')
```

### Supported Datasets

1. **Mozilla Common Voice Hausa**
   - 10,000+ validated speech samples
   - Audio recordings with transcriptions
   - Metadata: age, gender, accent
   - Automatically downloaded from Hugging Face

2. **JW300 Parallel Corpus**
   - 100,000+ Hausa-English sentence pairs
   - High-quality translations
   - Religious and moral content
   - Good for context understanding

3. **OPUS Multi-Domain**
   - Technical documentation
   - Conversational text
   - Formal language samples
   - Multiple domains and styles

4. **HausaNLP Corpus**
   - Specialized linguistic resources
   - Requires local file (CSV/JSON/TXT)
   - Custom Hausa NLP datasets

### Using Datasets in Training

```python
from data_preprocessing import HausaDataPreprocessor

preprocessor = HausaDataPreprocessor()

# Load multiple datasets at once
data = preprocessor.load_multiple_datasets(
    use_mozilla=True,
    use_jw300=True,
    use_opus=True
)

# Validate data quality
if preprocessor.validate_data(data):
    # Save for fine-tuning
    preprocessor.save_for_finetuning(data, 'hausa_training.jsonl')
```

## 📊 Evaluation & Quality Metrics (NEW)

### Using the Evaluation Framework

```python
from evaluation_metrics import HausaEvaluator

evaluator = HausaEvaluator()

# Comprehensive evaluation
reference = "Sannu, ina kwana? Na ji daɗi."
hypothesis = "Sannu, ina kwana? Na ji dadi."

report = evaluator.generate_evaluation_report(
    reference=reference,
    hypothesis=hypothesis,
    include_cultural=True
)

print(f"Overall Score: {report['overall_score']}")
print(f"Phoneme Accuracy: {report['phoneme_alignment']['phoneme_accuracy']}")
print(f"Tonal Accuracy: {report['tonal_accuracy']['tonal_accuracy']}")
```

### Available Evaluation Metrics

1. **Phoneme Alignment**
   - Word Error Rate (WER)
   - Character Error Rate (CER)
   - Phoneme-level accuracy
   - Special character correctness

2. **Tonal Accuracy**
   - Tone mark detection
   - Tone placement accuracy
   - Missing/extra tone identification

3. **Cultural Validation**
   - Greeting detection
   - Polite expression usage
   - Common phrase identification
   - Cultural appropriateness score

4. **Text Validation**
   - Hausa character validation (ɓ, ɗ, ƙ, ƴ)
   - Phoneme coverage analysis
   - Common error detection

## 🤖 Autonomous Training System

### How It Works

The autonomous training system enables the chatbot to continuously improve itself:

1. **Conversation Logging**: Every chat interaction is automatically logged
2. **Data Accumulation**: Conversations are stored in JSONL format
3. **Threshold Monitoring**: System checks if minimum conversation count is reached
4. **Automatic Training**: When threshold is met, a fine-tuning job is triggered
5. **Scheduled Checks**: Runs periodically (default: every 24 hours)
6. **Background Operation**: Runs independently of active chat sessions

### Configuration

Add these settings to your `.env` file:

```env
# Enable/disable autonomous training
AUTO_TRAIN_ENABLED=true

# Minimum conversations before triggering training (default: 50)
AUTO_TRAIN_MIN_CONVERSATIONS=50

# Hours between training checks (default: 24)
AUTO_TRAIN_INTERVAL_HOURS=24
```

### API Endpoints

Control autonomous training via REST API:

```bash
# Get training status
curl http://localhost:5000/api/autonomous-training/status

# Start autonomous training
curl -X POST http://localhost:5000/api/autonomous-training/start

# Stop autonomous training
curl -X POST http://localhost:5000/api/autonomous-training/stop

# Manually trigger training now
curl -X POST http://localhost:5000/api/autonomous-training/trigger
```

### Using the UI

The chatbot interface includes controls for autonomous training:

1. **Auto-Train Button**: Click to start/stop autonomous training
2. **Status Button**: View current training status and conversation count
3. **Real-time Updates**: Monitor logged conversations and training progress

### Data Storage

Conversations are stored in `backend/training_data/` directory:
- `conversations_YYYYMM.jsonl`: Monthly conversation logs
- `training_state.json`: System state and metadata
- `training_YYYYMMDD_HHMMSS.jsonl`: Generated training files

### Monitoring

Check the status of training jobs:

```python
import requests
response = requests.get('http://localhost:5000/api/autonomous-training/status')
status = response.json()

print(f"Running: {status['is_running']}")
print(f"Conversations: {status['conversation_count']}/{status['min_conversations']}")
print(f"Last training: {status['last_training_time']}")
```

## 📊 Data Preparation & Fine-Tuning

### 1. Collect Hausa Data

**Recommended Sources:**
- HausaNLP datasets
- JW300 parallel corpus
- OPUS collections
- Hausa news websites
- Hausa literature

### 2. Prepare Training Data

```python
from data_preprocessing import HausaDataPreprocessor

preprocessor = HausaDataPreprocessor()

# Load from CSV
data = preprocessor.load_from_csv('hausa_conversations.csv')

# Validate
if preprocessor.validate_data(data):
    # Save for fine-tuning
    preprocessor.save_for_finetuning(data, 'hausa_training.jsonl')
```

**Data Format:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful Hausa assistant."},
    {"role": "user", "content": "Sannu, ina kwana?"},
    {"role": "assistant", "content": "Lafiya lau. Na gode."}
  ]
}
```

### 3. Fine-Tune GPT Model

```python
import openai

# Upload training file
with open("hausa_training.jsonl", "rb") as f:
    file_response = openai.File.create(file=f, purpose='fine-tune')

# Create fine-tuning job
job = openai.FineTuningJob.create(
    training_file=file_response.id,
    model="gpt-3.5-turbo"
)

print(f"Fine-tuning job ID: {job.id}")
```

### 4. Monitor Fine-Tuning

```python
# Check status
status = openai.FineTuningJob.retrieve(job.id)
print(f"Status: {status.status}")

# List all jobs
jobs = openai.FineTuningJob.list()
```

## 🧪 Testing

### Backend API Tests

```bash
# Health check
curl http://localhost:5000/api/health

# Chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Sannu, yaya kake?", "history": []}'

# Google Cloud Speech-to-Text
curl -X POST http://localhost:5000/api/speech-to-text \
  -H "Content-Type: application/json" \
  -d '{"audio": "base64_audio_data", "language_code": "ha-NG"}'

# Google Cloud Text-to-Speech
curl -X POST http://localhost:5000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Sannu, ina kwana?", "language_code": "ha-NG"}'

# Azure Text-to-Speech (NEW)
curl -X POST http://localhost:5000/api/azure/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Sannu, ina kwana?", "voice_name": "female", "speaking_rate": 0.9}'

# Azure Speech-to-Text (NEW)
curl -X POST http://localhost:5000/api/azure/speech-to-text \
  -H "Content-Type: application/json" \
  -d '{"audio": "base64_audio_data", "language_code": "ha-NG"}'

# Get available Azure voices (NEW)
curl http://localhost:5000/api/azure/voices

# Evaluate text (NEW)
curl -X POST http://localhost:5000/api/evaluate/text \
  -H "Content-Type: application/json" \
  -d '{"reference": "Sannu, ina kwana?", "hypothesis": "Sannu, ina kwana?"}'

# Phoneme alignment (NEW)
curl -X POST http://localhost:5000/api/evaluate/phoneme-alignment \
  -H "Content-Type: application/json" \
  -d '{"reference": "Sannu, ina kwana?", "hypothesis": "Sannu, ina kwana?"}'

# Tonal accuracy (NEW)
curl -X POST http://localhost:5000/api/evaluate/tonal-accuracy \
  -H "Content-Type: application/json" \
  -d '{"reference": "Sannu, ina kwana?", "hypothesis": "Sannu, ina kwana?"}'

# Validate Hausa text (NEW)
curl -X POST http://localhost:5000/api/validate/hausa-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Sannu, ina kwana?"}'

# Cultural context evaluation (NEW)
curl -X POST http://localhost:5000/api/evaluate/cultural-context \
  -H "Content-Type: application/json" \
  -d '{"text": "Sannu, ina kwana? Na gode."}'
```

### Testing Checklist

- [ ] Text chat functionality
- [ ] Voice recording
- [ ] Google Cloud speech-to-text accuracy
- [ ] Azure speech-to-text accuracy
- [ ] Google Cloud text-to-speech quality
- [ ] Azure text-to-speech quality (native voices)
- [ ] Hausa language correctness
- [ ] Phoneme alignment validation
- [ ] Tonal accuracy validation
- [ ] Cultural context validation
- [ ] Response latency
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Dataset loading and integration

## 📚 API Documentation (Enhanced)

### Core Endpoints

#### Chat
```
POST /api/chat
Content-Type: application/json

Request:
{
  "message": "User message",
  "history": [{"role": "user", "content": "..."}],
  "model": "gpt-3.5-turbo"
}

Response:
{
  "response": "AI response",
  "model": "gpt-3.5-turbo",
  "usage": {...}
}
```

### Azure Speech Endpoints (NEW)

#### Azure Text-to-Speech
```
POST /api/azure/text-to-speech
Content-Type: application/json

Request:
{
  "text": "Text to synthesize",
  "voice_name": "female" | "male",
  "language_code": "ha-NG",
  "speaking_rate": 0.9,
  "pitch": "default" | "low" | "high"
}

Response:
{
  "audio": "base64_encoded_audio",
  "format": "mp3",
  "voice": "female",
  "service": "azure"
}
```

#### Azure Speech-to-Text
```
POST /api/azure/speech-to-text
Content-Type: application/json

Request:
{
  "audio": "base64_encoded_audio",
  "language_code": "ha-NG"
}

Response:
{
  "text": "Transcribed text",
  "confidence": 1.0,
  "language": "ha-NG",
  "service": "azure"
}
```

#### Get Available Voices
```
GET /api/azure/voices

Response:
{
  "voices": [
    {
      "id": "female",
      "name": "ha-NG-AbeoNaural",
      "language": "ha-NG",
      "gender": "female",
      "neural": true
    },
    {
      "id": "male",
      "name": "ha-NG-SamuelNeural",
      "language": "ha-NG",
      "gender": "male",
      "neural": true
    }
  ],
  "count": 2
}
```

### Evaluation Endpoints (NEW)

#### Comprehensive Text Evaluation
```
POST /api/evaluate/text
Content-Type: application/json

Request:
{
  "reference": "Reference text",
  "hypothesis": "Text to evaluate",
  "include_cultural": true
}

Response:
{
  "phoneme_alignment": {
    "word_error_rate": 0.0,
    "character_error_rate": 0.0,
    "phoneme_accuracy": 100.0,
    "special_char_accuracy": 100.0,
    "alignment_score": 100.0
  },
  "tonal_accuracy": {
    "tonal_accuracy": 100.0,
    "tone_matches": 5,
    "tone_mismatches": 0
  },
  "cultural_context": {
    "cultural_greetings": ["sannu"],
    "polite_expressions": [],
    "cultural_score": 20.0
  },
  "overall_score": 95.5
}
```

#### Phoneme Alignment
```
POST /api/evaluate/phoneme-alignment
Content-Type: application/json

Request:
{
  "reference": "Reference text",
  "hypothesis": "Text to evaluate"
}

Response:
{
  "word_error_rate": 0.0,
  "character_error_rate": 0.0,
  "phoneme_accuracy": 100.0,
  "special_char_accuracy": 100.0,
  "alignment_score": 100.0
}
```

#### Tonal Accuracy
```
POST /api/evaluate/tonal-accuracy
Content-Type: application/json

Request:
{
  "reference": "Reference text with tone marks",
  "hypothesis": "Text to evaluate"
}

Response:
{
  "tonal_accuracy": 100.0,
  "tone_matches": 5,
  "tone_mismatches": 0,
  "missing_tones": 0,
  "extra_tones": 0
}
```

#### Validate Hausa Text
```
POST /api/validate/hausa-text
Content-Type: application/json

Request:
{
  "text": "Hausa text to validate"
}

Response:
{
  "is_valid": true,
  "errors": [],
  "warnings": [],
  "special_chars_used": ["ɓ", "ƙ"],
  "phoneme_coverage": {"s": 2, "n": 2, ...}
}
```

#### Cultural Context Evaluation
```
POST /api/evaluate/cultural-context
Content-Type: application/json

Request:
{
  "text": "Hausa text to evaluate"
}

Response:
{
  "cultural_greetings": ["sannu", "ina kwana"],
  "polite_expressions": ["na gode"],
  "common_phrases": ["lafiya lau"],
  "cultural_score": 30.0
}
```

## 🌐 Deployment

### Option 1: AWS Elastic Beanstalk

```bash
# Initialize
eb init -p python-3.8 hausa-chatbot

# Create environment
eb create hausa-chatbot-env

# Deploy
eb deploy
```

### Option 2: Google Cloud Platform

```bash
# Deploy to App Engine
gcloud app deploy

# Or Cloud Run
gcloud run deploy hausa-chatbot --source .
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

```bash
docker build -t hausa-chatbot .
docker run -p 5000:5000 --env-file .env hausa-chatbot
```

### Option 4: Heroku

```bash
# Create Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create hausa-chatbot
git push heroku main
```

## 📈 Performance Optimization

### Backend Optimization
- Implement caching for frequent queries
- Use connection pooling for database
- Enable gzip compression
- Rate limiting for API calls

### Frontend Optimization
- Lazy load components
- Optimize audio file sizes
- Implement progressive loading
- Use service workers for offline support

## 🔒 Security Best Practices

1. **API Key Management**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **CORS Configuration**
   - Restrict allowed origins in production
   - Validate all input data
   - Implement rate limiting

3. **HTTPS**
   - Always use HTTPS in production
   - Required for microphone access

4. **Input Validation**
   - Sanitize user inputs
   - Limit message length
   - Validate audio formats

## 📚 API Documentation

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

Request:
{
  "message": "User message",
  "history": [{"role": "user", "content": "..."}],
  "model": "gpt-3.5-turbo"
}

Response:
{
  "response": "AI response",
  "model": "gpt-3.5-turbo",
  "usage": {...}
}
```

### Speech-to-Text Endpoint
```
POST /api/speech-to-text
Content-Type: application/json

Request:
{
  "audio": "base64_encoded_audio",
  "encoding": "LINEAR16",
  "sample_rate": 16000,
  "language_code": "ha-NG"
}

Response:
{
  "transcriptions": [...],
  "best_transcript": "Transcribed text"
}
```

### Text-to-Speech Endpoint
```
POST /api/text-to-speech
Content-Type: application/json

Request:
{
  "text": "Text to synthesize",
  "language_code": "ha-NG",
  "voice_name": "ha-NG-Standard-A"
}

Response:
{
  "audio": "base64_encoded_audio",
  "format": "mp3"
}
```

## 🐛 Troubleshooting

### Common Issues

**1. API Authentication Errors**
- Verify API keys are correct
- Check billing status
- Ensure APIs are enabled

**2. CORS Errors**
- Install flask-cors: `pip install flask-cors`
- Configure allowed origins properly

**3. Microphone Not Working**
- Grant browser permissions
- Use HTTPS (required for production)
- Check browser compatibility

**4. Google Cloud Errors**
- Verify credentials file path
- Check API enablement
- Review quota limits

## 📖 Additional Resources

- [OpenAI Fine-Tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
- [Hausa Language Resources](https://hausanlp.github.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For questions or issues:
- Open an issue on GitHub
- Email: contact@adamu.tech
- Documentation: [View Docs](https://adab-tech.github.io/hausa_chatbot_docs.html)

## 🎯 Roadmap

- [ ] Support for more Hausa dialects
- [ ] Mobile application (iOS/Android)
- [ ] Offline mode support
- [ ] Multi-turn conversation improvements
- [ ] Custom vocabulary training
- [ ] Voice cloning for personalization
- [ ] Integration with messaging platforms

---

**Built with ❤️ for the Hausa language community**
