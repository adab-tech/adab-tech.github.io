import { ogCard } from '@/components/og/card'

// Site-wide social preview image, written to /og.png at build time.
export const dynamic = 'force-static'

export function GET() {
  return ogCard({
    kicker: 'adamu.tech',
    title: 'Hausa speech technology, open research datasets, and computational linguistics for African languages',
    footer: 'Ph.D. defended, University of Alabama',
  })
}
