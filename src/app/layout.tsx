import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B1120'
}

export const metadata: Metadata = {
  title: 'Adamu Abubakar — Computational Linguist & AI Researcher',
  description: 'Sovereign Hausa AI, speech synthesis, digital philology, and African language NLP research by Adamu Danjuma Abubakar.',
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
    title: 'Adamu Abubakar — Computational Linguist & AI Researcher',
    description: 'Sovereign Hausa speech synthesis, Ajami manuscripts, and African language AI infrastructure.',
    url: 'https://adamu.tech',
    siteName: 'adamu.tech',
    type: 'website'
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
