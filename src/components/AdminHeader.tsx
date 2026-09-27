'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { GHOST_URL, ghostEnabled } from '@/config/blog'
import { ShieldCheck, LogOut, ExternalLink } from 'lucide-react'

export function AdminHeader() {
  const { logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login/')
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

        <nav className="flex flex-wrap items-center gap-2" aria-label="Admin">
          <a
            href="/admin/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Dashboard</span>
          </a>
          <a
            href={ghostEnabled() ? `${GHOST_URL.replace(/\/$/, '')}/ghost/#/editor/post` : '/admin/blog/'}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs font-mono text-amber-300 hover:text-white transition-colors"
          >
            <span>Write a post</span>
          </a>
          <a
            href="/admin/comments/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Comments</span>
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
          >
            <span>Preview Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-900/60 text-xs font-mono text-red-300 hover:bg-red-900 hover:text-white transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
