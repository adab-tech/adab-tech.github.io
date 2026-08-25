'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const success = login(password)
    if (success) {
      router.push('/admin')
    } else {
      setError('Invalid admin password. Access denied.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-midnight-950 text-zinc-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-gold-400 mb-2">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-mono font-bold tracking-tight text-zinc-50">
            ADAMU-TECH ADMIN SUITE
          </h1>
          <p className="text-xs font-sans text-zinc-400">
            Authorized research publishing portal & content management gate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-zinc-800 bg-midnight-900 shadow-2xl space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-zinc-500" /> Secret Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 shadow-md"
          >
            <span>Authenticate & Access Studio</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-[10px] font-mono text-center text-zinc-500 pt-2">
            Protected Session Cookie • Encrypted Verification
          </p>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Return to Public Site
          </a>
        </div>
      </div>
    </div>
  )
}
