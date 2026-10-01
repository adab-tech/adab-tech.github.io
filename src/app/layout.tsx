import type { Metadata, Viewport } from 'next'
import './globals.css'
import { checkSiteContent } from '@/lib/site-content'
import { JsonLd, personNode, websiteNode } from '@/lib/structured-data'

// Stops the build with a clear message if an edited content file is malformed.
checkSiteContent()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B132B'
}

export const metadata: Metadata = {
  title: {
    default: 'Adamu Danjuma Abubakar — Computational Linguist',
    template: '%s — Adamu Danjuma Abubakar',
  },
  description: 'Adamu Danjuma Abubakar builds African-language speech technology: Murya for Hausa, open datasets such as Mapping Voices, and computational linguistics.',
  alternates: { canonical: '/' },
  authors: [{ name: 'Adamu Danjuma Abubakar', url: 'https://adamu.tech' }],
  creator: 'Adamu Danjuma Abubakar',
  keywords: ['Adamu Danjuma Abubakar', 'Hausa speech technology', 'Hausa text-to-speech', 'computational linguistics', 'African languages NLP', 'Murya', 'Mapping Voices', 'digital humanities'],
  formatDetection: { telephone: false },
  metadataBase: new URL('https://adamu.tech'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    shortcut: '/icon.svg',
    apple: '/apple-touch-icon.png',
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

// Content Security Policy. GitHub Pages can't send response headers, so it is
// set with a meta tag. It lists every outside service the site uses; anything
// else is blocked, so an injected script could not send data (such as the
// admin's saved GitHub token) to another server through fetch, XHR, images
// or forms. Next's static export needs inline scripts, hence 'unsafe-inline'.
const HCB = 'https://www.htmlcommentbox.com'
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://giscus.app ${HCB}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${HCB}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${HCB}`,
  `connect-src 'self' https://api.counterapi.dev https://api.github.com ${HCB}`,
  `frame-src https://giscus.app ${HCB}`,
  `form-action 'self' ${HCB}`,
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
