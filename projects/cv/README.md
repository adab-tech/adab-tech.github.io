# AI-Powered CV Builder

> Build professional, ATS-optimized resumes with AI assistance, real-time preview, and PDF export—all running entirely in your browser.

## 🚀 Features

### ✨ AI-Powered Content Generation
- **Professional Summary Generator**: Create compelling summaries tailored to your role
- **Bullet Point Enhancement**: Transform basic descriptions into impactful achievements
- **Keyword Suggestions**: Get industry-relevant keywords for ATS optimization
- Powered by OpenAI GPT-3.5 (you provide your own API key)

### 📊 ATS Optimization
- **Real-time Scoring**: Get instant feedback on your resume's ATS compatibility (0-100 scale)
- **Detailed Analysis**: 
  - Format Check (30 points)
  - Content Check (40 points)
  - Keyword Analysis (30 points)
- **Actionable Suggestions**: Receive specific recommendations to improve your score
- **Visual Feedback**: Color-coded progress bars and severity indicators

### 🎨 Professional Templates
Choose from three expertly designed templates:
1. **Professional** - Two-column layout with blue accents
2. **Modern** - Single column with bold headers and gradient styling
3. **Executive** - Traditional formal layout with serif fonts

All templates are:
- ATS-compatible
- Print-friendly
- Mobile-responsive

### 💾 Browser-Based Storage
- **Auto-Save**: Changes saved automatically every 5 seconds
- **No Account Required**: All data stored locally in your browser
- **Privacy First**: No data sent to servers (except optional AI features)
- **Import/Export**: Backup your data as JSON

### 📄 PDF Export
- One-click export to professional PDF
- Matches your selected template
- Proper formatting and page breaks
- Standard Letter size (8.5" x 11")

## 🎯 How to Use

### Getting Started
1. Click "Get Started Free" or "Launch Editor"
2. Fill in your contact information
3. Add your professional summary, experience, education, and skills
4. Choose a template from the dropdown
5. Export as PDF when ready

### Using AI Features (Optional)
1. Get your free API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click the Settings icon (⚙️) in the top toolbar
3. Enter your API key and save
4. Use the "AI Generate" and "Enhance" buttons throughout the editor

**Note**: Your API key is stored locally and never sent to our servers. You only pay OpenAI for the API usage (typically $0.002 per request).

### Keyboard Shortcuts
- `Ctrl/Cmd + S` - Save resume
- `Ctrl/Cmd + P` - Export PDF

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Requirements**: JavaScript enabled, localStorage available

## 🔒 Privacy & Security

### Data Storage
- All resume data is stored in your browser's localStorage
- No data is sent to external servers except:
  - OpenAI API calls (only if you configure an API key and use AI features)
  - No tracking or analytics
  - No cookies

### Security Features
- HTML escaping to prevent XSS attacks
- Input validation (email, URLs, required fields)
- No external dependencies loaded from untrusted sources
- API keys never transmitted to our servers

### Clearing Your Data
You can clear all stored data at any time:
1. Open Settings (⚙️)
2. Click "Clear All Data"
3. Confirm the action

**Note**: This action cannot be undone. Export your data first if you want to keep a backup.

## 🛠️ Technical Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Styling**: Tailwind CSS (via CDN)
- **PDF Generation**: jsPDF library
- **AI Integration**: OpenAI API (gpt-3.5-turbo)
- **Storage**: Browser localStorage
- **Deployment**: GitHub Pages

## 📖 Architecture

### File Structure
```
projects/cv/
├── index.html          # Landing page
├── editor.html         # Resume editor interface
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── app.js          # Main application logic (989 lines)
│   ├── storage.js      # localStorage management
│   ├── ai.js           # OpenAI integration
│   ├── ats.js          # ATS scoring algorithm
│   ├── pdf.js          # PDF export functionality
│   ├── templates.js    # Resume templates
│   └── utils.js        # Utility functions
└── README.md           # This file
```

### Module Overview

**app.js** - Main orchestrator
- Initializes all modules
- Handles UI events and user interactions
- Coordinates between modules
- Implements auto-save and real-time preview

**storage.js** - Data persistence
- localStorage wrapper
- Resume CRUD operations
- Settings management
- Import/export functionality

**templates.js** - Resume rendering
- Three professional templates
- HTML generation from resume data
- Template switching logic

**ats.js** - Score calculation
- Format analysis (30%)
- Content analysis (40%)
- Keyword analysis (30%)
- Suggestion generation

**ai.js** - AI integration
- OpenAI API communication
- Prompt engineering
- Error handling and retry logic
- Rate limiting

**pdf.js** - PDF generation
- jsPDF integration
- Text-based PDF export
- Page break handling
- Proper formatting

**utils.js** - Helper functions
- Toast notifications
- Validation (email, URL)
- Debouncing
- HTML escaping
- Date formatting

## 🎓 ATS Scoring Explained

### How It Works
The ATS scoring system analyzes your resume across three dimensions:

#### 1. Format (30 points)
- Standard fonts
- Proper section headers
- Consistent formatting
- Optimal length (1-2 pages)

#### 2. Content (40 points)
- Complete contact information
- Professional summary present
- Work experience with dates
- Education section
- Skills section

#### 3. Keywords (30 points)
- Action verbs (achieved, developed, led, etc.)
- Industry-relevant keywords
- Quantifiable metrics (%, $, numbers)

### Scoring Scale
- **90-100**: Grade A - Excellent, highly optimized
- **80-89**: Grade B - Very good, minor improvements
- **70-79**: Grade C - Good, some optimization needed
- **60-69**: Grade D - Needs improvement
- **0-59**: Grade F - Requires significant work

## 🐛 Troubleshooting

### AI Features Not Working
- Ensure you've added your OpenAI API key in Settings
- Check that your API key is valid and has available credits
- Verify you have an internet connection
- Check browser console for error messages

### Preview Not Updating
- Refresh the page
- Check that JavaScript is enabled
- Try a different browser
- Clear browser cache

### PDF Export Issues
- Ensure popup blockers are disabled
- Try a different browser
- Check browser console for errors
- Verify jsPDF library is loaded

### Data Not Saving
- Check that localStorage is enabled in your browser
- Verify available storage space (Settings > Storage)
- Try exporting your data as JSON backup
- Check browser console for quota errors

### Storage Quota Exceeded
1. Export your resume data (Settings > Export as JSON)
2. Clear all data (Settings > Clear All Data)
3. Import only the resume(s) you need

## 💡 Tips for Best Results

### Writing Effective Bullet Points
- Start with strong action verbs
- Include quantifiable metrics (%, $, numbers)
- Focus on achievements, not just responsibilities
- Keep bullets concise (1-2 lines)
- Use the AI enhancement feature for suggestions

### Optimizing for ATS
- Use standard section headers (Experience, Education, Skills)
- Avoid tables, text boxes, and graphics
- Include relevant keywords naturally
- Use standard fonts
- Keep formatting simple and consistent

### Professional Summary
- 3-5 sentences
- Highlight key qualifications
- Include years of experience
- Mention 3-5 core skills
- Use AI generation as a starting point, then customize

## 🤝 Contributing

This project is part of Adamu Abubakar's portfolio. For issues or suggestions:
1. Visit [adamu.tech](https://adamu.tech)
2. Navigate to Projects > CV Builder
3. Use the contact form to reach out

## 📄 License

© 2024 Adamu Abubakar. All rights reserved.

This project is part of my personal portfolio and is provided as-is for educational and personal use.

## 🔗 Links

- **Portfolio**: [adamu.tech](https://adamu.tech)
- **CV Builder**: [adamu.tech/projects/cv/](https://adamu.tech/projects/cv/)
- **OpenAI Platform**: [platform.openai.com](https://platform.openai.com/)
- **GitHub Pages**: [adab-tech.github.io](https://adab-tech.github.io)

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by the need for accessible resume tools
- Designed to help job seekers create professional resumes
- Part of a broader mission to make technology accessible

---

**Made with ❤️ for job seekers everywhere**

*Last updated: January 2024*
