# Apple Wallet pass (self-owned)

You said you **don’t have a pass provider**. That’s totally fine — but Apple Wallet passes (`.pkpass`) must be **signed**.

Because this repo is a static site (GitHub Pages), the practical self-owned workflow is:

1. Get the required Apple certificates (one-time).
2. Generate a signed `.pkpass` **locally** (or in CI with secrets).
3. Commit the generated pass into the repo (or upload it to GitHub Pages).
4. Link to it from `static/business-card.html`.

## What you need (Apple requirements)

- An **Apple Developer Program** membership.
- A **Pass Type ID** (PassKit identifier), e.g. `pass.com.yourcompany.card`.
- Certificates:
  - Pass Type ID certificate (`Pass Type ID Certificate`)
  - Apple WWDR certificate

> Without these, no tool can produce an installable Wallet pass.

## Quick start (local generation)

1) Install Node dependencies.

2) Put your certs in `wallet/certs/`:
- `wallet/certs/pass.p12` (exported from Keychain, includes private key)
- `wallet/certs/wwdr.pem`

3) Create `wallet/config.json` (copy from `wallet/config.example.json`).

4) Run the generator:

```bash
node wallet/build-pass.mjs
```

Output:
- `static/passes/business-card.pkpass`

Then your iPhone can install it from:
- `https://<your-site>/static/passes/business-card.pkpass`

## Notes

- If you want this generated automatically on deploy, we can add a GitHub Action — but that requires storing signing certs as repo secrets.
