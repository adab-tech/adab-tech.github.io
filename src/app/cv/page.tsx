'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ArrowLeft, Printer, Mail, Globe, MapPin, BookOpen, GraduationCap, Briefcase, Languages, ExternalLink, Cpu, Database } from 'lucide-react'

// Self-assessed levels. Add a certification only where one can be documented.
const LANGUAGES_DATA = [
  { name: 'Hausa', level: 'Native', note: 'First language' },
  { name: 'English', level: 'Near-native', note: 'Primary academic and professional working language' },
  { name: 'French', level: 'Full professional', note: 'B.A. French (University of Ilorin) · M.A. Romance Languages (University of Alabama)' },
  { name: 'Fulfulde (Fula)', level: 'Full professional', note: '' },
  { name: 'Nigerian Pidgin', level: 'Advanced', note: '' },
  { name: 'Arabic', level: 'Advanced (working)', note: 'Classical Arabic' },
  { name: 'Sango', level: 'Fluent', note: '' },
  { name: 'Yoruba', level: 'Professional working', note: '' },
  { name: 'Spanish', level: 'Basic working', note: 'Reading' },
  { name: 'German', level: 'Basic working', note: 'Reading' }
]

// Book reviews in journals first, then the pre-print, then creative writing,
// so peer-reviewed venues aren't mixed with self-published work.
const PUBLICATION_GROUPS: { heading: string; items: { title: string; venue: string; href?: string }[] }[] = [
  {
    heading: 'Book reviews',
    items: [
      { title: 'Pathos and Power: Interdisciplinary Perspectives on Widowhood in Africa, Past and Present', venue: 'African Studies Review (2026), pp. 1–2 · Review of Davidson & Lawrance (Ohio UP, 2025)' },
      { title: 'Gender in French Banlieue Cinema: Intersectional Perspectives', venue: 'Women in French Studies 33 (1), pp. 221–223 (2025) · Review of Caporale, Mouflard & Zanzana' },
      { title: 'Je pars by Diary Sow', venue: 'Women in French Studies 31 (1), pp. 174–176 (2023) · Review of Diary Sow (2021)' },
    ],
  },
  {
    heading: 'Pre-prints',
    items: [
      { title: 'Humanities Perspectives on Agentic AI: Cultural Knowledge, Postcolonial Epistemologies, and a Framework for Governance', venue: 'Pre-print (2026) · adamu.tech', href: '/papers/agentic-ai/' },
    ],
  },
  {
    heading: 'Creative writing',
    items: [
      { title: 'This too shall pass', venue: 'Essay (2024)' },
      { title: "Nature's Hymn", venue: 'Creative writing (2023)' },
      { title: "Les Larmes d'une Plume Esseulée", venue: 'Collection, in French (2020)' },
    ],
  },
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
            <span>Back to home</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            
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
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-zinc-50 tracking-tight">
                  Adamu Danjuma Abubakar
                </h1>
                <p className="text-sm sm:text-base font-mono text-amber-400 font-semibold">
                  Computational Linguist · African-Language Speech Technology
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Tuscaloosa, AL · Open to Relocation & Global Remote</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-amber-500 shrink-0" /> adamu.tech</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" /> contact@adamu.tech</span>
                </div>
              </div>

              {/* External Profile Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 lg:shrink-0 lg:max-w-xs lg:justify-end">
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
                  href="https://orcid.org/0009-0009-4672-4956"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-semibold text-lime-400 hover:border-lime-500 transition-colors shadow-sm"
                >
                  <span>ORCID 0009-0009-4672-4956</span>
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
                  <span>Ph.D. Candidate in Romance Languages</span>
                  <span className="text-amber-400 text-xs">Expected Dec 2026</span>
                </div>
                <div className="text-zinc-400 font-mono text-xs">The University of Alabama · Tuscaloosa, AL</div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Master of Arts (M.A.) in Romance Languages</span>
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
              Experience
            </h2>

            <div className="space-y-4 text-xs sm:text-sm font-sans">
              
              {/* Murya Forensic Breakdown */}
              <div className="p-4 sm:p-6 rounded-2xl border border-amber-500/40 bg-[#15213D] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span className="text-sm sm:text-base text-amber-400 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 shrink-0 text-amber-400" />
                    Founder & Linguistic Lead — Murya (app.murya.ng)
                  </span>
                  <span className="text-amber-400 text-xs">2024 – Present</span>
                </div>

                <p className="text-zinc-200 leading-relaxed">
                  Founded <strong>Murya</strong>, a Hausa speech synthesis and conversational platform live at <a href="https://app.murya.ng" target="_blank" rel="noreferrer" className="text-amber-400 underline font-bold">app.murya.ng</a>. I lead its linguistic design and product and work with engineering to ship it:
                </p>

                <ul className="space-y-2 pl-4 list-disc text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  <li>
                    <strong>Speech synthesis:</strong> 24 kHz multi-speaker Piper VITS models fine-tuned on the WAXAL Hausa corpus and published as open weights (<code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-[10px] text-amber-300">adab-tech/murya-piper-hausa-tts</code>) with two voices, <em>Malama Asabe</em> (female) and <em>Malam Garba</em> (male), and under 110 ms to first audio in the browser.
                  </li>
                  <li>
                    <strong>Tone:</strong> syllable-weight segmentation (light CV vs heavy CVV/CVC) and right-to-left tonal melody mapping, following Litvinova, to guide Hausa pitch.
                  </li>
                  <li>
                    <strong>Pragmatics:</strong> Hausa politeness and respect norms (<code className="font-mono text-[10px] text-amber-300">Kunya & Girmamawa</code>), gendered address forms (<code className="font-mono text-[10px] text-amber-300">Namiji ka/maka vs Mace ki/miki</code>), and pedagogical tutor modes (<code className="font-mono text-[10px] text-amber-300">Malamin Hausa</code>).
                  </li>
                  <li>
                    <strong>Ƙamus lexicon:</strong> curated the 20,628-pair Robinson 1914 lexicon, published on Hugging Face (public domain), and obtained written permission from Prof. Paul Newman to use his 1977 <em>Modern Hausa–English Dictionary</em> internally (not redistributed) for dictionary-grounded lookup.
                  </li>
                  <li>
                    <strong>Live voice:</strong> real-time spoken conversation (Faster-Whisper speech recognition with echo suppression); dictionary and speech synthesis also work offline in the browser.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>Graduate Researcher & Teaching Fellow — University of Alabama</span>
                  <span className="text-zinc-400 font-mono text-xs">2021 – Present</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Teach undergraduate courses in Romance languages; present on the legacy of Nana Asma&apos;u bint Fodio&apos;s poetry and scholarship in Hausa, Ajami, Fulfulde, and Arabic; and write on the humanities and AI governance.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                  <span>AI Linguistic Specialist (RLHF & Red-Teaming) — Contract</span>
                  <span className="text-zinc-400 font-mono text-xs">2023 – Present</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Red-teaming, cultural-alignment review, and preference ranking for multilingual large language models, focused on low-resource African languages.
                </p>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Languages className="h-5 w-5 text-amber-500 shrink-0" />
              Languages
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
                  {l.note && <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">{l.note}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Peer-Reviewed & Google Scholar Publications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-500 shrink-0" />
                Publications
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

            {PUBLICATION_GROUPS.map((group) => (
              <div key={group.heading} className="space-y-3 text-xs sm:text-sm font-sans">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400">{group.heading}</h3>
                {group.items.map((item) => (
                  <div key={item.title} className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                    <div className="font-mono font-bold text-zinc-100 text-sm">
                      {item.href ? (
                        <Link href={item.href} className="hover:text-amber-400 transition-colors">{item.title}</Link>
                      ) : item.title}
                    </div>
                    <div className="text-zinc-400 font-mono text-[11px]">{item.venue}</div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          {/* Research Datasets & Digital Projects (self-published, archived with DOIs) */}
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Database className="h-5 w-5 text-amber-500 shrink-0" />
              Research Datasets & Digital Projects
            </h2>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <div className="font-mono font-bold text-zinc-100 text-sm">
                    Mapping Voices: An Open Atlas of Oral-History and Voice-Testimony Collections
                  </div>
                  <span className="text-zinc-400 font-mono text-xs shrink-0">2026</span>
                </div>
                <div className="text-zinc-400 font-mono text-[11px]">
                  Dataset (v0.4.0) · Zenodo · CC BY 4.0 · Creator &amp; curator ·{' '}
                  <a href="https://doi.org/10.5281/zenodo.22996478" target="_blank" rel="noreferrer" className="text-amber-400 underline break-all">
                    doi:10.5281/zenodo.22996478
                  </a>
                </div>
                <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                  Open research dataset and interactive atlas indexing 221 real, publicly documented oral-history and
                  voice-testimony collections across 120 countries and territories and 125 languages. Persistent
                  identifiers, controlled vocabularies (ISO 639-3, ISO 3166, UN M49), a published methodology, and an
                  append-only review log; released as CSV, JSON, and GeoJSON with an interface in English, Hausa,
                  French, and Arabic.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
                  <a href="https://adamu.tech/mapping/" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1">
                    <span>Live atlas</span><ExternalLink className="h-3 w-3" />
                  </a>
                  <a href="https://github.com/adab-tech/mapping" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-1">
                    <span>Source &amp; methodology</span><ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </section>

        </article>
      </div>
    </GlobalShell>
  )
}
