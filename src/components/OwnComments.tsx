'use client'

import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { listComments, postComment, type PublicComment } from '@/lib/comments-api'

const NAME_KEY = 'adamu_tech_comment_name'

const when = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// Comment list and form backed by the site's own comment service
// (comments-worker/). No account needed; comments show after approval.
export function OwnComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<PublicComment[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // honeypot: people never see or fill it
  const [openedAt, setOpenedAt] = useState(0)
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string }>({ kind: 'idle' })

  useEffect(() => {
    let cancelled = false
    listComments(slug)
      .then((c) => !cancelled && setComments(c))
      .catch((e) => !cancelled && setLoadError(e.message))
    return () => {
      cancelled = true
    }
  }, [slug])

  // Remember the commenter's name on this device, and when the form was opened.
  useEffect(() => {
    const t = setTimeout(() => {
      setOpenedAt(Date.now())
      try {
        setName(localStorage.getItem(NAME_KEY) || '')
      } catch {}
    }, 0)
    return () => clearTimeout(t)
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({ kind: 'sending' })
    try {
      await postComment({ post: slug, name: name.trim(), body: body.trim(), website, t: openedAt })
      try {
        localStorage.setItem(NAME_KEY, name.trim())
      } catch {}
      setBody('')
      setState({ kind: 'sent', text: 'Thank you. Your comment will appear here once it has been approved.' })
    } catch (err) {
      setState({ kind: 'error', text: err instanceof Error ? err.message : String(err) })
    }
  }

  const field =
    'w-full px-3 py-2 rounded-lg bg-[#0E1526] border border-zinc-700 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-gold-500'

  return (
    <div className="space-y-6">
      {comments === null && !loadError && <p className="text-sm text-zinc-400">Loading comments…</p>}
      {loadError && <p className="text-sm text-zinc-400">Comments could not be loaded right now.</p>}
      {comments && comments.length > 0 && (
        <ol className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`p-4 rounded-xl border ${c.is_author ? 'border-gold-500/40 bg-gold-500/5' : 'border-zinc-800 bg-[#0E1526]'}`}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-semibold text-zinc-100">{c.name}</span>
                {c.is_author === 1 && (
                  <span className="px-1.5 py-0.5 rounded text-xs lg:text-[11px] font-mono border border-gold-500/40 text-gold-400">Author</span>
                )}
                <span className="text-zinc-500" aria-hidden="true">·</span>
                <time dateTime={c.created_at} className="text-zinc-400">
                  {when(c.created_at)}
                </time>
              </div>
              <p className="mt-2 text-zinc-200 leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]" dir="auto">
                {c.body}
              </p>
            </li>
          ))}
        </ol>
      )}
      {comments && comments.length === 0 && <p className="text-sm text-zinc-400">No comments yet. Be the first to share a thought.</p>}

      <form onSubmit={submit} className="space-y-3 p-4 rounded-xl border border-zinc-800 bg-[#0B1120]">
        <h3 className="text-base font-semibold text-zinc-100">Leave a comment</h3>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Name</span>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoComplete="name" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-zinc-300">Comment</span>
          <textarea
            className={`${field} min-h-[8rem] leading-relaxed`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={3000}
            required
            dir="auto"
          />
        </label>
        {/* Honeypot for spam bots; hidden from people and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gold-500 text-zinc-950 text-sm font-bold hover:bg-gold-500 disabled:opacity-60"
          >
            {state.kind === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
            Post comment
          </button>
          <span className="text-xs text-zinc-400">No account needed. Comments appear after approval.</span>
        </div>
        {(state.kind === 'sent' || state.kind === 'error') && (
          <p role="status" className={`text-sm ${state.kind === 'sent' ? 'text-emerald-300' : 'text-red-300'}`}>
            {state.text}
          </p>
        )}
      </form>
    </div>
  )
}
