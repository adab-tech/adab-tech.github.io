import type { Metadata } from 'next'
import { JsonLd, PERSON_ID } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Adamu Danjuma Abubakar about roles, contract work, and research collaboration.',
  alternates: { canonical: '/contact/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd graph={[{ '@type': 'ContactPage', url: 'https://adamu.tech/contact/', name: 'Contact — Adamu Danjuma Abubakar', mainEntity: { '@id': PERSON_ID } }]} />
    </>
  )
}
