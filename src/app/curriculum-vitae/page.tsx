'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ArrowLeft, Printer, Mail, Globe, MapPin, BookOpen, GraduationCap, Briefcase, Languages, ExternalLink, Cpu } from 'lucide-react'
import { VisitorCounter } from '@/components/VisitorCounter'

const LANGUAGES_DATA = [
  { name: 'Hausa', level: 'Native / Bilingual (C2)', note: 'First Language · West Chadic Dialectologist · ACTFL Certified' },
  { name: 'English', level: 'Bilingual / Near-Native (C2)', note: 'Academic & Professional Primary Working Language' },
  { name: 'French', level: 'Full Professional (C1/C2)', note: 'B.A. French (Unilorin), M.A. French (UA) · Romance Philology' },
  { name: 'Fulfulde (Fula)', level: 'Full Proficiency (C1/C2)', note: 'Senegambian & Sahelian Cross-Border Lingua Franca' },
  { name: 'Nigerian Pidgin English', level: 'Advanced Proficiency (C1/C2)', note: 'West African Anglophone Creole · Sociolinguistic Modeling' },
  { name: 'Arabic', level: 'Advanced / Working (B2/C1)', note: 'Classical Arabic & Kano Ajami Paleography' },
  { name: 'Sango', level: 'Fluent (C1)', note: 'Central African Lingua Franca · App Development for CAR & Diaspora' },
  { name: 'Yoruba', level: 'Professional Working (B2)', note: 'Southwestern Nigerian Lingua Franca · Tone Modeling' },
  { name: 'Spanish', level: 'Basic Working Proficiency (A2/B1)', note: 'Comparative Romance Linguistics & Reading' },
  { name: 'German', level: 'Basic Working Proficiency (A2/B1)', note: 'Germanic Philology & Academic Reading' }
]

export default function AcademicCVPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <GlobalShell>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 bg-[#0B1120]">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Platform Dossier</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <VisitorCounter />
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* CV Document Container - 100% Solid Obsidian Dark Canvas */}
        <article className="p-5 sm:p-8 md:p-12 rounded-2xl border border-zinc-800 bg-[#0E1526] text-zinc-100 shadow-xl space-y-8 sm:space-y-10 font-sans">
          
          {/* Header & Bio */}
          <div className="space-y-4 border-b border-zinc-800 pb-6 sm:pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-zinc-50 tracking-tight">
                  Adamu Danjuma Abubakar
                </h1>
                <p className="text-sm sm:text-base font-mono text-amber-400 font-semibold">
                  Applied Computational Linguist · Speech AI Architect · Polyglot (10 Languages)
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Tuscaloosa, AL / Kano, Nigeria</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-amber-500 shrink-0" /> adamu.tech</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" /> adamudanjuma1@outlook.com</span>
                </div>
              </div>

              {/* External Profile Badges */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                <a
                  href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-semibold text-blue-400 hover:border-blue-500 transition-colors shadow-sm"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Google Scholar</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://huggingface.co/adab-tech"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-semibold text-amber-400 hover:border-amber-500 transition-colors shadow-sm"
                >
                  <span>Hugging Face</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Academic Appointments & Education */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <GraduationCap className="h-5 w-5 text-amber-500 shrink-0" />
              Education & Academic Credentials
            </h2>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-sans">
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Ph.D. Candidate in Romance Languages (Applied Computational Humanities)</span>
                  <span className="text-amber-400 text-xs">Expected Dec 2026</span>
                </div>
                <div className="text-zinc-400 font-mono text-xs">The University of Alabama · Tuscaloosa, AL</div>
                <p className="text-zinc-300 pt-1 text-xs sm:text-sm leading-relaxed">
                  Dissertation: <em>Sovereign African Speech Intelligence: Dialectal Synthesis, Postcolonial AI Governance, and Chadic Acoustic Architectures.</em>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Master of Arts (M.A.) in Romance Languages (French Linguistics)</span>
                  <span className="text-zinc-400 font-mono text-xs">2023</span>
                </div>
                <div className="text-zinc-400 font-mono text-xs">The University of Alabama · Tuscaloosa, AL</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Bachelor of Arts (B.A. Hons) in French</span>
                  <span className="text-zinc-400 font-mono text-xs">2019</span>
                </div>
                <div className="text-zinc-400 font-mono text-xs">University of Ilorin · Ilorin, Nigeria</div>
              </div>
            </div>
          </section>

          {/* Research & Industry Experience — Enriched with Murya Forensics */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Briefcase className="h-5 w-5 text-amber-500 shrink-0" />
              Applied AI & Systems Architecture Experience
            </h2>

            <div className="space-y-4 text-xs sm:text-sm font-sans">
              
              {/* Murya Forensic Breakdown */}
              <div className="p-4 sm:p-6 rounded-2xl border border-amber-500/40 bg-[#15213D] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span className="text-sm sm:text-base text-amber-400 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 shrink-0 text-amber-400" />
                    Founder & Lead Systems Architect — Murya Speech AI (app.murya.ng)
                  </span>
                  <span className="text-amber-400 text-xs">2024 – Present</span>
                </div>

                <p className="text-zinc-200 leading-relaxed">
                  Pioneered and built <strong>Murya OS</strong>, a sovereign African speech synthesis and conversational intelligence ecosystem running live in production at <a href="https://app.murya.ng" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">app.murya.ng</a>:
                </p>

                <ul className="space-y-2 pl-4 list-disc text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  <li>
                    <strong>24kHz Neural Acoustic Modeling:</strong> Architected and fine-tuned multi-speaker Piper VITS ONNX models (<code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-[10px] text-amber-300">adab-tech/murya-piper-hausa-tts</code>) featuring <em>Malama Asabe</em> (Female) and <em>Malam Garba</em> (Male) with zero-latency streaming.
                  </li>
                  <li>
                    <strong>Litvinova Right-to-Left Tonal Melody Mapping:</strong> Integrated syllable weight segmentation (Light CV vs Heavy CVV/CVC) and backwards pitch-accent contouring directly into acoustic generation.
                  </li>
                  <li>
                    <strong>Native Chadic Sociolinguistics:</strong> Engineered cultural pragmatics protocols (<code className="font-mono text-[10px] text-amber-300">Kunya & Girmamawa</code>), gendered address forms (<code className="font-mono text-[10px] text-amber-300">Namiji ka/maka vs Mace ki/miki</code>), and pedagogical tutor modes (<code className="font-mono text-[10px] text-amber-300">Malamin Hausa</code>).
                  </li>
                  <li>
                    <strong>30,708-Entry Ƙamus (Lexical Engine):</strong> Curated the 20,628-pair Robinson 1914 Lexicon on Hugging Face and secured direct written permission from Prof. Paul Newman to ingest the 1977 <em>Modern Hausa–English Dictionary</em>, creating an authoritative, zero-hallucination lexical grounding service.
                  </li>
                  <li>
                    <strong>Bidirectional WebSocket Audio Pipeline:</strong> Engineered the offline-first <code className="font-mono text-[10px] text-amber-300">/api/live</code> real-time audio pipeline with 16kHz Faster-Whisper VAD and rising-edge microphone buffer purging to eliminate self-echo and streaming latency.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Graduate Researcher & Teaching Fellow — University of Alabama</span>
                  <span className="text-zinc-400 font-mono text-xs">2021 – Present</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Instruct undergraduate Romance linguistic courses, conduct digital philology research on 19th-century West African Ajami manuscripts, and author frameworks for agentic AI governance.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>AI Linguistic Specialist (RLHF & Red-Teaming) — Leading Frontier AI Labs</span>
                  <span className="text-zinc-400 font-mono text-xs">2023 – Present</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Conduct safety red-teaming, cultural alignment, and preference ranking evaluations for state-of-the-art multilingual LLMs spanning low-resource African languages.
                </p>
              </div>
            </div>
          </section>

          {/* 10-Language Polyglot Matrix */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Languages className="h-5 w-5 text-amber-500 shrink-0" />
              10-Language Polyglot Competency Matrix
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {LANGUAGES_DATA.map((l) => (
                <div
                  key={l.name}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-100 text-sm">{l.name}</span>
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{l.level}</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">{l.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Peer-Reviewed & Google Scholar Publications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-500 shrink-0" />
                Publications & Google Scholar Record
              </h2>
              <a
                href="https://scholar.google.com/citations?hl=en&user=08cPiU8AAAAJ"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Google Scholar Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">Working Papers in Applied Computational Humanities (2026) · Pre-Print</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa, Past and Present
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">African Studies Review (2026), pp. 1–2 · Review of Davidson & Lawrance (Ohio UP, 2025)</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Gender in French Banlieue Cinema: Intersectional Perspectives
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">Women in French Studies 33 (1), pp. 221–223 (2025) · Review of Caporale, Mouflard & Zanzana</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  This too shall pass
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">Literary & Philosophical Essay (2024)</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Nature's Hymn
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">Poetic & Philological Treatise (2023)</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Je pars by Diary Sow
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">Women in French Studies 31 (1), pp. 174–176 (2023) · Review of Diary Sow (2021)</div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="font-mono font-bold text-zinc-100 text-sm">
                  Les Larmes d'une Plume Esseulée
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">French Literary Collection (2020)</div>
              </div>
            </div>
          </section>

        </article>
      </div>
    </GlobalShell>
  )
}
