'use client'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { MIN_PASSWORD } from '@/lib/admin-password'
import { ShieldCheck, ArrowRight } from 'lucide-react'

const field =
  'w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-gold-500'
const submit =
  'w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold-500 text-zinc-950 text-sm font-semibold shadow-sm disabled:opacity-50'
const MAX_ATTEMPTS = 5

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [repeat, setRepeat] = useState('')
  const [resetPassword, setResetPassword] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const { login, setupPassword, isAuthenticated, loading, connectionError, needsSetup, serverMode } = useAdminAuth(true)
  const showSetup = needsSetup || resetPassword
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.replace('/admin/')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (lockedUntil === null) return
    const timer = window.setTimeout(() => {
      setAttempts(0)
      setLockedUntil(null)
      setError('')
    }, Math.max(0, lockedUntil - Date.now()))
    return () => window.clearTimeout(timer)
  }, [lockedUntil])

  const signIn = async (event: FormEvent) => {
    event.preventDefault()
    if (busy || lockedUntil !== null) return
    setError('')
    setBusy(true)
    try {
      const result = await login(password)
      if (result === 'setup') {
        setPassword('')
        return
      }
      if (result === 'wrong') {
        const failed = attempts + 1
        setAttempts(failed)
        if (failed >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + 60_000)
          setError('Too many attempts. Try again in one minute.')
        } else {
          setError('Incorrect password. Try again.')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
    } finally {
      setBusy(false)
    }
  }

  const setUp = async (event: FormEvent) => {
    event.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      await setupPassword(token, password, repeat)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set up this browser.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#F8F6F1] dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 font-sans">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-xl space-y-5">
        <div className="space-y-2">
          <ShieldCheck className="h-8 w-8 text-gold-500" aria-hidden="true" />
          <h1 className="text-xl font-mono font-bold tracking-tight">{showSetup ? 'Set up this browser' : 'Site admin sign-in'}</h1>
          {loading || isAuthenticated ? (
            <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">Checking your session…</p>
          ) : connectionError ? null : showSetup ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Connect GitHub to publish from this browser, then choose a password for this device.</p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {serverMode ? 'Enter your site admin password.' : 'Enter the admin password you set up for this site.'}
            </p>
          )}
        </div>

        {(error || connectionError) && (
          <p role="alert" className="p-3 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm">
            {error || connectionError}
          </p>
        )}

        {connectionError && (
          <button type="button" onClick={() => window.location.reload()} className={submit}>Try again</button>
        )}

        {!loading && !isAuthenticated && !connectionError && (showSetup ? (
          <form onSubmit={setUp} className="space-y-3">
            <p id="token-help" className="text-sm text-zinc-500 dark:text-zinc-400">
              <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer" className="underline">
                Create a fine-grained GitHub token
              </a>
              {' '}for <code>adab-tech/adab-tech.github.io</code> with Contents read and write. The token stays in this browser and is sent to GitHub when you publish.
            </p>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">GitHub token</span>
              <input type="password" required autoComplete="off" spellCheck={false} aria-describedby="token-help" value={token} onChange={(event) => setToken(event.target.value)} className={field} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">New password</span>
              <input type="password" required minLength={MIN_PASSWORD} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={field} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">Repeat password</span>
              <input type="password" required minLength={MIN_PASSWORD} autoComplete="new-password" value={repeat} onChange={(event) => setRepeat(event.target.value)} className={field} />
            </label>
            <button type="submit" disabled={busy} className={submit}>
              {busy ? 'Connecting…' : 'Connect and sign in'}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {resetPassword && <button type="button" disabled={busy} onClick={() => {
              setResetPassword(false)
              setPassword('')
              setRepeat('')
              setToken('')
              setError('')
            }} className="text-sm text-zinc-500 underline dark:text-zinc-400">Back to sign-in</button>}
          </form>
        ) : (
          <form onSubmit={signIn} className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold">Password</span>
              <input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className={field} />
            </label>
            <button type="submit" disabled={busy || lockedUntil !== null} className={submit}>
              {busy ? 'Signing in…' : 'Sign in'}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {!serverMode && <button type="button" disabled={busy} onClick={() => {
              setResetPassword(true)
              setPassword('')
              setError('')
            }} className="text-sm text-zinc-500 underline dark:text-zinc-400">Reset this browser’s password</button>}
          </form>
        ))}

        <a href="/" className="inline-block text-sm text-zinc-500 underline dark:text-zinc-400">Back to site</a>
      </div>
    </main>
  )
}
