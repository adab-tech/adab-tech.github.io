'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { ShieldCheck, LogOut, ExternalLink } from 'lucide-react'

export function AdminHeader() {
  const { logout } = useAdminAuth()
  const router = useRouter()
  const [logoutError, setLogoutError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const handleLogout = async () => {
    setSigningOut(true)
    setLogoutError('')
    try {
      await logout()
      router.replace('/admin/login/')
    } catch {
      setLogoutError('Could not sign out. Try again.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="w-full border-b border-zinc-800 bg-midnight-950">
      <div className="max-w-6xl mx-auto px-4 min-h-14 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-gold-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm font-bold tracking-tight text-zinc-50">
            adamu<span className="text-gold-500">.tech</span><span className="hidden sm:inline"> Admin Studio</span>
          </span>
        </div>

        <nav aria-label="Admin" className="flex flex-wrap items-center gap-2">
          <a
            href="/admin/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Dashboard</span>
          </a>
          <a
            href="/admin/blog/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 text-xs font-mono text-gold-400 hover:text-white transition-colors"
          >
            <span>Write a post</span>
          </a>
          <a
            href="/admin/#visits"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Visits</span>
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>View site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-900/60 text-xs font-mono text-red-300 hover:bg-red-900 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </button>
        </nav>
      </div>
      {logoutError && <p role="alert" className="max-w-6xl mx-auto px-4 pb-3 text-sm text-red-300">{logoutError}</p>}
    </header>
  )
}
