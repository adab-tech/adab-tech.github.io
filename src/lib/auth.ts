'use client'

import { useState, useEffect } from 'react'
import { adminServer, checkWriteAccess, detectAdminServer, forgetToken, saveToken } from '@/lib/github-publish'
import { checkPassword, fetchPasswordRecord, getLocalRecord, hashPassword, passwordProblem, setLocalRecord } from '@/lib/admin-password'

const AUTH_KEY = 'adamu_tech_admin_session'
const SESSION_DAYS = 30

function isAdminAuthenticated(): boolean {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null')
    const age = Date.now() - Number(session?.timestamp)
    return Boolean(session?.authenticated) && age >= 0 && age < SESSION_DAYS * 86_400_000
  } catch {
    return false
  }
}

function startSession() {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, timestamp: Date.now() }))
  localStorage.removeItem('adamu_tech_admin_password')
}

function clearBrowserSession() {
  try {
    localStorage.removeItem(AUTH_KEY)
    forgetToken()
  } catch {
    // An admin Worker session can still work when browser storage is blocked.
  }
}

async function browserPasswordRecord() {
  return getLocalRecord() ?? await fetchPasswordRecord()
}

export function useAdminAuth(checkSetup = false) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [serverMode, setServerMode] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [connectionError, setConnectionError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function initialize() {
      try {
        const server = await detectAdminServer()
        const signedIn = server
          ? (await adminServer<{ signedIn: boolean }>('session')).signedIn
          : isAdminAuthenticated()
        const setup = checkSetup && !server && !signedIn && !(await browserPasswordRecord())
        if (cancelled) return
        setServerMode(server)
        setIsAuthenticated(signedIn)
        setNeedsSetup(setup)
      } catch (err) {
        if (!cancelled) setConnectionError(err instanceof Error ? err.message : 'Could not check the admin session.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void initialize()
    return () => {
      cancelled = true
    }
  }, [checkSetup])

  const login = async (password: string): Promise<'ok' | 'wrong' | 'setup'> => {
    if (await detectAdminServer()) {
      try {
        await adminServer('login', { password })
      } catch (err) {
        if (err instanceof Error && err.message === 'Wrong password.') return 'wrong'
        throw err
      }
      // Remove old browser-only credentials after the Worker takes over.
      clearBrowserSession()
    } else {
      const record = await browserPasswordRecord()
      if (!record) {
        setNeedsSetup(true)
        return 'setup'
      }
      if (!(await checkPassword(password, record))) return 'wrong'
      startSession()
    }
    setIsAuthenticated(true)
    return 'ok'
  }

  const changePassword = async (password: string, repeat: string, current: string): Promise<void> => {
    const problem = passwordProblem(password, repeat)
    if (problem) throw new Error(problem)
    if (await detectAdminServer()) {
      throw new Error('Change the admin password in the Cloudflare Worker secret settings.')
    }
    const record = await browserPasswordRecord()
    if (!record || !(await checkPassword(current, record))) throw new Error('The current password is wrong.')
    setLocalRecord(await hashPassword(password))
  }

  // The GitHub token allows publishing on static deployments. The browser
  // password unlocks this device and its hash stays on this device.
  const setupPassword = async (token: string, password: string, repeat: string): Promise<void> => {
    const problem = passwordProblem(password, repeat)
    if (problem) throw new Error(problem)
    if (!token.trim()) throw new Error('Enter the GitHub token for this site.')
    if (await detectAdminServer()) throw new Error('The admin server is available. Reload and sign in with your admin password.')
    await checkWriteAccess(token)
    setLocalRecord(await hashPassword(password))
    saveToken(token)
    startSession()
    setNeedsSetup(false)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    if (await detectAdminServer()) await adminServer('logout', {})
    clearBrowserSession()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, serverMode, needsSetup, connectionError, login, setupPassword, changePassword, logout }
}
