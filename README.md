# adamu.tech

Personal site for **Adamu Danjuma Abubakar** — Ph.D. candidate and teaching fellow at the University of Alabama. Hausa speech AI, computational linguistics, and African-language infrastructure.

**Live:** [https://adamu.tech](https://adamu.tech)

This repository is a Next.js app (not a static HTML GitHub Pages tree). Production deploys from `main`.

## Routes

| Path | Page |
|------|------|
| `/` | Research-builder dossier (Murya, lexicon, projects) |
| `/about` `/cv` | Biography and CV |
| `/projects` | Engineered systems catalog |
| `/skills` | Skills |
| `/contact` | Contact form |
| `/papers/agentic-ai` | Working paper |
| `/mapping` | Mapping Voices (static app in `public/mapping`) |

Related live systems: [app.murya.ng](https://app.murya.ng) · [globalopportunities.app](https://globalopportunities.app) · [imodoye.ng](https://imodoye.ng) · [Hugging Face](https://huggingface.co/adab-tech)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

Contact-form email goes through a separate Cloudflare Worker (`cf-worker/`). See [cf-worker/README.md](cf-worker/README.md).

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

## License

The site source is public on GitHub. Datasets and models linked from the pages have their own licenses (see Hugging Face cards).
