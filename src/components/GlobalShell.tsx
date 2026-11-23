'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUp } from 'lucide-react'
import { LogoMark } from '@/components/LogoMark'
import { SocialNavIcons } from '@/components/SocialNavIcons'
import { NAVIGATION, type NavigationLink } from '@/lib/navigation'
import { parsePublicUrl } from '@/lib/public-url'

const desktopLink = 'text-xs font-mono text-zinc-300 hover:text-gold-500 transition-colors px-1.5 py-1'
const desktopFeatured = 'text-xs font-mono font-bold text-gold-500 bg-gold-500/10 px-2.5 py-1 rounded-lg border border-gold-500/20 hover:bg-gold-500/20 transition-all'
const mobileLink = 'p-2.5 text-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 hover:text-gold-500'
const mobileFeatured = 'p-2.5 text-center rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-500 font-bold hover:bg-gold-500/20'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500'

function NavigationAnchor({ item, className, onClick }: {
  item: NavigationLink
  className: string
  onClick?: () => void
}) {
  const destination = parsePublicUrl(item.url)
  if (!destination) return null

  const classes = `${className} ${focusRing}`
  if (destination.kind === 'local' && destination.href.startsWith('/')) {
    return <Link href={destination.href} className={classes} onClick={onClick}>{item.label}</Link>
  }

  return (
    <a
      href={destination.href}
      className={classes}
      onClick={onClick}
      {...(destination.kind === 'external' ? {
        target: '_blank',
        rel: 'noopener noreferrer',
        title: destination.host,
        'aria-label': `${item.label} (${destination.host})`,
      } : {})}
    >
      {item.label}
    </a>
  )
}

export function GlobalShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const mobileMenuId = useId()
  const menuToggle = useRef<HTMLButtonElement>(null)
  const { menu, social, footer } = NAVIGATION
  const hasNavigation = menu.length > 0 || social.length > 0
  const closeMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 350)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-[#F8FAFC]">
      <header
        className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0B1120]/95 backdrop-blur-md"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && mobileMenuOpen) {
            closeMenu()
            menuToggle.current?.focus()
          }
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex items-center justify-between gap-4">
          <Link
            href="/"
            title="adamu.tech home"
            aria-label="adamu.tech home"
            className={`shrink-0 inline-flex items-center ${focusRing}`}
          >
            <LogoMark />
          </Link>

          {hasNavigation && (
            <>
              <nav className="hidden md:flex items-center justify-end flex-wrap gap-x-4 gap-y-2 lg:gap-x-6" aria-label="Main navigation">
                {menu.map((item, index) => (
                  <NavigationAnchor
                    key={index}
                    item={item}
                    className={item.featured ? desktopFeatured : desktopLink}
                  />
                ))}
                {menu.length > 0 && social.length > 0 && <div className="h-4 w-px bg-zinc-800" aria-hidden="true" />}
                <SocialNavIcons />
              </nav>

              <button
                ref={menuToggle}
                type="button"
                onClick={() => setMobileMenuOpen(open => !open)}
                className={`md:hidden p-2 rounded-lg border border-zinc-800 bg-[#0E1526] text-zinc-300 hover:text-gold-500 ${focusRing}`}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                aria-controls={mobileMenuId}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </>
          )}
        </div>

        {hasNavigation && (
          <nav
            id={mobileMenuId}
            hidden={!mobileMenuOpen}
            aria-label="Mobile navigation"
            className="md:hidden border-b border-zinc-800 bg-[#0B1120] px-4 sm:px-6 py-5 space-y-4 shadow-2xl"
          >
            {menu.length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                {menu.map((item, index) => (
                  <NavigationAnchor
                    key={index}
                    item={item}
                    className={item.featured ? mobileFeatured : mobileLink}
                    onClick={closeMenu}
                  />
                ))}
              </div>
            )}
            {social.length > 0 && (
              <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="text-xs font-mono text-zinc-400">Profiles &amp; Repositories:</span>
                <SocialNavIcons />
              </div>
            )}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {(footer.copyright || footer.license || footer.links.length > 0) && (
        <footer className="border-t border-zinc-800/80 bg-[#070C18] text-zinc-400 py-6 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:flex-wrap items-center sm:justify-between text-xs font-mono text-zinc-400 gap-3">
            {footer.copyright && <div>{footer.copyright}</div>}
            {footer.links.length > 0 && (
              <nav aria-label="Footer links" className="flex flex-wrap justify-center gap-3">
                {footer.links.map((item, index) => (
                  <NavigationAnchor key={index} item={item} className="hover:text-gold-500 hover:underline" />
                ))}
              </nav>
            )}
            {footer.license && <div>{footer.license}</div>}
          </div>
        </footer>
      )}

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 p-3 rounded-full bg-gold-500 text-zinc-950 shadow-lg transition-all z-30 cursor-pointer ${focusRing}`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
