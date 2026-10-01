import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Adamu Danjuma Abubakar',
    short_name: 'adamu.tech',
    description: 'African-language speech technology and computational linguistics.',
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
