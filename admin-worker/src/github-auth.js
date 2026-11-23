const API = 'https://api.github.com'
const REFRESH_EARLY_MS = 60_000
const JWT_LIFETIME_SECONDS = 9 * 60
const SIGNATURE = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }
// PKCS#8 PrivateKeyInfo version 0 and the rsaEncryption algorithm identifier.
const PKCS8_RSA_HEADER = [0x02, 0x01, 0x00, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00]
const encoder = new TextEncoder()
let cachedInstallation

export const githubHeaders = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'adamu-admin-worker',
  'X-GitHub-Api-Version': '2022-11-28',
}

function appConfiguration(env) {
  const appId = String(env.GITHUB_APP_ID ?? '').trim()
  const installationId = String(env.GITHUB_APP_INSTALLATION_ID ?? '').trim()
  const privateKey = env.GITHUB_APP_PRIVATE_KEY?.trim()
  if (!/^[1-9]\d*$/.test(appId) || !/^[1-9]\d*$/.test(installationId) || !privateKey) return null
  return { appId, installationId, privateKey, repo: env.REPO }
}

export const publishingConfigured = (env) =>
  Boolean(env.REPO && (appConfiguration(env) || env.GITHUB_TOKEN?.trim()))

const base64url = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const encode = (data) => base64url(encoder.encode(JSON.stringify(data)))

function derValue(tag, bytes) {
  const size = bytes.length
  if (size > 0xffff) throw new Error('GitHub App private key is too large')
  const length = size < 128 ? [size] : size < 256 ? [0x81, size] : [0x82, size >> 8, size & 0xff]
  return Uint8Array.of(tag, ...length, ...bytes)
}

function privateKeyBytes(privateKey) {
  if (privateKey.length > 12_000) throw new Error('GitHub App private key is too large')
  const pem = privateKey.match(/^-----BEGIN (RSA |)PRIVATE KEY-----\s+([A-Za-z0-9+/=\s]+)-----END \1PRIVATE KEY-----$/)
  if (!pem) throw new Error('Expected a GitHub App private key PEM')
  const bytes = Uint8Array.from(atob(pem[2].replace(/\s/g, '')), (character) => character.charCodeAt(0))
  // GitHub downloads a PKCS#1 RSAPrivateKey. Web Crypto imports that key
  // once wrapped as the privateKey OCTET STRING in a PKCS#8 sequence.
  if (pem[1]) return derValue(0x30, Uint8Array.of(...PKCS8_RSA_HEADER, ...derValue(0x04, bytes)))
  return bytes
}

async function appJwt(config) {
  const key = await crypto.subtle.importKey('pkcs8', privateKeyBytes(config.privateKey), SIGNATURE, false, ['sign'])
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iat: now - 60,
    exp: now + JWT_LIFETIME_SECONDS,
    iss: config.appId,
  })}`
  const signature = await crypto.subtle.sign(SIGNATURE, key, encoder.encode(unsigned))
  return `${unsigned}.${base64url(new Uint8Array(signature))}`
}

async function mintInstallationToken(config) {
  const [, repository] = config.repo.split('/')
  const response = await fetch(`${API}/app/installations/${config.installationId}/access_tokens`, {
    method: 'POST',
    redirect: 'error',
    headers: {
      ...githubHeaders,
      Authorization: `Bearer ${await appJwt(config)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repositories: [repository],
      permissions: { contents: 'write', actions: 'read' },
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error('GitHub declined the installation token request')
  const { token, expires_at: expiresAt } = await response.json()
  const expiration = Date.parse(expiresAt)
  if (typeof token !== 'string' || !token || !Number.isFinite(expiration) || expiration <= Date.now()) {
    throw new Error('GitHub returned an invalid installation token')
  }
  return { token, expiration }
}

export async function publishingToken(env) {
  const config = appConfiguration(env)
  if (!config) return env.GITHUB_TOKEN?.trim()

  // Coalesce requests within one Worker isolate. A deployment that rotates
  // credentials should mint a new token with its current configuration.
  if (!cachedInstallation || Object.keys(config).some((key) => config[key] !== cachedInstallation.config[key])) {
    cachedInstallation = { config }
  }
  const installation = cachedInstallation
  if (installation.token && installation.expiration > Date.now() + REFRESH_EARLY_MS) return installation.token

  installation.pending ??= mintInstallationToken(config)
    .then(({ token, expiration }) => {
      installation.token = token
      installation.expiration = expiration
      return token
    })
    .finally(() => { installation.pending = null })
  return installation.pending
}

export function discardInstallationToken(token) {
  if (cachedInstallation && token === cachedInstallation.token) cachedInstallation.token = undefined
}
