import type { MetadataRoute } from 'next'
import { CV } from '@/lib/site-content'
import { SITE_SETTINGS } from '@/lib/site-settings'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CV.name,
    short_name: SITE_SETTINGS.siteName,
    description: SITE_SETTINGS.appDescription,
    start_url: '/',
    display: 'browser',
    background_color: '#0B132B',
    theme_color: '#0B132B',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
