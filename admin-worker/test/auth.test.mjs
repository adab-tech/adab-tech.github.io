import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'

const origin = 'https://adamu.tech'
const password = 'local-test-password'
const env = {
  REPO: 'adab-tech/adab-tech.github.io',
  GITHUB_TOKEN: 'test-token',
  ADMIN_PASSWORD: password,
  LOGIN_RATE_LIMIT: { limit: async () => ({ success: true }) },
}

const request = (path, init) => new Request(`${origin}/api/admin/${path}`, init)

function post(path, body, { site = origin, cookie } = {}) {
  return request(path, {
    method: 'POST',
    headers: {
      Origin: site,
      'X-Admin': '1',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  })
}

test('unconfigured admin sessions report a service error', async () => {
  const response = await worker.fetch(request('session'), { ...env, ADMIN_PASSWORD: '' })
  assert.equal(response.status, 503)
})

test('the site password starts a session that ends when the secret is rotated', async () => {
  const initial = await worker.fetch(request('session'), env)
  assert.deepEqual(await initial.json(), { signedIn: false })
  const response = await worker.fetch(post('login', { password }), env)
  assert.equal(response.status, 200)
  const cookie = response.headers.get('Set-Cookie')
  assert.match(cookie, /^__Secure-adamu_admin=/)
  assert.match(cookie, /Path=\/api\/admin/)
  assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/)
  const session = request('session', { headers: { Cookie: cookie.split(';')[0] } })
  assert.deepEqual(await (await worker.fetch(session, env)).json(), { signedIn: true })
  const rotated = { ...env, ADMIN_PASSWORD: 'different-test-password' }
  assert.deepEqual(await (await worker.fetch(session, rotated)).json(), { signedIn: false })
})

test('login enforces the site origin and the configured attempt limit', async () => {
  const external = await worker.fetch(post('login', { password }, { site: 'https://example.com' }), env)
  assert.equal(external.status, 403)
  assert.equal(external.headers.has('Set-Cookie'), false)

  const limited = { ...env, LOGIN_RATE_LIMIT: { limit: async () => ({ success: false }) } }
  const response = await worker.fetch(post('login', { password }, {}), limited)
  assert.equal(response.status, 429)
  assert.equal(response.headers.has('Set-Cookie'), false)
})

test('signed-in publishing forwards the configured repository request', async (t) => {
  const signedOut = await worker.fetch(post('github/git/blobs', { content: 'example' }), env)
  assert.equal(signedOut.status, 401)

  const login = await worker.fetch(post('login', { password }), env)
  const cookie = login.headers.get('Set-Cookie').split(';')[0]
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.github.com/repos/adab-tech/adab-tech.github.io/git/blobs')
    assert.equal(init.method, 'POST')
    assert.deepEqual(JSON.parse(init.body), { content: 'example' })
    assert.equal(init.headers.Authorization, 'Bearer test-token')
    return Response.json({ sha: 'local-test-blob' }, { status: 201 })
  })

  const response = await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), env)
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { sha: 'local-test-blob' })
  assert.equal(fetchMock.mock.callCount(), 1)
})
