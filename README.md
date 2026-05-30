# adamu.tech — Local development

Quick setup to run and test the site locally.

Prerequisites
- Node.js v18 (use `.nvmrc` or `nvm use`)
- npm (bundled with Node)
- Python (optional) for `start:py`

Install dependencies

```bash
npm install
```

Run the site (cross-platform)

```bash
npm run start       # uses http-server on port 8000
# or
npm run start:py    # uses python's http.server
```

Run accessibility checks

```bash
npm run pa11y
npm run axe-audit
```

Pre-commit hooks
- Hooks are installed automatically via `prepare` script (simple-git-hooks).
- Pre-commit runs a lightweight `npm audit` by default; adjust `package.json` if you add linters/tests.
