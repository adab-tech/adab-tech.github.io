'use client'

import React, { useState } from 'react'
import { Filter, Quote, Download, Check, ExternalLink } from 'lucide-react'
import { usePostsStore, StreamCategory } from '@/lib/posts-store'
import { PaperReaderModal } from '@/components/PaperReaderModal'

export function TaxonomyGrid() {
  const { posts } = usePostsStore()
  const [activeCategory, setActiveCategory] = useState<StreamCategory | 'All'>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories: (StreamCategory | 'All')[] = [
    'All',
    'Literary & Academic',
    'Tech',
    'General',
    'Personal'
  ]

  const filteredPosts = activeCategory === 'All'
    ? posts.filter(p => p.status === 'Published')
    : posts.filter(p => p.status === 'Published' && p.category === activeCategory)

  const handleCopyBibtex = (id: string, bibtex?: string) => {
    if (!bibtex || typeof navigator === 'undefined') return
    navigator.clipboard.writeText(bibtex)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // SCHOLARSHIP & REPOSITORY MATRIX
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Filter className="h-5 w-5 text-amber-500" />
          Stream Taxonomy & Research Publications
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Peer-reviewed articles, speech AI datasets, and literary manuscripts categorized by stream taxonomy with 1-click BibTeX citations.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${
              activeCategory === c
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                : 'bg-zinc-100 dark:bg-midnight-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((p) => {
          const isCopied = copiedId === p.id
          const isAgenticPaper = p.id === 'post-agentic-humanities'

          return (
            <div
              key={p.id}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {p.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">{p.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {p.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                  {isAgenticPaper && <PaperReaderModal />}

                  {p.bibtex && (
                    <button
                      onClick={() => handleCopyBibtex(p.id, p.bibtex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:border-amber-500 transition-colors"
                      title="Copy BibTeX Citation"
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Quote className="h-3.5 w-3.5 text-amber-500" />}
                      <span>{isCopied ? 'Copied' : 'BibTeX'}</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {p.abstract || p.summary}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
