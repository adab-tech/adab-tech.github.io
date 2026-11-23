import type { Metadata } from 'next'
import { Rss } from 'lucide-react'
import { GlobalShell } from '@/components/GlobalShell'
import { BlogList } from '@/components/BlogList'
import { getAllPosts, formatDate } from '@/lib/blog'
import { BLOG_INDEX } from '@/lib/blog-index-content'

export const metadata: Metadata = {
  title: BLOG_INDEX.metadataTitle,
  description: BLOG_INDEX.metadataDescription,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/feed.xml' } },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <GlobalShell>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        <header className="space-y-3 border-b border-zinc-800 pb-8">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-zinc-50 tracking-tight">{BLOG_INDEX.heading}</h1>
          <p className="text-base text-zinc-300 leading-relaxed max-w-2xl">
            {BLOG_INDEX.intro}
          </p>
          <a href="/feed.xml" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-gold-500">
            <Rss className="h-3.5 w-3.5" />
            <span>{BLOG_INDEX.feedLabel}</span>
          </a>
        </header>

        <BlogList
          initial={posts.map((p) => ({
            title: p.title,
            href: `/blog/${p.slug}/`,
            external: false,
            date: p.date,
            dateLabel: formatDate(p.date),
            summary: p.summary,
            readingMinutes: p.readingMinutes,
            draft: p.draft,
          }))}
        />
      </div>
    </GlobalShell>
  )
}
