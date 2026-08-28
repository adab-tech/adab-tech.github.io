'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowUp } from 'lucide-react'
import { LogoMark } from '@/components/LogoMark'
import { SocialNavIcons } from '@/components/SocialNavIcons'

interface ShellProps {
  children: React.ReactNode
}

export function GlobalShell({ children }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0B1120]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Mark Only - Phonetic notation /a/ */}
          <Link href="/" title="Adamu.tech Home Dossier" className="shrink-0">
            <LogoMark />
          </Link>

          {/* Desktop Navigation Links & Social Network Icon Badges */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" aria-label="Main Navigation">
            <Link 
              href="/" 
              className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors px-1.5 py-1"
            >
              Dossier
            </Link>
            <Link 
              href="/projects" 
              className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors px-1.5 py-1"
            >
              Projects
            </Link>
            <Link 
              href="/papers/agentic-ai" 
              className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors px-1.5 py-1"
            >
              Pre-Print
            </Link>
            <Link 
              href="/cv" 
              className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 hover:bg-amber-400/20 transition-all"
            >
              Academic CV
            </Link>
            
            <div className="h-4 w-px bg-zinc-800" />
            
            {/* Hyperlinked Icon Hub */}
            <SocialNavIcons />

            <div className="h-4 w-px bg-zinc-800" />

            <Link 
              href="/admin" 
              className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-[#0E1526] text-xs font-mono text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Mobile Header Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-zinc-800 bg-[#0E1526] text-zinc-300 hover:text-amber-400 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-[#0B1120] px-4 sm:px-6 py-5 space-y-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 hover:text-amber-400"
              >
                Dossier
              </Link>
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 hover:text-amber-400"
              >
                Projects
              </Link>
              <Link
                href="/papers/agentic-ai"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-center rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 hover:text-amber-400"
              >
                Pre-Print Paper
              </Link>
              <Link
                href="/cv"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 text-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/20"
              >
                Academic CV
              </Link>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-xs font-mono text-zinc-400">Profiles & Repositories:</span>
              <SocialNavIcons />
            </div>

            <div className="pt-1">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-amber-400"
              >
                Admin Studio & Traffic Tracker
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Ultra-Clean Minimal Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#070C18] text-zinc-400 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-3">
          <div>© 2026 adamu.tech · Adamu Danjuma Abubakar</div>
          <div>CC-BY-NC-SA 4.0</div>
        </div>
      </footer>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-amber-500 text-zinc-950 shadow-lg hover:bg-amber-400 transition-all z-30 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
