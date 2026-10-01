import type { Metadata, Viewport } from 'next'
import './globals.css'
import { checkSiteContent } from '@/lib/site-content'

// Stops the build with a clear message if an edited content file is malformed.
checkSiteContent()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B1120'
}

export const metadata: Metadata = {
  title: {
    default: 'Adamu Danjuma Abubakar — Computational Linguist',
    template: '%s — Adamu Danjuma Abubakar',
  },
  description: 'Adamu Danjuma Abubakar (Ph.D. defended, University of Alabama): Hausa speech technology (Murya), open research datasets (Mapping Voices), and computational linguistics for African languages.',
  metadataBase: new URL('https://adamu.tech'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Adamu Danjuma Abubakar — Computational Linguist',
    description: 'Hausa speech technology, open research datasets, and computational linguistics for African languages.',
    url: 'https://adamu.tech',
    siteName: 'adamu.tech',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'adamu.tech' }]
  },
  twitter: {
    card: 'summary_large_image',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ backgroundColor: '#0B1120', color: '#F8FAFC' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0B1120] text-[#F8FAFC] font-sans selection:bg-amber-500/20 selection:text-amber-400 overflow-x-hidden" style={{ backgroundColor: '#0B1120', color: '#F8FAFC' }}>
        {children}
      </body>
    </html>
  )
}
