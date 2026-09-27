'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import { GISCUS, HCB, REPLY_EMAIL, commentsEnabled, hcbEnabled, ownCommentsEnabled } from '@/config/blog'
import { OwnComments } from '@/components/OwnComments'
import { listComments } from '@/lib/comments-api'

// Public comments plus a private "reply by email" link that works for
// everyone. The site's own comment service (no account needed) is used when
// configured; otherwise giscus (GitHub sign-in).
export function Comments({ title, slug }: { title: string; slug: string }) {
  const box = useRef<HTMLDivElement>(null)
  // 'checking' until we know whether the own comment service answers.
  const [mode, setMode] = useState<'checking' | 'own' | 'hcb' | 'giscus' | 'none'>(
    ownCommentsEnabled() ? 'checking' : hcbEnabled() ? 'hcb' : commentsEnabled() ? 'giscus' : 'none',
  )
  const own = mode === 'own'
  const useGiscus = mode === 'giscus'
  const enabled = mode !== 'none'

  useEffect(() => {
    if (mode !== 'checking') return
    let cancelled = false
    listComments(slug)
      .then(() => !cancelled && setMode('own'))
      .catch(() => !cancelled && setMode(hcbEnabled() ? 'hcb' : commentsEnabled() ? 'giscus' : 'none'))
    return () => {
      cancelled = true
    }
  }, [mode, slug])

  useEffect(() => {
    const el = box.current
    if (!useGiscus || !el) return
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    const attrs: Record<string, string> = {
      'data-repo': GISCUS.repo,
      'data-repo-id': GISCUS.repoId,
      'data-category': GISCUS.category,
      'data-category-id': GISCUS.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': 'transparent_dark',
      'data-lang': 'en',
      'data-loading': 'lazy',
    }
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v))
    el.appendChild(script)
    return () => {
      el.innerHTML = ''
    }
  }, [useGiscus])

  // HTML Comment Box: its script fills #HCB_comment_box. PAGE pins each post
  // to its canonical URL so its thread is the same however it was reached.
  useEffect(() => {
    if (mode !== 'hcb') return
    const page = `https://adamu.tech/blog/${slug}/`
    const w = window as unknown as { hcb_user?: Record<string, string> }
    w.hcb_user = {
      PAGE: page,
      comments_header: '',
      name_label: 'Name',
      content_label: 'Share your thoughts',
      submit: 'Post comment',
      no_comments_msg: 'No comments yet. Be the first to share a thought.',
    }
    const script = document.createElement('script')
    script.src =
      `https://www.htmlcommentbox.com/jread?page=${encodeURIComponent(page).replace('+', '%2B')}` +
      `&mod=${HCB.mod}&opts=${HCB.opts}&num=10&ts=${Date.now()}`
    script.async = true
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [mode, slug])

  const mailto = `mailto:${REPLY_EMAIL}?subject=${encodeURIComponent(`Re: ${title}`)}`

  return (
    <section aria-labelledby="comments-heading" className="space-y-4 border-t border-zinc-800 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="comments-heading" className="font-serif-display text-2xl font-semibold text-zinc-50 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-amber-400" />
          {enabled ? 'Comments' : 'Responses'}
        </h2>
        <a
          href={mailto}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-zinc-700 text-sm text-zinc-200 hover:text-amber-400 hover:border-amber-500/60"
        >
          <Mail className="h-4 w-4" />
          Reply by email
        </a>
      </div>
      {mode === 'checking' ? (
        <p className="text-sm text-zinc-400">Loading comments…</p>
      ) : own ? (
        <OwnComments slug={slug} />
      ) : mode === 'hcb' ? (
        <>
          <p className="text-sm text-zinc-400">No account needed: add your name and comment.</p>
          <div id="HCB_comment_box" className="hcb-dark min-h-[8rem]">
            Loading comments…
          </div>
        </>
      ) : useGiscus ? (
        <>
          <p className="text-sm text-zinc-400">
            Comment below with a GitHub account, or reply privately by email.
          </p>
          <div ref={box} className="giscus min-h-[8rem]" />
        </>
      ) : (
        <p className="text-sm text-zinc-400">Thoughts on this post? Reply by email.</p>
      )}
    </section>
  )
}
