// Blog comments API for adamu.tech: a Cloudflare Worker with a D1 database.
//
// Served at https://adamu.tech/api/... (paths below are relative to /api).
// Public:  GET  /comments?post=<slug>            approved comments, oldest first
//          POST /comments {post,name,body,website,t}  new comment -> pending
// Admin (Authorization: Bearer <ADMIN_KEY>):
//          GET    /admin/comments?status=pending|approved
//          POST   /admin/comments/<id>/approve
//          DELETE /admin/comments/<id>
//          POST   /admin/comments {post, body}    author reply, published at once
//
// Readers need no account. Spam is kept off the page by moderation (nothing
// shows until approved), a hidden honeypot field, a minimum time on the form,
// and a per-IP rate limit.

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_NAME = 60
const MAX_BODY = 3000
const MIN_SECONDS_ON_FORM = 3
const RATE_LIMIT = { count: 5, minutes: 10 }

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    try {
      const res = await route(request, env)
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v)
      return res
    } catch (err) {
      return json({ error: 'Server error' }, 500, cors, err)
    }
  },
}

async function route(request, env) {
  const url = new URL(request.url)
  // Served at adamu.tech/api/comments…; accept both with and without /api.
  const path = url.pathname.replace(/\/+$/, '').replace(/^\/api(?=\/)/, '')

  if (path === '/comments' && request.method === 'GET') {
    const post = url.searchParams.get('post') || ''
    if (!SLUG.test(post)) return json({ error: 'Unknown post' }, 400)
    const { results } = await env.DB.prepare(
      `SELECT id, name, body, created_at, is_author FROM comments
       WHERE post = ?1 AND status = 'approved' ORDER BY created_at ASC LIMIT 500`,
    ).bind(post).all()
    return json({ comments: results }, 200, { 'Cache-Control': 'public, max-age=30' })
  }

  if (path === '/comments' && request.method === 'POST') {
    let data
    try {
      data = await request.json()
    } catch {
      return json({ error: 'Invalid request' }, 400)
    }
    const post = String(data.post || '')
    const name = clean(data.name, MAX_NAME)
    const body = clean(data.body, MAX_BODY, true)
    if (!SLUG.test(post)) return json({ error: 'Unknown post' }, 400)
    if (name === null) return json({ error: `Please keep your name under ${MAX_NAME} characters.` }, 400)
    if (body === null) return json({ error: `Please keep comments under ${MAX_BODY} characters.` }, 400)
    if (!name) return json({ error: 'Please add your name.' }, 400)
    if (!body) return json({ error: 'Please write a comment.' }, 400)
    // Bots fill the hidden "website" field or submit instantly; accept
    // silently so they learn nothing, but store nothing.
    const openedAt = Number(data.t) || 0
    if (data.website || Date.now() - openedAt < MIN_SECONDS_ON_FORM * 1000) return json({ ok: true, status: 'pending' }, 202)

    const ipHash = await hash(`${request.headers.get('CF-Connecting-IP') || ''}|${env.ADMIN_KEY || ''}`)
    const since = new Date(Date.now() - RATE_LIMIT.minutes * 60_000).toISOString()
    const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ?1 AND created_at > ?2')
      .bind(ipHash, since)
      .first()
    if ((recent?.n ?? 0) >= RATE_LIMIT.count) return json({ error: 'Too many comments. Please try again later.' }, 429)

    await env.DB.prepare(
      `INSERT INTO comments (post, name, body, created_at, status, ip_hash) VALUES (?1, ?2, ?3, ?4, 'pending', ?5)`,
    ).bind(post, name, body, new Date().toISOString(), ipHash).run()
    return json({ ok: true, status: 'pending' }, 202)
  }

  if (path.startsWith('/admin/')) {
    if (!(await isAdmin(request, env))) return json({ error: 'Not authorized' }, 401)

    if (path === '/admin/comments' && request.method === 'GET') {
      const status = url.searchParams.get('status') === 'approved' ? 'approved' : 'pending'
      const { results } = await env.DB.prepare(
        `SELECT id, post, name, body, created_at, status, is_author FROM comments
         WHERE status = ?1 ORDER BY created_at DESC LIMIT 500`,
      ).bind(status).all()
      return json({ comments: results })
    }

    if (path === '/admin/comments' && request.method === 'POST') {
      const data = await request.json().catch(() => ({}))
      const post = String(data.post || '')
      const body = clean(data.body, MAX_BODY, true)
      if (!SLUG.test(post) || !body) return json({ error: 'Post and text (up to 3000 characters) are required.' }, 400)
      await env.DB.prepare(
        `INSERT INTO comments (post, name, body, created_at, status, is_author)
         VALUES (?1, 'Adamu Danjuma Abubakar', ?2, ?3, 'approved', 1)`,
      ).bind(post, body, new Date().toISOString()).run()
      return json({ ok: true }, 201)
    }

    const m = path.match(/^\/admin\/comments\/(\d+)(\/approve)?$/)
    if (m && request.method === 'POST' && m[2]) {
      await env.DB.prepare(`UPDATE comments SET status = 'approved' WHERE id = ?1`).bind(Number(m[1])).run()
      return json({ ok: true })
    }
    if (m && request.method === 'DELETE' && !m[2]) {
      await env.DB.prepare('DELETE FROM comments WHERE id = ?1').bind(Number(m[1])).run()
      return json({ ok: true })
    }
  }

  return json({ error: 'Not found' }, 404)
}

// Trims, drops control characters, collapses runs of blank lines.
// Returns null when the text is longer than `max`.
function clean(value, max, multiline = false) {
  let s = String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  s = multiline ? s.replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ')
  s = s.trim()
  return s.length > max ? null : s
}

async function isAdmin(request, env) {
  const given = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  const expected = env.ADMIN_KEY || ''
  if (!expected || given.length !== expected.length) return false
  const a = new TextEncoder().encode(given)
  const b = new TextEncoder().encode(expected)
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function hash(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim())
  const ok = allowed.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin)
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(data, status = 200, headers = {}, err) {
  if (err) console.error(err)
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  })
}
