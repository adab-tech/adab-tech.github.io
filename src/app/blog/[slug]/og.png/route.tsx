import { ogCard } from '@/components/og/card'
import { getAllPosts, getPost, formatDate } from '@/lib/blog'

// Per-post social preview image at /blog/<slug>/og.png, made at build time.
// A real .png path so GitHub Pages serves it as image/png.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: '_none' }]
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  return ogCard({
    kicker: 'Blog · adamu.tech',
    title: post?.title ?? 'Blog',
    footer: post ? formatDate(post.date) : '',
  })
}
