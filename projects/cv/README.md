# CV Builder (Local AI)

Build professional, ATS-optimized resumes with local content generation, real-time preview, and PDF export — all running entirely in your browser.

## Features

### Local AI Content Generation
- Professional summary generator
- Bullet-point enhancement
- Keyword suggestions

All features run locally; no API key or external services are required.

This project provides a fully client-side CV/resume builder with ATS scoring,
local content-enhancement heuristics, live preview, and PDF export. Everything
runs in the browser; no API key, account, or external calls are required.

## Feature set

- Local summary generation and bullet enhancement
- ATS scoring with actionable suggestions
- Three print-ready templates
- Auto-save to browser localStorage every 5 seconds
- Export/Import as JSON and PDF
- No external servers, no tracking, no analytics

## How it works

- The `js/ai.js` module implements deterministic, template-driven generation
  and enhancement utilities. These are heuristics designed to provide useful
  suggestions offline.
- The `js/ats.js` module computes a 0-100 score and provides prioritized
  recommendations.
- `js/pdf.js` uses jsPDF to export the rendered resume into a text-based PDF.

## Privacy & Security

- All data stays in your browser's `localStorage`.
- No data is sent to any external servers.
- Inputs are escaped before insertion into the preview to mitigate XSS risk.

## Developer notes

- Open `editor.html` to run the editor.
- The app is intentionally dependency-light to reduce surface area.

## License

© 2026 Adamu Abubakar. All rights reserved.

## 📱 Browser Compatibility
