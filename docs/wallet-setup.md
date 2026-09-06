# Apple Wallet via a pass provider

For generating a signed `.pkpass` yourself, see [wallet/README.md](../wallet/README.md).

This site is hosted statically (GitHub Pages), so you **can’t** generate a signed Apple Wallet pass (`.pkpass`) purely in the browser.

The easiest approach is to use a **pass provider** (PassKit, PassSource, etc.) and paste the provider-issued “Add to Apple Wallet” link into the business card page.

## What you’ll do

1. Create a pass with a provider.
2. Set:
   - **Primary fields:** your name / title
   - **Secondary fields:** phone, email, website
   - **Barcode / QR:** point it to your public card URL (example):
     - `https://adamu.tech/static/business-card.html`
3. The provider will give you an **“Add to Apple Wallet” URL**.

## Plug the provider link into this repo

Open the page:
- `static/business-card.html`

In the “Apple Wallet setup (Route A: provider)” section:
- paste the provider link into the input

The page saves it locally to your browser (via `localStorage`) and updates the “Add to Apple Wallet” button.

## Making it permanent (optional)

If you want the button to work for all visitors (not just your browser):

- Hardcode the provider link in `static/business-card.html` (replace `DEFAULT_PROVIDER_INFO`).
- Or load it at runtime from a small JSON file such as `static/business-card.config.json`.
