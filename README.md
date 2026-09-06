# adamu.tech · Portfolio

[![Site](https://img.shields.io/badge/live-adamu.tech-0f766e?style=for-the-badge)](https://adamu.tech)
[![GitHub Pages](https://img.shields.io/badge/deploy-GitHub_Pages-24292f?style=for-the-badge&logo=github)](https://github.com/adab-tech/adab-tech.github.io/actions)
[![License](https://img.shields.io/badge/license-MIT-4f46e5?style=flat-square)](LICENSE)

Personal portfolio and project hub for **Adamu Abubakar** — computational linguistics, African language AI, and applied NLP.

**Live site:** [https://adamu.tech](https://adamu.tech)

---

## Highlights

- Responsive portfolio with dark mode, accessible navigation, and Cal.com booking
- Featured projects: Khad (offline health), Hausa Language Explorer, OpportunityFinder, Adamsy Free TV, and more
- Brand assets under `assets/brand/` · resume PDF at `assets/resume/`
- Hausa Explorer PWA under `static/` · Khad demo under `khad-app/`

---

## Local development

**Prerequisites:** Node.js 18+ (see `.nvmrc`), npm

```bash
git clone https://github.com/adab-tech/adab-tech.github.io.git
cd adab-tech.github.io
npm install
npm start          # http://localhost:8000
```

```bash
npm run pa11y      # accessibility scan
npm run axe-audit  # axe audit
```

---

## Deploy

Pushes to `main` deploy via GitHub Actions (`.github/workflows/static.yml`) to GitHub Pages with custom domain **adamu.tech**.

---

## Structure

```text
index.html          Portfolio homepage
styles.css          Design system
responsive.css      Cross-platform layout
animations.css/js   Motion layer
booking.js          Cal.com embed
script.js           Site behavior
sw.js               Unregisters a retired root service worker
manifest.json       PWA manifest (Hausa Explorer)
CNAME               Custom domain
assets/brand/       Logo, favicon, site config
assets/resume/      Public CV (PDF)
khad-app/           Offline health demo
static/             Hausa Explorer, demos, business card
wallet/             Apple Wallet pass generator
docs/               Maintainer documentation
scripts/            Repo tooling (axe audit, README push)
.github/            CI, issue, and PR templates
```

---

## Profile README

GitHub profile landing page: [adab-tech/adab-tech](https://github.com/adab-tech/adab-tech)

Setup notes for pins and repo READMEs: [docs/GITHUB_PROFILE.md](docs/GITHUB_PROFILE.md)

---

## Contact

- **Email:** [contact@adamu.tech](mailto:contact@adamu.tech)
- **Book a call:** [cal.com/adamu-abubakar/intro](https://cal.com/adamu-abubakar/intro)
- **LinkedIn:** [adamudanjuma](https://www.linkedin.com/in/adamudanjuma/)
