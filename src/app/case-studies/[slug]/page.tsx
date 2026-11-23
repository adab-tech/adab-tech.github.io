import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CaseStudyArticle } from '@/components/CaseStudyArticle'
import { GlobalShell } from '@/components/GlobalShell'
import { CASE_STUDIES, CASE_STUDY_CONTENT, caseStudyPath } from '@/lib/case-studies'
import { authorRef, breadcrumbs, JsonLd, SITE } from '@/lib/structured-data'

type PageProps = { params: Promise<{ slug: string }> }
export const dynamicParams = false

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const study = CASE_STUDIES.find((entry) => entry.slug === slug)
  if (!study) return {}
  const path = caseStudyPath(study.slug)
  const title = `${study.title} case study`
  return {
    title,
    description: study.summary,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: `${study.title} — ${study.headline}`,
      description: study.summary,
      url: path,
      images: [{ url: `${path}og.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description: study.summary, images: [`${path}og.png`] },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const study = CASE_STUDIES.find((entry) => entry.slug === slug)
  if (!study) notFound()
  const path = caseStudyPath(study.slug)
  return (
    <GlobalShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-9 sm:px-6 sm:py-14">
        <Link href="/projects/" className="mb-7 inline-flex min-h-11 items-center gap-2 text-xs font-mono text-zinc-400 hover:text-gold-500">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <CaseStudyArticle study={study} contact={CASE_STUDY_CONTENT.contact} />
      </div>
      <JsonLd graph={[
        { '@type': 'Article', headline: study.headline, description: study.summary, author: authorRef,
          mainEntityOfPage: `${SITE}${path}`, image: `${SITE}${path}og.png` },
        breadcrumbs([['Home', '/'], ['Projects', '/projects/'], [study.title, path]]),
      ]} />
    </GlobalShell>
  )
}
