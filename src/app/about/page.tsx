import type { Metadata } from 'next'
import { RedirectTo } from '@/components/RedirectTo'

// Old URL kept so existing links keep working; the CV lives at /cv.
export const metadata: Metadata = { title: 'Moved to /cv', robots: { index: false } }

export default function Page() {
  return <RedirectTo href="/cv/" />
}
