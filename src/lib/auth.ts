'use client'

import { useSyncExternalStore } from 'react'
import { checkAccess, forgetToken, getToken, saveToken, subscribeToken } from '@/lib/github-publish'

// Admin sign-in. The site is static, so there is no server to check a
// password; a password written into the site's code would be readable by
// anyone. The one real key is the GitHub token that can publish to this repo,
// so signing in means giving the admin that token. It is kept in this browser
// (localStorage) until you sign out, and sent only to api.github.com.

// Older versions kept a browser-only password and session here.
function dropLegacyKeys() {
  try {
    localStorage.removeItem('adamu_tech_admin_password')
    localStorage.removeItem('adamu_tech_admin_session')
  } catch {}
}

export function useAdminAuth() {
  // null while the page is rendered on the server / before hydration.
  const token = useSyncExternalStore<string | null>(subscribeToken, getToken, () => null)

  // Checks the token with GitHub before keeping it.
  const login = async (value: string) => {
    const previous = getToken()
    saveToken(value)
    try {
      await checkAccess()
      dropLegacyKeys()
    } catch (err) {
      if (previous) saveToken(previous)
      else forgetToken()
      throw err
    }
  }

  const logout = () => {
    forgetToken()
    dropLegacyKeys()
  }

  return { isAuthenticated: Boolean(token), loading: token === null, login, logout }
}
