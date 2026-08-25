'use client'

import React, { useState, useEffect } from 'react'
import { GlobalShell } from '@/components/GlobalShell'
import { AudioTTSWidget } from '@/components/AudioTTSWidget'
import { EcosystemGrid } from '@/components/EcosystemGrid'
import { TaxonomyGrid } from '@/components/TaxonomyGrid'
import { AssetGallery } from '@/components/AssetGallery'
import { PhoneticSoundboard } from '@/components/PhoneticSoundboard'
import { AjamiTransliterationWidget } from '@/components/AjamiTransliterationWidget'
import { DialectMapWidget } from '@/components/DialectMapWidget'
import { ContactForm } from '@/components/ContactForm'
import { Cpu, BookOpen, Terminal, Sparkles, Globe } from 'lucide-react'

const GREETINGS = [
  { text: 'Barka da zuwa', lang: 'ha', label: 'Hausa' },
  { text: 'Welcome', lang: 'en', label: 'English' },
  { text: 'Bienvenue', lang: 'fr', label: 'French' },
  { text: 'Ẹ káàbọ', lang: 'yo', label: 'Yoruba' },
  { text: 'مرحبا', lang: 'ar', label: 'Arabic' }
]

export default function Home() {
  const [greetingIndex, setGreetingIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const currentGreeting = GREETINGS[greetingIndex]

  return (
    <GlobalShell>
      <div className="space-y-14 py-2">
        {/* Profile Hero Section */}
        <section className="relative p-6 sm:p-10 md:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-sm overflow-hidden space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              {/* Multilingual Dynamic Greeting */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span className="font-bold">{currentGreeting.text}</span>
                <span className="text-[10px] opacity-70">[{currentGreeting.label}]</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Adamu Abubakar
              </h1>

              <p className="text-base sm:text-lg font-mono text-amber-600 dark:text-gold-400 font-semibold">
                Computational Linguist & AI Researcher • 8+ Languages Polyglot
              </p>

              <p className="text-sm font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Engineering sovereign Hausa NLP engines, Chadic neural speech synthesis, and digital philology archives for low-resource African languages. Bridging postcolonial humanities theory with state-of-the-art agentic AI governance.
              </p>

              {/* Core Pillars */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Hausa-first NLP</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  <span>Ajami Philology</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Speech AI Systems</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                  <Globe className="h-3.5 w-3.5 text-gold-400" />
                  <span>Agentic Governance</span>
                </span>
              </div>
            </div>

            {/* Terminal Code Card */}
            <div className="w-full md:w-80 rounded-xl border border-zinc-800 bg-midnight-950 p-4 font-mono text-xs text-zinc-300 shadow-xl space-y-3 shrink-0">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-500 text-[10px]">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span>hausa_tts.py</span>
              </div>
              <div className="space-y-1 text-[11px] leading-relaxed">
                <p className="text-zinc-500"># Murya Speech Synthesis</p>
                <p><span className="text-purple-400">from</span> murya <span className="text-purple-400">import</span> Synthesizer</p>
                <p className="pt-1"><span className="text-blue-400">model</span> = Synthesizer.load(<span className="text-emerald-400">"hausa-v1"</span>)</p>
                <p><span className="text-blue-400">wav</span> = model.infer(<span className="text-emerald-400">"Barka da zuwa"</span>)</p>
                <p className="text-zinc-500 pt-1"># Audio: 24kHz Native Stream</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gem 1: Hausa Phonetic Soundboard */}
        <PhoneticSoundboard />

        {/* Gem 2: Live Boko to Ajami Transliteration Demo */}
        <AjamiTransliterationWidget />

        {/* Audio TTS Widget with Real Murya WAV Audio */}
        <AudioTTSWidget />

        {/* Gem 5: Dialectal & Tone Explorer Map */}
        <DialectMapWidget />

        {/* Production Ecosystem Grid */}
        <EcosystemGrid />

        {/* Research Taxonomy Grid with BibTeX */}
        <TaxonomyGrid />

        {/* Visual Asset Gallery */}
        <AssetGallery />

        {/* Communications Pipeline */}
        <ContactForm />
      </div>
    </GlobalShell>
  )
}
