import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'

const origin = 'https://adamu.tech'
const password = 'local-test-password'
const env = {
  REPO: 'adab-tech/adab-tech.github.io',
  GITHUB_TOKEN: 'test-token',
  ADMIN_PASSWORD: password,
  ADMIN_SESSION_SECRET: 'local-test-session-secret-value-for-fixtures',
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
  for (const overrides of [
    { ADMIN_PASSWORD: '' },
    { ADMIN_SESSION_SECRET: undefined },
    { ADMIN_SESSION_SECRET: 'too-short' },
    { ADMIN_PASSWORD: env.ADMIN_SESSION_SECRET },
    { LOGIN_RATE_LIMIT: undefined },
  ]) {
    const response = await worker.fetch(request('session'), { ...env, ...overrides })
    assert.equal(response.status, 503)
  }
})

test('password and session-secret rotation end sessions independently of the publishing token', async () => {
  const initial = await worker.fetch(request('session'), env)
  assert.deepEqual(await initial.json(), { signedIn: false, publishingConfigured: false })
  const response = await worker.fetch(post('login', { password }), env)
  assert.equal(response.status, 200)
  const cookie = response.headers.get('Set-Cookie')
  assert.match(cookie, /^__Secure-adamu_admin=/)
  assert.match(cookie, /Path=\/api\/admin/)
  assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/)
  const session = request('session', { headers: { Cookie: cookie.split(';')[0] } })
  assert.deepEqual(await (await worker.fetch(session, env)).json(), { signedIn: true, publishingConfigured: true })
  const rotatedToken = { ...env, GITHUB_TOKEN: 'new-test-token' }
  assert.deepEqual(await (await worker.fetch(session, rotatedToken)).json(), { signedIn: true, publishingConfigured: true })
  const signedOut = { signedIn: false, publishingConfigured: false }
  const rotatedPassword = { ...env, ADMIN_PASSWORD: 'different-test-password' }
  assert.deepEqual(await (await worker.fetch(session, rotatedPassword)).json(), signedOut)
  const rotatedSession = { ...env, ADMIN_SESSION_SECRET: 'different-session-secret-value-for-fixtures' }
  assert.deepEqual(await (await worker.fetch(session, rotatedSession)).json(), signedOut)
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

test('password-only sign-in allows authenticated analytics and reports unavailable publishing', async (t) => {
  const tokenless = {
    ...env,
    GITHUB_TOKEN: undefined,
    CLOUDFLARE_ANALYTICS_TOKEN: 'analytics-test-token',
    ANALYTICS_ZONE_ID: 'analytics-test-zone',
  }
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.cloudflare.com/client/v4/graphql')
    assert.equal(init.headers.Authorization, 'Bearer analytics-test-token')
    return Response.json({
      data: {
        viewer: {
          zones: [{
            day: [{ count: 5, sum: { visits: 3 } }],
            week: [{ count: 12, sum: { visits: 8 } }],
          }],
        },
      },
    })
  })

  assert.equal((await worker.fetch(request('analytics'), tokenless)).status, 401)
  assert.equal((await worker.fetch(post('github/git/blobs', { content: 'example' }), tokenless)).status, 401)
  assert.equal(fetchMock.mock.callCount(), 0)

  const signIn = await worker.fetch(post('login', { password }), tokenless)
  assert.equal(signIn.status, 200)
  const cookie = signIn.headers.get('Set-Cookie').split(';')[0]
  const init = { headers: { Cookie: cookie } }
  const session = await worker.fetch(request('session', init), tokenless)
  assert.deepEqual(await session.json(), { signedIn: true, publishingConfigured: false })

  const analytics = await worker.fetch(request('analytics', init), tokenless)
  assert.equal(analytics.status, 200)
  const { day, week } = await analytics.json()
  assert.deepEqual(day, { visits: 3, pageViews: 5 })
  assert.deepEqual(week, { visits: 8, pageViews: 12 })

  const publish = await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), tokenless)
  assert.equal(publish.status, 503)
  assert.match((await publish.json()).message, /GitHub publishing is not configured/)
  assert.equal(fetchMock.mock.callCount(), 1)
})
