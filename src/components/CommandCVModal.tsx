'use client'

import React, { useState } from 'react'
import { FileText, X, Globe, Download, Award, BookOpen, Cpu, Briefcase, GraduationCap, MapPin } from 'lucide-react'

export interface LanguageSkill {
  name: string
  level: string
  note: string
}

const POLYGLOT_LANGUAGES: LanguageSkill[] = [
  { name: 'Hausa', level: 'Native (L1)', note: 'OPI Tester Eligible · Speech AI Focus' },
  { name: 'English', level: 'Native / Fluent', note: 'Academic & Technical Writing' },
  { name: 'Fulfulde', level: 'Native / Fluent', note: 'Sahelian Field Research' },
  { name: 'Pidgin English', level: 'Native / Fluent', note: 'Nigerian Pidgin English' },
  { name: 'Sango', level: 'Fluent / Near-Native', note: 'Central African Literacy Corpus' },
  { name: 'French', level: 'Fluent / Near-Native', note: 'Instructor of Record · Univ. of Alabama' },
  { name: 'Arabic', level: 'Professional / Proficient', note: 'Kano Ajami Scriptural Philology' },
  { name: 'Yoruba', level: 'Professional / Proficient', note: 'West African Niger-Congo' },
  { name: 'German', level: 'Basic', note: 'Philological Research' },
  { name: 'Spanish', level: 'Basic', note: 'Comparative Romance NLP' }
]

export function CommandCVModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 font-bold shadow-sm"
      >
        <FileText className="h-3.5 w-3.5" />
        <span>Curriculum Vitae</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-midnight-900 p-6 md:p-8 text-zinc-50 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-mono">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs text-amber-400 font-bold tracking-widest">// OFFICIAL ACADEMIC & RESEARCH CURRICULUM VITAE</span>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-50">Adamu Danjuma Abubakar</h2>
              <p className="text-xs font-mono text-amber-500 font-semibold">
                NLP Systems Architect | Applied AI Researcher | Speech AI Engineer | Computational Linguist
              </p>
              <p className="text-xs font-sans text-zinc-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gold-400" /> Atlanta, GA · Open to Remote & Relocation Worldwide</span>
                <span>•</span>
                <span>adamudanjuma1@outlook.com</span>
                <span>•</span>
                <span>(205) 671-1129</span>
                <span>•</span>
                <span>ORCID: 0009-0009-4672-4956</span>
              </p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5 text-xs">
              <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> PROFESSIONAL SUMMARY
              </h3>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed bg-midnight-950 p-3.5 rounded-xl border border-zinc-800">
                Computational linguist and NLP systems architect building AI models and voice engines for low-resource African languages, with a deep technical focus on Hausa. PhD candidate in Romance Languages (Applied Computational Linguistics) at the University of Alabama. Founder of Murya (<strong className="text-amber-400">murya.ng</strong>), an open multi-speaker Hausa neural TTS platform. Commands 10 languages (5 on the U.S. DoD Strategic Language List), validated by industry (Meta, Innodata) and academic/government institutions (ACTFL).
              </p>
            </div>

            {/* Industry Recognition */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <Award className="h-4 w-4" /> SELECTED INDUSTRY & SECTOR RECOGNITION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-midnight-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-zinc-100 block">Meta (2024)</span>
                  <p className="text-[11px] font-sans text-zinc-400">Data Labeling Analyst II — LLM Training. Red teaming, safety alignment, benchmark evaluations for hallucination mitigation.</p>
                </div>
                <div className="p-3 rounded-xl bg-midnight-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-zinc-100 block">Innodata (2024)</span>
                  <p className="text-[11px] font-sans text-zinc-400">Generative AI Specialist (Humanities SME) — RLHF instruction-tuning, preference ranking, human feedback protocols.</p>
                </div>
                <div className="p-3 rounded-xl bg-midnight-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-zinc-100 block">ACTFL (2024)</span>
                  <p className="text-[11px] font-sans text-zinc-400">Hausa Oral Proficiency Interview (OPI) Tester for U.S. government & military personnel.</p>
                </div>
                <div className="p-3 rounded-xl bg-midnight-950 border border-zinc-800 space-y-1">
                  <span className="font-bold text-zinc-100 block">YALI Fellow</span>
                  <p className="text-[11px] font-sans text-zinc-400">Young African Leaders Initiative Fellow — Sovereign AI & Digital Accessibility Leader.</p>
                </div>
              </div>
            </div>

            {/* Polyglot Matrix (10 Languages from CV Page 4) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> POLYGLOT LINGUISTIC MATRIX (10 LANGUAGES)
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">5 on U.S. DoD Strategic Language List</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                {POLYGLOT_LANGUAGES.map((lang) => (
                  <div key={lang.name} className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                    <span className="font-bold text-zinc-100 block truncate">{lang.name}</span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">{lang.level}</span>
                    <span className="text-[9px] text-zinc-500 block truncate">{lang.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Publications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" /> EDUCATION
                </h3>
                <div className="space-y-2 font-sans text-xs">
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">Ph.D. Romance Languages</strong>
                    <span className="text-zinc-400 text-[11px]">French & Computational Humanities · Univ. of Alabama (Expected Dec 2026)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">M.A. Romance Languages & Culture</strong>
                    <span className="text-zinc-400 text-[11px]">University of Alabama (2023)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">B.A. French</strong>
                    <span className="text-zinc-400 text-[11px]">University of Ilorin, Nigeria (2019)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> INVITED TALKS & PUBLICATIONS
                </h3>
                <div className="space-y-2 font-sans text-xs">
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">Univ. of Trier, Germany (2026)</strong>
                    <span className="text-zinc-400 text-[11px]">Reviving Nana Asma'u bint Fodio's Contribution to Scholarship through Poetry</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">Harvard University (2025)</strong>
                    <span className="text-zinc-400 text-[11px]">Empire Bokassa: The Rise and Fall of a Political Institution</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800">
                    <strong className="text-zinc-100 block">Springer AI and Ethics (Under Review)</strong>
                    <span className="text-zinc-400 text-[11px]">Humanities Perspectives on Agentic AI: Cultural Knowledge & Governance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <a
                href="https://github.com/adab-tech"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                View GitHub Code Repositories →
              </a>

              <button
                onClick={() => {
                  alert('Academic CV download initiated: Adamu_Danjuma_Abubakar_CV.pdf')
                }}
                className="px-5 py-2.5 rounded-xl bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-colors flex items-center gap-1.5 shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Download Complete Academic CV (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
