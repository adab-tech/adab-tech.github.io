import type { Metadata } from 'next'
import { AGENTIC_AI_PAPER } from '@/lib/paper-agentic-ai-content'
import { JsonLd, SITE, breadcrumbs } from '@/lib/structured-data'

const paper = AGENTIC_AI_PAPER
const PAPER_PATH = '/papers/agentic-ai/'

export const metadata: Metadata = {
  title: paper.seo.title,
  description: paper.seo.description,
  alternates: { canonical: PAPER_PATH },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd graph={[
        {
          '@type': 'ScholarlyArticle',
          headline: paper.seo.headline,
          url: `${SITE}${PAPER_PATH}`,
          author: {
            '@type': 'Person',
            name: paper.author,
            affiliation: { '@type': 'Organization', name: paper.institution },
          },
          datePublished: paper.publishedMonth,
          inLanguage: paper.seo.language,
          isAccessibleForFree: true,
          creativeWorkStatus: paper.seo.status,
          description: paper.seo.articleDescription,
        },
        breadcrumbs([['Home', '/'], [paper.seo.status, PAPER_PATH]]),
      ]} />
    </>
  )
}
