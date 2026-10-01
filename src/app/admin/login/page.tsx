'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { getToken } from '@/lib/github-publish'
import { ShieldCheck, Lock, ArrowRight, ShieldAlert } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [setup, setSetup] = useState(false)
  const [token, setToken] = useState('')
  const [repeat, setRepeat] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, setupPassword, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const now = Date.now()
    if (lockedUntil && now < lockedUntil) {
      const remainingSec = Math.ceil((lockedUntil - now) / 1000)
      setError(`Security Lockout active. Please wait ${remainingSec}s before retrying.`)
      return
    }

    let success = false
    try {
      const result = await login(password)
      if (result === 'setup') {
        setSetup(true)
        setToken(getToken())
        setRepeat('')
        return
      }
      success = result === 'ok'
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      return
    }
    if (success) {
      setAttempts(0)
      setLockedUntil(null)
      router.push('/admin')
    } else {
      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)

      if (nextAttempts >= 5) {
        const lockoutTime = Date.now() + 60 * 1000 // 60s lockout
        setLockedUntil(lockoutTime)
        setError('Maximum attempts reached. Locked for 60 seconds.')
      } else {
        setError(`Invalid master password. ${5 - nextAttempts} attempts remaining.`)
      }
    }
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await setupPassword(token, password, repeat)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const field =
    'w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-gold-500'

  if (setup) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F6F1] dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 font-sans">
        <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-xl space-y-5">
          <div className="space-y-2">
            <h1 className="text-xl font-mono font-bold tracking-tight">Set your admin password</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              No admin password has been set yet. Prove you own the site with a GitHub token that can publish to
              adab-tech.github.io, then choose a password of at least 10 characters. It will work on every device.
            </p>
          </div>
          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSetup} className="space-y-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">GitHub token</span>
              <input type="password" required autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" className={field} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">New password</span>
              <input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">Repeat password</span>
              <input type="password" required minLength={10} autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} className={field} />
            </label>
            <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold shadow-sm disabled:opacity-50">
              <span>{busy ? 'Saving…' : 'Set password and sign in'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F6F1] dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 font-sans">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-gold-500/10 text-gold-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-mono font-bold tracking-tight">Admin Studio Authentication</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Enter the master studio passphrase to manage research posts and inquiry dispatches.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
              Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter passphrase..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-gold-500"
              />
              <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={lockedUntil !== null && Date.now() < lockedUntil}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-500 transition-colors shadow-sm disabled:opacity-50"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <a
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-gold-500 transition-colors"
          >
            ← Return to Public Dossier
          </a>
        </div>
      </div>
    </div>
  )
}
