import type { Metadata } from 'next'

// Private tools: reachable by URL, not linked from the site, not indexed.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
