'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { 
  Layers, ExternalLink, Code2, ArrowRight, Cpu, BookOpen, 
  Globe, Database, Shield, Sparkles, Building2, Search, Filter 
} from 'lucide-react'

interface ProjectItem {
  id: string
  title: string
  category: 'AI & Speech' | 'Academic & Grants' | 'Philology & Humanities' | 'Infrastructure'
  role: string
  status: string
  statusColor: 'emerald' | 'blue' | 'amber'
  description: string
  highlights: string[]
  liveUrl?: string
  repoUrl?: string
  paperUrl?: string
  modelUrl?: string
  tags: string[]
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'murya-os',
    title: 'Murya Speech OS',
    category: 'AI & Speech',
    role: 'Founder & Lead Systems Architect',
    status: 'Live Production (v1.2)',
    statusColor: 'emerald',
    description: 'Sovereign 8-speaker neural speech synthesis and bidirectional live voice engine for Hausa. Features client-side WASM ONNX inference, offline-first IndexedDB Ƙamus grounding, and rising-edge echo cancellation.',
    highlights: [
      'Live blind MOS naturalness study at app.murya.ng/listen — results pending sufficient rater volume',
      '8-Speaker WAXAL-Piper VITS multi-speaker neural architecture',
      '< 110ms time-to-first-audio chunk latency in browser WASM',
      'Rising-edge control barrier (assistant_speaking) preventing self-echo'
    ],
    liveUrl: 'https://app.murya.ng',
    repoUrl: 'https://huggingface.co/adab-tech',
    modelUrl: 'https://huggingface.co/adab-tech/murya-piper-hausa-tts',
    tags: ['Speech AI', 'Piper VITS', 'FastAPI', 'WASM ONNX', 'Hausa NLP']
  },
  {
    id: 'global-opportunities',
    title: 'Global Opportunities Platform',
    category: 'Academic & Grants',
    role: 'Founder & Lead Full-Stack Architect',
    status: 'Live Production',
    statusColor: 'emerald',
    description: 'A global discovery engine and automated deadline tracker for scholarships, research fellowships, international grants, and academic positions worldwide.',
    highlights: [
      'Plain-English opportunity summaries with verified deadline tracking',
      'Automated background web aggregation and listing refresh',
      'Passwordless instant opportunity saving and email match alerts',
      'Built for international researchers, scholars, and fellows'
    ],
    liveUrl: 'https://globalopportunities.app',
    repoUrl: 'https://github.com/adab-tech/OpportunityFinder',
    tags: ['Next.js', 'Grants Engine', 'Scholarships', 'Automated Alerts', 'Global Mobility']
  },
  {
    id: 'agentic-ai-monograph',
    title: 'Humanities Perspectives on Agentic AI',
    category: 'Philology & Humanities',
    role: 'Author & Principal Investigator',
    status: 'Pre-Print Research',
    statusColor: 'blue',
    description: 'Academic monograph and theoretical framework examining postcolonial epistemologies, cultural pragmatics, and ethical governance for autonomous AI agents.',
    highlights: [
      'Grounding conversational AI in Chadic social etiquette (Kunya & Girmamawa)',
      'Critical analysis of Western anthropocentric agent architectures',
      'Operational framework for sovereign digital governance'
    ],
    paperUrl: '/papers/agentic-ai',
    repoUrl: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    tags: ['Digital Humanities', 'AI Ethics', 'Chadic Pragmatics', 'Pre-Print']
  },
  {
    id: 'hausa-30k-lexicon',
    title: 'Hausa 30k Lexicon (Ƙamus)',
    category: 'Philology & Humanities',
    role: 'Curator & Maintainer',
    status: 'Open Dataset (v2.0)',
    statusColor: 'amber',
    description: 'Standardized 30,708-entry phonetically tone-marked Hausa dictionary uniting Charles Henry Robinson (1914, Public Domain) with Prof. Paul Newman (1977, authorized research subset).',
    highlights: [
      '30,708 verified lexical entries with syllable weight segmentation',
      'Phonetically normalized for high-accuracy neural TTS alignment',
      'Published on Hugging Face Datasets under CC-BY-NC-SA 4.0'
    ],
    modelUrl: 'https://huggingface.co/adab-tech',
    repoUrl: 'https://huggingface.co/adab-tech',
    tags: ['Lexical Infrastructure', 'Hugging Face', 'Hausa Philology', 'Open Data']
  },
  {
    id: 'imodoye-archive',
    title: "Imodoye Writers' Residency & Fellowship",
    category: 'Philology & Humanities',
    role: 'Lead Platform Architect & Developer',
    status: 'Live Production',
    statusColor: 'emerald',
    description: "Full-stack platform for Imodoye — the first writers' residency of its kind in Northern Nigeria, founded in Ilorin, Kwara State by Dr. Usman Oladipo Akanbi, President of the Association of Nigerian Authors. Seven cohorts in, with its own literary journal, Imodoye Review.",
    highlights: [
      'Next.js + Neon Postgres, with an admin CMS covering fellows, cohorts, partners, and publications',
      'Blind-review editorial workflow feeding submissions to Imodoye Review',
      'Public residency archive and impact reporting, backed by the live database'
    ],
    liveUrl: 'https://imodoye.ng',
    repoUrl: 'https://github.com/adab-tech/imodoye-web',
    tags: ["Writers' Residency", 'Literary Fellowship', 'Next.js', 'Neon Postgres']
  },
  {
    id: 'mapping-voices',
    title: 'Mapping Voices',
    category: 'Philology & Humanities',
    role: 'Founder & Lead Architect',
    status: 'Live Production',
    statusColor: 'emerald',
    description: 'An open, interactive atlas of real oral-history and voice-testimony archives worldwide — a single geographic entry point into a landscape of collections otherwise scattered across hundreds of independent institutional sites, filterable by country, theme, language, and decade.',
    highlights: [
      '191 independently verified real archive entries across 118 countries on every inhabited continent',
      'Zero-dependency static app (Leaflet + OpenStreetMap) — no backend, no build step',
      'Full UI localization in English, Hausa, French, and Arabic with native CLDR pluralization',
      'Open source (MIT code / CC BY 4.0 data) with a public contribution pipeline for institutions and researchers'
    ],
    liveUrl: 'https://adamu.tech/mapping/',
    repoUrl: 'https://github.com/adab-tech/mapping',
    tags: ['Digital Humanities', 'Oral History', 'Leaflet', 'Open Data', 'i18n']
  },
  {
    id: 'adab-infrastructure',
    title: 'Adab Infrastructure (PropTech)',
    category: 'Infrastructure',
    role: 'Technical Architect',
    status: 'Live Production',
    statusColor: 'emerald',
    description: 'Full-stack property listing and real estate marketplace platform operating across Nigeria with intelligent search portals and verified lister workflows.',
    highlights: [
      'Multi-region search with intelligent geo-spatial categorization',
      'Scalable Next.js and Supabase backend deployment',
      'Enterprise cloud routing and verified agent onboarding'
    ],
    liveUrl: 'https://adab.ng',
    repoUrl: 'https://github.com/adab-tech/adab-real-estate-web',
    tags: ['PropTech', 'Next.js', 'Supabase', 'Cloudflare']
  }
]

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<string>('All')

  const filteredProjects = activeTab === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === activeTab)

  const categories = ['All', 'AI & Speech', 'Academic & Grants', 'Philology & Humanities', 'Infrastructure']

  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        
        {/* Header Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              Sovereign Ecosystem & Systems Portfolio
            </span>
            
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-zinc-50 tracking-tight">
            Engineered Systems & Research Platforms
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-sans leading-relaxed">
            A comprehensive catalog of production speech AI engines, academic discovery platforms, computational linguistics datasets, and digital humanities repositories built and maintained by Adamu Danjuma Abubakar.
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
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-xl font-mono font-bold text-zinc-50">
                      {p.title}
                    </h2>
                    <div className="text-xs font-mono text-amber-400">
                      {p.role}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border shrink-0 ${
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
                      <span>Source</span>
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
