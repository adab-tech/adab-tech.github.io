'use client'

import React, { useState } from 'react'
import { Filter, Quote, Download, Check } from 'lucide-react'
import { usePostsStore, StreamCategory } from '@/lib/posts-store'

export function TaxonomyGrid() {
  const { posts } = usePostsStore()
  const [activeCategory, setActiveCategory] = useState<StreamCategory | 'All'>('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories: (StreamCategory | 'All')[] = [
    'All',
    'General',
    'Literary & Academic',
    'Personal',
    'Tech'
  ]

  const publishedPosts = posts.filter((item) => item.status === 'Published')

  const filteredItems = activeCategory === 'All'
    ? publishedPosts
    : publishedPosts.filter(item => item.category === activeCategory)

  const copyBibtex = (id: string, bibtex?: string) => {
    if (!bibtex) return
    navigator.clipboard.writeText(bibtex)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Filter className="h-5 w-5 text-amber-500" />
            RESEARCH & PROJECT TAXONOMY
          </h2>
          <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
            Categorized research publications, technical engines, and academic notes.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-zinc-100 dark:bg-midnight-900 border border-zinc-200 dark:border-zinc-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 shadow-sm font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isAcademic = item.category === 'Literary & Academic'

          return (
            <div
              key={item.id}
              className={`p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 space-y-4 transition-all hover:border-amber-500/40 ${
                isAcademic ? 'font-serif' : 'font-sans'
              }`}
            >
              <div className="flex items-start justify-between gap-2 font-mono">
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                  {item.category}
                </span>
                <span className="text-[11px] text-zinc-400">{item.date}</span>
              </div>

              <h3
                className={`text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${
                  isAcademic ? 'font-serif leading-snug text-zinc-950 dark:text-zinc-100' : 'font-mono text-base'
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed ${
                  isAcademic ? 'font-serif text-sm leading-relaxed text-zinc-700 dark:text-zinc-300' : ''
                }`}
              >
                {item.summary}
              </p>

              <div className="pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 font-mono text-xs">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-3">
                  {item.bibtex && (
                    <button
                      onClick={() => copyBibtex(item.id, item.bibtex)}
                      className="inline-flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      {copiedId === item.id ? <Check className="h-3 w-3" /> : <Quote className="h-3 w-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'BibTeX'}</span>
                    </button>
                  )}

                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      className="inline-flex items-center space-x-1 text-[11px] text-zinc-600 dark:text-zinc-300 hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
