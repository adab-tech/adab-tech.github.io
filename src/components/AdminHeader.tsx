'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { ShieldCheck, LogOut, ExternalLink } from 'lucide-react'

export function AdminHeader() {
  const { logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-midnight-950/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-gold-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="font-mono text-sm font-bold tracking-tight text-zinc-50">
            ADAMU-TECH ADMIN SUITE
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            AUTHENTICATED
          </span>
        </div>

        <nav className="flex items-center space-x-3">
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
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
