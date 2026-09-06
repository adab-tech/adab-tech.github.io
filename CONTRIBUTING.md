# Contributing

This is a static GitHub Pages site. Keep changes accessible (WCAG 2 AA) and avoid breaking public URLs.

## Local development

```bash
npm install
npm start          # http://localhost:8000
```

## Accessibility checks

Start the local server first, then in another terminal:

```bash
npm run pa11y      # fast CLI scan
npm run axe-audit  # axe-core via Playwright
```

CI also runs these on pull requests (`.github/workflows/ci.yml`) plus Lighthouse (`.github/workflows/accessibility.yml`).

If Chrome/Playwright fails to launch, install Chromium and its OS dependencies. See [Playwright on CI](https://playwright.dev/docs/ci).

## Pull requests

Use the PR template. For UI work, include a short test plan and screenshots.
