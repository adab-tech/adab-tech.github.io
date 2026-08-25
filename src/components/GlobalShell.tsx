'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon, ShieldCheck, ExternalLink, Menu, X, ArrowUp, Globe, FileText } from 'lucide-react'
import { CommandCVModal } from '@/components/CommandCVModal'

interface ShellProps {
  children: React.ReactNode
}

export function GlobalShell({ children }: ShellProps) {
  const [dark, setDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

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
    <div className="min-h-screen flex flex-col bg-[#F8F6F1] dark:bg-[#0B1120] text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#F8F6F1]/90 dark:bg-[#0B1120]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <a href="/" className="flex items-center space-x-2.5 group">
            <svg
              className="h-7 w-7 text-amber-500 transition-transform group-hover:scale-105"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Adamu Abubakar Logo"
            >
              <polygon
                points="50,12 88,82 12,82"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <circle cx="38" cy="50" r="5" fill="currentColor" />
              <path d="M46,40 A12 12 0 0 1 46,60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M52,32 A20 20 0 0 1 52,68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M68,26 L78,36 L58,56 L48,56 L48,46 Z" fill="currentColor" opacity="0.85" />
            </svg>

            <span className="font-mono text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-gold-500 transition-colors">
              adamu<span className="text-gold-500">.tech</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3.5">
            <a
              href="https://github.com/adab-tech"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="GitHub"
              title="GitHub Profile"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://huggingface.co/adab-tech"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="HuggingFace Models"
              title="Hugging Face"
            >
              HF
            </a>

            <a
              href="https://www.linkedin.com/in/adamudanjuma"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn Profile"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://orcid.org/0009-0009-4672-4956"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-md bg-zinc-100/60 dark:bg-zinc-900/60 transition-colors"
              title="ORCID Academic Record"
            >
              ORCID
            </a>

            <CommandCVModal />

            {/* Admin Studio Trigger */}
            <a
              href="/admin"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              title="Admin Studio & Inbox"
              aria-label="Admin Studio"
            >
              <ShieldCheck className="h-4 w-4" />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle Theme"
              title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <CommandCVModal />
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
              aria-label="Toggle Theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-amber-500"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-[#F8F6F1] dark:bg-[#0B1120] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a
                href="https://github.com/adab-tech"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-700 dark:text-zinc-300"
              >
                <Globe className="h-4 w-4 text-amber-500" />
                GitHub
              </a>
              <a
                href="https://huggingface.co/adab-tech"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-700 dark:text-zinc-300"
              >
                <span className="font-bold text-amber-500">HF</span>
                Hugging Face
              </a>
              <a
                href="https://www.linkedin.com/in/adamudanjuma"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-700 dark:text-zinc-300"
              >
                <ExternalLink className="h-4 w-4 text-blue-500" />
                LinkedIn
              </a>
              <a
                href="https://orcid.org/0009-0009-4672-4956"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-700 dark:text-zinc-300"
              >
                <span className="text-emerald-500 font-bold">ID</span>
                ORCID Record
              </a>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <a
                href="/admin"
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-mono text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  Admin Studio & Inquiries Inbox
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {children}
      </main>

      {/* Back to Top Floating Trigger */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-3 rounded-full bg-amber-500 text-zinc-950 shadow-lg hover:bg-amber-400 focus:outline-none transition-all duration-200 hover:scale-105"
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Footer Ecosystem Map */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-10 bg-white dark:bg-midnight-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs text-zinc-400 pb-8 border-b border-zinc-100 dark:border-zinc-900">
            
            {/* Identity & Scope */}
            <div className="space-y-2.5 sm:col-span-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">adamu.tech</span>
                <span>·</span>
                <span className="text-zinc-700 dark:text-zinc-300">Adamu Danjuma Abubakar</span>
              </div>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                Computational Linguist & Applied AI Researcher. Engineering low-resource Chadic speech synthesis (Murya), digital philology archives (Imodoye), and African cloud infrastructure.
              </p>
            </div>

            {/* Ecosystem Platforms */}
            <div className="space-y-2.5">
              <span className="font-bold text-zinc-900 dark:text-zinc-200 text-xs uppercase tracking-wider">Production Platforms</span>
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="https://murya.ng" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors inline-flex items-center gap-1.5">
                    <span>murya.ng</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </a>
                </li>
                <li>
                  <a href="https://imodoye.ng" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors inline-flex items-center gap-1.5">
                    <span>imodoye.ng</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </a>
                </li>
                <li>
                  <a href="https://adab.ng" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors inline-flex items-center gap-1.5">
                    <span>adab.ng</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Scholarly Archives */}
            <div className="space-y-2.5">
              <span className="font-bold text-zinc-900 dark:text-zinc-200 text-xs uppercase tracking-wider">Scholarly Profiles</span>
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>
                  <a href="https://orcid.org/0009-0009-4672-4956" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                    ORCID Record (0009-0009-4672-4956)
                  </a>
                </li>
                <li>
                  <a href="https://huggingface.co/adab-tech" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                    Hugging Face (adab-tech)
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/adamudanjuma" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors">
                    LinkedIn (adamudanjuma)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
            <div>© {new Date().getFullYear()} adamu.tech · Adamu Danjuma Abubakar</div>
            <div>Automated Email Router · contact@adamu.tech / adamudanjuma1@outlook.com</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
