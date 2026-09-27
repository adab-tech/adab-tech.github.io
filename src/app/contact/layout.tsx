import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Adamu Danjuma Abubakar about roles, contract work, and research collaboration.',
  alternates: { canonical: '/contact/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
