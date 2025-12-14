# Hausa GPT Chatbot - Complete Implementation Guide

## 🌍 Overview

A comprehensive AI-powered chatbot system for fluent Hausa language conversation, integrating:
- **GPT Models** for natural language understanding
- **Google Cloud Speech-to-Text** for voice input
- **Google Cloud Text-to-Speech** for voice output
- **Interactive Web Interface** for seamless user experience

## ✨ Features

### Core Capabilities
- ✅ **Hausa Language Processing**: Fine-tuned GPT model for Hausa understanding and generation
- ✅ **Speech-to-Text**: Convert Hausa voice input to text using Google Cloud API
- ✅ **Text-to-Speech**: Generate natural Hausa audio responses
- ✅ **Bilingual Support**: Handle both Hausa and English inputs
- ✅ **Real-time Chat**: Instant responses with conversation history
- ✅ **Voice Visualization**: Audio waveform animation during recording

### Technical Features
- Modern, responsive UI built with Tailwind CSS
- Flask-based REST API backend
- Secure API key management
- Cross-platform compatibility
- Easy deployment to cloud platforms

## 📁 Project Structure

```
adab-tech.github.io/
├── hausa_chatbot.html          # Frontend application
├── hausa_chatbot_docs.html     # Complete documentation
├── backend/
│   ├── app.py                  # Flask API server
│   ├── data_preprocessing.py   # Data preparation utilities
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
OPENAI_API_KEY=your_openai_api_key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
GOOGLE_CLOUD_PROJECT=your_project_id
FLASK_ENV=development
PORT=5000
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

### OpenAI API Setup

1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `.env` file

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

# Speech-to-Text (with base64 audio)
curl -X POST http://localhost:5000/api/speech-to-text \
  -H "Content-Type: application/json" \
  -d '{"audio": "base64_audio_data", "language_code": "ha-NG"}'

# Text-to-Speech
curl -X POST http://localhost:5000/api/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Sannu, ina kwana?", "language_code": "ha-NG"}'
```

### Testing Checklist

- [ ] Text chat functionality
- [ ] Voice recording
- [ ] Speech-to-text accuracy
- [ ] Text-to-speech quality
- [ ] Hausa language correctness
- [ ] Response latency
- [ ] Error handling
- [ ] Mobile responsiveness

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
