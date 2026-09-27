'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { ArrowRight, ExternalLink, KeyRound, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'

// A fine-grained token for this one repository. GitHub pre-fills the form
// from these parameters where it supports them; the steps below say what to
// pick either way.
const NEW_TOKEN_URL =
  'https://github.com/settings/personal-access-tokens/new?name=adamu.tech%20admin&description=Publishing%20from%20adamu.tech%2Fadmin&target_name=adab-tech&expires_in=366&contents=write&actions=read'

export default function AdminLoginPage() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { login, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !checking) router.replace('/admin/')
  }, [isAuthenticated, checking, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setChecking(true)
    try {
      await login(token.trim())
      // Offer to save it in the browser's password manager (Chrome, Edge),
      // so other devices signed in to the same browser can fill it in.
      const w = window as unknown as { PasswordCredential?: new (d: { id: string; password: string; name?: string }) => Credential }
      if (w.PasswordCredential) {
        await navigator.credentials
          .store(new w.PasswordCredential({ id: 'adab-tech', password: token.trim(), name: 'adamu.tech admin (GitHub token)' }))
          .catch(() => {})
      }
      router.replace('/admin/')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1120] text-zinc-50 font-sans">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-midnight-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-mono font-bold tracking-tight">adamu.tech admin</h1>
          <p className="text-sm text-zinc-400">Sign in with your GitHub token. It is the key that publishes to the site, so it is the only sign-in.</p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-sm flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          {/* A username lets password managers save and fill the token. */}
          <div className="space-y-1.5">
            <label htmlFor="gh-user" className="text-xs font-mono font-bold text-zinc-300">
              GitHub account
            </label>
            <input
              id="gh-user"
              name="username"
              type="text"
              autoComplete="username"
              value="adab-tech"
              readOnly
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-sm text-zinc-400"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="gh-token" className="text-xs font-mono font-bold text-zinc-300">
              GitHub token
            </label>
            <div className="relative">
              <input
                id="gh-token"
                name="password"
                type="password"
                autoComplete="current-password"
                spellCheck={false}
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="github_pat_…"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <KeyRound className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={checking || !token.trim()}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{checking ? 'Checking with GitHub…' : 'Sign in'}</span>
            {!checking && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="text-xs text-zinc-400 leading-relaxed">
            You stay signed in on this browser until you sign out or the token expires. When your browser offers to save the password,
            accept: next time (and on your other devices using the same browser account) it fills in by itself.
          </p>
        </form>

        <div className="space-y-2 text-sm">
          <button type="button" onClick={() => setShowHelp((v) => !v)} aria-expanded={showHelp} className="text-amber-400 hover:underline font-mono text-xs">
            {showHelp ? 'Hide' : 'No token, or it expired?'}
          </button>
          {showHelp && (
            <ol className="list-decimal pl-5 space-y-1.5 text-zinc-300">
              <li>
                Open{' '}
                <a className="text-amber-400 underline inline-flex items-center gap-1" href={NEW_TOKEN_URL} target="_blank" rel="noreferrer">
                  GitHub → new fine-grained token <ExternalLink className="h-3 w-3" />
                </a>
                .
              </li>
              <li>Expiration: up to a year.</li>
              <li>
                Repository access: <strong>Only select repositories</strong> → <code>adab-tech.github.io</code>.
              </li>
              <li>
                Permissions: <strong>Contents: Read and write</strong> and <strong>Actions: Read-only</strong>.
              </li>
              <li>Generate, copy it and paste it above.</li>
            </ol>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-amber-500 transition-colors">
            ← Back to the site
          </Link>
        </div>
      </div>
    </div>
  )
}
