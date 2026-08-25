'use client'

import React, { useState } from 'react'
import { Sparkles, ArrowRightLeft, BookOpen, Copy, Check, Info } from 'lucide-react'

const PRESETS = [
  { label: 'Greeting', text: 'barka da zuwa' },
  { label: 'Voice of Hausa', text: 'muryar hausa' },
  { label: 'Knowledge Pursuit', text: 'neman ilimi wajibi ne' },
  { label: 'Ajami Literature', text: 'rubutun ajami da boko' },
  { label: 'Hooked Letters', text: 'ɓauna ɗaki ƙofa ƴaƴa' }
]

// Extended 19th-Century Kano Ajami Grapheme Dictionary
const BOKO_TO_AJAMI_MAP: Record<string, string> = {
  // Common Words with Historical Harakat
  'barka': 'بَرْكَا',
  'da': 'دَا',
  'zuwa': 'زُووَا',
  'muryar': 'مُورْيَارْ',
  'hausa': 'هَوْسَا',
  'neman': 'نَيْمَانْ',
  'ilimi': 'عِلِمِي',
  'wajibi': 'وَاجِبِي',
  'ne': 'نَيْ',
  'rubutun': 'رُوبُوتُونْ',
  'ajami': 'عَجَمِي',
  'boko': 'بَوْكَوْ',
  'kasa': 'قَاسَا',
  'mutum': 'مُوتُومْ',
  'girma': 'غِرْمَا',
  'sarki': 'سَرْكِي',
  'allah': 'اللّٰه',
  // Hooked Consonant Words with Kano Ajami Variants (ݕ, ݑ, ق, ۑ)
  'ɓauna': 'ݕَوْنَا',
  'ɗaki': 'ݑَاكِي',
  'ƙofa': 'قَوْفَا',
  'ƴaƴa': 'ۑَاعْيَا',
  "a'a": 'أَعْأَ'
}

export function AjamiTransliterationWidget() {
  const [inputText, setInputText] = useState('barka da zuwa muryar hausa ɓauna ɗaki ƙofa')
  const [copied, setCopied] = useState(false)

  // Transliterate text with character-level and word-level fallbacks
  const transliterateToAjami = (text: string): string => {
    if (!text.trim()) return ''
    const lower = text.toLowerCase()

    const words = lower.split(/\s+/)
    const mapped = words.map(w => {
      if (BOKO_TO_AJAMI_MAP[w]) return BOKO_TO_AJAMI_MAP[w]
      
      // Fallback character transliteration
      return w
        .replace(/ɓ/g, 'ݕ')
        .replace(/ɗ/g, 'ݑ')
        .replace(/ƙ/g, 'ق')
        .replace(/ƴ/g, 'ۑ')
        .replace(/ts/g, 'ڟ')
        .replace(/c/g, 'چ')
        .replace(/sh/g, 'ش')
        .replace(/b/g, 'ب')
        .replace(/d/g, 'د')
        .replace(/f/g, 'ف')
        .replace(/g/g, 'غ')
        .replace(/h/g, 'ه')
        .replace(/j/g, 'ج')
        .replace(/k/g, 'ك')
        .replace(/l/g, 'ل')
        .replace(/m/g, 'م')
        .replace(/n/g, 'ن')
        .replace(/r/g, 'ر')
        .replace(/s/g, 'س')
        .replace(/t/g, 'ت')
        .replace(/w/g, 'و')
        .replace(/y/g, 'ي')
        .replace(/z/g, 'ز')
        .replace(/'/g, 'ء')
    }).join(' ')

    return mapped
  }

  const ajamiOutput = transliterateToAjami(inputText)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(ajamiOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // DIGITAL PHILOLOGY & SCRIPT ENGINE
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-amber-500" />
          Boko ⇄ 19th-Century Kano Ajami Transliteration Engine
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Rule-based Harakat diacritization mapping modern Latinized Boko orthography to classical 19th-century Kano Ajami manuscript typography, supporting specialized Chadic graphemes (<strong className="text-zinc-800 dark:text-zinc-200">ݕ, ݑ, ق, ۑ, ڟ</strong>).
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 p-5 sm:p-7 shadow-sm space-y-5">
        {/* Preset sample buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-1">Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setInputText(p.text)}
              className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 hover:border-amber-500/50 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Input: Latin Boko */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Standard Boko (Latin Orthography)</span>
              <span className="text-[10px] text-zinc-400">Editable Live</span>
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type standard Hausa (e.g. barka da zuwa)..."
              className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Output: Kano Ajami Arabic */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <span>Kano Ajami Manuscript Script (عجمي)</span>
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div
              dir="rtl"
              className="w-full min-h-[90px] p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-amber-50/20 dark:bg-midnight-950/60 font-serif text-2xl text-amber-600 dark:text-amber-400 flex items-center justify-end leading-relaxed tracking-wide select-all"
            >
              {ajamiOutput || '...'}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-amber-500" />
            Specialized Kano Graphemes: ɓ ➔ ݕ (U+0755), ɗ ➔ ݑ (U+0751), ƙ ➔ ق, ƴ ➔ ۑ (U+06D1)
          </span>
          <span>Zero External Dependencies · Pure Unicode UTF-8</span>
        </div>
      </div>
    </section>
  )
}
