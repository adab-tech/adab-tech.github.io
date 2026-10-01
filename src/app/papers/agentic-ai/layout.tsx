import type { Metadata } from 'next'
import { JsonLd, authorRef, breadcrumbs } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Humanities Perspectives on Agentic AI (pre-print)',
  description: 'Pre-print by Adamu Danjuma Abubakar on the humanities, postcolonial epistemologies, and a framework for governing agentic AI.',
  alternates: { canonical: '/papers/agentic-ai/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd graph={[{ '@type': 'ScholarlyArticle', headline: 'Humanities Perspectives on Agentic AI', url: 'https://adamu.tech/papers/agentic-ai/', author: authorRef, datePublished: '2026-08', inLanguage: 'en', isAccessibleForFree: true, creativeWorkStatus: 'Pre-print', description: 'Why the humanities belong at the centre of agentic-AI governance: contested ideas of agency, four case studies, and a governance framework.' }, breadcrumbs([['Home', '/'], ['Pre-print', '/papers/agentic-ai/']])]} />
    </>
  )
}
