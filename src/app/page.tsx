'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { 
  Cpu, BookOpen, ExternalLink, ArrowRight, Shield, Activity, 
  Layers, CheckCircle2, 
  FileText, 
  MapPin, Mail, Sparkles
} from 'lucide-react'

// Ordered by what best shows the work: the product, then the citable research
// outputs, then the other platforms.
const ECOSYSTEM_PROJECTS = [
  {
    name: 'Murya',
    status: 'Live (v1.2)',
    statusColor: 'emerald',
    role: 'Founder & linguistic lead',
    type: 'Hausa speech technology',
    desc: 'Hausa speech synthesis and spoken conversation, with two voices built on an 8-speaker Piper VITS model, dictionary-grounded answers, and synthesis that works offline in the browser.',
    url: 'https://app.murya.ng',
    linkLabel: 'Try it',
    modelUrl: 'https://huggingface.co/adab-tech/murya-piper-hausa-tts',
    repo: 'https://huggingface.co/adab-tech',
    repoLabel: 'Hugging Face'
  },
  {
    name: 'Mapping Voices',
    status: 'Dataset v0.4.0 · DOI',
    statusColor: 'blue',
    role: 'Creator & curator',
    type: 'Open research dataset & atlas',
    desc: 'Open dataset and interactive atlas of 221 publicly documented oral-history and voice-testimony collections across 120 countries and territories and 125 languages, archived on Zenodo (doi:10.5281/zenodo.22996478).',
    url: 'https://adamu.tech/mapping/',
    linkLabel: 'Open the atlas',
    repo: 'https://github.com/adab-tech/mapping',
    repoLabel: 'Source & methodology'
  },
  {
    name: 'Hausa Lexicon (Ƙamus)',
    status: 'Open dataset',
    statusColor: 'blue',
    role: 'Curator & maintainer',
    type: 'Lexical resource',
    desc: '20,628 Robinson (1914) Hausa–English pairs published on Hugging Face (public domain). Murya’s internal lexicon totals 30,729 entries, adding Wiktionary (CC BY-SA) and an authorized subset of Newman (1977) that is not redistributed.',
    url: 'https://huggingface.co/datasets/adab-tech/murya-hausa-en-lexicon-robinson1914',
    linkLabel: 'Dataset',
    repo: 'https://huggingface.co/adab-tech',
    repoLabel: 'Hugging Face'
  },
  {
    name: 'Humanities Perspectives on Agentic AI',
    status: 'Pre-print',
    statusColor: 'blue',
    role: 'Author',
    type: 'Working paper',
    desc: 'Why the humanities belong at the centre of agentic-AI governance: contested ideas of agency, four case studies, and a governance framework informed by postcolonial theory.',
    url: '/papers/agentic-ai',
    linkLabel: 'Read the paper',
    repo: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ',
    repoLabel: 'Google Scholar'
  },
  {
    name: "Imodoye Writers' Residency",
    status: 'Live',
    statusColor: 'emerald',
    role: 'Founder & platform lead',
    type: 'Literary fellowship & publishing platform',
    desc: "Platform for a writers' residency in Ilorin, Kwara State: fellows, cohorts, and publications, plus blind review for its literary journal, Imodoye Review.",
    url: 'https://imodoye.ng',
    linkLabel: 'Visit',
    repo: 'https://github.com/adab-tech/imodoye-web',
    repoLabel: 'Source'
  },
  {
    name: 'Global Opportunities',
    status: 'Live',
    statusColor: 'emerald',
    role: 'Founder',
    type: 'Scholarship & grant discovery',
    desc: 'Scholarships, research fellowships, grants, and international jobs in one place, with deadline tracking and email alerts.',
    url: 'https://globalopportunities.app',
    linkLabel: 'Visit',
    repo: 'https://github.com/adab-tech/globalopportunities',
    repoLabel: 'Source'
  }
]

const BENCHMARKS_DATA = [
  { metric: 'In progress', label: 'MOS Listening Study', sub: 'Blind, anonymous ITU-T P.800-style naturalness study live at app.murya.ng/listen — results pending sufficient rater volume' },
  { metric: '30,729', label: 'Lexicon Entries', sub: 'Used for dictionary-grounded answers (Robinson 1914 + Wiktionary CC BY-SA + an authorized subset of Newman 1977)' },
  { metric: '< 110ms', label: 'Time to First Audio', sub: 'Speech synthesis in the browser, offline-capable, with a server fallback' },
  { metric: '24 kHz', label: 'Output Sampling Rate', sub: 'Output audio for both voices, Malama Asabe and Malam Garba' }
]

export default function HomePage() {
  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION — Clear Narrative, Academic Affiliations & Primary CTAs */}
        <section className="space-y-8 pt-4 sm:pt-8">
          
          {/* Status & Verification Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              African-language speech technology & computational linguistics
            </span>
            
          </div>

          {/* Core Title & Bio */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-zinc-50 tracking-tight leading-tight">
              Adamu Danjuma Abubakar
            </h1>
            <p className="text-lg sm:text-xl font-mono text-amber-400 font-medium">
              Ph.D. Candidate & Teaching Fellow · University of Alabama
            </p>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              I build African-language speech systems from a humanities foundation — literature, philology, and linguistics, not a computer-science degree. I design the linguistic framing and the product, and I work with engineering to ship it. Try Murya, then the CV.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Tuscaloosa, AL · Open to roles, remote, and relocation</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-500" /> contact@adamu.tech</span>
            </div>
          </div>

          {/* Primary Call-to-Actions (Above the Fold) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:contact@adamu.tech?subject=Work%20with%20Adamu"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <Mail className="w-4 h-4" />
              <span>Roles, gigs &amp; collabs</span>
            </a>

            <a
              href="https://app.murya.ng"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm"
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Try Murya</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/papers/agentic-ai"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read the pre-print</span>
            </Link>

            <Link
              href="/cv"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>CV</span>
            </Link>
          </div>

        </section>

        {/* SECTION 1: BENCHMARKS & EVALUATION EVIDENCE (Hard Data Replacing Broad Claims) */}
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              Murya in numbers
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              What can be checked
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Open weights and dataset cards back these figures. The listening study is still collecting ratings, so no naturalness score is published yet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENCHMARKS_DATA.map((b) => (
              <div key={b.label} className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-2">
                <div className="text-3xl font-mono font-bold text-amber-400">{b.metric}</div>
                <div className="text-xs font-mono font-bold text-zinc-100">{b.label}</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Technical Specifications Table */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-4">
            <div className="font-mono font-bold text-sm text-zinc-100 flex items-center justify-between border-b border-zinc-800 pb-3">
              <span>Model & Architecture Specifications</span>
              <a href="https://huggingface.co/adab-tech/murya-piper-hausa-tts" target="_blank" rel="noreferrer" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                <span>Hugging Face Model Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-zinc-400">Base Architecture:</span>
                <div className="text-zinc-200">8-Speaker WAXAL-Piper VITS Multi-Speaker ONNX (24 kHz)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400">Voice Personas:</span>
                <div className="text-zinc-200">Malama Asabe (Female) · Malam Garba (Male)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400">Training Corpus:</span>
                <div className="text-zinc-200">WAXAL (hau subset, arXiv:2602.02734)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400">Tone:</span>
                <div className="text-zinc-200">Syllable weight and right-to-left tone mapping (after Litvinova)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400">Runs:</span>
                <div className="text-zinc-200">In the browser (ONNX/WASM), with server streaming as fallback</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-400">License:</span>
                <div className="text-zinc-200">CC-BY-NC-SA 4.0 (Open Weights)</div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 space-y-3 font-sans text-xs text-zinc-300 leading-relaxed">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Evaluation & data provenance</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-zinc-400">
                <div className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1">
                  <strong className="text-zinc-200 font-mono block">MOS Evaluation Protocol</strong>
                  <p>A blind, randomized Mean Opinion Score study (ITU-T P.800-style, 1–5 naturalness scale, real-human-speech anchor) is live and collecting ratings at app.murya.ng/listen. No score is published until each voice clears a floor of 20 ratings — the study is ongoing and results aren&apos;t final yet.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1">
                  <strong className="text-zinc-200 font-mono block">30k Ƙamus Lexicon Provenance</strong>
                  <p>Compiled from C.H. Robinson (1914, Public Domain) and Prof. Paul Newman (1977, authorized research subset). Verified entries are deduplicated, tone-contoured, and phonetically normalized.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1">
                  <strong className="text-zinc-200 font-mono block">What runs offline</strong>
                  <p>Speech synthesis and dictionary lookup run entirely in the browser. Live conversation uses an optional server connection for speech recognition (Faster-Whisper) and responses (Aya 8B).</p>
                </div>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono pt-1">
                <strong>Dialect Boundary Notice:</strong> Acoustic tuning is calibrated for Standard Kano Hausa (Eastern dialect). Sokoto and Gobirawa acoustic variations are scheduled for Murya v2.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DESIGN PRINCIPLES */}
        <section className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-[#0E1526] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            Design principles
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-50">
            Local, offline, and culturally grounded
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">1. Local control</span>
              <p>Open weights can be self-hosted, so the tools don’t depend on a proprietary cloud API that could be shut down or paywalled.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">2. Works offline</span>
              <p>The 30k-entry dictionary and speech synthesis run in the browser, so they work on low bandwidth or none, which is common across the Sahel.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">3. Cultural pragmatics</span>
              <p>Responses follow Hausa norms of modesty and respect (<em>Kunya & Girmamawa</em>) and gendered address, instead of translated Western conversational templates.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROJECTS */}
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Projects
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              What I&apos;ve built
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Products, open datasets, and research, with my role in each.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ECOSYSTEM_PROJECTS.map((p) => (
              <div key={p.name} className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-zinc-100 text-base">{p.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      p.statusColor === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                      p.statusColor === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                      'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-amber-400/90">{p.role} · <span className="text-zinc-400">{p.type}</span></div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{p.desc}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800 text-xs font-mono">
                  {p.url.startsWith('/') ? (
                    <Link href={p.url} className="text-amber-400 hover:underline flex items-center gap-1">
                      <span>{p.linkLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                      <span>{p.linkLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {p.modelUrl && (
                    <a href={p.modelUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                      <span>Weights</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                      <span>{p.repoLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: PRIVACY & CONTACT NOTICE */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-3 text-xs font-sans text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-2 font-mono font-bold text-zinc-200">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Hiring, consulting &amp; collaboration</span>
          </div>
          <p className="text-zinc-300">
            Available for industry roles, contract work, and research collaboration in African-language speech, low-resource NLP, and shipping research as product.{' '}
            <a href="mailto:contact@adamu.tech?subject=Work%20with%20Adamu" className="text-amber-400 hover:underline font-mono">contact@adamu.tech</a>
            {' · '}
            <a href="/cv" className="text-amber-400 hover:underline font-mono">CV</a>
          </p>
          <p>
            Mail to that address is routed privately (TLS). Inquiries are kept for legitimate work and research contact only — not shared or sold.
          </p>
        </section>

      </div>
    </GlobalShell>
  )
}
