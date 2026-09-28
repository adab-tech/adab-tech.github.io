'use client'

// Publishes blog posts from the admin editor by committing Markdown files to
// the site repo through the GitHub REST API. The site is a static export with
// no server, so a commit to `main` is how anything gets published: the deploy
// workflow rebuilds the site about a minute later.
//
// Two ways to reach GitHub:
// 1. The admin server (admin-worker/, at adamu.tech/api/admin), when it is
//    deployed: it holds the GitHub token as a Cloudflare secret, so the
//    browser needs only the admin sign-in. detectAdminServer() turns this on.
// 2. Otherwise a fine-grained token for this one repository, kept in this
//    browser's localStorage only and sent only to api.github.com.

const OWNER = 'adab-tech'
const REPO = 'adab-tech.github.io'
const BRANCH = 'main'
const DIR = 'content/blog'
const API = `https://api.github.com/repos/${OWNER}/${REPO}`
const TOKEN_KEY = 'adamu_tech_github_publish_token'

export const ACTIONS_URL = `https://github.com/${OWNER}/${REPO}/actions`

export const TOKEN_EVENT = 'adamu-token-change'
const SERVER = '/api/admin'
let serverMode = false
let detecting: Promise<boolean> | null = null

// True when the admin server answers on this site (checked once per page).
export function detectAdminServer(): Promise<boolean> {
  if (!detecting) {
    detecting = fetch(`${SERVER}/session`, { cache: 'no-store', credentials: 'same-origin' })
      .then(async (res) => {
        const type = res.headers.get('Content-Type') || ''
        if (!type.includes('application/json')) return false
        const body = await res.json().catch(() => null)
        return Boolean(body && 'signedIn' in body)
      })
      .catch(() => false)
      .then((on) => {
        serverMode = on
        if (typeof window !== 'undefined') window.dispatchEvent(new Event(TOKEN_EVENT))
        return on
      })
  }
  return detecting
}

export const isServerMode = () => serverMode

// Calls to the admin server itself (sign-in, password).
export async function adminServer<T>(route: string, body?: unknown): Promise<T> {
  const res = await fetch(`${SERVER}/${route}`, {
    method: body === undefined ? 'GET' : 'POST',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: { 'X-Admin': '1', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Admin server error ${res.status}`)
  return data as T
}

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim())
}

export function forgetToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Only CORS-safelisted headers plus Authorization/Content-Type, so the
  // browser's preflight to api.github.com can't be refused over a header.
  let res: Response
  try {
    res = serverMode
      ? await fetch(`${SERVER}/github${path}`, {
          ...init,
          cache: 'no-store',
          credentials: 'same-origin',
          headers: { Accept: 'application/vnd.github+json', 'X-Admin': '1', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
        })
      : await fetch(`${API}${path}`, {
          ...init,
          cache: 'no-store',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${getToken().trim()}`,
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          },
        })
  } catch (err) {
    throw new Error(
      `Couldn't reach GitHub from this browser (${err instanceof Error ? err.message : String(err)}). ` +
        'Check the connection, and turn off ad or privacy blockers for adamu.tech, then try again.',
    )
  }
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json()).message || ''
    } catch {}
    if (res.status === 401 && serverMode) throw new Error('You were signed out. Sign in again at adamu.tech/admin.')
    if (res.status === 401) throw new Error('GitHub rejected the token (expired or mistyped). Paste a new one.')
    if (res.status === 403 || res.status === 404) {
      throw new Error(`GitHub refused access (${res.status}). Check the token is for ${OWNER}/${REPO} with Contents: Read and write. ${detail}`)
    }
    if (res.status === 409 || res.status === 422) {
      throw new Error(`The file changed on GitHub since it was opened. Reload the post list and try again. ${detail}`)
    }
    throw new Error(`GitHub error ${res.status}: ${detail}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

// UTF-8 safe base64, so Hausa, French and Arabic text survive the round trip.
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin)
}

function fromBase64(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

export type RemoteFile = { name: string; path: string; sha: string }

export async function checkAccess(): Promise<void> {
  await gh(`/contents/${DIR}?ref=${BRANCH}`)
}

export async function listPosts(): Promise<RemoteFile[]> {
  const items = await gh<{ name: string; path: string; sha: string; type: string }[]>(`/contents/${DIR}?ref=${BRANCH}`)
  return items
    .filter((i) => i.type === 'file' && i.name.endsWith('.md'))
    .map(({ name, path, sha }) => ({ name, path, sha }))
    .sort((a, b) => b.name.localeCompare(a.name))
}

export async function readPost(name: string): Promise<{ text: string; sha: string }> {
  const file = await gh<{ content: string; sha: string }>(`/contents/${DIR}/${encodeURIComponent(name)}?ref=${BRANCH}`)
  return { text: fromBase64(file.content), sha: file.sha }
}

// Creates or updates a post. Returns the commit SHA.
export async function writePost(name: string, text: string, message: string, sha?: string): Promise<string> {
  const res = await gh<{ commit: { sha: string } }>(`/contents/${DIR}/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: toBase64(text), branch: BRANCH, ...(sha ? { sha } : {}) }),
  })
  return res.commit.sha
}

export type FileChange = { path: string; base64: string } | { path: string; delete: true }

// Writes several files (a post, its images, a rename) as ONE commit on main
// using the Git Data API, so a publish triggers a single site rebuild.
// Returns the commit SHA.
export async function commitFiles(changes: FileChange[], message: string): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(`/git/ref/heads/${BRANCH}`)
  const parent = await gh<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`)
  const tree = await Promise.all(
    changes.map(async (c) => {
      if ('delete' in c) return { path: c.path, mode: '100644', type: 'blob', sha: null }
      const blob = await gh<{ sha: string }>(`/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: c.base64, encoding: 'base64' }),
      })
      return { path: c.path, mode: '100644', type: 'blob', sha: blob.sha }
    }),
  )
  const newTree = await gh<{ sha: string }>(`/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  })
  const commit = await gh<{ sha: string }>(`/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  })
  // Not forced: if main moved since we read it, GitHub refuses and the user retries.
  await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) })
  return commit.sha
}

export const postPath = (name: string) => `${DIR}/${name}`
export const textToBase64 = (text: string) => toBase64(text)

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function deletePost(name: string, sha: string, message: string): Promise<void> {
  await gh(`/contents/${DIR}/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  })
}

export type DeployState = 'building' | 'live' | 'failed' | 'unknown'

// Status of the deploy run for a commit. Needs "Actions: Read" on the token;
// without it this returns 'unknown' and the editor links to the Actions tab.
export async function deployState(commitSha: string): Promise<DeployState> {
  try {
    const { workflow_runs } = await gh<{ workflow_runs: { status: string; conclusion: string | null }[] }>(
      `/actions/runs?head_sha=${commitSha}&per_page=5`,
    )
    if (!workflow_runs.length) return 'building'
    const run = workflow_runs[0]
    if (run.status !== 'completed') return 'building'
    return run.conclusion === 'success' ? 'live' : 'failed'
  } catch {
    return 'unknown'
  }
}

// Any text file in the repo (the site content files under content/site/).
export async function readFile(path: string): Promise<{ text: string; sha: string }> {
  const file = await gh<{ content: string; sha: string }>(`/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${BRANCH}`)
  return { text: fromBase64(file.content), sha: file.sha }
}

export type RecentRun = { status: string; conclusion: string | null; title: string; created_at: string; html_url: string }

// Latest site deploys, for the admin overview. Needs "Actions: Read".
export async function recentDeploys(count = 5): Promise<RecentRun[]> {
  const { workflow_runs } = await gh<{
    workflow_runs: { status: string; conclusion: string | null; display_title: string; created_at: string; html_url: string; path: string }[]
  }>(`/actions/runs?branch=${BRANCH}&per_page=20`)
  return workflow_runs
    .filter((r) => r.path.endsWith('deploy.yml'))
    .slice(0, count)
    .map((r) => ({ status: r.status, conclusion: r.conclusion, title: r.display_title, created_at: r.created_at, html_url: r.html_url }))
}
