# Apple Wallet (Provider / Route A)

This site is hosted statically (GitHub Pages), so you **can’t** generate a signed Apple Wallet pass (`.pkpass`) purely in the browser.

The easiest approach is to use a **pass provider** (PassKit, PassSource, etc.) and paste the provider-issued “Add to Apple Wallet” link into the business card page.

## What you’ll do

1. Create a pass with a provider.
2. Set:
   - **Primary fields:** your name / title
   - **Secondary fields:** phone, email, website
   - **Barcode / QR:** point it to your public card URL (example):
     - `https://adab-tech.github.io/static/business-card.html`
3. The provider will give you an **“Add to Apple Wallet” URL**.

## Plug the provider link into this repo

Open the page:
- `static/business-card.html`

In the “Apple Wallet setup (Route A: provider)” section:
- paste the provider link into the input

The page saves it locally to your browser (via `localStorage`) and updates the “Add to Apple Wallet” button.

## Making it permanent (optional)

If you want the “Add to Apple Wallet” button to work for **all visitors** (not just your browser), you have two options:

- **Option 1 (simple):** hardcode your provider link into `static/business-card.html` (replace `DEFAULT_PROVIDER_INFO`).
- **Option 2 (clean):** put the provider link in a small JSON file (example `static/business-card.config.json`) and load it at runtime.

If you want, tell me your provider link once you have it and I’ll wire it in permanently.
