import type { Metadata } from 'next'
import { GlobalShell } from '@/components/GlobalShell'
import { ResearchTools } from './ResearchTools'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Format JSON and JSON Lines, inspect Unicode text and links, and generate BibTeX citations in your browser.',
  alternates: { canonical: '/tools/' },
}

export default function ToolsPage() {
  return (
    <GlobalShell>
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
        <header className="space-y-3">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-50 sm:text-5xl">Research and developer tools</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Format datasets, examine text, build citations, and check link destinations. The tools process your input in your browser.
          </p>
        </header>
        <ResearchTools />
      </div>
    </GlobalShell>
  )
}
