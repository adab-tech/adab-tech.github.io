import { ogCard } from '@/components/og/card'
import { SITE_SETTINGS } from '@/lib/site-settings'

// Site-wide social preview image, written to /og.png at build time.
export const dynamic = 'force-static'

export function GET() {
  return ogCard(SITE_SETTINGS.shareCard)
}
