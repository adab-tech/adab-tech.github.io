/**
 * Admin server for adamu.tech (Cloudflare Worker, free tier).
 *
 * The site itself is static. Saving from adamu.tech/admin means committing to
 * the GitHub repository, which needs a GitHub token. This Worker holds that
 * token as an encrypted secret, so browsers never see or need it. The admin
 * signs in here with a password and gets an HttpOnly session cookie; then the
 * admin pages send their GitHub API calls through /api/admin/github/..., and
 * the Worker adds the token.
 *
 * Secrets (set by .github/workflows/admin-worker.yml):
 *   GITHUB_TOKEN   fine-grained token for REPO only (Contents: read and write,
 *                  Actions: read)
 *   ADMIN_PASSWORD the starting password. Once the password is changed from
 *                  the dashboard, AUTH_PATH in the repo holds a keyed hash of
 *                  the new one and ADMIN_PASSWORD stops working; deleting that
 *                  file brings ADMIN_PASSWORD back ("forgot password").
 *
 * Routes (all under /api/admin/):
 *   GET  session            -> { signedIn }
 *   POST login  {password}  -> sets the session cookie
 *   POST logout             -> clears it
 *   POST password {current, next}
 *   *    github/<path>      -> api.github.com/repos/REPO/<path>, signed in only
 *
 * The admin pages are on the same origin, so no CORS headers are sent: other
 * sites can't read responses, and the session cookie is SameSite=Strict.
 * Write requests must also carry "X-Admin: 1", which a cross-site form can't.
 */

const SESSION_DAYS = 30
const COOKIE = 'adamu_admin'
const MIN_PASSWORD = 10

const enc = new TextEncoder()
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function hmac(keyText, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(keyText), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(message)))
}

function sameString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } })

// Keys derived from the secrets. Replacing the GitHub token (or the
// ADMIN_PASSWORD secret) signs every browser out.
const sessionKey = (env) => `session|${env.GITHUB_TOKEN}|${env.ADMIN_PASSWORD}`
const pepper = (env) => `password|${env.GITHUB_TOKEN}`

async function github(env, path, init = {}) {
  return fetch(`https://api.github.com/repos/${env.REPO}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'adamu-admin-worker',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
}

// The password set from the dashboard: { v: 2, salt, hash } where hash is
// HMAC(pepper, salt + password). Returns { record, sha } or null.
async function readPasswordRecord(env) {
  const res = await github(env, `/contents/${env.AUTH_PATH}?ref=${env.BRANCH}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  const file = await res.json()
  const record = JSON.parse(atob(file.content.replace(/\n/g, '')))
  return record?.v === 2 ? { record, sha: file.sha } : null
}

async function passwordMatches(env, password) {
  const stored = await readPasswordRecord(env)
  if (stored) return sameString(await hmac(pepper(env), stored.record.salt + password), stored.record.hash)
  return Boolean(env.ADMIN_PASSWORD) && sameString(password, env.ADMIN_PASSWORD)
}

async function newSessionCookie(env) {
  const expires = Date.now() + SESSION_DAYS * 86_400_000
  const value = `${expires}.${await hmac(sessionKey(env), String(expires))}`
  return `${COOKIE}=${value}; Path=/api/admin; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Strict`
}

async function signedIn(request, env) {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [expires, sig] = match[1].split('.')
  if (!expires || !sig || Number(expires) < Date.now()) return false
  return sameString(sig, await hmac(sessionKey(env), expires))
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const route = url.pathname.replace(/^\/api\/admin\/?/, '')
    const method = request.method

    if (!env.GITHUB_TOKEN || !env.ADMIN_PASSWORD) return json({ error: 'The admin server is not configured yet.' }, 503)
    if (method !== 'GET' && method !== 'HEAD' && request.headers.get('X-Admin') !== '1') return json({ error: 'Forbidden' }, 403)

    if (route === 'session' && method === 'GET') return json({ signedIn: await signedIn(request, env) })

    if (route === 'login' && method === 'POST') {
      const { password } = await request.json().catch(() => ({}))
      if (typeof password === 'string' && (await passwordMatches(env, password))) {
        return json({ ok: true }, 200, { 'Set-Cookie': await newSessionCookie(env) })
      }
      // Slow down guessing.
      await new Promise((r) => setTimeout(r, 1500))
      return json({ error: 'Wrong password.' }, 401)
    }

    if (route === 'logout' && method === 'POST') {
      return json({ ok: true }, 200, { 'Set-Cookie': `${COOKIE}=; Path=/api/admin; Max-Age=0; HttpOnly; Secure; SameSite=Strict` })
    }

    if (!(await signedIn(request, env))) return json({ error: 'Signed out. Sign in again.' }, 401)

    if (route === 'password' && method === 'POST') {
      const { current, next } = await request.json().catch(() => ({}))
      if (typeof next !== 'string' || next.length < MIN_PASSWORD) return json({ error: `Use at least ${MIN_PASSWORD} characters.` }, 400)
      if (typeof current !== 'string' || !(await passwordMatches(env, current))) {
        await new Promise((r) => setTimeout(r, 1500))
        return json({ error: 'The current password is wrong.' }, 400)
      }
      const salt = b64url(crypto.getRandomValues(new Uint8Array(16)))
      const record = { v: 2, note: 'Admin password as a keyed hash; delete this file to reset to the ADMIN_PASSWORD secret.', salt, hash: await hmac(pepper(env), salt + next) }
      const existing = await readPasswordRecord(env)
      const res = await github(env, `/contents/${env.AUTH_PATH}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: 'Admin: change the admin password',
          content: btoa(JSON.stringify(record, null, 2) + '\n'),
          branch: env.BRANCH,
          ...(existing ? { sha: existing.sha } : {}),
        }),
      })
      if (!res.ok) return json({ error: `GitHub refused the change (${res.status}).` }, 502)
      return json({ ok: true })
    }

    if (route.startsWith('github/')) {
      const path = '/' + route.slice('github/'.length) + url.search
      // Only this repository's API, and never the admin password file.
      if (path.includes('..') || path.includes(env.AUTH_PATH)) return json({ error: 'Not allowed' }, 403)
      const res = await github(env, path, {
        method,
        body: method === 'GET' || method === 'HEAD' ? undefined : await request.text(),
      })
      return new Response(res.body, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json', 'Cache-Control': 'no-store' },
      })
    }

    return json({ error: 'Not found' }, 404)
  },
}
