'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, Sparkles, Cpu, ExternalLink } from 'lucide-react'

export interface HausaAudioSample {
  id: string
  label: string
  speaker: string
  text: string
  trans: string
  audioUrl: string
}

const HAUSA_SAMPLES: HausaAudioSample[] = [
  {
    id: 'sample-hero',
    label: 'Cibiyar Murya',
    speaker: 'Native Hausa (Kano / Standard)',
    text: 'Barka da zuwa cibiyar fasahar murya ta Hausa.',
    trans: 'Welcome to the Hausa voice intelligence repository.',
    audioUrl: 'https://murya.ng/samples/hero.wav'
  },
  {
    id: 'sample-female',
    label: 'Ilimin Na\'ura',
    speaker: 'Acoustic Female · 24kHz Neural',
    text: 'Ilimin na\'ura yana taimakawa wajen fassara harsunan Afirka cikin sauƙi.',
    trans: 'Machine learning assists in translating African languages effortlessly.',
    audioUrl: 'https://murya.ng/samples/female.wav'
  },
  {
    id: 'sample-male',
    label: 'Al\'adun Gargajiya',
    speaker: 'Acoustic Male · VITS Model',
    text: 'Kiyaye al\'adun gargajiya da adabin Hausa ta hanyar fasahar zamani.',
    trans: 'Preserving traditional heritage and Hausa literature through modern AI.',
    audioUrl: 'https://murya.ng/samples/male.wav'
  }
]

export function AudioTTSWidget() {
  const [selectedSample, setSelectedSample] = useState<HausaAudioSample>(HAUSA_SAMPLES[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animIdRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Draw simulated or real-time Mel-spectrogram waveform
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let phase = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const width = canvas.width
      const height = canvas.height
      const bars = 48
      const barWidth = width / bars

      for (let i = 0; i < bars; i++) {
        const barHeight = isPlaying
          ? Math.sin(phase + i * 0.25) * (height * 0.4) + height * 0.45
          : (Math.sin(i * 0.4) * 0.15 + 0.2) * height

        const x = i * barWidth
        const y = (height - barHeight) / 2

        ctx.fillStyle = isPlaying ? '#F59E0B' : '#71717A'
        ctx.fillRect(x + 1, y, Math.max(2, barWidth - 2), barHeight)
      }

      if (isPlaying) {
        phase += 0.12
      }

      animIdRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Synthetic playback animation if remote audio is loading
          setTimeout(() => setIsPlaying(false), 3500)
        })
      } else {
        setTimeout(() => setIsPlaying(false), 3500)
      }
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          // ACOUSTIC MEL-SPECTROGRAM & NEURAL VOICES
        </span>
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-amber-500" />
          Murya.ng Neural Speech Synthesis Live Player
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          High-fidelity 24kHz multi-speaker Hausa Piper-TTS acoustic generation trained on curated Chadic phoneme corpuses with pitch-accent contouring.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HAUSA_SAMPLES.map((s) => {
            const isSel = selectedSample.id === s.id
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSample(s)
                  setIsPlaying(false)
                }}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 ${
                  isSel
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{s.label}</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">{s.speaker}</div>
              </button>
            )
          })}
        </div>

        {/* Player & Waveform Container */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-mono text-xs text-amber-500 font-bold tracking-wide">// INPUT PHONEME STREAM:</span>
              <p className="font-serif text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
                "{selectedSample.text}"
              </p>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 italic">
                Translation: "{selectedSample.trans}"
              </p>
            </div>

            <button
              onClick={togglePlay}
              className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause Audio' : 'Play 24kHz Sample'}</span>
            </button>
          </div>

          {/* Waveform Canvas */}
          <div className="w-full h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={600} height={48} className="w-full h-full" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-amber-500" />
              Model: Piper-TTS Chadic VITS · 24000 Hz
            </span>
            <a
              href="https://murya.ng"
              target="_blank"
              rel="noreferrer"
              className="text-amber-500 hover:underline inline-flex items-center gap-1"
            >
              <span>Explore murya.ng</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
