import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { caseStudyFor, caseStudyPath } from '@/lib/case-studies'

export function CaseStudyLink({ projectId }: { projectId: string }) {
  const study = caseStudyFor(projectId)
  if (!study) return null

  return (
    <Link
      href={caseStudyPath(study.slug)}
      aria-label={`Read the ${study.title} case study`}
      className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-gold-500 hover:underline"
    >
      Case study <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  )
}
