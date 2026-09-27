import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

// Lists the public pages for search engines. Old redirect URLs and /admin
// are left out on purpose.
export const dynamic = 'force-static'

const SITE = 'https://adamu.tech'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/cv/', '/projects/', '/blog/', '/papers/agentic-ai/', '/contact/', '/mapping/']
  const posts = getAllPosts().filter((p) => !p.draft)
  return [
    ...pages.map((path) => ({ url: `${SITE}${path}` })),
    ...posts.map((p) => ({ url: `${SITE}/blog/${p.slug}/`, lastModified: p.date })),
  ]
}
