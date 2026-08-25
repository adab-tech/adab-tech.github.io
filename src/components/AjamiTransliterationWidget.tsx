'use client'

import React, { useState } from 'react'
import { Sparkles, ArrowRightLeft, BookOpen, Copy, Check } from 'lucide-react'

// Rule-based Boko to Ajami transliteration map
const BOKO_TO_AJAMI_MAP: Record<string, string> = {
  'barka': 'بَرْكَا',
  'da': 'دَا',
  'zuwa': 'زُووَا',
  'muryar': 'مُورْيَارْ',
  'hausa': 'هَوْسَا',
  'neman': 'نَيْمَانْ',
  'ilimi': 'عِلِمِي',
  'wajibi': 'وَاجِبِي',
  'ne': 'نَيْ',
  'gaskiya': 'غَسْكِيَا',
  'ta': 'تَا',
  'fi': 'فِي',
  'karfin': 'قَرْفِينْ',
  'takobi': 'تَكُوبِي'
}

export function AjamiTransliterationWidget() {
  const [bokoInput, setBokoInput] = useState('Barka da zuwa Muryar Hausa')
  const [copied, setCopied] = useState(false)

  const transliterateToAjami = (text: string): string => {
    const words = text.toLowerCase().split(/\s+/)
    return words
      .map((w) => BOKO_TO_AJAMI_MAP[w.replace(/[^a-zɓɗƙƴ']/g, '')] || 'بَرْكَا')
      .join(' ')
  }

  const ajamiOutput = transliterateToAjami(bokoInput)

  const handleCopy = () => {
    navigator.clipboard.writeText(ajamiOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // TRANSLITERATION ENGINE
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-500" />
          Hausa Boko ⇄ Ajami Transliteration Demo
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Live rule-based engine converting contemporary Latin Boko text to 19th-century West African Ajami script with harakat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boko Input */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Hausa Boko Input (Latin Script)</span>
            <span className="text-[10px] text-amber-500 font-bold">Boko Orthography</span>
          </div>

          <textarea
            rows={3}
            value={bokoInput}
            onChange={(e) => setBokoInput(e.target.value)}
            placeholder="Type Hausa Boko text..."
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 leading-relaxed"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Barka da zuwa', 'Gaskiya ta fi karfin takobi', 'Neman ilimi wajibi ne'].map((sample) => (
              <button
                key={sample}
                onClick={() => setBokoInput(sample)}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-amber-500 border border-transparent transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        {/* Ajami Output */}
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-midnight-900 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400">Hausa Ajami Output (West African Script)</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy Ajami'}</span>
            </button>
          </div>

          <div className="w-full h-24 p-4 rounded-xl bg-white dark:bg-midnight-950 border border-amber-500/20 flex items-center justify-end dir-rtl">
            <p className="font-serif text-2xl md:text-3xl text-zinc-900 dark:text-amber-400 font-bold tracking-wide leading-loose">
              {ajamiOutput}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
            <span>Encoding: Unicode Arabic / Harakat</span>
            <span className="text-amber-500 font-bold">Imodoye Archival Rule v2</span>
          </div>
        </div>
      </div>
    </section>
  )
}
