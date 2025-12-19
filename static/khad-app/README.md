# Khad App - Healthcare Communication Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-success)](https://adamu.tech/khad-app/)

## 🏥 Overview

Khad App is a healthcare communication demonstration platform that addresses language barriers in medical settings through AI-powered multilingual translation and symptom summarization. Built with patient safety and accessibility as core principles, it provides separate interfaces for patients and healthcare providers.

**⚠️ IMPORTANT DISCLAIMER:** This is a **demonstration tool only**. It does not provide medical advice, diagnoses, or treatment recommendations. All clinical decisions must be made by qualified healthcare professionals.

## ✨ Features

### Patient-Facing Interface
- **Multilingual Input**: Support for text and voice input in English, Hausa, Yoruba, Igbo, French, Arabic, Spanish, and more
- **Voice Recognition**: Browser-based speech-to-text for hands-free symptom description
- **Translation**: Optional translation to provider's preferred language
- **Text Normalization**: Grammar and spelling correction for clarity
- **Symptom Summarization**: AI-powered extraction and organization of symptoms
- **Safety Disclaimers**: Clear notices that the tool is non-clinical

### Provider-Facing Interface
- **Comprehensive Analysis Dashboard**: View original, normalized, translated, and summarized patient inputs
- **Risk Assessment**: Automated triage-level urgency flagging (Low/Medium/High)
- **Export Functionality**: Download and print reports for medical records
- **No Diagnostics**: Strictly focuses on communication clarity, not medical assessment
- **Professional Disclaimers**: Clear guidance on appropriate tool usage

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: TailwindCSS (via CDN) for responsive, mobile-first design
- **AI Integration**: OpenAI GPT & Google Gemini via API
- **Voice Input**: Web Speech API for browser-based voice recognition
- **Storage**: LocalStorage for API key and settings persistence
- **Deployment**: GitHub Pages compatible (static site)

## 📁 Project Structure

```
khad-app/
├── index.html                  # Landing page
├── pages/
│   ├── patient.html           # Patient-facing interface
│   └── provider.html          # Provider dashboard
├── lib/
│   ├── ai-router.js          # AI backend abstraction layer
│   └── prompts/
│       └── templates.js       # Reusable prompt templates
├── components/                # (Reserved for future React components)
├── styles/                    # (Reserved for custom CSS)
├── .env.example              # Environment variable template
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

To use Khad App, you need an API key from one of these providers:
- [OpenAI Platform](https://platform.openai.com/) (GPT-3.5/GPT-4)
- [Google AI Studio](https://makersuite.google.com/) (Gemini Pro)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adab-tech/adab-tech.github.io.git
   cd adab-tech.github.io/khad-app
   ```

2. **Open locally:**
   Simply open `index.html` in a modern web browser (Chrome, Edge, Firefox, Safari)

3. **Configure API Access:**
   - Click the Settings icon (⚙️) in any interface
   - Select your AI provider (OpenAI or Gemini)
   - Enter your API key
   - Click Save

   Your API key is stored **locally in your browser** and never transmitted to any server except the AI provider you selected.

### Deployment

**GitHub Pages (Recommended):**
The app is already deployed as part of the adab-tech.github.io repository.

**Custom Hosting:**
Simply upload all files to any static web hosting service (Netlify, Vercel, Azure Static Web Apps, etc.)

## 📖 Usage Guide

### For Patients

1. Visit the **Patient Interface** (`pages/patient.html`)
2. Select your preferred language from the dropdown
3. Describe your symptoms using:
   - Text input (type directly)
   - Voice input (click microphone button and speak)
4. Optionally select a translation language
5. Click "Process Symptoms"
6. Review the clarified description and summary
7. Share results with your healthcare provider

### For Healthcare Providers

1. Visit the **Provider Dashboard** (`pages/provider.html`)
2. Either:
   - Click "Load Patient Data" if patient used the Patient Interface
   - Paste patient's symptom description directly
3. Click "Analyze Symptoms"
4. Review:
   - Original patient input
   - Normalized/clarified text
   - Symptom summary list
   - Risk assessment level (Low/Medium/High)
5. Export or print report for medical records

## 🔐 Security & Privacy

- **No Server-Side Storage**: All processing happens client-side
- **Local API Keys**: Keys stored in browser LocalStorage, never transmitted
- **No Data Collection**: No analytics, tracking, or data retention
- **HTTPS Required**: Use secure connections for API calls
- **API Security**: Follow provider best practices for key management

## ♿ Accessibility

Khad App follows WCAG 2.1 Level AA guidelines:
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Responsive text sizing
- Clear focus indicators
- Semantic HTML structure

## 🔧 Configuration

### Environment Variables

For server-side deployments with pre-configured API keys, create a `.env` file:

```bash
# Copy from template
cp .env.example .env

# Edit .env with your keys
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

**Note:** For GitHub Pages deployment, users must configure API keys individually in the browser interface.

### AI Router Configuration

The AI Router (`lib/ai-router.js`) provides a unified interface for multiple AI backends:

```javascript
// Set provider
aiRouter.setProvider('openai'); // or 'gemini'

// Set API key
aiRouter.setApiKey('your-api-key');

// Set model (OpenAI only)
aiRouter.setModel('gpt-4'); // or 'gpt-3.5-turbo'

// Use AI services
const normalized = await aiRouter.normalize(text);
const translation = await aiRouter.translate(text, 'en');
const summary = await aiRouter.summarizeSymptoms(text);
const risk = await aiRouter.assessRisk(symptoms);
```

## 🧪 Testing

### Manual Testing Checklist

**Patient Interface:**
- [ ] Select different languages
- [ ] Test voice input (Chrome/Edge)
- [ ] Enter symptom descriptions
- [ ] Verify text normalization
- [ ] Check translation functionality
- [ ] Confirm disclaimers display
- [ ] Test mobile responsiveness

**Provider Interface:**
- [ ] Load patient data
- [ ] Analyze manual input
- [ ] Verify risk assessment (Low/Medium/High)
- [ ] Check all data displays correctly
- [ ] Test export functionality
- [ ] Verify print output

### Browser Compatibility

- ✅ Chrome/Edge (recommended for voice input)
- ✅ Firefox
- ✅ Safari
- ⚠️ Voice input requires Chrome/Edge/Safari (WebKit Speech API)

## 🌐 Multilingual Support

Currently supported languages:
- English (en)
- Hausa (ha)
- Yoruba (yo)
- Igbo (ig)
- French (fr)
- Arabic (ar)
- Spanish (es)

Additional languages can be added by extending the language dropdowns in the HTML files.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Maintain WCAG accessibility standards
- Keep dependencies minimal (prefer vanilla JS)
- Test on multiple browsers
- Update documentation
- Add disclaimers where appropriate

## 📜 License

This project is part of the adab-tech.github.io repository. See the main repository for license information.

## 👨‍💻 Author

**Adamu Abubakar (adab-tech)**
- Portfolio: [adamu.tech](https://adamu.tech)
- GitHub: [@adab-tech](https://github.com/adab-tech)
- LinkedIn: [adamudanjuma](https://linkedin.com/in/adamudanjuma)

## 🙏 Acknowledgments

- Built as part of the adamu.tech infrastructure
- Designed for deployment on GitHub Pages
- Inspired by the need for better healthcare communication in multilingual communities

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: contact@adamu.tech

## ⚖️ Legal Notice

**MEDICAL DISCLAIMER:** This application is provided for **demonstration and educational purposes only**. It is not intended for use in actual medical diagnosis, treatment, or clinical decision-making. 

- **Not a Medical Device**: This tool is not FDA-approved or certified for medical use
- **No Medical Advice**: Does not provide medical advice, diagnosis, or treatment
- **Professional Consultation Required**: Always seek advice from qualified healthcare professionals
- **Emergency Services**: Call emergency services (911, 999, etc.) for medical emergencies
- **No Liability**: The authors assume no liability for medical decisions made using this tool

By using this application, you acknowledge that you understand and accept these limitations.

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Demo/Educational
