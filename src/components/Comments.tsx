'use client'

import React, { useEffect, useRef } from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import { GISCUS, REPLY_EMAIL, commentsEnabled, ownCommentsEnabled } from '@/config/blog'
import { OwnComments } from '@/components/OwnComments'

// Public comments plus a private "reply by email" link that works for
// everyone. The site's own comment service (no account needed) is used when
// configured; otherwise giscus (GitHub sign-in).
export function Comments({ title, slug }: { title: string; slug: string }) {
  const box = useRef<HTMLDivElement>(null)
  const own = ownCommentsEnabled()
  const enabled = own || commentsEnabled()
  const useGiscus = !own && commentsEnabled()

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
      {own ? (
        <OwnComments slug={slug} />
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
