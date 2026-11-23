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

export class GitHubPublishingError extends Error {}

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

async function appRequest(path, jwt, body) {
  let response
  try {
    response = await fetch(`${API}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      // Workers supports manual and follow. Keep the App JWT on GitHub's API host.
      redirect: 'manual',
      headers: {
        ...githubHeaders,
        Authorization: `Bearer ${jwt}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    if (err?.name === 'TimeoutError') throw new GitHubPublishingError('GitHub timed out while checking the App credentials. Try again shortly.')
    throw new GitHubPublishingError('GitHub could not be reached while checking the App credentials. Try again shortly.')
  }
  if (response.status >= 300 && response.status < 400) {
    throw new GitHubPublishingError('GitHub unexpectedly redirected the App credentials request. Try again shortly.')
  }
  if (response.status === 401) throw new GitHubPublishingError('GitHub rejected the App JWT. Check the App ID and the private key for that App.')
  if (response.status === 404) {
    throw new GitHubPublishingError('GitHub could not find the App installation for this repository. Check that the App is installed for the site repository.')
  }
  if (response.status === 403 || response.status === 422) {
    throw new GitHubPublishingError('GitHub declined the App permissions. Check the installation and approve any pending permission changes.')
  }
  if (!response.ok) throw new GitHubPublishingError('GitHub App authentication is temporarily unavailable. Try again shortly.')
  try {
    return await response.json()
  } catch {
    throw new GitHubPublishingError('GitHub returned an unexpected response while checking the App credentials.')
  }
}

async function mintInstallationToken(config) {
  let jwt
  try {
    jwt = await appJwt(config)
  } catch {
    throw new GitHubPublishingError('The GitHub App private key could not be read. Enter the complete RSA PEM from the GitHub App settings.')
  }
  const installation = await appRequest(`/repos/${config.repo}/installation`, jwt)
  if (String(installation?.id) !== config.installationId) {
    throw new GitHubPublishingError('The Worker installation ID does not match the GitHub App installed on the site repository.')
  }
  if (installation.suspended_at) {
    throw new GitHubPublishingError('The site repository’s GitHub App installation is suspended.')
  }
  if (installation.permissions?.contents !== 'write') {
    throw new GitHubPublishingError('The GitHub App installation needs Contents read and write permission for the site repository.')
  }
  const canReadActions = ['read', 'write'].includes(installation.permissions.actions)
  const [, repository] = config.repo.split('/')
  const { token, expires_at: expiresAt } = await appRequest(
    `/app/installations/${config.installationId}/access_tokens`,
    jwt,
    {
      repositories: [repository],
      permissions: { contents: 'write', ...(canReadActions ? { actions: 'read' } : {}) },
    },
  ) ?? {}
  const expiration = Date.parse(expiresAt)
  if (typeof token !== 'string' || !token || !Number.isFinite(expiration) || expiration <= Date.now()) {
    throw new GitHubPublishingError('GitHub returned an unexpected installation token. Try again shortly.')
  }
  return { token, expiration, kind: 'app', canReadActions }
}

export async function publishingCredential(env) {
  const config = appConfiguration(env)
  if (!config) return { token: env.GITHUB_TOKEN?.trim(), kind: 'pat' }

  // Coalesce requests within one Worker isolate. A deployment that rotates
  // credentials should mint a new token with its current configuration.
  if (!cachedInstallation || Object.keys(config).some((key) => config[key] !== cachedInstallation.config[key])) {
    cachedInstallation = { config }
  }
  const installation = cachedInstallation
  if (installation.credential?.expiration > Date.now() + REFRESH_EARLY_MS) return installation.credential

  installation.pending ??= mintInstallationToken(config)
    .then((credential) => {
      installation.credential = credential
      return credential
    })
    .finally(() => { installation.pending = null })
  return installation.pending
}

export function discardInstallationToken(token) {
  if (token === cachedInstallation?.credential?.token && cachedInstallation) cachedInstallation.credential = undefined
}
