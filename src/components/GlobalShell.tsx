'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/components/LogoMark'
import { SocialNavIcons } from '@/components/SocialNavIcons'
import { ShieldCheck, ExternalLink, Menu, X, ArrowUp, Globe, FileText, Sun, Moon } from 'lucide-react'

interface ShellProps {
  children: React.ReactNode
}

export function GlobalShell({ children }: ShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] text-[#F8FAFC]">
      {/* Sticky Header - Streamlined & Minimalist */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0B1120]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Modern Acoustic & Linguistics Brand Logo */}
          <Link href="/" title="Adamu.tech Dossier & Research">
            <LogoMark />
          </Link>

          {/* Desktop Nav with Navigation & Interactive Icon Badges */}
          <nav className="hidden md:flex items-center space-x-5">
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
            
            {/* Hyperlinked Network Icon Hub */}
            <SocialNavIcons />

            <Link href="/admin" className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-[#0E1526] text-xs font-mono text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors">
              Admin
            </Link>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-zinc-800 text-zinc-300 hover:text-amber-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-[#0B1120] px-4 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono text-zinc-200 hover:text-amber-400"
            >
              Dossier
            </Link>
            <Link
              href="/papers/agentic-ai"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono text-zinc-200 hover:text-amber-400"
            >
              Pre-Print Paper
            </Link>
            <Link
              href="/cv"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono font-bold text-amber-400"
            >
              Academic CV
            </Link>
            <a
              href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-sm font-mono text-zinc-400 hover:text-amber-400"
            >
              <span>Google Scholar</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://huggingface.co/adab-tech"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-sm font-mono text-zinc-400 hover:text-amber-400"
            >
              <span>Hugging Face</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono text-amber-400 pt-2 border-t border-zinc-800"
            >
              Admin Studio
            </Link>
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
              <LogoMark showText={true} />
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
              <SocialNavIcons />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-3 border-t border-zinc-800/60 pt-5">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-zinc-400">© {new Date().getFullYear()} adamu.tech · Open Access</span>
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
