// Ghost (blog.adamu.tech) connection. Fill both in once Ghost is set up
// (Ghost admin → Settings → Integrations → Add custom integration).
//
// The Content API key is read-only and only returns published posts, so it
// is meant to be public and safe in browser code. Never put the Admin API
// key here.
export const GHOST_URL = '' // e.g. 'https://blog.adamu.tech'
export const GHOST_CONTENT_API_KEY = ''

export const ghostEnabled = () => Boolean(GHOST_URL && GHOST_CONTENT_API_KEY)

// First-party comments can be enabled after deploying comments-worker/.
export const COMMENTS_API = ''

export const ownCommentsEnabled = () => Boolean(COMMENTS_API)

// Readers can reply privately by email.
export const REPLY_EMAIL = 'contact@adamu.tech'
