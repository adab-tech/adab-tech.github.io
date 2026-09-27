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
    title: 'Murya',
    category: 'AI & Speech',
    role: 'Founder & linguistic lead',
    status: 'Live (v1.2)',
    statusColor: 'emerald',
    description: 'Hausa speech synthesis and live spoken conversation. Speech synthesis and dictionary lookup run in the browser and work offline; answers are grounded in the Ƙamus lexicon.',
    highlights: [
      'Blind MOS naturalness study running at app.murya.ng/listen; no score is published until each voice has enough ratings',
      '8-speaker Piper VITS model fine-tuned on the WAXAL Hausa corpus; open weights on Hugging Face',
      'Under 110 ms to first audio, running in the browser',
      'Echo suppression so the assistant doesn’t hear its own voice in live conversation'
    ],
    liveUrl: 'https://app.murya.ng',
    repoUrl: 'https://huggingface.co/adab-tech',
    modelUrl: 'https://huggingface.co/adab-tech/murya-piper-hausa-tts',
    tags: ['Speech AI', 'Piper VITS', 'FastAPI', 'WASM ONNX', 'Hausa NLP']
  },
  {
    id: 'mapping-voices',
    title: 'Mapping Voices',
    category: 'Philology & Humanities',
    role: 'Creator & curator',
    status: 'Dataset v0.4.0 · DOI',
    statusColor: 'blue',
    description: 'An open research dataset and interactive atlas of real oral-history and voice-testimony collections worldwide — a single geographic entry point into collections otherwise scattered across hundreds of institutional sites, searchable by country, language, theme, period, and access, with a published methodology and persistent identifiers.',
    highlights: [
      '221 real, publicly documented collections across 120 countries and territories and 125 languages, archived on Zenodo (doi:10.5281/zenodo.22996478)',
      'Zero-dependency static app (Leaflet + OpenStreetMap) with Language Explorer, Theme Explorer, and Coverage Gaps views',
      'Full UI localization in English, Hausa, French, and Arabic with native CLDR pluralization',
      'Open source (MIT code / CC BY 4.0 data) with a public contribution pipeline for institutions and researchers'
    ],
    liveUrl: 'https://adamu.tech/mapping/',
    repoUrl: 'https://github.com/adab-tech/mapping',
    tags: ['Digital Humanities', 'Oral History', 'Open Data', 'Zenodo DOI', 'Leaflet', 'i18n']
  },
  {
    id: 'hausa-30k-lexicon',
    title: 'Hausa Lexicon (Ƙamus)',
    category: 'Philology & Humanities',
    role: 'Curator & Maintainer',
    status: 'Open dataset',
    statusColor: 'blue',
    description: 'Robinson 1914 Hausa–English lexicon (20,628 pairs, Public Domain) published on Hugging Face, extended internally to 30,729 dictionary-constrained entries with Wiktionary (CC-BY-SA) and a Prof. Paul Newman (1977) research subset kept unpublished per that permission’s terms.',
    highlights: [
      '20,628 Robinson 1914 pairs published on Hugging Face under public-domain terms',
      '30,729 total entries used for internal lexical grounding (Robinson + Wiktionary + Newman 1977 subset)',
      'Newman (1977) subset is not redistributed'
    ],
    modelUrl: 'https://huggingface.co/datasets/adab-tech/murya-hausa-en-lexicon-robinson1914',
    repoUrl: 'https://huggingface.co/adab-tech',
    tags: ['Lexical Infrastructure', 'Hugging Face', 'Hausa Philology', 'Open Data']
  },
  {
    id: 'agentic-ai-monograph',
    title: 'Humanities Perspectives on Agentic AI',
    category: 'Philology & Humanities',
    role: 'Author',
    status: 'Pre-print',
    statusColor: 'blue',
    description: 'Working paper on why the humanities belong at the centre of agentic-AI governance, drawing on postcolonial theory, cultural pragmatics, and four case studies.',
    highlights: [
      'Grounding conversational AI in Hausa norms of modesty and respect (Kunya & Girmamawa)',
      'Critical analysis of Western anthropocentric agent architectures',
      'A governance framework for autonomous AI agents'
    ],
    paperUrl: '/papers/agentic-ai',
    repoUrl: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    tags: ['Digital Humanities', 'AI Ethics', 'Pragmatics', 'Pre-print']
  },
  {
    id: 'imodoye-archive',
    title: "Imodoye Writers' Residency",
    category: 'Philology & Humanities',
    role: 'Founder & platform lead',
    status: 'Live',
    statusColor: 'emerald',
    description: "Platform for Imodoye, a writers' residency in Ilorin, Kwara State by Dr. Usman Oladipo Akanbi, President of the Association of Nigerian Authors. Seven cohorts in, with its own literary journal, Imodoye Review.",
    highlights: [
      'Content management for fellows, cohorts, partners, and publications',
      'Blind-review editorial workflow feeding submissions to Imodoye Review',
      'Public residency archive and impact reporting, backed by the live database'
    ],
    liveUrl: 'https://imodoye.ng',
    repoUrl: 'https://github.com/adab-tech/imodoye-web',
    tags: ["Writers' Residency", 'Literary Fellowship', 'Next.js', 'Neon Postgres']
  },
  {
    id: 'global-opportunities',
    title: 'Global Opportunities',
    category: 'Academic & Grants',
    role: 'Founder',
    status: 'Live',
    statusColor: 'emerald',
    description: 'A global discovery engine and automated deadline tracker for scholarships, research fellowships, international grants, and academic positions worldwide.',
    highlights: [
      'Plain-English opportunity summaries with verified deadline tracking',
      'Automated background web aggregation and listing refresh',
      'Passwordless instant opportunity saving and email match alerts',
      'Built for international researchers, scholars, and fellows'
    ],
    liveUrl: 'https://globalopportunities.app',
    repoUrl: 'https://github.com/adab-tech/globalopportunities',
    tags: ['Next.js', 'Grants Engine', 'Scholarships', 'Automated Alerts', 'Global Mobility']
  },
  {
    id: 'adab-infrastructure',
    title: 'Adab Infrastructure (PropTech)',
    category: 'Infrastructure',
    role: 'Technical Architect',
    status: 'Live',
    statusColor: 'emerald',
    description: 'Full-stack property listing and real estate marketplace platform operating across Nigeria with intelligent search portals and verified lister workflows.',
    highlights: [
      'Property search with filters, Google Maps integration, and structured data for SEO',
      'Supabase-backed CMS for listings, inquiries, and services content',
      'Dedicated lister portal, separate from the admin CMS, for verified agent onboarding'
    ],
    liveUrl: 'https://adab.ng',
    repoUrl: 'https://github.com/adab-tech/adab-real-estate-web',
    tags: ['PropTech', 'Next.js', 'Supabase', 'Vercel']
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
              Projects
            </span>
            
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-zinc-50 tracking-tight">
            Engineered Systems & Research Platforms
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-sans leading-relaxed">
            Speech technology, open research datasets, and platforms I have built or lead, with my role in each.
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
                  <div className="space-y-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-mono font-bold text-zinc-50">
                      {p.title}
                    </h2>
                    <div className="text-xs font-mono text-amber-400">
                      {p.role}
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
