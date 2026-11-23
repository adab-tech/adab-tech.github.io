/**
 * Admin server for adamu.tech (Cloudflare Worker, free tier).
 *
 * The site itself is static. Saving from adamu.tech/admin means committing to
 * the GitHub repository. The admin signs in with a password and gets an
 * HttpOnly session cookie. The Worker adds the publishing credential to
 * requests for the configured GitHub repository.
 *
 * Secrets (set by .github/workflows/admin-worker.yml):
 *   ADMIN_PASSWORD owner-selected password, rotated through secret settings
 *   ADMIN_SESSION_SECRET independent, randomly generated 32-byte secret
 *   GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, GITHUB_APP_PRIVATE_KEY
 *                  optional GitHub App credentials to mint publishing tokens
 *   GITHUB_TOKEN   optional fine-grained publishing token for REPO only
 *                  (Contents: read and write, Actions: read)
 *
 * Routes (all under /api/admin/):
 *   GET  session            -> { signedIn, publishingConfigured }
 *   GET  analytics          -> real visitor metrics, signed in only
 *   POST login  {password}  -> sets the session cookie
 *   POST logout             -> clears it
 *   *    github/<path>      -> api.github.com/repos/REPO/<path>, signed in only
 *
 * The admin pages are on the same origin, so no CORS headers are sent: other
 * sites can't read responses, and the session cookie is SameSite=Strict.
 * Write requests must also carry the site's Origin and the X-Admin header.
 */

import { readAnalytics } from './analytics.js'
import { discardInstallationToken, githubHeaders, publishingConfigured, publishingToken } from './github-auth.js'

const SESSION_DAYS = 30
const COOKIE = '__Secure-adamu_admin'
const MIN_PASSWORD = 10
const MIN_SESSION_SECRET_LENGTH = 32
const ADMIN_ORIGIN = 'https://adamu.tech'

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
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } })

// Password and session-secret changes sign every browser out. A publishing
// token can be added or rotated independently of an admin session.
const sessionSignature = (env, expires) =>
  hmac(env.ADMIN_SESSION_SECRET, JSON.stringify(['session', env.ADMIN_PASSWORD, expires]))

async function github(env, token, path, init = {}) {
  return fetch(`https://api.github.com/repos/${env.REPO}${path}`, {
    ...init,
    redirect: 'error',
    headers: {
      ...githubHeaders,
      Authorization: `Bearer ${token}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
}

async function passwordMatches(env, password) {
  if (typeof password !== 'string' || password.length > 1024) return false
  const digest = (value) => hmac(env.ADMIN_SESSION_SECRET, JSON.stringify(['password', value]))
  const [expected, supplied] = await Promise.all([digest(env.ADMIN_PASSWORD), digest(password)])
  return sameString(supplied, expected)
}

async function newSessionCookie(env) {
  const expires = Date.now() + SESSION_DAYS * 86_400_000
  const value = `${expires}.${await sessionSignature(env, String(expires))}`
  return `${COOKIE}=${value}; Path=/api/admin; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Strict`
}

async function signedIn(request, env) {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))
  if (!match) return false
  const [expires, sig, extra] = match[1].split('.')
  const expiration = Number(expires)
  if (!sig || extra !== undefined || !Number.isSafeInteger(expiration) || expiration <= Date.now()) return false
  return sameString(sig, await sessionSignature(env, expires))
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.origin !== ADMIN_ORIGIN || !url.pathname.startsWith('/api/admin/')) return json({ error: 'Not found.' }, 404)
    const route = url.pathname.slice('/api/admin/'.length)
    const method = request.method

    if (
      typeof env.ADMIN_PASSWORD !== 'string' || env.ADMIN_PASSWORD.length < MIN_PASSWORD ||
      typeof env.ADMIN_SESSION_SECRET !== 'string' || env.ADMIN_SESSION_SECRET.trim().length < MIN_SESSION_SECRET_LENGTH ||
      env.ADMIN_SESSION_SECRET === env.ADMIN_PASSWORD || !env.LOGIN_RATE_LIMIT
    ) {
      return json({ error: 'The site owner still needs to configure admin sign-in.' }, 503)
    }
    if (method !== 'GET' && method !== 'HEAD' &&
      (request.headers.get('Origin') !== ADMIN_ORIGIN || request.headers.get('X-Admin') !== '1')) {
      return json({ error: 'Forbidden.' }, 403)
    }

    if (route === 'session' && method === 'GET') {
      const authenticated = await signedIn(request, env)
      return json({ signedIn: authenticated, publishingConfigured: authenticated && publishingConfigured(env) })
    }

    if (route === 'login' && method === 'POST') {
      const { success } = await env.LOGIN_RATE_LIMIT.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' })
      if (!success) return json({ error: 'Too many sign-in attempts. Try again in one minute.' }, 429, { 'Retry-After': '60' })
      const credentials = await request.json().catch(() => null)
      if (await passwordMatches(env, credentials?.password)) {
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

    if (route === 'analytics' && method === 'GET') return readAnalytics(env)

    if (route.startsWith('github/')) {
      if (!publishingConfigured(env)) {
        return json({ message: 'GitHub publishing is not configured for this admin server.' }, 503)
      }
      const path = '/' + route.slice('github/'.length) + url.search
      // Only this repository's API, and never the admin password file.
      if (path.includes('..') || path.includes('content/admin/auth.json') || path.includes('public/admin-auth.json')) return json({ error: 'Not allowed' }, 403)
      let token
      try {
        token = await publishingToken(env)
      } catch {
        return json({ message: 'GitHub App publishing could not be authenticated. Check the GitHub App installation and Worker secret settings.' }, 502)
      }
      let res
      try {
        res = await github(env, token, path, {
          method,
          body: method === 'GET' || method === 'HEAD' ? undefined : await request.text(),
        })
      } catch {
        return json({ message: 'GitHub could not be reached. Try again shortly.' }, 502)
      }
      if (res.status === 401) {
        discardInstallationToken(token)
        return json({ message: 'GitHub rejected the publishing credential. Try again or check the Worker settings.' }, 502)
      }
      return new Response(res.body, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json', 'Cache-Control': 'no-store' },
      })
    }

    return json({ error: 'Not found' }, 404)
  },
}
