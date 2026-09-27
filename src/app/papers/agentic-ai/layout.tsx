import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Humanities Perspectives on Agentic AI (pre-print)',
  description: 'Pre-print by Adamu Danjuma Abubakar on the humanities, postcolonial epistemologies, and a framework for governing agentic AI.',
  alternates: { canonical: '/papers/agentic-ai/' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
