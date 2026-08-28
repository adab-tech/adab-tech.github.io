'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
          
          {/* Minimalist Home Icon (Replaces text brand) */}
          <Link href="/" className="flex items-center space-x-2.5 group" title="Return to Home Dossier">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-mono font-bold text-zinc-950 text-base shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="font-mono text-xs font-semibold text-zinc-300 group-hover:text-amber-400 transition-colors hidden sm:inline-block">
              Adamu Abubakar
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors">
              Dossier
            </Link>
            <Link href="/papers/agentic-ai" className="text-xs font-mono text-zinc-300 hover:text-amber-400 transition-colors">
              Pre-Print Paper
            </Link>
            <Link href="/cv" className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 hover:bg-amber-400/20 transition-all">
              Academic CV
            </Link>
            <a href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-amber-400 text-xs font-mono flex items-center gap-1">
              <span>Google Scholar</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a href="https://huggingface.co/adab-tech" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-amber-400 text-xs font-mono flex items-center gap-1">
              <span>Hugging Face</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <Link href="/admin" className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-[#0E1526] text-xs font-mono text-zinc-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors">
              Admin Studio
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

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#070C18] text-zinc-400 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-base text-zinc-100">
                  adamu<span className="text-amber-400">.tech</span>
                </span>
                <span className="text-zinc-600 font-mono text-xs">·</span>
                <span className="font-mono text-xs text-zinc-300">Adamu Danjuma Abubakar</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-md">
                Applied Computational Linguist & Speech AI Architect. Specializing in West Chadic neural speech modeling, 19th-century Kano Ajami digital philology, and postcolonial AI governance frameworks.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Navigation</span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Dossier</Link></li>
                <li><Link href="/papers/agentic-ai" className="hover:text-amber-400 transition-colors">Agentic AI Paper</Link></li>
                <li><Link href="/cv" className="hover:text-amber-400 transition-colors">Curriculum Vitae</Link></li>
                <li><Link href="/admin" className="hover:text-amber-400 transition-colors">Admin Studio</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Networks & Repos</span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li><a href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Google Scholar</a></li>
                <li><a href="https://github.com/adab-tech" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">GitHub (adab-tech)</a></li>
                <li><a href="https://huggingface.co/adab-tech" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">Hugging Face (adab-tech)</a></li>
                <li><a href="https://www.linkedin.com/in/adamudanjuma" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn (adamudanjuma)</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-400 gap-4 border-t border-zinc-800/80 pt-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Operational"></span>
              <span className="text-zinc-300">© 2026 adamu.tech · Adamu Danjuma Abubakar</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-zinc-400">
              <a 
                href="mailto:contact@adamu.tech" 
                className="hover:text-amber-400 transition-colors flex items-center gap-1 text-zinc-300"
              >
                <span>contact@adamu.tech</span>
              </a>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="text-zinc-400 hidden sm:inline">Ph.D. Fellow · Computational Linguistics</span>
              <span className="text-zinc-700">|</span>
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
