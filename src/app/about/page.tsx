'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ArrowLeft, Printer, Download, Mail, Globe, MapPin, Award, BookOpen, GraduationCap, Briefcase, Languages, Shield, ExternalLink } from 'lucide-react'
import { VisitorCounter } from '@/components/VisitorCounter'

const LANGUAGES_DATA = [
  { name: 'Hausa', level: 'Native / Bilingual (C2)', note: 'First Language · West Chadic Dialectologist · ACTFL Certified Tester' },
  { name: 'English', level: 'Bilingual / Near-Native (C2)', note: 'Academic & Professional Primary Working Language' },
  { name: 'French', level: 'Full Professional (C1/C2)', note: 'B.A. French (Unilorin), M.A. French (UA) · Romance Philology' },
  { name: 'Arabic', level: 'Advanced / Working (B2/C1)', note: 'Classical Arabic & Kano Ajami Paleography' },
  { name: 'Yoruba', level: 'Professional Working (B2)', note: 'Southwestern Nigerian Lingua Franca · Tone Modeling' },
  { name: 'Sango', level: 'Fluent (C1)', note: 'Central African Lingua Franca · App Development for CAR & Diaspora' },
  { name: 'Fulfulde (Fula)', level: 'Working Proficiency (B1)', note: 'Senegambian & Sahelian Cross-Border Lingua Franca' },
  { name: 'Spanish', level: 'Reading & Research (B1)', note: 'Comparative Romance Linguistics' },
  { name: 'Italian', level: 'Reading Knowledge (A2/B1)', note: 'Romance Philology & Historical Syntax' },
  { name: 'Portuguese', level: 'Elementary Working (A2)', note: 'Lusophone Atlantic Studies' }
]

export default function AcademicCVPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <GlobalShell>
      <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Platform Dossier</span>
          </Link>

          <div className="flex items-center space-x-3">
            <VisitorCounter />
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* CV Document Container */}
        <article className="p-6 sm:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1526] shadow-sm space-y-10 font-sans">
          
          {/* Header & Bio */}
          <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-4xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  Adamu Danjuma Abubakar
                </h1>
                <p className="text-base font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  Applied Computational Linguist · Speech AI Architect · Polyglot (8+ Languages)
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-amber-500" /> Tuscaloosa, AL / Kano, Nigeria</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-amber-500" /> adamu.tech</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-amber-500" /> adamudanjuma1@outlook.com</span>
                </div>
              </div>

              {/* External Profile Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-blue-600 dark:text-blue-400 hover:border-blue-500 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Google Scholar</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://huggingface.co/adab-tech"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-amber-600 dark:text-amber-400 hover:border-amber-500 transition-colors"
                >
                  <span>Hugging Face</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Academic Appointments & Education */}
          <section className="space-y-4">
            <h2 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <GraduationCap className="h-5 w-5 text-amber-500" />
              Education & Academic Credentials
            </h2>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-midnight-950 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Ph.D. Candidate in Romance Languages (Applied Computational Humanities)</span>
                  <span className="text-amber-600 dark:text-amber-400">Expected Dec 2026</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-mono">The University of Alabama · Tuscaloosa, AL</div>
                <p className="text-zinc-700 dark:text-zinc-300 pt-1 leading-relaxed">
                  Dissertation: <em>Sovereign African Speech Intelligence: Dialectal Synthesis, Postcolonial AI Governance, and Chadic Acoustic Architectures.</em>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-midnight-950 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Master of Arts (M.A.) in Romance Languages (French Linguistics)</span>
                  <span className="text-zinc-500 font-normal">2023</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-mono">The University of Alabama · Tuscaloosa, AL</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-midnight-950 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Bachelor of Arts (B.A. Hons) in French</span>
                  <span className="text-zinc-500 font-normal">2019</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-mono">University of Ilorin · Ilorin, Nigeria</div>
              </div>
            </div>
          </section>

          {/* Research & Industry Experience */}
          <section className="space-y-4">
            <h2 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Briefcase className="h-5 w-5 text-amber-500" />
              Applied AI & Research Experience
            </h2>

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Founder & Lead Systems Architect — Murya Speech AI</span>
                  <span className="text-amber-600 dark:text-amber-400">2024 – Present</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Architected the sovereign 24kHz Piper VITS ONNX neural speech synthesis pipeline for Hausa (<code className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">adab-tech/murya-piper-hausa-tts</code>). Integrated Litvinova Right-to-Left tonal melody heuristics and curated the 20,628-pair Robinson 1914 Lexicon for embedding warm-start.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Graduate Researcher & Teaching Fellow — University of Alabama</span>
                  <span className="text-zinc-500 font-normal">2021 – Present</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Instruct undergraduate Romance linguistic courses, conduct digital philology research on 19th-century West African Ajami manuscripts, and author frameworks for agentic AI governance.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  <span>AI Linguistic Specialist (RLHF & Red-Teaming) — Leading Frontier AI Labs</span>
                  <span className="text-zinc-500 font-normal">2023 – Present</span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Conduct safety red-teaming, cultural alignment, and preference ranking evaluations for state-of-the-art multilingual LLMs spanning low-resource African languages.
                </p>
              </div>
            </div>
          </section>

          {/* 10-Language Polyglot Matrix */}
          <section className="space-y-4">
            <h2 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Languages className="h-5 w-5 text-amber-500" />
              10-Language Polyglot Competency Matrix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {LANGUAGES_DATA.map((l) => (
                <div
                  key={l.name}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950 space-y-1"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{l.name}</span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">{l.level}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans text-[11px] leading-relaxed">{l.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Peer-Reviewed & Google Scholar Publications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h2 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-500" />
                Publications & Google Scholar Record
              </h2>
              <a
                href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-500 hover:underline flex items-center gap-1"
              >
                <span>View Google Scholar Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">Working Papers in Applied Computational Humanities (2026) · Pre-Print</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa, Past and Present
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">African Studies Review (2026) · Review of Davidson & Lawrance (Ohio UP, 2025)</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Gender in French Banlieue Cinema: Intersectional Perspectives
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">French Review (2025) · Review of Caporale, Mouflard & Zanzana (2025)</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  This too shall pass
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">Literary & Philosophical Essay (2024)</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Nature's Hymn
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">Poetic & Philological Treatise (2023)</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Je pars by Diary Sow
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">Francophone Literary Studies (2023) · Review of Diary Sow (2021)</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
                <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Les Larmes d'une Plume Esseulée
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">French Literary Collection (2020)</div>
              </div>
            </div>
          </section>

        </article>
      </div>
    </GlobalShell>
  )
}
