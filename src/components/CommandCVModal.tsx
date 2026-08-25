'use client'

import React, { useState } from 'react'
import { FileText, X, Globe, Download, Terminal, Award, BookOpen, Cpu } from 'lucide-react'

export function CommandCVModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-mono text-xs text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors flex items-center gap-1 font-bold"
      >
        <FileText className="h-3 w-3" />
        <span>Curriculum Vitae</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl border border-zinc-700 bg-midnight-900 p-6 md:p-8 text-zinc-50 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-mono">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="space-y-1.5 border-b border-zinc-800 pb-4">
              <span className="text-xs text-amber-400 font-bold">// ACADEMIC & RESEARCH CURRICULUM VITAE</span>
              <h2 className="text-2xl font-bold text-zinc-50">Adamu Danjuma Abubakar</h2>
              <p className="text-xs font-sans text-zinc-400">
                Computational Linguist & AI Researcher • ORCID: 0009-0009-4672-4956
              </p>
            </div>

            {/* Polyglot Linguistic Matrix (6+ Languages) */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <Globe className="h-4 w-4" /> POLYGLOT LINGUISTIC MATRIX (6+ LANGUAGES)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">Hausa</span>
                  <span className="text-[10px] text-emerald-400">Native (L1) • Speech Models</span>
                </div>
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">English</span>
                  <span className="text-[10px] text-emerald-400">Native / Fluent Academic</span>
                </div>
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">Arabic</span>
                  <span className="text-[10px] text-amber-400">Classical & Ajami Script</span>
                </div>
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">Yoruba</span>
                  <span className="text-[10px] text-indigo-400">West African Family</span>
                </div>
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">French</span>
                  <span className="text-[10px] text-indigo-400">International Research</span>
                </div>
                <div className="p-2.5 rounded-lg bg-midnight-950 border border-zinc-800 space-y-0.5">
                  <span className="font-bold text-zinc-100 block">Igbo</span>
                  <span className="text-[10px] text-indigo-400">Comparative NLP</span>
                </div>
              </div>
            </div>

            {/* Core Research Focus */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4" /> RESEARCH & PLATFORM CORE
              </h3>
              <ul className="space-y-1 text-zinc-300 font-sans text-xs leading-relaxed list-disc list-inside">
                <li>Founder & Lead Architect, <strong>murya.ng</strong> (Sovereign Hausa Speech Synthesis AI).</li>
                <li>Research Director, <strong>imodoye.ng</strong> (Digital Literary Archive & African Ajami Manuscripts).</li>
                <li>Chief Engineer, <strong>adab.ng</strong> (PropTech & Property Infrastructure Platform).</li>
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
              <a
                href="https://github.com/adab-tech"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                View GitHub Repositories →
              </a>

              <button
                onClick={() => {
                  alert('CV download initiated: Adamu_Abubakar_Academic_CV.pdf')
                }}
                className="px-5 py-2 rounded-lg bg-gold-500 text-zinc-950 font-bold text-xs hover:bg-gold-400 transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Download Official CV (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
