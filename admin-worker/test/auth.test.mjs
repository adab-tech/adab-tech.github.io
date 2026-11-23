import test from 'node:test'
import assert from 'node:assert/strict'
import { generateKeyPairSync, verify } from 'node:crypto'
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
  let calls = 0
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(url, 'https://api.github.com/repos/adab-tech/adab-tech.github.io/git/blobs')
    assert.equal(init.method, 'POST')
    assert.equal(init.redirect, 'manual')
    assert.deepEqual(JSON.parse(init.body), { content: 'example' })
    assert.equal(init.headers.Authorization, 'Bearer test-token')
    if (calls++ > 0) return Response.redirect('https://example.invalid/unexpected', 302)
    return Response.json({ sha: 'local-test-blob' }, { status: 201 })
  })

  const response = await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), env)
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { sha: 'local-test-blob' })
  const redirected = await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), env)
  assert.equal(redirected.status, 502)
  assert.equal(redirected.headers.has('Location'), false)
  assert.match((await redirected.json()).message, /unexpectedly redirected/)
  assert.equal(fetchMock.mock.callCount(), 2)
})

test('an installed GitHub App signs, scopes, caches, and renews publishing credentials', async (t) => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const app = {
    ...env,
    GITHUB_APP_ID: '12345',
    GITHUB_APP_INSTALLATION_ID: '67890',
    GITHUB_APP_PRIVATE_KEY: privateKey.export({ type: 'pkcs1', format: 'pem' }),
  }
  let now = Date.now()
  t.mock.method(Date, 'now', () => now)
  let mints = 0
  let writes = 0
  let installationChecks = 0
  const installationUrl = 'https://api.github.com/repos/adab-tech/adab-tech.github.io/installation'
  const mintUrl = 'https://api.github.com/app/installations/67890/access_tokens'
  const writeUrl = 'https://api.github.com/repos/adab-tech/adab-tech.github.io/git/blobs'

  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.equal(init.redirect, 'manual')
    if (url === installationUrl) {
      installationChecks++
      assert.equal(init.method, 'GET')
      assert.match(init.headers.Authorization, /^Bearer /)
      return Response.json({ id: 67890, permissions: { contents: 'write', actions: 'read' } })
    }
    if (url === mintUrl) {
      mints++
      assert.equal(init.method, 'POST')
      assert.deepEqual(JSON.parse(init.body), {
        repositories: ['adab-tech.github.io'],
        permissions: { contents: 'write', actions: 'read' },
      })
      const [header, payload, signature] = init.headers.Authorization.slice('Bearer '.length).split('.')
      assert.deepEqual(JSON.parse(Buffer.from(header, 'base64url')), { alg: 'RS256', typ: 'JWT' })
      assert.deepEqual(JSON.parse(Buffer.from(payload, 'base64url')), {
        iat: Math.floor(now / 1000) - 60,
        exp: Math.floor(now / 1000) + 540,
        iss: '12345',
      })
      assert.equal(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), publicKey, Buffer.from(signature, 'base64url')), true)
      return Response.json({ token: `installation-fixture-${mints}`, expires_at: new Date(now + 3_600_000).toISOString() }, { status: 201 })
    }

    assert.equal(url, writeUrl)
    assert.equal(init.headers.Authorization, `Bearer installation-fixture-${mints}`)
    writes++
    return Response.json({ sha: 'local-test-blob' }, { status: 201 })
  })

  const auth = await worker.fetch(post('login', { password }), app)
  const cookie = auth.headers.get('Set-Cookie').split(';')[0]
  const session = await worker.fetch(request('session', { headers: { Cookie: cookie } }), app)
  assert.deepEqual(await session.json(), { signedIn: true, publishingConfigured: true })
  assert.equal(mints, 0)

  const publish = (config = app) => worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), config)
  const simultaneous = await Promise.all([publish(), publish()])
  assert.deepEqual(simultaneous.map((response) => response.status), [201, 201])
  assert.equal(mints, 1)
  assert.equal(installationChecks, 1)
  assert.equal(writes, 2)

  now += 3_540_000
  assert.equal((await publish()).status, 201)
  assert.equal(mints, 2)
  assert.equal(installationChecks, 2)
  assert.equal(writes, 3)

  const pkcs8 = { ...app, GITHUB_APP_PRIVATE_KEY: privateKey.export({ type: 'pkcs8', format: 'pem' }) }
  assert.equal((await publish(pkcs8)).status, 201)
  assert.equal(mints, 3)
  assert.equal(installationChecks, 3)
  assert.equal(writes, 4)
})

test('an App without Actions permissions can publish and read the public Pages workflow', async (t) => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const app = {
    ...env,
    GITHUB_TOKEN: undefined,
    GITHUB_APP_ID: '98765',
    GITHUB_APP_INSTALLATION_ID: '43210',
    GITHUB_APP_PRIVATE_KEY: privateKey.export({ type: 'pkcs1', format: 'pem' }),
  }
  const appPath = 'https://api.github.com/repos/adab-tech/adab-tech.github.io'
  const runs = 'actions/workflows/deploy.yml/runs?branch=main&per_page=1'
  const publicReads = []
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    if (url === `${appPath}/installation`) {
      return Response.json({ id: 43210, permissions: { contents: 'write' } })
    }
    if (url === 'https://api.github.com/app/installations/43210/access_tokens') {
      assert.deepEqual(JSON.parse(init.body), {
        repositories: ['adab-tech.github.io'],
        permissions: { contents: 'write' },
      })
      return Response.json({ token: 'no-actions-fixture', expires_at: new Date(Date.now() + 3_600_000).toISOString() }, { status: 201 })
    }
    if (url === `${appPath}/git/blobs`) {
      assert.equal(init.headers.Authorization, 'Bearer no-actions-fixture')
      return Response.json({ sha: 'local-test-blob' }, { status: 201 })
    }
    if (!init.headers.Authorization) {
      assert.equal(init.method, 'GET')
      publicReads.push(url)
      return Response.json({ workflow_runs: [{ status: 'completed' }] })
    }
    return Response.json({ message: 'Resource not accessible by integration' }, { status: 403 })
  })
  const auth = await worker.fetch(post('login', { password }), app)
  const cookie = auth.headers.get('Set-Cookie').split(';')[0]
  const signedIn = (path) => request(path, { headers: { Cookie: cookie } })
  assert.equal((await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), app)).status, 201)
  assert.deepEqual(await (await worker.fetch(signedIn(`github/${runs}`), app)).json(), {
    workflow_runs: [{ status: 'completed' }],
  })
  assert.deepEqual(publicReads, [`${appPath}/${runs}`])
  assert.equal((await worker.fetch(signedIn('github/actions/workflows/other.yml/runs'), app)).status, 403)
  assert.equal((await worker.fetch(post(`github/${runs}`, {}, { cookie }), app)).status, 403)
  assert.equal(publicReads.length, 1)
})

test('GitHub App setup failures expose fixed messages without provider data', async (t) => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const app = {
    ...env,
    GITHUB_TOKEN: undefined,
    GITHUB_APP_ID: '112233',
    GITHUB_APP_INSTALLATION_ID: '223344',
    GITHUB_APP_PRIVATE_KEY: privateKey.export({ type: 'pkcs1', format: 'pem' }),
  }
  const auth = await worker.fetch(post('login', { password }), app)
  const cookie = auth.headers.get('Set-Cookie').split(';')[0]
  const privateMessage = { message: 'Provider response stays private' }
  const cases = [
    ['invalid PEM', /private key could not be read/, { GITHUB_APP_PRIVATE_KEY: 'fake-pem' }, []],
    ['provider redirect', /unexpectedly redirected/, {}, [[302, privateMessage]]],
    ['GitHub rejects JWT', /rejected the App JWT/, {}, [[401, privateMessage]]],
    ['no installation for this repository', /could not find the App installation/, {}, [[404, privateMessage]]],
    ['wrong installation ID', /ID does not match/, {}, [[200, { id: 987, permissions: { contents: 'write' } }]]],
    ['missing Contents write', /needs Contents read and write/, {}, [[200, { id: 223344, permissions: { contents: 'read' } }]]],
    ['token permissions declined', /declined the App permissions/, {}, [[200, { id: 223344, permissions: { contents: 'write' } }], [422, privateMessage]]],
    ['provider timeout', /timed out/, {}, [[null, null]]],
  ]
  for (const [name, expectedMessage, overrides, replies] of cases) {
    await t.test(name, async (ctx) => {
      let calls = 0
      const fetchMock = ctx.mock.method(globalThis, 'fetch', async (url) => {
        const mockCall = calls++
        assert.equal(url, mockCall === 0
          ? 'https://api.github.com/repos/adab-tech/adab-tech.github.io/installation'
          : 'https://api.github.com/app/installations/223344/access_tokens')
        const [status, response] = replies[mockCall]
        if (status === null) throw new DOMException('Provider timeout details', 'TimeoutError')
        return Response.json(response, { status })
      })
      const response = await worker.fetch(post('github/git/blobs', { content: 'example' }, { cookie }), { ...app, ...overrides })
      assert.equal(response.status, 502)
      const { message } = await response.json()
      assert.match(message, expectedMessage)
      assert.doesNotMatch(message, /Provider response|Provider timeout details/)
      assert.equal(fetchMock.mock.callCount(), replies.length)
    })
  }
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
