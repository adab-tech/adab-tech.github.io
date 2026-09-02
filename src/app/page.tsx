'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { 
  Cpu, BookOpen, ExternalLink, ArrowRight, Shield, Activity, 
  Terminal, Database, Layers, CheckCircle2, Award, Zap, Code, 
  Share2, Play, Pause, Volume2, Globe, FileText, Check, AlertCircle, 
  Clock, MapPin, Mail, Sparkles, Building2
} from 'lucide-react'

const ECOSYSTEM_PROJECTS = [
  {
    name: 'Murya Speech OS',
    status: 'Live Production (v1.2)',
    statusColor: 'emerald',
    role: 'Founder & Lead Systems Architect',
    type: 'Tier 1 · Sovereign Speech AI Platform',
    desc: '8-speaker WAXAL-Piper VITS neural speech synthesis and conversational intelligence with offline-first IndexedDB Ƙamus grounding and rising-edge echo cancellation.',
    url: 'https://app.murya.ng',
    repo: 'https://huggingface.co/adab-tech',
    modelUrl: 'https://huggingface.co/adab-tech/murya-piper-hausa-tts'
  },
  {
    name: 'Global Opportunities Platform',
    status: 'Live Production',
    statusColor: 'emerald',
    role: 'Founder & Lead Full-Stack Architect',
    type: 'Tier 1 · Academic & Grant Discovery Engine',
    desc: 'Worldwide scholarships, research fellowships, grants, and international jobs platform featuring real-time deadline indexing and automated alerts.',
    url: 'https://globalopportunities.app',
    repo: 'https://github.com/adab-tech/OpportunityFinder'
  },
  {
    name: 'Humanities Perspectives on Agentic AI',
    status: 'Pre-Print Research',
    statusColor: 'blue',
    role: 'Author & Principal Investigator',
    type: 'Tier 2 · Academic Monograph',
    desc: 'Postcolonial epistemologies, cultural pragmatics, and an ethical governance framework for autonomous agents.',
    url: '/papers/agentic-ai',
    repo: 'https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ'
  },
  {
    name: 'Hausa 30k Lexicon (Ƙamus)',
    status: 'Open Dataset (v2.0)',
    statusColor: 'amber',
    role: 'Curator & Maintainer',
    type: 'Tier 3 · Lexical Infrastructure',
    desc: 'Combined 30,708-entry lexicon uniting Robinson 1914 (Public Domain) with Prof. Paul Newman 1977 authorized research subset.',
    url: 'https://huggingface.co/adab-tech',
    repo: 'https://huggingface.co/adab-tech'
  },
  {
    name: "Imodoye Writers' Residency & Fellowship",
    status: 'Live Production',
    statusColor: 'emerald',
    role: 'Lead Platform Architect & Developer',
    type: 'Tier 4 · Literary Fellowship & Publishing Platform',
    desc: "Full-stack platform for Northern Nigeria's first writers' residency (Ilorin, Kwara State) — admin CMS for fellows, cohorts, and publications, plus a blind-review workflow for its literary journal, Imodoye Review.",
    url: 'https://imodoye.ng',
    repo: 'https://github.com/adab-tech/imodoye-web'
  },
  {
    name: 'Mapping Voices',
    status: 'Live Production',
    statusColor: 'emerald',
    role: 'Founder & Lead Architect',
    type: 'Tier 5 · Global Oral-History Atlas',
    desc: 'Open, interactive atlas of 191 real, independently verified oral-history and voice-testimony archives across 118 countries, filterable by country, theme, language, and decade.',
    url: 'https://adamu.tech/mapping/',
    repo: 'https://github.com/adab-tech/mapping'
  }
]

const BENCHMARKS_DATA = [
  { metric: 'In progress', label: 'MOS Listening Study', sub: 'Blind, anonymous ITU-T P.800-style naturalness study live at app.murya.ng/listen — results pending sufficient rater volume' },
  { metric: '30,708', label: 'Validated Lexicon Entries', sub: 'Dictionary-constrained lexical grounding (Robinson 1914 + Newman 1977 authorized subset)' },
  { metric: '< 110ms', label: 'Inference Latency', sub: 'Client-side WASM ONNX time-to-first-audio chunk (offline-capable) with server fallback' },
  { metric: '24 kHz', label: 'Output Sampling Rate', sub: 'High-fidelity audio synthesis (Malama Asabe & Malam Garba synthetic neural personas)' }
]

export default function HomePage() {
  const [playingAudio, setPlayingAudio] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState('1.0x')

  const toggleDemoAudio = () => {
    setPlayingAudio(!playingAudio)
  }

  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION — Clear Narrative, Academic Affiliations & Primary CTAs */}
        <section className="space-y-8 pt-4 sm:pt-8">
          
          {/* Status & Verification Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Sovereign African Speech AI & Computational Linguistics
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-zinc-800 bg-[#0E1526] text-zinc-400 font-mono text-[11px]">
              <Clock className="w-3 h-3 text-emerald-400" />
              Updated Aug 2026
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
              Applied Computational Linguist, Romance Philologist, and Speech AI Architect, specializing in West Chadic neural speech synthesis and postcolonial AI governance frameworks — with a secondary focus on documenting and preserving voices, including presentations on the Hausa, Ajami, Fulfulde, and Arabic poetry and scholarship of Nana Asma&apos;u bint Fodio.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Tuscaloosa, AL · Open to Relocation & Remote</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-500" /> contact@adamu.tech</span>
            </div>
          </div>

          {/* Primary Call-to-Actions (Above the Fold) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://app.murya.ng"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <Cpu className="w-4 h-4" />
              <span>Try Murya OS (Live Speech AI)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/papers/agentic-ai"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore Pre-Print Paper</span>
            </Link>

            <Link
              href="/cv"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Academic CV & Citations</span>
            </Link>
          </div>

        </section>

        {/* SECTION 1: BENCHMARKS & EVALUATION EVIDENCE (Hard Data Replacing Broad Claims) */}
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              Empirical Benchmarks & Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              Evaluated Performance Metrics
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Every technical claim on this platform is backed by reproducible open weights, dataset cards, and rater evaluations.
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
                <span className="text-zinc-500">Base Architecture:</span>
                <div className="text-zinc-200">8-Speaker WAXAL-Piper VITS Multi-Speaker ONNX (24 kHz)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">Voice Personas:</span>
                <div className="text-zinc-200">Malama Asabe (Female) · Malam Garba (Male)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">Training Corpus:</span>
                <div className="text-zinc-200">WAXAL (hau subset, arXiv:2602.02734)</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">Tonal Heuristics:</span>
                <div className="text-zinc-200">Litvinova RTL syllable weight segmentation</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">Inference Runtime:</span>
                <div className="text-zinc-200">WASM ONNX Client-Side / FastAPI Rising-Edge Stream</div>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500">License:</span>
                <div className="text-zinc-200">CC-BY-NC-SA 4.0 (Open Weights)</div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 space-y-3 font-sans text-xs text-zinc-300 leading-relaxed">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Rater Protocol, Data Provenance & Clinical Disclaimers</span>
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
                  <strong className="text-zinc-200 font-mono block">Offline vs. Cloud Streaming Architecture</strong>
                  <p>Client-side ONNX WASM &amp; IndexedDB run fully offline for TTS &amp; dictionary lookup. Optional WebSocket connection handles server-side Faster-Whisper VAD STT &amp; Aya 8B reasoning.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1">
                  <strong className="text-zinc-200 font-mono block">Imodoye Editorial Process</strong>
                  <p>Submissions to Imodoye Review go through a blind-review workflow in the platform&apos;s admin CMS before publication, tracked alongside fellow, cohort, and partner records in the same Neon Postgres database.</p>
                </div>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono pt-1">
                <strong>Dialect Boundary Notice:</strong> Acoustic tuning is calibrated for Standard Kano Hausa (Eastern dialect). Sokoto and Gobirawa acoustic variations are scheduled for Murya v2.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: OPERATIONAL DEFINITION OF DIGITAL SOVEREIGNTY */}
        <section className="p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-[#0E1526] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            Operational Framework
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-50">
            What Does “Digital Sovereignty” Mean in Practice?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">1. Local Weight Control</span>
              <p>Models are self-hostable with open ONNX weights, eliminating dependency on foreign proprietary cloud APIs that can be shut down or paywalled.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">2. Offline Sahelian Resilience</span>
              <p>The 30k+ dictionary and voice pipelines run client-side in browser IndexedDB, functioning in low-bandwidth and offline environments across the Sahel.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm block">3. Cultural Pragmatics Grounding</span>
              <p>System prompts enforce authentic Chadic social etiquette (<em>Kunya & Girmamawa</em>) and gendered grammar rather than translating Western conversational templates.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: ECOSYSTEM & PROJECT TAXONOMY MAP */}
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Project Portfolio & Ownership Map
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              Ecosystem Taxonomy
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              Clear distinction between academic research, open-source models, live products, and commercial implementations.
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
                  <div className="text-xs font-mono text-amber-400/90">{p.role} · <span className="text-zinc-500">{p.type}</span></div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{p.desc}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800 text-xs font-mono">
                  {p.url.startsWith('/') ? (
                    <Link href={p.url} className="text-amber-400 hover:underline flex items-center gap-1">
                      <span>View Paper</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline flex items-center gap-1">
                      <span>Launch Platform</span>
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
                      <span>Source</span>
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
            <span>Inquiries & Communication Policy</span>
          </div>
          <p>
            Communications sent to <code className="text-amber-400 font-mono">contact@adamu.tech</code> are routed via AWS SES with TLS transport encryption to a private destination inbox. Inbound messages are retained strictly for legitimate research, academic, and collaboration inquiries. Your contact information is never shared, marketed, or monetized.
          </p>
        </section>

      </div>
    </GlobalShell>
  )
}
