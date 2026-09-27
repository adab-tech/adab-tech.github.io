import type { Metadata } from 'next'
import Link from 'next/link'
import { Rss } from 'lucide-react'
import { GlobalShell } from '@/components/GlobalShell'
import { getAllPosts, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Posts and reflections by Adamu Danjuma Abubakar on language, research, African-language technology, and writing.',
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/feed.xml' } },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <GlobalShell>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        <header className="space-y-3 border-b border-zinc-800 pb-8">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-zinc-50 tracking-tight">Blog</h1>
          <p className="text-base text-zinc-300 leading-relaxed max-w-2xl">
            Posts and reflections on language, research, building technology for African languages, and writing.
          </p>
          <a href="/feed.xml" className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400">
            <Rss className="h-3.5 w-3.5" />
            <span>RSS feed</span>
          </a>
        </header>

        {posts.length === 0 ? (
          <p className="text-zinc-400">No posts yet.</p>
        ) : (
          <ol className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="group space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readingMinutes} min read</span>
                    {post.draft && (
                      <span className="px-1.5 py-0.5 rounded border border-amber-500/40 text-amber-400">Draft</span>
                    )}
                  </div>
                  <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-zinc-50 leading-snug">
                    <Link href={`/blog/${post.slug}/`} className="hover:text-amber-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  {post.summary && <p className="text-zinc-300 leading-relaxed">{post.summary}</p>}
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="inline-block text-sm font-mono text-amber-400 hover:underline"
                    aria-label={`Read “${post.title}”`}
                  >
                    Read →
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </GlobalShell>
  )
}
