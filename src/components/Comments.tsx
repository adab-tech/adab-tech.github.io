'use client'

import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import { REPLY_EMAIL, ownCommentsEnabled } from '@/config/blog'
import { OwnComments } from '@/components/OwnComments'
import { listComments } from '@/lib/comments-api'

export function Comments({ title, slug }: { title: string; slug: string }) {
  const [mode, setMode] = useState<'checking' | 'own' | 'email'>(
    ownCommentsEnabled() ? 'checking' : 'email',
  )

  useEffect(() => {
    if (!ownCommentsEnabled()) return
    let cancelled = false
    listComments(slug)
      .then(() => !cancelled && setMode('own'))
      .catch(() => !cancelled && setMode('email'))
    return () => { cancelled = true }
  }, [slug])

  const mailto = `mailto:${REPLY_EMAIL}?subject=${encodeURIComponent(`Re: ${title}`)}`

  return (
    <section aria-labelledby="comments-heading" className="space-y-4 border-t border-zinc-800 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="comments-heading" className="font-serif-display text-2xl font-semibold text-zinc-50">
          {mode === 'own' ? 'Comments' : 'Responses'}
        </h2>
        <a
          href={mailto}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-700 px-4 text-sm text-zinc-200 hover:border-gold-500/60 hover:text-gold-500"
        >
          <Mail className="h-4 w-4" /> Reply by email
        </a>
      </div>
      {mode === 'checking' && <p role="status" className="text-sm text-zinc-400">Loading comments…</p>}
      {mode === 'own' && <OwnComments slug={slug} />}
    </section>
  )
}
