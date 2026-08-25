'use client'

import React, { useState } from 'react'
import { MapPin, Volume2, Globe, Sparkles } from 'lucide-react'

export interface DialectRegion {
  name: string
  region: string
  toneFeature: string
  sampleText: string
  audioToneFreq: number
  description: string
}

const DIALECTS: DialectRegion[] = [
  {
    name: 'Kano (Kananci)',
    region: 'Standard Hausa / Central Nigeria',
    toneFeature: 'High-Low-High pitch contour (Standard Media Norm)',
    sampleText: 'Ina son in koyi yaren Hausa da kyau.',
    audioToneFreq: 240,
    description: 'The national standard literary and broadcast baseline utilized in BBC Hausa, VOA, and Murya acoustic corpuses.'
  },
  {
    name: 'Sokoto (Sakkwatanci)',
    region: 'North-Western Nigeria / Niger border',
    toneFeature: 'Glottal assimilation & lengthened vowel nuclei',
    sampleText: 'Ina so in koyi maganar Hausa.',
    audioToneFreq: 210,
    description: 'Preserves archaic Chadic phonology with pre-palatalized variants and historical morphological markers.'
  },
  {
    name: 'Katsina (Katsinanci)',
    region: 'Northern Chadic transitional zone',
    toneFeature: 'Sharper high tone register & ejective crispness',
    sampleText: 'Muna aiki kan fasahar murya.',
    audioToneFreq: 280,
    description: 'Distinctive tonal inflection and historical Islamic scholarship manuscript terminology.'
  },
  {
    name: 'Bauchi / Zaria (Guddiri / Zazzaganci)',
    region: 'Eastern & Southern Hausa dialect clusters',
    toneFeature: 'Softened glottalization & rising interrogative tones',
    sampleText: 'Barka da rana ga baki daya.',
    audioToneFreq: 260,
    description: 'Shows lexical interchange with neighboring Plateau and Benue-Congo linguistic communities.'
  }
]

export function DialectMapWidget() {
  const [selectedDialect, setSelectedDialect] = useState<DialectRegion>(DIALECTS[0])
  const [isPlayingTone, setIsPlayingTone] = useState(false)

  const playToneSimulation = (freq: number) => {
    setIsPlayingTone(true)
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(freq * 1.2, ctx.currentTime + 0.15)
        osc.frequency.linearRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.3)

        gain.gain.setValueAtTime(0.2, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 0.38)
      }
    } catch (e) {
      console.log('Dialect tone triggered')
    }
    setTimeout(() => setIsPlayingTone(false), 450)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // SOCIOLINGUISTICS & PROSODIC VARIATION
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Globe className="h-5 w-5 text-amber-500" />
          Regional Hausa Dialect & Tone Atlas
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Phonetic and tonal prosody mapping across primary West African dialect clusters to ensure multi-dialectal generalization in zero-shot ASR and neural TTS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dialect Selector List */}
        <div className="space-y-2.5">
          {DIALECTS.map((d) => {
            const isSel = selectedDialect.name === d.name
            return (
              <button
                key={d.name}
                onClick={() => setSelectedDialect(d)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex flex-col space-y-1 ${
                  isSel
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-zinc-900 dark:text-zinc-50">
                    {d.name}
                  </span>
                  <MapPin className={`h-4 w-4 ${isSel ? 'text-amber-500' : 'text-zinc-400'}`} />
                </div>
                <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400">
                  {d.region}
                </span>
              </button>
            )
          })}
        </div>

        {/* Selected Dialect Deep-Dive Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wide">
                  // SELECTED DIALECT PROSODICS
                </span>
                <h3 className="text-xl font-mono font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                  {selectedDialect.name}
                </h3>
                <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedDialect.region}
                </p>
              </div>

              <button
                onClick={() => playToneSimulation(selectedDialect.audioToneFreq)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                  isPlayingTone
                    ? 'bg-amber-500 text-zinc-950 border-amber-500 scale-105'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-500'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Play Tone Pitch</span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide block">
                Acoustic Tone Feature
              </span>
              <p className="text-sm font-sans font-semibold text-zinc-800 dark:text-zinc-200">
                {selectedDialect.toneFeature}
              </p>
            </div>

            <p className="text-xs font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {selectedDialect.description}
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Integrated in Piper Chadic Multi-Speaker Acoustic Config
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
