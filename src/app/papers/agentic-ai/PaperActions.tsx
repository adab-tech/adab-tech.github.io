'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Printer, Quote } from 'lucide-react'
import type { AgenticAiPaperContent } from '@/lib/paper-agentic-ai-content'

export function PrintPaperButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:border-gold-500 transition-colors"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

export function CopyCitationButton({ bibtex, actions, inline = false }: {
  bibtex: string
  actions: AgenticAiPaperContent['actions']
  inline?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])

  async function copyCitation() {
    if (timer.current !== null) clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(bibtex)
      setStatus('copied')
      timer.current = setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  const label = status === 'copied'
    ? (inline ? actions.copiedLabel : actions.citedLabel)
    : (inline ? actions.copyLabel : actions.citeLabel)

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={copyCitation}
        className={inline
          ? 'px-2 -mr-2 text-gold-600 dark:text-gold-500 hover:underline font-bold'
          : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-500 transition-colors shadow-sm'}
      >
        {!inline && (status === 'copied'
          ? <Check className="h-3.5 w-3.5 text-zinc-950" aria-hidden="true" />
          : <Quote className="h-3.5 w-3.5" aria-hidden="true" />)}
        <span>{label}</span>
      </button>
      <span role="status" className={status === 'error' ? 'text-xs text-zinc-300' : 'sr-only'}>
        {status === 'copied' ? label : status === 'error' ? actions.copyFailed : ''}
      </span>
    </div>
  )
}
