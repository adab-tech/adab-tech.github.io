'use client'

import { GHOST_URL, GHOST_CONTENT_API_KEY } from '@/config/blog'

export type GhostPost = {
  title: string
  url: string
  date: string // YYYY-MM-DD
  summary: string
  readingMinutes: number
}

type ApiPost = {
  title: string
  url: string
  published_at: string
  custom_excerpt: string | null
  excerpt: string | null
  reading_time?: number
}

// Published posts from the Ghost Content API, newest first. Read in the
// visitor's browser, so a post appears on adamu.tech/blog the moment it is
// published in Ghost, without rebuilding this site.
export async function fetchGhostPosts(signal?: AbortSignal): Promise<GhostPost[]> {
  const url =
    `${GHOST_URL.replace(/\/$/, '')}/ghost/api/content/posts/` +
    `?key=${encodeURIComponent(GHOST_CONTENT_API_KEY)}&limit=all&order=published_at%20desc` +
    `&fields=title,url,published_at,custom_excerpt,excerpt,reading_time`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Ghost ${res.status}`)
  const { posts } = (await res.json()) as { posts: ApiPost[] }
  return posts.map((p) => {
    const text = (p.custom_excerpt || p.excerpt || '').replace(/\s+/g, ' ').trim()
    return {
      title: p.title,
      url: p.url,
      date: p.published_at.slice(0, 10),
      summary: text.length > 220 ? text.slice(0, 217).trimEnd() + '…' : text,
      readingMinutes: Math.max(1, p.reading_time ?? 1),
    }
  })
}
