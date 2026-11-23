import type { Metadata, Viewport } from 'next'
import './globals.css'
import { checkSiteContent, CV, HOME } from '@/lib/site-content'
import { SITE_SETTINGS } from '@/lib/site-settings'
import { JsonLd, personNode, SITE, websiteNode } from '@/lib/structured-data'

// Stops the build with a clear message if an edited content file is malformed.
checkSiteContent()

const homeTitle = HOME.metadata?.title?.trim() || 'Adamu Danjuma Abubakar — Computational Linguist'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B132B'
}

export const metadata: Metadata = {
  title: {
    default: homeTitle,
    template: `%s — ${CV.name}`,
  },
  description: HOME.metadata?.description?.trim() || 'Adamu Danjuma Abubakar builds African-language speech technology: Murya for Hausa, open datasets such as Mapping Voices, and computational linguistics.',
  alternates: { canonical: '/' },
  authors: [{ name: CV.name, url: SITE }],
  creator: CV.name,
  keywords: SITE_SETTINGS.keywords,
  formatDetection: { telephone: false },
  metadataBase: new URL(SITE),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: HOME.metadata?.shareTitle?.trim() || homeTitle,
    description: HOME.metadata?.shareDescription?.trim() || 'Hausa speech technology, open research datasets, and computational linguistics for African languages.',
    url: SITE,
    siteName: SITE_SETTINGS.siteName,
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE_SETTINGS.shareCard.alt }]
  },
  twitter: {
    card: 'summary_large_image',
  }
}

// Cloudflare injects a versioned beacon and collects its reports on this origin.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com/beacon.min.js https://static.cloudflareinsights.com/beacon.min.js/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://api.github.com",
  "frame-src https://www.youtube-nocookie.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ backgroundColor: '#0B1120', color: '#F8FAFC' }}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#0B1120] text-[#F8FAFC] font-sans selection:bg-gold-500/20 selection:text-gold-500 overflow-x-hidden" style={{ backgroundColor: '#0B1120', color: '#F8FAFC' }}>
        {children}
        <JsonLd graph={[personNode(), websiteNode()]} />
      </body>
    </html>
  )
}
