'use client'

import React, { useEffect } from 'react'
import { VisitorCounter } from '@/components/VisitorCounter'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { AdminHeader } from '@/components/AdminHeader'
import { SiteOverview } from '@/components/admin/SiteOverview'
import { GHOST_URL, ghostEnabled } from '@/config/blog'
import { Activity, AlertCircle, Edit3, Key, Mail } from 'lucide-react'

// Admin front page. Everything shown here is real: the controls save to
// GitHub (the only way anything reaches the public site), the page views come
// from the site's public counter, and deploys come from GitHub Actions.
export default function AdminDashboardPage() {
  const { isAuthenticated, loading, logout } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login/')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">
        Verifying session…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100 flex flex-col font-sans">
      <AdminHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-10">
        {ghostEnabled() && (
          <a
            href={`${GHOST_URL.replace(/\/$/, '')}/ghost/#/editor/post`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              <Edit3 className="h-5 w-5" />
              <span>Write a blog post in Ghost →</span>
            </div>
          </a>
        )}

        <SiteOverview />

        <section className="space-y-3">
          <h2 className="text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-500" />
            Visitors
          </h2>
          <VisitorCounter showDetails={true} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-midnight-900 space-y-4">
            <h3 className="text-base font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Key className="h-4 w-4 text-gold-400" />
              Sign-in on this device
            </h3>
            <p className="text-xs font-sans text-zinc-400 leading-relaxed">
              You are signed in with your GitHub token, saved in this browser only. Other browsers, other devices and private windows
              ask for it once. Signing out removes it from this browser; to cut off every device at once, revoke the token on GitHub.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  logout()
                  router.push('/admin/login/')
                }}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-mono text-xs text-zinc-100 font-bold transition-colors"
              >
                Sign out on this device
              </button>
              <a
                href="https://github.com/settings/personal-access-tokens"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg border border-zinc-700 font-mono text-xs text-zinc-300 hover:text-white"
              >
                Manage tokens on GitHub
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-midnight-900 space-y-4">
            <h3 className="text-base font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              Email
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Visitors reach you at contact@adamu.tech (the site’s buttons, the CV and “Reply by email” under posts all use it).
              MX for adamu.tech points to AWS SES inbound; confirm the SES receipt rule forwards mail before relying on it.
            </p>
            <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-400">Inbound routing</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> AWS SES, unverified
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
