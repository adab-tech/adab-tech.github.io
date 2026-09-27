import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { GlobalShell } from '@/components/GlobalShell'
import { ShareButtons } from '@/components/ShareButtons'
import { getAllPosts, getPost, formatDate } from '@/lib/blog'

// Every post is generated at build time; unknown slugs are 404s.
export const dynamicParams = false

// Static export needs at least one path. With no posts yet, emit a
// placeholder that renders the 404 page, so the build never fails.
const NO_POSTS = '_none'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: NO_POSTS }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug)
  if (!post) return { title: 'Not found', robots: { index: false } }
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}/` },
    robots: post.draft ? { index: false } : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}/`,
      publishedTime: post.date,
      authors: ['Adamu Danjuma Abubakar'],
      tags: post.tags,
      images: [{ url: `/blog/${post.slug}/og.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', images: [`/blog/${post.slug}/og.png`] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const post = posts[index]
  const newer = posts[index - 1]
  const older = posts[index + 1]

  return (
    <GlobalShell>
      <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        <Link href="/blog/" className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 hover:text-amber-400">
          <ArrowLeft className="h-4 w-4" />
          <span>All posts</span>
        </Link>

        <header className="space-y-4 border-b border-zinc-800 pb-8">
          {post.draft && (
            <p className="inline-block px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 text-xs font-mono">
              Draft: not published
            </p>
          )}
          <h1 className="font-serif-display text-3xl sm:text-5xl font-semibold text-zinc-50 leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
            <span>Adamu Danjuma Abubakar</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <ShareButtons url={`https://adamu.tech/blog/${post.slug}/`} title={post.title} />
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="px-2 py-0.5 rounded-full border border-zinc-700 text-xs font-mono text-zinc-300">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className="border-t border-zinc-800 pt-6">
          <ShareButtons url={`https://adamu.tech/blog/${post.slug}/`} title={post.title} />
        </div>

        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-8" aria-label="More posts">
          {older ? (
            <Link href={`/blog/${older.slug}/`} className="p-4 rounded-xl border border-zinc-800 bg-[#0E1526] hover:border-amber-500/50">
              <span className="block text-xs font-mono text-zinc-400">← Older</span>
              <span className="block text-zinc-100 font-semibold">{older.title}</span>
            </Link>
          ) : <span />}
          {newer && (
            <Link href={`/blog/${newer.slug}/`} className="p-4 rounded-xl border border-zinc-800 bg-[#0E1526] hover:border-amber-500/50 sm:text-right">
              <span className="block text-xs font-mono text-zinc-400">Newer →</span>
              <span className="block text-zinc-100 font-semibold">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </GlobalShell>
  )
}
