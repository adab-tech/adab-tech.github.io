'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/AdminHeader'
import { SiteOverview } from '@/components/admin/SiteOverview'
import { VisitAnalytics } from '@/components/admin/VisitAnalytics'
import { useAdminAuth } from '@/lib/auth'

function DevicePasswordForm({ changePassword }: {
  changePassword: (password: string, repeat: string, current: string) => Promise<unknown>
}) {
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setStatus('')
    try {
      await changePassword(String(data.get('password')), String(data.get('repeat')), String(data.get('current')))
      form.reset()
      setStatus('Password updated for this browser.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to change the password.')
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-3">
      <p className="text-sm text-zinc-400">This password applies to this browser.</p>
      <fieldset disabled={pending} className="space-y-3">
        {[
          { name: 'current', label: 'Current password', autocomplete: 'current-password' },
          { name: 'password', label: 'New password', autocomplete: 'new-password', minLength: 10 },
          { name: 'repeat', label: 'Confirm new password', autocomplete: 'new-password', minLength: 10 },
        ].map(({ name, label, autocomplete, minLength }) => (
          <label key={name} className="block space-y-1 text-sm">
            <span>{label}</span>
            <input
              name={name}
              type="password"
              autoComplete={autocomplete}
              minLength={minLength}
              required
              className="w-full rounded-lg border border-zinc-700 bg-midnight-900 px-3 py-2"
            />
          </label>
        ))}
        <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm disabled:opacity-50">
          {pending ? 'Saving…' : 'Change password'}
        </button>
      </fieldset>
      {status && <p role="status" className="text-sm text-zinc-300">{status}</p>}
    </form>
  )
}

export default function AdminDashboardPage() {
  const { isAuthenticated, loading, serverMode, changePassword } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/admin/login/')
  }, [isAuthenticated, loading, router])

  if (loading || !isAuthenticated) {
    return (
      <div role="status" className="grid min-h-screen place-items-center bg-midnight-950 text-sm text-zinc-400">
        Checking your session…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-zinc-100">
      <AdminHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
        <h1 className="text-2xl font-mono font-bold">Site dashboard</h1>
        <SiteOverview />

        <section id="visits" aria-labelledby="visits-heading" className="scroll-mt-4 space-y-3">
          <h2 id="visits-heading" className="text-lg font-mono font-bold">Visits</h2>
          <VisitAnalytics />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-mono font-bold">Account security</h2>
          {serverMode ? (
            <p className="text-sm text-zinc-400">
              Change your admin password by updating the Worker’s password secret in Cloudflare.
            </p>
          ) : (
            <DevicePasswordForm changePassword={changePassword} />
          )}
        </section>
      </main>
    </div>
  )
}
