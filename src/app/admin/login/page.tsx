'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { ShieldCheck, Lock, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { login, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/admin')
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return
    setError('')
    setBusy(true)
    try {
      if ((await login(password)) === 'ok') {
        router.push('/admin')
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0B1120] text-zinc-50 font-sans">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-midnight-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-mono font-bold tracking-tight">adamu.tech admin</h1>
          <p className="text-sm text-zinc-400">Sign in with your admin password.</p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-sm flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="username" autoComplete="username" value="admin@adamu.tech" readOnly hidden />
          <div className="space-y-1.5">
            <label htmlFor="admin-pass" className="text-xs font-mono font-bold text-zinc-300">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
              />
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
        </form>

        <div className="text-sm">
          <button type="button" onClick={() => setShowHelp((v) => !v)} aria-expanded={showHelp} className="text-xs font-mono text-amber-400 hover:underline">
            Forgot your password?
          </button>
          {showHelp && (
            <p className="mt-2 text-zinc-300 leading-relaxed">
              On GitHub, delete the file <code>public/admin-auth.json</code> in the adab-tech.github.io repository. About a minute later the
              default password works again; sign in and set a new one under <strong>Admin password</strong>.
            </p>
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
