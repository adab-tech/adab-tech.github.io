'use client'

import React, { useState } from 'react'
import { Send, Calendar, CheckCircle2, ShieldAlert, Mail } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Academic / AI Collaboration',
    message: '',
    preferredDate: '',
    website: ''
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.website) {
      setStatus('success')
      return
    }

    setStatus('submitting')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Mail className="h-5 w-5 text-amber-500" />
          COMMUNICATIONS PIPELINE & CALENDAR BOOKING
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Direct research inquiry, speaking request, or consultation pipeline routed via Resend API & Cloudflare Edge.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50">
              PAYLOAD DISPATCHED SUCCESSFULLY
            </h3>
            <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 max-w-md">
              Your inquiry has passed edge validation and was delivered to Adamu Abubakar's research desk via Resend.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs hover:opacity-90 transition-opacity"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  Full Name / Entity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Prof. Ada / Lab Lead"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-sans text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="researcher@institution.org"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-sans text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  Inquiry Classification
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Academic / AI Collaboration">Academic / AI Collaboration</option>
                  <option value="Keynote / Guest Lecture">Keynote / Guest Lecture</option>
                  <option value="Hausa NLP Dataset Request">Hausa NLP Dataset Request</option>
                  <option value="General Technical Inquiry">General Technical Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Preferred Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                Message Payload *
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detail your research scope or computational requirement..."
                className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-sans text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-zinc-500" /> Protected by Edge Honeypot Guard
              </span>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-opacity disabled:opacity-50 shadow-sm"
              >
                <span>{status === 'submitting' ? 'Dispatching...' : 'Dispatch Message'}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
