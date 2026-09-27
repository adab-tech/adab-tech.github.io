// Ghost (blog.adamu.tech) connection. Fill both in once Ghost is set up
// (Ghost admin → Settings → Integrations → Add custom integration).
//
// The Content API key is read-only and only returns published posts, so it
// is meant to be public and safe in browser code. Never put the Admin API
// key here.
export const GHOST_URL = '' // e.g. 'https://blog.adamu.tech'
export const GHOST_CONTENT_API_KEY = ''

export const ghostEnabled = () => Boolean(GHOST_URL && GHOST_CONTENT_API_KEY)

// Comments under each post (giscus: stored as GitHub Discussions in this
// repo; free, no ads or tracking; commenters sign in with GitHub).
// One-time setup: install https://github.com/apps/giscus on this repo, then
// on https://giscus.app enter "adab-tech/adab-tech.github.io", choose the
// "Announcements" category, and copy data-category-id below.
export const GISCUS = {
  repo: 'adab-tech/adab-tech.github.io',
  repoId: 'R_kgDOP38YGA',
  category: 'Announcements',
  categoryId: 'DIC_kwDOP38YGM4Czwp6',
}

export const commentsEnabled = () => Boolean(GISCUS.categoryId)

// Own comment service (comments-worker/, Cloudflare free tier): readers
// comment with just a name, no account; comments appear after approval in
// /admin/comments. Set this to the Worker URL printed by the "Deploy comments
// worker" workflow, e.g. 'https://adamu-comments.<name>.workers.dev'.
// While empty, the giscus thread above is used instead.
export const COMMENTS_API = ''

export const ownCommentsEnabled = () => Boolean(COMMENTS_API)

// Readers without GitHub can always reply privately by email.
export const REPLY_EMAIL = 'contact@adamu.tech'
