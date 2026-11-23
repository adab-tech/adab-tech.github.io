import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { CASE_STUDIES, caseStudyPath } from '@/lib/case-studies'

// Lists the public pages for search engines. Old redirect URLs and /admin
// are left out on purpose.
export const dynamic = 'force-static'

const SITE = 'https://adamu.tech'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/cv/', '/projects/', '/tools/', '/blog/', '/papers/agentic-ai/', '/contact/', '/mapping/']
  const posts = getAllPosts().filter((p) => !p.draft)
  return [
    ...pages.map((path) => ({ url: `${SITE}${path}` })),
    ...CASE_STUDIES.map(({ slug }) => ({ url: `${SITE}${caseStudyPath(slug)}` })),
    ...posts.map((p) => ({ url: `${SITE}/blog/${p.slug}/`, lastModified: p.date })),
  ]
}
