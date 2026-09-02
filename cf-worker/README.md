# Contact-form relay (Cloudflare Worker)

The main site (`../`) is a static export on GitHub Pages — no server, so no
safe place to hold a Resend API key. This is that server: a standalone
Cloudflare Worker, deployed separately from the site itself, that receives
the contact form's submission and calls Resend on its behalf.

Deployed independently of the site's GitHub Actions build — nothing here
runs unless this directory is deployed with `wrangler`.

## Deploy

```bash
cd cf-worker
npx wrangler login
npx wrangler secret put RESEND_API_KEY   # paste the real Resend key when prompted — never commit it
npx wrangler deploy
```

`wrangler deploy` prints the Worker's URL, something like
`https://adamu-contact-relay.<your-subdomain>.workers.dev`. Give that URL to
whoever's wiring up the frontend (`src/components/ContactForm.tsx`'s
`RELAY_URL` constant) — it's not set automatically since it's only known
after the first deploy.

Optional: route a cleaner hostname to it instead of the `workers.dev` URL —
Cloudflare dashboard → Workers & Pages → `adamu-contact-relay` → Triggers →
Add Custom Domain (e.g. `contact-api.adamu.tech`; DNS for `adamu.tech` is
already on Cloudflare, so this is a few clicks, no separate registrar step).

## Requirements

- [Resend](https://resend.com) account with `adamu.tech` verified as a
  sending domain (DNS is on Cloudflare, so adding Resend's verification
  records is the same few-click process as the custom domain above), and an
  API key with send permission.
- A free Cloudflare account with Workers enabled (it already is, since DNS
  is on Cloudflare) — the free tier (100,000 requests/day) is far beyond
  what a personal contact form will ever use.

## What it does / doesn't do

- Validates the payload (required fields, length caps, a basic email-shape
  check) and a honeypot field before calling Resend — cheap first-line spam
  resistance without adding a CAPTCHA dependency.
- Locks CORS to `ALLOWED_ORIGIN` (`wrangler.jsonc`, defaults to
  `https://adamu.tech`) so this can't be used as an open relay from other
  sites.
- Does **not** touch `contact@adamu.tech`'s *inbound* mail at all — that's
  a separate concern (see the main repo's PR history: DNS MX currently
  points at AWS SES, recommended move is Cloudflare's own Zoho Mail
  DNS wizard for a real two-way mailbox). This Worker only sends the
  contact-form's outbound notification.
