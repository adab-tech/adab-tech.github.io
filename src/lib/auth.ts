'use client'

import { useState, useEffect } from 'react'
import { checkAccess, commitFiles, forgetToken, getToken, saveToken, textToBase64 } from '@/lib/github-publish'
import { AUTH_FILE, checkPassword, fetchPasswordRecord, hashPassword, passwordProblem } from '@/lib/admin-password'

// Admin sign-in with your own password. Only a hash of it is published
// (see lib/admin-password.ts); the session is remembered in this browser for
// 30 days or until you sign out.
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

  useEffect(() => {
    const t = setTimeout(() => {
      setIsAuthenticated(isAdminAuthenticated())
      setLoading(false)
    }, 0)
    return () => clearTimeout(t)
  }, [])

  // 'ok' | 'wrong' | 'not-set'
  const login = async (password: string): Promise<'ok' | 'wrong' | 'not-set'> => {
    const record = await fetchPasswordRecord()
    if (!record) return 'not-set'
    if (!(await checkPassword(password, record))) return 'wrong'
    startSession()
    setIsAuthenticated(true)
    return 'ok'
  }

  // First time, or forgot the password: prove it's you with the GitHub token.
  const setupWithToken = async (token: string, password: string, repeat: string) => {
    const problem = passwordProblem(password, repeat)
    if (problem) throw new Error(problem)
    const previous = getToken()
    saveToken(token)
    try {
      await checkAccess()
    } catch (err) {
      if (previous) saveToken(previous)
      else forgetToken()
      throw err
    }
    await publishPassword(password)
    startSession()
    setIsAuthenticated(true)
  }

  // From the dashboard, when already signed in (uses the saved token).
  const changePassword = async (password: string, repeat: string) => {
    const problem = passwordProblem(password, repeat)
    if (problem) throw new Error(problem)
    if (!getToken()) throw new Error('Connect GitHub first: open any editor (e.g. Blog posts) once on this device.')
    await publishPassword(password)
  }

  const logout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, login, setupWithToken, changePassword, logout }
}
