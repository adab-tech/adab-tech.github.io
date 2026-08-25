'use client'

import React, { useState } from 'react'
import { Volume2, Sparkles, HelpCircle } from 'lucide-react'

export interface ConsonantData {
  char: string
  name: string
  ipa: string
  type: string
  exampleHausa: string
  meaning: string
  audioUrl: string
}

const CONSONANTS: ConsonantData[] = [
  {
    char: 'ɓ',
    name: 'B-Hooked',
    ipa: '/ɓ/',
    type: 'Voiced Bilabial Implosive',
    exampleHausa: 'ɓaɓatu',
    meaning: 'Chamber / Chatter',
    audioUrl: 'https://murya.ng/samples/female.wav'
  },
  {
    char: 'ɗ',
    name: 'D-Hooked',
    ipa: '/ɗ/',
    type: 'Voiced Alveolar Implosive',
    exampleHausa: 'ɗa',
    meaning: 'Son / Child',
    audioUrl: 'https://murya.ng/samples/male.wav'
  },
  {
    char: 'ƙ',
    name: 'K-Hooked',
    ipa: '/ƙ/',
    type: 'Velar Ejective Consonant',
    exampleHausa: 'ƙasa',
    meaning: 'Earth / Country',
    audioUrl: 'https://murya.ng/samples/hero.wav'
  },
  {
    char: 'ƴ',
    name: 'Y-Hooked',
    ipa: '/ʄ/ or /ʔʲ/',
    type: 'Palatal Implosive / Glottalized Y',
    exampleHausa: 'ƴaƴa',
    meaning: 'Children / Fruit',
    audioUrl: 'https://murya.ng/samples/female.wav'
  },
  {
    char: 'ꞌ',
    name: 'Hamza / Glottal Stop',
    ipa: '/ʔ/',
    type: 'Glottal Stop Consonant',
    exampleHausa: "ma'ana",
    meaning: 'Meaning',
    audioUrl: 'https://murya.ng/samples/male.wav'
  }
]

export function PhoneticSoundboard() {
  const [activeChar, setActiveChar] = useState<ConsonantData>(CONSONANTS[0])
  const [isPlaying, setIsPlaying] = useState(false)

  const playSound = (data: ConsonantData) => {
    setActiveChar(data)
    setIsPlaying(true)
    const audio = new Audio(data.audioUrl)
    audio.play().then(() => {
      setTimeout(() => setIsPlaying(false), 2000)
    }).catch(() => setIsPlaying(false))
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // PHONETIC SOUNDBOARD
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-amber-500" />
          Hausa Orthography & Implosive Consonant Guide
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Interactive phonetic breakdown explaining why ASCII tokenizers fail for Hausa hooked consonants (ɓ, ɗ, ƙ, ƴ).
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CONSONANTS.map((item) => (
          <button
            key={item.char}
            onClick={() => playSound(item)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
              activeChar.char === item.char
                ? 'border-amber-500 bg-amber-500/15 text-zinc-900 dark:text-zinc-50 shadow-md scale-105'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <span className="font-serif text-3xl font-bold text-amber-500">{item.char}</span>
            <span className="font-mono text-[11px] font-semibold">{item.ipa}</span>
            <span className="text-[10px] font-sans text-zinc-400 truncate max-w-full">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-4xl font-bold text-amber-500">{activeChar.char}</span>
            <div>
              <h3 className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-50">
                {activeChar.name} ({activeChar.ipa})
              </h3>
              <span className="text-xs font-mono text-emerald-500 font-semibold">{activeChar.type}</span>
            </div>
          </div>

          <div className="font-mono text-xs text-zinc-600 dark:text-zinc-300 space-x-3 pt-1">
            <span>Example: <strong className="text-amber-500">{activeChar.exampleHausa}</strong></span>
            <span>•</span>
            <span>Meaning: <em>"{activeChar.meaning}"</em></span>
          </div>
        </div>

        <button
          onClick={() => playSound(activeChar)}
          className="px-5 py-2.5 rounded-xl bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-400 transition-transform active:scale-95 shadow-md flex items-center space-x-2 shrink-0"
        >
          <Volume2 className="h-4 w-4 fill-current" />
          <span>{isPlaying ? 'Playing Sample...' : 'Hear Native Pronunciation'}</span>
        </button>
      </div>
    </section>
  )
}
