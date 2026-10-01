import type { Metadata } from 'next'
import { JsonLd, breadcrumbs, projectNodes } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Murya (Hausa speech technology), Mapping Voices (open oral-history dataset), the Hausa lexicon, and other projects by Adamu Danjuma Abubakar.',
  alternates: { canonical: '/projects/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd graph={[...projectNodes(), breadcrumbs([['Home', '/'], ['Projects', '/projects/']])]} />
    </>
  )
}
