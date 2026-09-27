import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV',
  description: 'Curriculum vitae of Adamu Danjuma Abubakar: education, experience in Hausa speech technology, languages, publications, and research datasets.',
  alternates: { canonical: '/cv/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
