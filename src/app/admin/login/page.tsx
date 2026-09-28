'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { MIN_PASSWORD } from '@/lib/admin-password'
import { ShieldCheck, Lock, ArrowRight, ShieldAlert, Loader2, KeyRound } from 'lucide-react'

const field =
  'w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-sm text-zinc-100 focus:outline-none focus:border-amber-500'

export default function AdminLoginPage() {
  const [mode, setMode] = useState<'signin' | 'setup'>('signin')
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const { login, setupWithToken, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/admin')
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (locked) return
    setBusy(true)
    try {
      const result = await login(password)
      if (result === 'ok') {
        router.push('/admin')
        return
      }
      if (result === 'not-set') {
        setMode('setup')
        setError('No admin password has been set yet. Set yours below (one time).')
        return
      }
      const next = attempts + 1
      setAttempts(next)
      if (next >= 5) {
        setLocked(true)
        setError('Too many attempts. Locked for 60 seconds.')
        setTimeout(() => {
          setLocked(false)
          setAttempts(0)
          setError('')
        }, 60_000)
      } else {
        setError('Wrong password.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await setupWithToken(token.trim(), password, repeat)
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
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
          <p className="text-sm text-zinc-400">
            {mode === 'signin' ? 'Sign in with your admin password.' : 'Set your admin password. Your GitHub token proves it’s you.'}
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-sm flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'signin' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" name="username" autoComplete="username" value="admin@adamu.tech" readOnly hidden />
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-xs font-mono font-bold text-zinc-300">
                Password
              </label>
              <div className="relative">
                <input id="admin-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy || locked}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{busy ? 'Checking…' : 'Sign in'}</span>
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => { setMode('setup'); setError('') }} className="w-full text-xs font-mono text-amber-400 hover:underline">
              First time here, or forgot your password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetup} className="space-y-4">
            <input type="text" name="username" autoComplete="username" value="admin@adamu.tech" readOnly hidden />
            <div className="space-y-1.5">
              <label htmlFor="gh-token" className="text-xs font-mono font-bold text-zinc-300">
                GitHub token
              </label>
              <div className="relative">
                <input id="gh-token" type="password" autoComplete="off" spellCheck={false} required value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_…" className={field} />
                <KeyRound className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              </div>
              <p className="text-xs text-zinc-400">
                The one you use to publish (Contents: Read and write on adab-tech.github.io). Create one at{' '}
                <a className="text-amber-400 underline" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">
                  GitHub → new fine-grained token
                </a>
                .
              </p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="new-pass" className="text-xs font-mono font-bold text-zinc-300">
                New admin password (at least {MIN_PASSWORD} characters)
              </label>
              <div className="relative">
                <input id="new-pass" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="new-pass-2" className="text-xs font-mono font-bold text-zinc-300">
                Repeat the password
              </label>
              <div className="relative">
                <input id="new-pass-2" type="password" autoComplete="new-password" required value={repeat} onChange={(e) => setRepeat(e.target.value)} className={field} />
                <Lock className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-sm font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{busy ? 'Saving…' : 'Set password and sign in'}</span>
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Only a scrambled fingerprint (hash) of the password is saved to the site, never the password. It works on every device about a
              minute after you set it.
            </p>
            <button type="button" onClick={() => { setMode('signin'); setError('') }} className="w-full text-xs font-mono text-zinc-400 hover:text-amber-400">
              ← Back to sign in
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-zinc-800 text-center">
          <Link href="/" className="text-xs font-mono text-zinc-400 hover:text-amber-500 transition-colors">
            ← Back to the site
          </Link>
        </div>
      </div>
    </div>
  )
}
