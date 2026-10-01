'use client'

import React, { useState, useSyncExternalStore } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
import { TOKEN_EVENT, checkAccess, forgetToken, getToken, isServerMode, saveToken } from '@/lib/github-publish'

// Shared by every admin editor that saves to GitHub (blog, home page,
// projects, CV): the one-time token setup and a hook that reads the token.

// The token lives in localStorage; read it without a hydration mismatch.
export { TOKEN_EVENT }
const subscribeToken = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener(TOKEN_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(TOKEN_EVENT, cb)
  }
}
export const useToken = () => useSyncExternalStore(subscribeToken, getToken, () => '')

// Whether this browser can save to GitHub: through the admin server (no token
// needed) or with a saved token.
export const useCanPublish = () => useSyncExternalStore(subscribeToken, () => isServerMode() || getToken() !== '', () => false)

export function forgetTokenHere() {
  forgetToken()
  window.dispatchEvent(new Event(TOKEN_EVENT))
}

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500'

export function TokenSetup() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const connect = async (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setError('')
    const previous = getToken()
    saveToken(value)
    try {
      await checkAccess()
      window.dispatchEvent(new Event(TOKEN_EVENT))
    } catch (err) {
      if (previous) saveToken(previous)
      else forgetToken()
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setChecking(false)
    }
  }

  return (
    <section className="p-6 rounded-2xl border border-zinc-800 bg-[#0B1120] space-y-4 max-w-3xl">
      <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-gold-500" /> One-time setup on this device
      </h2>
      <p className="text-sm text-zinc-300 leading-relaxed">
        The site has no server, so posts and page edits are published by saving them to your GitHub repository. This page needs a
        GitHub token that can do only that. It is stored in this browser only and sent only to GitHub.
      </p>
      <ol className="list-decimal pl-5 space-y-1.5 text-sm text-zinc-300">
        <li>
          Open{' '}
          <a
            className="text-gold-500 underline"
            href="https://github.com/settings/personal-access-tokens/new"
            target="_blank"
            rel="noreferrer"
          >
            GitHub → New fine-grained token
          </a>
          .
        </li>
        <li>Name it “adamu.tech admin”. Pick an expiry (e.g. 1 year).</li>
        <li>
          <strong>Repository access:</strong> Only select repositories → <code>adab-tech/adab-tech.github.io</code>.
        </li>
        <li>
          <strong>Permissions:</strong> Contents → <em>Read and write</em>. Optional: Actions → <em>Read-only</em>, to
          see here when changes are live.
        </li>
        <li>Generate, copy the token, and paste it below.</li>
      </ol>
      <form onSubmit={connect} className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="github_pat_…"
          className={inputClass}
          aria-label="GitHub token"
          required
        />
        <button
          type="submit"
          disabled={checking || !value.trim()}
          className="px-4 py-2 rounded-lg bg-gold-500 text-zinc-950 font-mono text-sm font-bold hover:bg-gold-500 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {checking && <Loader2 className="h-4 w-4 animate-spin" />} Connect
        </button>
      </form>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </section>
  )
}

