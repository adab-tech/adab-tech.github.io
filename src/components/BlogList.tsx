'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ghostEnabled } from '@/config/blog'
import { fetchGhostPosts, GhostPost } from '@/lib/ghost'

export type ListedPost = {
  title: string
  href: string
  external: boolean
  date: string
  dateLabel: string
  summary: string
  readingMinutes: number
  draft?: boolean
}

const dateLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

const fromGhost = (p: GhostPost): ListedPost => ({
  title: p.title,
  href: p.url,
  external: true,
  date: p.date,
  dateLabel: dateLabel(p.date),
  summary: p.summary,
  readingMinutes: p.readingMinutes,
})

// Posts built into the site (content/blog) render immediately, including
// without JavaScript; Ghost posts are fetched live and merged in by date.
export function BlogList({ initial }: { initial: ListedPost[] }) {
  const [ghost, setGhost] = useState<ListedPost[]>([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!ghostEnabled()) return
    const ctrl = new AbortController()
    fetchGhostPosts(ctrl.signal)
      .then((posts) => setGhost(posts.map(fromGhost)))
      .catch((err) => {
        if (err?.name !== 'AbortError') setFailed(true)
      })
    return () => ctrl.abort()
  }, [])

  const posts = [...ghost, ...initial].sort((a, b) => b.date.localeCompare(a.date))

  if (posts.length === 0) {
    return <p className="text-zinc-400">{failed ? 'Posts could not be loaded. Please try again later.' : 'No posts yet.'}</p>
  }

  return (
    <ol className="space-y-10">
      {posts.map((post) => {
        const LinkTag = ({ className, children, label }: { className: string; children: React.ReactNode; label?: string }) =>
          post.external ? (
            <a href={post.href} className={className} aria-label={label}>
              {children}
            </a>
          ) : (
            <Link href={post.href} className={className} aria-label={label}>
              {children}
            </Link>
          )
        return (
          <li key={post.href}>
            <article className="space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400">
                <time dateTime={post.date}>{post.dateLabel}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
                {post.draft && <span className="px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400">Draft</span>}
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-zinc-50 leading-snug">
                <LinkTag className="hover:text-amber-400 transition-colors">{post.title}</LinkTag>
              </h2>
              {post.summary && <p className="text-zinc-300 leading-relaxed">{post.summary}</p>}
              <LinkTag className="inline-block text-sm font-mono text-amber-400 hover:underline" label={`Read “${post.title}”`}>
                Read →
              </LinkTag>
            </article>
          </li>
        )
      })}
    </ol>
  )
}
