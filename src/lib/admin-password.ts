'use client'

// The admin password is never stored anywhere, in the code or in the repo.
// public/admin-auth.json holds only a salted PBKDF2-SHA256 hash of it
// (600,000 rounds), which cannot be turned back into the password. Signing in
// hashes what you type and compares. Setting or changing the password writes
// a new hash through GitHub, so it needs the GitHub token.
//
// Until a password is set, the default password works (only its hash is
// here: DEFAULT_RECORD). A password changed without the GitHub token is kept
// on that device only (LOCAL_KEY).
//
// This gate runs in the browser (the site has no server): it keeps out anyone
// who doesn't know the password, and publishing still needs the GitHub token.

export const AUTH_FILE = 'public/admin-auth.json'
const AUTH_URL = '/admin-auth.json'
export const MIN_PASSWORD = 10
const ITERATIONS = 600_000
const LOCAL_KEY = 'adamu_tech_admin_password_hash'

export type PasswordRecord = { v: 1; kdf: 'PBKDF2-SHA256'; iterations: number; salt: string; hash: string }

// Hash of the default password, used until you set your own.
export const DEFAULT_RECORD: PasswordRecord = {
  v: 1,
  kdf: 'PBKDF2-SHA256',
  iterations: 600000,
  salt: 'DErIDV1RMVwoApbylaREwA==',
  hash: '01w/VBHCjw90VscVD5doJ82dIB3hzmJMrjqLgu9s8Hc=',
}

const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes))
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: salt as BufferSource, iterations }, base, 256)
  return new Uint8Array(bits)
}

export function passwordProblem(password: string, repeat: string): string {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`
  if (password !== repeat) return 'The two passwords are different.'
  return ''
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derive(password, salt, ITERATIONS)
  return { v: 1, kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: b64(salt), hash: b64(hash) }
}

export async function checkPassword(password: string, record: PasswordRecord): Promise<boolean> {
  const got = await derive(password, unb64(record.salt), record.iterations)
  const want = unb64(record.hash)
  if (got.length !== want.length) return false
  let diff = 0
  for (let i = 0; i < got.length; i++) diff |= got[i] ^ want[i]
  return diff === 0
}

// The published hash, or null if no password has been set yet.
export async function fetchPasswordRecord(): Promise<PasswordRecord | null> {
  const res = await fetch(`${AUTH_URL}?t=${Date.now()}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Couldn't check the password right now (${res.status}). Try again.`)
  const rec = (await res.json()) as PasswordRecord
  if (rec?.v !== 1 || !rec.hash || !rec.salt) throw new Error('The password file is damaged. Delete public/admin-auth.json on GitHub to go back to the default password.')
  return rec
}

// A password changed on this device only (no GitHub token).
export function getLocalRecord(): PasswordRecord | null {
  try {
    const rec = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null')
    return rec?.v === 1 ? rec : null
  } catch {
    return null
  }
}

export function setLocalRecord(rec: PasswordRecord | null): void {
  if (rec) localStorage.setItem(LOCAL_KEY, JSON.stringify(rec))
  else localStorage.removeItem(LOCAL_KEY)
}
