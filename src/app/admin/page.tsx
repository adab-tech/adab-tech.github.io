'use client'

import React, { useState, useEffect } from 'react'
import { VisitorCounter } from '@/components/VisitorCounter'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/auth'
import { AdminHeader } from '@/components/AdminHeader'
import { SiteOverview } from '@/components/admin/SiteOverview'
import { GHOST_URL, ghostEnabled } from '@/config/blog'
import { Activity, AlertCircle, Check, Edit3, Key, Mail } from 'lucide-react'

// Admin front page. Everything shown here is real: the controls save to
// GitHub (the only way anything reaches the public site), the page views come
// from the site's public counter, and deploys come from GitHub Actions.
export default function AdminDashboardPage() {
  const { isAuthenticated, loading, changePassword } = useAdminAuth()
  const router = useRouter()
  const [newPass, setNewPass] = useState('')
  const [repeatPass, setRepeatPass] = useState('')
  const [savingPass, setSavingPass] = useState(false)
  const [passNotice, setPassNotice] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-950 text-zinc-400 font-mono text-xs">
        Verifying session…
      </div>
    )
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassNotice('')
    setSavingPass(true)
    try {
      await changePassword(newPass, repeatPass)
      setNewPass('')
      setRepeatPass('')
      setPassNotice('Saved. The new password works on every device in about a minute.')
    } catch (err) {
      setPassNotice(err instanceof Error ? err.message : String(err))
    } finally {
      setSavingPass(false)
    }
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
              Admin password
            </h3>
            <p className="text-xs font-sans text-zinc-400">
              Your own password, for every device. Only a hash of it is saved to the site, never the password. Saving uses your GitHub
              token. Forgot it? Use “First time here, or forgot your password?” on the sign-in page.
            </p>

            {passNotice && (
              <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-gold-400 text-xs font-mono flex items-center gap-2">
                <Check className="h-3.5 w-3.5" />
                <span>{passNotice}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="new-admin-pass" className="text-xs font-mono text-zinc-400">New password</label>
                <input
                  id="new-admin-pass"
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  autoComplete="new-password"
                  placeholder="At least 10 characters"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="new-admin-pass-2" className="text-xs font-mono text-zinc-400">Repeat new password</label>
                <input
                  id="new-admin-pass-2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={repeatPass}
                  onChange={(e) => setRepeatPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-midnight-950 font-mono text-xs text-zinc-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <button
                type="submit"
                disabled={savingPass}
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-mono text-xs text-zinc-100 font-bold transition-colors disabled:opacity-50"
              >
                {savingPass ? 'Saving…' : 'Save new password'}
              </button>
            </form>
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
