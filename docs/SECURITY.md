# Public site security

Editable site links accept local paths and HTTPS URLs. The home page also
accepts email links on contact buttons. Blog posts use the same URL checks
and are sanitized during the GitHub Pages build. Formatting, tables, images,
and privacy-enhanced YouTube embeds are supported.

## Check production response headers

GitHub Pages serves the static export. Manage HTTP response headers at
Cloudflare for `adamu.tech`. Check that the response header rules apply to
both the public site and the administrator sign-in page.

```sh
for path in / /admin/login/; do
  curl -fsSI "https://adamu.tech$path" |
    grep -Ei '^(strict-transport-security|content-security-policy|x-frame-options|x-content-type-options|referrer-policy):'
done
```

The Cloudflare rules set `X-Content-Type-Options: nosniff` and
`Referrer-Policy: strict-origin-when-cross-origin` across `adamu.tech`.
Admin routes also use `X-Frame-Options: DENY` and
`frame-ancestors 'none'`. The static site CSP blocks remote scripts.
