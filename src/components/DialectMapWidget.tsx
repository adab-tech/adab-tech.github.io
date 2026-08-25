'use client'

import React, { useState } from 'react'
import { MapPin, Volume2, Globe } from 'lucide-react'

export interface DialectRegion {
  name: string
  region: string
  toneFeature: string
  sampleText: string
  audioUrl: string
}

const DIALECTS: DialectRegion[] = [
  {
    name: 'Kano (Kananci)',
    region: 'Standard Hausa / Central Nigeria',
    toneFeature: 'High-Low-High pitch contour stability; standard reference dialect.',
    sampleText: 'Barka da zuwa cibiyar Muryar Hausa',
    audioUrl: 'https://murya.ng/samples/hero.wav'
  },
  {
    name: 'Sokoto (Sakkwatanci)',
    region: 'Northwestern Nigeria & Niger',
    toneFeature: 'Retention of archaic palatalized consonants and high pitch registers.',
    sampleText: 'Gaskiya ta fi karfin takobi',
    audioUrl: 'https://murya.ng/samples/female.wav'
  },
  {
    name: 'Katsina (Katsinanci)',
    region: 'North-Central Nigeria',
    toneFeature: 'Distinct vowel length contrast and nasalized consonant endings.',
    sampleText: 'Sannu da zuwa, ina fatan kana lafiya',
    audioUrl: 'https://murya.ng/samples/male.wav'
  },
  {
    name: 'Zaria (Zazzaganci)',
    region: 'Southern Hausaland',
    toneFeature: 'Relaxed tone fall on final syllables with distinct lexical choices.',
    sampleText: 'Neman ilimi wajibi ne',
    audioUrl: 'https://murya.ng/samples/female.wav'
  }
]

export function DialectMapWidget() {
  const [selectedDialect, setSelectedDialect] = useState<DialectRegion>(DIALECTS[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const playDialectAudio = (dialect: DialectRegion) => {
    setSelectedDialect(dialect)
    setIsPlaying(true)
    const audio = new Audio(dialect.audioUrl)
    audio.play().then(() => {
      setTimeout(() => setIsPlaying(false), 2500)
    }).catch(() => setIsPlaying(false))
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // SOCIOLINGUISTIC ATLAS
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-500" />
          Hausa Dialectal & Tonal Pitch Contour Map
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Interactive sociolinguistic map comparing tonal pitch variations and phonetics across major Hausa regional dialects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {DIALECTS.map((d) => (
          <button
            key={d.name}
            onClick={() => playDialectAudio(d)}
            className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
              selectedDialect.name === d.name
                ? 'border-amber-500 bg-amber-500/10 text-zinc-900 dark:text-zinc-50 shadow-md'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {d.name}
              </span>
            </div>
            <p className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {d.region}
            </p>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 font-mono">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-500" />
            {selectedDialect.name} Dialect Profile
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-sans">
            {selectedDialect.toneFeature}
          </p>
          <span className="text-xs text-amber-500 font-mono block pt-1">Sample Phrase: "{selectedDialect.sampleText}"</span>
        </div>

        <button
          onClick={() => playDialectAudio(selectedDialect)}
          className="px-5 py-2.5 rounded-xl bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-transform active:scale-95 shadow-md flex items-center space-x-2 shrink-0"
        >
          <Volume2 className="h-4 w-4 fill-current" />
          <span>{isPlaying ? 'Streaming Audio...' : 'Play Dialect Sample'}</span>
        </button>
      </div>
    </section>
  )
}
