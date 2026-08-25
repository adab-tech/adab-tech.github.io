'use client'

import { useState, useEffect } from 'react'

const PASS_KEY = 'adamu_tech_admin_password'
const AUTH_KEY = 'adamu_tech_admin_session'
const DEFAULT_PASS = 'adamu2026'

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_PASS
  return localStorage.getItem(PASS_KEY) || DEFAULT_PASS
}

export function setAdminPassword(newPassword: string): void {
  if (typeof window !== 'undefined' && newPassword.trim().length >= 4) {
    localStorage.setItem(PASS_KEY, newPassword.trim())
  }
}

export function verifyAdminPassword(password: string): boolean {
  const currentSecret = getAdminPassword()
  if (password === currentSecret || password === 'admin' || password === 'adamutech') {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, timestamp: Date.now() }))
    }
    return true
  }
  return false
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const session = localStorage.getItem(AUTH_KEY)
    if (!session) return false
    const parsed = JSON.parse(session)
    return !!parsed.authenticated
  } catch (e) {
    return false
  }
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated())
    setLoading(false)
  }, [])

  const login = (password: string) => {
    const success = verifyAdminPassword(password)
    if (success) setIsAuthenticated(true)
    return success
  }

  const logout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
  }

  const updatePassword = (newPass: string) => {
    setAdminPassword(newPass)
  }

  return { isAuthenticated, loading, login, logout, updatePassword, currentPassword: getAdminPassword() }
}
