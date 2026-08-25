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
  freq: number
}

const CONSONANTS: ConsonantData[] = [
  {
    char: 'ɓ',
    name: 'B-Hooked',
    ipa: '/ɓ/',
    type: 'Voiced Bilabial Implosive',
    exampleHausa: 'ɓauna',
    meaning: 'buffalo',
    freq: 180
  },
  {
    char: 'ɗ',
    name: 'D-Hooked',
    ipa: '/ɗ/',
    type: 'Voiced Alveolar Implosive',
    exampleHausa: 'ɗaki',
    meaning: 'room',
    freq: 260
  },
  {
    char: 'ƙ',
    name: 'K-Hooked',
    ipa: '/kʼ/',
    type: 'Velar Ejective Stop',
    exampleHausa: 'ƙofa',
    meaning: 'door',
    freq: 380
  },
  {
    char: 'ƴ',
    name: 'Y-Hooked',
    ipa: '/j̰/ or /ʔʲ/',
    type: 'Palatalized Glottal Stop',
    exampleHausa: 'ƴaƴa',
    meaning: 'children / fruits',
    freq: 440
  },
  {
    char: "'",
    name: 'Glottal Stop',
    ipa: '/ʔ/',
    type: 'Glottal Stop (Hamza)',
    exampleHausa: "a'a",
    meaning: 'no (negation)',
    freq: 520
  }
]

export function PhoneticSoundboard() {
  const [activeChar, setActiveChar] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)

  const playSyntheticAcoustic = (char: string, freq: number) => {
    setPlaying(char)
    setActiveChar(char)

    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        
        // Create an implosive/ejective acoustic burst simulation
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = char === 'ƙ' || char === "'" ? 'triangle' : 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + 0.18)

        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      }
    } catch (e) {
      console.log('Web Audio tone triggered:', char)
    }

    setTimeout(() => {
      setPlaying(null)
    }, 400)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // ACOUSTIC PHONOLOGY & DIGRAPHS
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Hausa Hooked Consonants & Glottals Soundboard
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Interactive acoustic matrix demonstrating the 5 distinct non-pulmonic implosives and ejectives (<strong className="text-zinc-800 dark:text-zinc-200">ɓ, ɗ, ƙ, ƴ, '</strong>) critical for high-fidelity speech synthesis and zero-shot phoneme tokenization.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        {CONSONANTS.map((c) => {
          const isSelected = activeChar === c.char
          const isPlayingThis = playing === c.char

          return (
            <button
              key={c.char}
              onClick={() => playSyntheticAcoustic(c.char, c.freq)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-3xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                  {c.char}
                </span>
                <span className={`p-1.5 rounded-full transition-colors ${
                  isPlayingThis
                    ? 'bg-amber-500 text-zinc-950 scale-110'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}>
                  <Volume2 className="h-3.5 w-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-amber-600 dark:text-amber-400">{c.name}</span>
                  <span className="text-zinc-400">{c.ipa}</span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                  {c.type}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-sans">
                <span className="font-bold text-zinc-900 dark:text-zinc-200 font-mono">{c.exampleHausa}</span>
                <span className="text-zinc-400 text-[11px] ml-1.5">({c.meaning})</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
