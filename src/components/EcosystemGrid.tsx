'use client'

import React from 'react'
import { ExternalLink, Cpu, BookOpen, Building2 } from 'lucide-react'

export interface DomainProject {
  domain: string
  label: string
  category: string
  description: string
  type: 'tech' | 'literary' | 'real-estate'
  url: string
  tags: string[]
}

const projects: DomainProject[] = [
  {
    domain: "murya.ng",
    label: "Murya AI",
    category: "AI Hausa Speech Synthesis",
    description: "Advanced Text-to-Speech synthesis architecture optimized for low-resource African language speech patterns.",
    type: "tech",
    url: "https://murya.ng",
    tags: ["Speech AI", "Hausa NLP", "PyTorch", "Voice Engine"]
  },
  {
    domain: "imodoye.ng",
    label: "Imodoye",
    category: "Digital Literary Archive",
    description: "Digital research repository and literary archive structuring African oral tradition and contemporary Hausa prose.",
    type: "literary",
    url: "https://imodoye.ng",
    tags: ["Computational Linguistics", "African Philology", "Digital Humanities"]
  },
  {
    domain: "adab.ng",
    label: "Adab Infrastructure",
    category: "Real Estate PropTech",
    description: "Modern prop-tech and property listing platform operating across Nigeria with intelligent search and lister portals.",
    type: "real-estate",
    url: "https://adab.ng",
    tags: ["PropTech", "Next.js", "Supabase", "Vercel"]
  }
]

const getIcon = (type: DomainProject['type']) => {
  switch (type) {
    case 'tech':
      return <Cpu className="h-5 w-5 text-emerald-500" />
    case 'literary':
      return <BookOpen className="h-5 w-5 text-amber-500" />
    case 'real-estate':
      return <Building2 className="h-5 w-5 text-indigo-500" />
  }
}

export function EcosystemGrid() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          PRODUCTION ECOSYSTEM MATRIX
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Active domain platforms engineered for computational linguistics, literature, and digital infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.domain}
            className="group relative flex flex-col justify-between p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 hover:border-amber-500/50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {getIcon(p.type)}
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                      {p.label}
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-400">{p.domain}</span>
                  </div>
                </div>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label={`Visit ${p.domain}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {p.category}
              </div>

              <p className="text-xs font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
