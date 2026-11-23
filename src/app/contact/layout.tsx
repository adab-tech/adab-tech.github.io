import type { Metadata } from 'next'
import { GlobalShell } from '@/components/GlobalShell'
import { CONTACT } from '@/lib/contact-content'
import { CV } from '@/lib/site-content'
import { JsonLd, PERSON_ID, SITE } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: CONTACT.metadataTitle,
  description: CONTACT.metadataDescription,
  alternates: { canonical: '/contact/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalShell>{children}</GlobalShell>
      <JsonLd graph={[{
        '@type': 'ContactPage',
        url: `${SITE}/contact/`,
        name: `${CONTACT.metadataTitle} — ${CV.name}`,
        mainEntity: { '@id': PERSON_ID },
      }]} />
    </>
  )
}
