'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ProjectLogo } from '@/components/ProjectLogo'
import { PROJECTS, primaryLink } from '@/lib/site-content'
import { 
  Layers, ExternalLink, Code2, ArrowRight
} from 'lucide-react'

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<string>('All')

  const filteredProjects = activeTab === 'All'
    ? PROJECTS.projects
    : PROJECTS.projects.filter(p => p.category === activeTab)

  // Only categories that have projects get a filter button.
  const categories = ['All', ...PROJECTS.categories.filter((c) => PROJECTS.projects.some((p) => p.category === c))]

  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        
        {/* Header Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              Projects
            </span>
            
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-zinc-50 tracking-tight">
            {PROJECTS.heading}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-sans leading-relaxed">
            {PROJECTS.intro}
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === cat
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'bg-[#0E1526] text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              className="p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-5 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-sm"
            >
              <div className="space-y-4">
                {/* Title & Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {primaryLink(p) ? (
                      <a
                        href={primaryLink(p)}
                        {...(/^https?:/.test(primaryLink(p)) ? { target: '_blank', rel: 'noreferrer' } : {})}
                        aria-label={`Open ${p.title}`}
                        title={`Open ${p.title}`}
                        className="shrink-0 rounded-xl transition-transform hover:scale-105"
                      >
                        <ProjectLogo project={p} />
                      </a>
                    ) : (
                      <ProjectLogo project={p} />
                    )}
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-mono font-bold text-zinc-50">
                        {p.title}
                      </h2>
                      <div className="text-xs font-mono text-amber-400">
                        {p.role}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border max-w-full ${
                    p.statusColor === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                    p.statusColor === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                    'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  {p.description}
                </p>

                {/* Key Highlights */}
                <div className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    Key Technical Highlights:
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-300 font-sans">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-mono">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons & Tags */}
              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold hover:underline"
                    >
                      <span>Launch Platform</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {p.paperUrl && (
                    <Link
                      href={p.paperUrl}
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold hover:underline"
                    >
                      <span>Read Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {p.modelUrl && (
                    <a
                      href={p.modelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                    >
                      <span>Model Weights</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{p.repoLabel || 'Source'}</span>
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </GlobalShell>
  )
}
