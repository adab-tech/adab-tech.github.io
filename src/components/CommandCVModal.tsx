'use client'

import React, { useState } from 'react'
import { FileText, ExternalLink, X, Globe, Download, Award, BookOpen, Cpu, Briefcase, GraduationCap, MapPin } from 'lucide-react'

export interface LanguageSkill {
  name: string
  level: string
  note: string
}

const POLYGLOT_LANGUAGES: LanguageSkill[] = [
  { name: 'Hausa', level: 'Native (L1)', note: 'ACTFL OPI Tester Eligible · Primary Speech AI Corpuses' },
  { name: 'English', level: 'Near Native', note: 'Academic Writing, Research Publications & Specs' },
  { name: 'French', level: 'Near Native', note: 'Instructor of Record (FR 101/102/201/202) · B.A. French' },
  { name: 'Sango', level: 'Fluent (C1)', note: 'Central African Lingua Franca · App Development for CAR & Diaspora' },
  { name: 'Yoruba', level: 'Fluent', note: 'West African Niger-Congo Tonal Language' },
  { name: 'Nigerian Pidgin', level: 'Fluent', note: 'Anglophone West African Creole & Dialectology' },
  { name: 'Fulfulde', level: 'Fluent', note: 'Sahelian Chadic-Congo Pastoralist Dialect' },
  { name: 'Arabic', level: 'Advanced / Classical', note: 'Kano Ajami Scriptural Philology & Harakat Diacritics' },
  { name: 'German', level: 'Basic', note: 'Reading Knowledge for Philological & Linguistic Texts' },
  { name: 'Spanish', level: 'Basic', note: 'Comparative Romance Linguistics & Corpus Research' }
]

export function CommandCVModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 font-mono text-xs font-bold transition-colors"
        title="View Full Academic CV & Polyglot Matrix"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>Academic CV</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-midnight-900/95 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                  // SCHOLARLY DOSSIER & CURRICULUM VITAE
                </span>
                <h2 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  Adamu Danjuma Abubakar · PhD Candidate
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href="/cv"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open Full CV</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-sans text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              
              {/* Profile Summary */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm font-mono">
                  <GraduationCap className="h-4 w-4 text-amber-500" />
                  Academic Profile & Affiliation
                </div>
                <p>
                  PhD Candidate in Romance Languages at the <strong>University of Alabama</strong> (Expected Dec 2026). Specializing in Sovereign Speech AI, Low-Resource African Language NLP, and Digital Philology.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-mono text-zinc-500">
                  <span>📍 Tuscaloosa, AL / Abuja, Nigeria</span>
                  <span>·</span>
                  <span>ORCID: 0009-0009-4672-4956</span>
                  <span>·</span>
                  <span>contact@adamu.tech</span>
                </div>
              </div>

              {/* Verified 10-Language Polyglot Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-amber-500" />
                    Verified 10-Language Polyglot Competency Matrix
                  </h3>
                  <span className="text-[11px] font-mono text-amber-500">5 DoD Strategic Languages</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {POLYGLOT_LANGUAGES.map((l) => (
                    <div key={l.name} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-midnight-950/60 flex items-start justify-between space-x-2">
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-xs">{l.name}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{l.note}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shrink-0">
                        {l.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Experience Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-amber-500" />
                    Education & Fellowships
                  </h3>
                  <ul className="space-y-3 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">PhD Candidate in Romance Languages</div>
                      <div className="text-zinc-500">University of Alabama · 2023 - 2026 (Expected)</div>
                    </li>
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">M.A. in Romance Languages (French)</div>
                      <div className="text-zinc-500">University of Alabama · 2021 - 2023</div>
                    </li>
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">B.A. (Hons) French</div>
                      <div className="text-zinc-500">University of Ilorin · 2015 - 2019</div>
                    </li>
                    <li>
                      <div className="font-bold text-amber-600 dark:text-amber-400 font-mono">YALI Fellow</div>
                      <div className="text-zinc-500">Young African Leaders Initiative · Cohort 12</div>
                    </li>
                  </ul>
                </div>

                {/* Industry & Appointments */}
                <div className="space-y-3">
                  <h3 className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                    Appointments & Industry AI Roles
                  </h3>
                  <ul className="space-y-3 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">Meta (2024)</div>
                      <div className="text-zinc-500">Data Labeling Analyst II — LLM Safety & Hallucination Mitigation</div>
                    </li>
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">Innodata (2024)</div>
                      <div className="text-zinc-500">Generative AI Specialist (Humanities SME) — RLHF & Alignment</div>
                    </li>
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">ACTFL (2024)</div>
                      <div className="text-zinc-500">Certified Hausa OPI Tester for U.S. Defense & Intelligence</div>
                    </li>
                    <li>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">Instructor of Record</div>
                      <div className="text-zinc-500">Univ. of Alabama · French Language (FR 101, 102, 201, 202)</div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Invited Keynotes & Scholarly Talks */}
              <div className="space-y-2">
                <h3 className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  Key Invited Lectures & Conference Presentations
                </h3>
                <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950/50 space-y-2 text-xs">
                  <div>
                    <strong>University of Trier (Germany, 2024):</strong> "Neural Speech Synthesis for Low-Resource Chadic Languages: The Murya Piper Architecture."
                  </div>
                  <div>
                    <strong>Harvard University (2024):</strong> "Ajami Manuscripts, Digital Philology, and African Language Preservation in the Age of Generative AI."
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
