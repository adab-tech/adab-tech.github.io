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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 400) {
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
          
          {/* Logo Mark & Identity */}
          <Link href="/" title="Adamu.tech Dossier & Research" className="shrink-0">
            <LogoMark />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5">
            <Link href="/" className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors">
              Dossier
            </Link>
            <Link href="/projects" className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors">
              Projects
            </Link>
            <Link href="/papers/agentic-ai" className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors">
              Pre-Print
            </Link>
            <Link href="/cv" className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 hover:bg-amber-400/20 transition-all">
              Academic CV
            </Link>
            
            <div className="h-4 w-px bg-zinc-800" />
            
            {/* Hyperlinked Social Network Icon Hub */}
            <SocialNavIcons />

            <div className="h-4 w-px bg-zinc-800" />

            <Link href="/admin" className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-[#0E1526] text-xs font-mono text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors">
              Admin
            </Link>
          </nav>

          {/* Tablet/Mobile Header Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            <div className="hidden sm:flex">
              <SocialNavIcons />
            </div>
            
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

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-zinc-800 bg-[#0B1120] px-4 sm:px-6 py-5 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 hover:text-amber-400 hover:border-amber-500/30"
              >
                Dossier
              </Link>
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 hover:text-amber-400 hover:border-amber-500/30"
              >
                Projects
              </Link>
              <Link
                href="/papers/agentic-ai"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-200 hover:text-amber-400 hover:border-amber-500/30"
              >
                Pre-Print Paper
              </Link>
              <Link
                href="/cv"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500/20"
              >
                Academic CV
              </Link>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Networks & Profiles:</span>
              <SocialNavIcons />
            </div>

            <div className="pt-1">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-amber-400"
              >
                Admin Dashboard Studio
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Minimalist, Clean Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#070C18] text-zinc-400 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <LogoMark />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono">
                <Link href="/" className="hover:text-amber-400 transition-colors">Dossier</Link>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">Projects</Link>
                <Link href="/papers/agentic-ai" className="hover:text-amber-400 transition-colors">Pre-Print</Link>
                <Link href="/cv" className="hover:text-amber-400 transition-colors">Academic CV</Link>
                <Link href="/admin" className="hover:text-amber-400 text-zinc-500 transition-colors">Admin</Link>
              </div>
              
              <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
              
              {/* Footer Network Icons */}
              <SocialNavIcons />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-3 border-t border-zinc-800/60 pt-5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-400">© 2026 adamu.tech · Adamu Danjuma Abubakar</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <a 
                href="mailto:contact@adamu.tech" 
                className="hover:text-amber-400 transition-colors text-zinc-300 font-medium"
              >
                contact@adamu.tech
              </a>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500">CC-BY-NC-SA 4.0</span>
            </div>
          </div>
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
