'use client'

import React from 'react'
import { Sun, Moon, ShieldCheck, ExternalLink } from 'lucide-react'

interface ShellProps {
  children: React.ReactNode
}

export function GlobalShell({ children }: ShellProps) {
  const [dark, setDark] = React.useState(true)

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 dark:bg-midnight-950 text-zinc-900 dark:text-zinc-50 transition-colors">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-parchment-50/90 dark:bg-midnight-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Unique Multiprofile Logo & Brand Name */}
          <a href="/" className="flex items-center space-x-2.5 group">
            <svg
              className="h-7 w-7 text-gold-500 transform group-hover:scale-105 transition-transform"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="adamu.tech multiprofile logo"
            >
              {/* Arewa Octagon Geometry */}
              <polygon
                points="90.6,66.9 66.9,90.6 33.1,90.6 9.4,66.9 9.4,33.1 33.1,9.4 66.9,9.4 90.6,33.1"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Neural Audio Wave Node */}
              <circle cx="38" cy="50" r="5" fill="currentColor" />
              <path d="M46,40 A12 12 0 0 1 46,60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M52,32 A20 20 0 0 1 52,68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              {/* Manuscript Quill Nib */}
              <path d="M68,26 L78,36 L58,56 L48,56 L48,46 Z" fill="currentColor" opacity="0.85" />
            </svg>

            <span className="font-mono text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-gold-500 transition-colors">
              adamu<span className="text-gold-500">.tech</span>
            </span>
          </a>

          {/* Nav Section Shortcuts + External Profiles */}
          <nav className="flex items-center space-x-3 sm:space-x-4">
            <a href="https://github.com/adab-tech" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" aria-label="GitHub">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="https://huggingface.co/adab-tech" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex items-center space-x-1" aria-label="HuggingFace">
              <span className="font-mono text-xs font-bold text-amber-500">HF</span>
            </a>
            <a href="https://www.linkedin.com/company/murya-voice" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://orcid.org/0009-0009-4672-4956" target="_blank" rel="noreferrer" className="font-mono text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900">
              ORCID
            </a>

            {/* Quick Admin Studio Link */}
            <a
              href="/admin"
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-gold-400 transition-colors"
              title="Admin Studio"
              aria-label="Admin Studio"
            >
              <ShieldCheck className="h-4 w-4" />
            </a>

            <button
              onClick={() => setDark(!dark)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Toggle Theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-8 bg-white dark:bg-midnight-950">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">adamu.tech</span>
              <span>·</span>
              <span>Adamu Danjuma Abubakar</span>
              <span>© {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center space-x-4">
              <a href="https://murya.ng" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span>murya.ng</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://imodoye.ng" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span>imodoye.ng</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://adab.ng" target="_blank" rel="noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                <span>adab.ng</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 pt-3 border-t border-zinc-100 dark:border-zinc-900">
            <div>DNS: Cloudflare Edge Routing</div>
            <div>Mail Dispatch: contact@adamu.tech / adamudanjuma1@outlook.com</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
