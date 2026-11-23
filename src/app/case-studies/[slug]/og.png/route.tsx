import { ogCard } from '@/components/og/card'
import { CASE_STUDIES } from '@/lib/case-studies'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = CASE_STUDIES.find((entry) => entry.slug === slug)
  if (!study) return new Response(null, { status: 404 })
  return ogCard({ kicker: study.title, title: study.headline, footer: study.role })
}
