'use client'

import React from 'react'
import { Mail } from 'lucide-react'

export interface SocialLink {
  name: string
  url: string
  icon: React.ReactNode
  color: string
}

export const SOCIAL_LINKS = [
  {
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    ariaLabel: 'View Google Scholar Citations & Publications',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.8 3.8v6.2h2.4v-4.3L12 19l9.6-7.7V9.5L12 0z"/>
      </svg>
    ),
    hoverColor: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/adab-tech',
    ariaLabel: 'View GitHub Profile & Code Repositories',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    hoverColor: 'hover:text-zinc-100 hover:border-zinc-500/40 hover:bg-zinc-800/50'
  },
  {
    name: 'Hugging Face',
    url: 'https://huggingface.co/adab-tech',
    ariaLabel: 'View Hugging Face Open-Weights Models & Datasets',
    icon: (
      <span className="text-sm leading-none select-none">🤗</span>
    ),
    hoverColor: 'hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/adamudanjuma',
    ariaLabel: 'Connect with Adamu on LinkedIn',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    hoverColor: 'hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10'
  },
  {
    name: 'Email Contact',
    url: 'mailto:contact@adamu.tech',
    ariaLabel: 'Send Email to contact@adamu.tech',
    icon: <Mail className="w-4 h-4" />,
    hoverColor: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10'
  }
]

export function SocialNavIcons({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target={link.url.startsWith('mailto') ? undefined : '_blank'}
          rel={link.url.startsWith('mailto') ? undefined : 'noreferrer'}
          aria-label={link.ariaLabel}
          title={link.name}
          className={`relative p-2 rounded-lg border border-zinc-800 bg-[#0E1526] text-zinc-400 ${link.hoverColor} transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
