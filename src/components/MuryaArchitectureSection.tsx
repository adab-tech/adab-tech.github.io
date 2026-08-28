'use client'

import React from 'react'
import { Cpu, Mic, Brain, Volume2, Database, Sparkles, ExternalLink, ArrowRight, Shield, Layers, Radio, Globe } from 'lucide-react'

export function MuryaArchitectureSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          // SYSTEMS ARCHITECTURE & ROADMAP
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-amber-500" />
          Murya OS: Sovereign Bidirectional Speech AI Pipeline
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          The end-to-end technical blueprint powering <a href="https://app.murya.ng" target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">app.murya.ng</a> — integrating 16kHz VAD ingestion, Chadic sociolinguistic reasoning, Litvinova tone contouring, and 24kHz Piper VITS multi-speaker synthesis.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* 4-Stage Interactive Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Stage 1: Ingestion & STT */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-midnight-950/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500 font-mono text-xs font-bold">01</span>
              <Mic className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">16kHz VAD & STT</h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Streams raw PCM-16 frames with VAD mute buffers into <strong>Faster-Whisper</strong> for real-time transcription.
            </p>
          </div>

          {/* Stage 2: Cognition & Cultural Heuristics */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-midnight-950/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-500 font-mono text-xs font-bold">02</span>
              <Brain className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">Cognitive Alignment</h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Processes intent via <strong>Aya-Expanse 8B</strong>, applying <em>Kunya & Girmamawa</em> and gendered address protocols.
            </p>
          </div>

          {/* Stage 3: Philological Trace & Tone */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-midnight-950/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 font-mono text-xs font-bold">03</span>
              <Database className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">30k Ƙamus & Tone</h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Grounds tokens via <strong>dictionary-constrained lexical lookup (30,708 entries)</strong> (Robinson 1914 Public Domain + Newman 1977 authorized research subset) with Litvinova R-to-L tone mapping.
            </p>
          </div>

          {/* Stage 4: 24kHz Synthesis */}
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-midnight-950/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500 font-mono text-xs font-bold">04</span>
              <Volume2 className="h-4 w-4 text-purple-500" />
            </div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">24kHz Piper VITS</h3>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Synthesizes low-latency audio via ONNX runtime featuring <strong>Malama Asabe</strong> & <strong>Malam Garba</strong>.
            </p>
          </div>

        </div>

        {/* 3 Strategic Initiatives for Scaled Impact */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              // 3 ACTIVE INITIATIVES & ROADMAP
            </span>
            <span className="text-[10px] font-mono text-amber-500">In Active Execution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 space-y-1.5">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
                1. System Demo White Paper
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Empirical architecture report for <strong>ACL / Interspeech / AfricaNLP</strong> documenting WAXAL fine-tuning and 30k Ƙamus validation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950 space-y-1.5">
              <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                <Radio className="h-4 w-4 text-blue-500" />
                2. Sahelian Offline PWA
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Progressive Web App with on-device caching for zero-bandwidth synthesis across Northern Nigeria, Niger, and the diaspora.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950 space-y-1.5">
              <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                <Globe className="h-4 w-4 text-emerald-500" />
                3. Sovereign Developer API
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Open REST/WebSocket endpoints (<code className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/api/live</code>, <code className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/api/dictionary</code>) for health, agrarian, and education apps.
              </p>
            </div>

          </div>
        </div>

        {/* Live CTA Bridges */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[11px]">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            <span>Open Source Model: adab-tech/murya-piper-hausa-tts · License: CC-BY-NC-SA 4.0 (Open Weights)</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://app.murya.ng"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              <span>Launch Live Murya App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
