'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, Sparkles, Cpu, ExternalLink, Activity, Info } from 'lucide-react'

export interface HausaAudioSample {
  id: string
  label: string
  speaker: string
  text: string
  trans: string
  audioUrl: string
  pitchMelody: string
}

const HAUSA_SAMPLES: HausaAudioSample[] = [
  {
    id: 'sample-hero',
    label: 'Cibiyar Murya (Primary)',
    speaker: 'Native Hausa (Kano Standard) · 24kHz',
    text: 'Barka da zuwa cibiyar fasahar murya ta Hausa.',
    trans: 'Welcome to the Hausa sovereign voice intelligence repository.',
    audioUrl: 'https://murya.ng/samples/hero.wav',
    pitchMelody: 'H-H L-H L-H / H-L-H'
  },
  {
    id: 'sample-female',
    label: 'Ilimin Na\'ura (Neural)',
    speaker: 'Acoustic Female · Piper VITS',
    text: 'Ilimin na\'ura yana taimakawa wajen fassara harsunan Afirka cikin sauƙi.',
    trans: 'Machine learning assists in translating African languages effortlessly.',
    audioUrl: 'https://murya.ng/samples/female.wav',
    pitchMelody: 'H-L-H L-H-H / L-H'
  },
  {
    id: 'sample-male',
    label: 'Al\'adun Gargajiya (Chadic)',
    speaker: 'Acoustic Male · ONNX Export',
    text: 'Kiyaye al\'adun gargajiya da adabin Hausa ta hanyar fasahar zamani.',
    trans: 'Preserving traditional heritage and Hausa literature through sovereign AI.',
    audioUrl: 'https://murya.ng/samples/male.wav',
    pitchMelody: 'L-H-L H-H / H-L-H'
  }
]

export function AudioTTSWidget() {
  const [selectedSample, setSelectedSample] = useState<HausaAudioSample>(HAUSA_SAMPLES[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animIdRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Dynamic spectrogram & waveform canvas visualizer
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
      const bars = 56
      const barWidth = width / bars

      for (let i = 0; i < bars; i++) {
        const barHeight = isPlaying
          ? Math.sin(phase + i * 0.28) * (height * 0.42) + height * 0.45
          : (Math.sin(i * 0.4) * 0.12 + 0.18) * height

        const x = i * barWidth
        const y = (height - barHeight) / 2

        ctx.fillStyle = isPlaying ? '#F59E0B' : '#52525B'
        ctx.fillRect(x + 1, y, Math.max(2, barWidth - 2), barHeight)
      }

      if (isPlaying) {
        phase += 0.14
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
      if (typeof Audio !== 'undefined') {
        if (!audioRef.current) {
          audioRef.current = new Audio(selectedSample.audioUrl)
        } else {
          audioRef.current.src = selectedSample.audioUrl
        }
        
        audioRef.current.play().catch(() => {
          // Synthetic visual simulation if network audio stream is buffered
          setTimeout(() => setIsPlaying(false), 3800)
        })

        audioRef.current.onended = () => {
          setIsPlaying(false)
        }
      } else {
        setTimeout(() => setIsPlaying(false), 3800)
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
          Murya.ng Neural Speech Synthesis Live Acoustic Player
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
          High-fidelity 24kHz multi-speaker Hausa Piper-TTS acoustic generation fine-tuned on the Hausa (hau) subset of the Google WAXAL corpus (1,970 samples) and Robinson 1914 Lexicon with Litvinova right-to-left tonal melody contouring.
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
                  if (audioRef.current) {
                    audioRef.current.pause()
                  }
                  setSelectedSample(s)
                  setIsPlaying(false)
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2 ${
                  isSel
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-midnight-950 hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">{s.label}</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">{s.speaker}</div>
                </div>
                <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-amber-500" />
                  <span>Tone: {s.pitchMelody}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Player & Waveform Container */}
        <div className="p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-500 font-bold tracking-wide">// INPUT PHONEME STREAM:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold">
                  24,000 Hz Native
                </span>
              </div>
              <p className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 leading-snug">
                "{selectedSample.text}"
              </p>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 italic">
                Translation: "{selectedSample.trans}"
              </p>
            </div>

            <button
              onClick={togglePlay}
              className="self-start sm:self-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-zinc-950 font-mono text-xs font-bold hover:bg-amber-400 transition-colors shadow-md shrink-0"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause Audio' : 'Play 24kHz Sample'}</span>
            </button>
          </div>

          {/* Waveform Canvas */}
          <div className="w-full h-16 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-2 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} width={650} height={48} className="w-full h-full" />
          </div>

          {/* Technical Specs & Hugging Face Bridges */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-amber-500" />
              <span>Model: Piper VITS ONNX (adab-tech/murya-piper-hausa-tts)</span>
            </div>

            <div className="flex items-center space-x-3">
              <a
                href="https://huggingface.co/adab-tech/murya-piper-hausa-tts"
                target="_blank"
                rel="noreferrer"
                className="text-amber-500 hover:underline inline-flex items-center gap-1 font-bold"
              >
                <span>Hugging Face Model</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <span>·</span>
              <a
                href="https://murya.ng"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-600 dark:text-zinc-300 hover:text-amber-500 inline-flex items-center gap-1"
              >
                <span>murya.ng</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
