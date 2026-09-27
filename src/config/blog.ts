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

// Own comment service (comments-worker/, a Cloudflare Worker on the
// adamu.tech zone, free tier): readers comment with just a name, no account;
// comments appear after approval in /admin/comments. Each post checks that the
// service answers and falls back to the giscus thread above if it doesn't
// (e.g. before the worker has been deployed), so this can stay set.
// Not in use (the author chose not to set up Cloudflare); set to
// 'https://adamu.tech/api' after deploying comments-worker/ to switch it on.
export const COMMENTS_API = ''

export const ownCommentsEnabled = () => Boolean(COMMENTS_API)

// HTML Comment Box (htmlcommentbox.com): hosted, free for small sites,
// readers comment anonymously with no account. Paste the values from the
// snippet it generates ("Get the code"): the `mod=` part is your moderator key
// and `opts=` the options number. While empty, giscus is used.
export const HCB = {
  mod: '%241%24wq1rdBcg%24I.XUuA.YkL4Mf.1qCpGVf.',
  opts: '16798',
}

export const hcbEnabled = () => Boolean(HCB.mod)

// Readers without GitHub can always reply privately by email.
export const REPLY_EMAIL = 'contact@adamu.tech'
