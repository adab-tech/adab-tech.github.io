'use client'

import { useState, useEffect } from 'react'
import { adminServer, checkAccess, commitFiles, detectAdminServer, forgetToken, getToken, saveToken, textToBase64 } from '@/lib/github-publish'
import { AUTH_FILE, DEFAULT_RECORD, checkPassword, fetchPasswordRecord, getLocalRecord, hashPassword, passwordProblem, setLocalRecord } from '@/lib/admin-password'

// Admin sign-in with a password.
//
// With the admin server deployed (admin-worker/, adamu.tech/api/admin), the
// server checks the password, keeps you signed in with a secure cookie, and
// holds the GitHub token: no browser needs one.
//
// Without it, the check happens in the browser: the default password until
// you change it, then yours. Only hashes are kept (see lib/admin-password.ts);
// the session is remembered in this browser for 30 days or until you sign out.
const AUTH_KEY = 'adamu_tech_admin_session'
const SESSION_DAYS = 30

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    return Boolean(session?.authenticated) && Date.now() - Number(session.timestamp) < SESSION_DAYS * 86_400_000
  } catch {
    return false
  }
}

function startSession() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, timestamp: Date.now() }))
  // The old browser-only password is no longer used.
  localStorage.removeItem('adamu_tech_admin_password')
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(AUTH_KEY)
}

// Writes a new password hash to the repo (needs the GitHub token in this browser).
async function publishPassword(password: string) {
  const record = await hashPassword(password)
  await commitFiles([{ path: AUTH_FILE, base64: textToBase64(JSON.stringify(record, null, 2) + '\n') }], 'Admin: set the admin password')
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [serverMode, setServerMode] = useState(false)

  useEffect(() => {
    let cancelled = false
    detectAdminServer().then(async (server) => {
      let signedIn = false
      if (server) signedIn = await adminServer<{ signedIn: boolean }>('session').then((r) => r.signedIn).catch(() => false)
      else signedIn = isAdminAuthenticated()
      if (cancelled) return
      setServerMode(server)
      setIsAuthenticated(signedIn)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Your password (set for every device), else the default until you set
  // one. A password changed on this device only also works here.
  const login = async (password: string): Promise<'ok' | 'wrong'> => {
    if (await detectAdminServer()) {
      try {
        await adminServer('login', { password })
      } catch (err) {
        if (err instanceof Error && err.message === 'Wrong password.') return 'wrong'
        throw err
      }
      setIsAuthenticated(true)
      return 'ok'
    }
    const published = await fetchPasswordRecord()
    const local = getLocalRecord()
    // On a device with its own password, the default no longer works there.
    const ok = local
      ? (await checkPassword(password, local)) || (published !== null && (await checkPassword(password, published)))
      : await checkPassword(password, published ?? DEFAULT_RECORD)
    if (!ok) return 'wrong'
    startSession()
    setIsAuthenticated(true)
    return 'ok'
  }

  // With the GitHub token (already saved in this browser, or pasted now) the
  // new password works on every device; without it, on this device only.
  const changePassword = async (password: string, repeat: string, token = '', current = ''): Promise<'everywhere' | 'device'> => {
    const problem = passwordProblem(password, repeat)
    if (problem) throw new Error(problem)
    if (await detectAdminServer()) {
      await adminServer('password', { current, next: password })
      return 'everywhere'
    }
    if (token.trim()) {
      const previous = getToken()
      saveToken(token.trim())
      try {
        await checkAccess()
      } catch (err) {
        if (previous) saveToken(previous)
        else forgetToken()
        throw err
      }
    }
    if (getToken()) {
      await publishPassword(password)
      setLocalRecord(null)
      return 'everywhere'
    }
    setLocalRecord(await hashPassword(password))
    return 'device'
  }

  const logout = async () => {
    if (serverMode) await adminServer('logout', {}).catch(() => {})
    logoutAdmin()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, serverMode, login, changePassword, logout }
}
