'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, Sparkles, Cpu, RotateCcw } from 'lucide-react'

const HAUSA_SAMPLES = [
  { text: 'Barka da zuwa platform dinta', label: 'Welcome Sample', trans: 'Welcome to our platform' },
  { text: 'Neman ilimi wajibi ne ga kowane mutum', label: 'Academic Sample', trans: 'Seeking knowledge is mandatory for everyone' },
  { text: 'Murya AI tana sarrafa maganar Hausa', label: 'Speech AI Sample', trans: 'Murya AI processes Hausa speech synthesis' }
]

export function AudioTTSWidget() {
  const [selectedSample, setSelectedSample] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Animated Waveform Effect
  useEffect(() => {
    let animationFrameId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = isPlaying ? '#D4AF37' : '#52525b'

      ctx.beginPath()
      const width = canvas.width
      const height = canvas.height
      const amplitude = isPlaying ? 16 : 4
      const frequency = isPlaying ? 0.05 : 0.02

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      if (isPlaying) phase += 0.15 * speed
      else phase += 0.02

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPlaying, speed])

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      // Web Audio Speech Synthesis fallback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const synthText = HAUSA_SAMPLES[selectedSample].text
        const utterance = new SpeechSynthesisUtterance(synthText)
        utterance.rate = speed
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
      } else {
        setTimeout(() => setIsPlaying(false), 3000)
      }
    }
  }

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-md space-y-6 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Neural Voice Engine</span>
          </div>
          <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-500" />
            Murya AI — Hausa TTS Synthesizer Demo
          </h3>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span>Speed:</span>
          {[0.8, 1.0, 1.2].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                speed === s
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold border-transparent'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Sample Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {HAUSA_SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedSample(idx)
              setIsPlaying(false)
              if ('speechSynthesis' in window) window.speechSynthesis.cancel()
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedSample === idx
                ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 text-zinc-900 dark:text-zinc-50'
                : 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-bold">
              {sample.label}
            </span>
            <p className="text-xs font-mono font-semibold truncate mt-0.5">{sample.text}</p>
            <span className="text-[10px] font-sans text-zinc-400 block truncate">{sample.trans}</span>
          </button>
        ))}
      </div>

      {/* Audio Waveform Canvas & Controller */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handlePlayToggle}
          className="p-3.5 rounded-full bg-gold-500 text-zinc-950 hover:bg-gold-400 transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
          aria-label={isPlaying ? 'Pause Synthesizer' : 'Synthesize Hausa Audio'}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 w-full space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-200 font-bold">{HAUSA_SAMPLES[selectedSample].text}</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {isPlaying ? 'Synthesizing Audio Stream...' : 'Ready for Inference'}
            </span>
          </div>
          <canvas ref={canvasRef} width={600} height={40} className="w-full h-10 rounded bg-zinc-900" />
        </div>
      </div>
    </div>
  )
}
