## Contributing: running local accessibility checks (pa11y / axe)

This project includes accessibility improvements and CI-based Lighthouse checks. To reproduce and run accessibility checks locally, follow the steps below.

Checklist
- Start a local static server that serves the site (example provided)
- Run pa11y for a fast site scan
- Run axe (via Playwright) for a programmatic DOM accessibility check

Prerequisites
- Node.js (v16+ recommended) and npm
- A modern Chromium/Chrome installation available on your machine (required by pa11y/axe when using Puppeteer/Playwright)

If you're on Ubuntu/Debian, you may need to install native deps for headless Chrome. Example:

```bash
sudo apt update
sudo apt install -y chromium-browser libatk1.0-0 libatk-bridge2.0-0 libcups2 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpangocairo-1.0-0 libgtk-3-0 libnss3 libxss1 libxtst6
```

Quick local server

```bash
# from the repo root
python3 -m http.server 8000
# or if you have serve installed
npx serve -s . -l 8000
```

pa11y (fast CLI scan)

pa11y is a simple command-line accessibility scanner. Install globally or use npx.

```bash
# install globally
npm install -g pa11y

# run a scan and write a text report
npx pa11y http://127.0.0.1:8000 --reporter cli > pa11y-report.txt

# or output JSON
npx pa11y http://127.0.0.1:8000 --reporter json > pa11y-report.json
```

Notes: pa11y uses a headless browser under the hood. If you see errors about launching Chrome (missing libraries), install Chrome/Chromium and native dependencies first (see Prerequisites).

axe (programmatic DOM checks with Playwright)

For deeper programmatic checks using axe-core, the `@axe-core/playwright` helper is convenient.

1. Install dev dependencies

```bash
npm install --save-dev playwright @axe-core/playwright
```

2. Create a small script `axe-audit.js` in the repo root:

```javascript
// axe-audit.js
const { chromium } = require('playwright');
const { injectAxe, checkA11y } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8000');

  // inject axe runtime into the page
  await injectAxe(page);

  // run the accessibility checks
  const results = await checkA11y(page, null, { detailedReport: true });
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
```

3. Run the script

```bash
node axe-audit.js > axe-report.json
```

Tips
- Save reports (`pa11y-report.txt`, `axe-report.json`) and attach them to PRs for reviewers.
- If running in CI, use the provided LHCI workflow (see `.github/workflows/accessibility.yml`) to produce Lighthouse reports on PRs.
- If Chrome fails to launch inside CI or containers, install the missing native libraries or use an action that provides Chrome (the LHCI workflow uses the GitHub runner which has Chrome available).

Troubleshooting
- Error: "Failed to launch the browser process" — usually means Chromium/Chrome or native deps are missing. Check the troubleshooting guide for puppeteer/playwright.
  - Puppeteer troubleshooting: https://pptr.dev/troubleshooting
  - Playwright docs: https://playwright.dev/docs/ci

If you want, I can add a small npm script and the `axe-audit.js` helper file to the repo so contributors can run `npm run audit`.
