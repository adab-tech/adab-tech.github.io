import type { Metadata } from 'next'
import { JsonLd, PERSON_ID, breadcrumbs } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'CV',
  description: 'Curriculum vitae of Adamu Danjuma Abubakar: education, experience in Hausa speech technology, languages, publications, and research datasets.',
  alternates: { canonical: '/cv/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd graph={[{ '@type': 'ProfilePage', url: 'https://adamu.tech/cv/', name: 'CV — Adamu Danjuma Abubakar', mainEntity: { '@id': PERSON_ID } }, breadcrumbs([['Home', '/'], ['CV', '/cv/']])]} />
    </>
  )
}
