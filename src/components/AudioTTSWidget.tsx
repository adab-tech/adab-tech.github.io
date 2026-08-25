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
    speaker: 'Native Master Voice',
    text: 'Barka da zuwa cibiyar Muryar Hausa',
    trans: 'Welcome to the Hausa Voice Center',
    audioUrl: 'https://murya.ng/samples/hero.wav'
  },
  {
    id: 'sample-female',
    label: 'Mace · Female',
    speaker: 'Female Voice (Mace)',
    text: 'Gaskiya ta fi ƙarfin takobi, in ji magabata.',
    trans: 'Truth is stronger than a sword, say the ancestors.',
    audioUrl: 'https://murya.ng/samples/female.wav'
  },
  {
    id: 'sample-male',
    label: 'Namiji · Male',
    speaker: 'Male Voice (Namiji)',
    text: 'Sannu da zuwa, ina fatan kana lafiya.',
    trans: 'Welcome, I hope you are doing well.',
    audioUrl: 'https://murya.ng/samples/male.wav'
  }
]

export function AudioTTSWidget() {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const [statusText, setStatusText] = useState('Native Audio Stream Ready')
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const currentSample = HAUSA_SAMPLES[selectedSampleIndex]

  // Synchronize Audio playback & canvas animation
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const handleEnded = () => {
      setIsPlaying(false)
      setStatusText('Playback Finished')
    }

    const handleError = () => {
      setIsPlaying(false)
      setStatusText('Streaming from murya.ng...')
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.pause()
    }
  }, [])

  // Canvas waveform animation loop
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
      const amplitude = isPlaying ? 16 : 3
      const frequency = isPlaying ? 0.04 : 0.015

      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      if (isPlaying) phase += 0.12 * speed
      else phase += 0.02

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPlaying, speed])

  const handlePlayToggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setStatusText('Audio Stream Paused')
    } else {
      audio.src = currentSample.audioUrl
      audio.playbackRate = speed
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setStatusText(`Streaming ${currentSample.speaker} audio...`)
        })
        .catch((err) => {
          console.error('Audio playback error:', err)
          setIsPlaying(false)
          setStatusText('Unable to stream audio sample')
        })
    }
  }

  const handleSampleSelect = (index: number) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    setSelectedSampleIndex(index)
    setStatusText('Native Audio Sample Selected')
  }

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 shadow-md space-y-6 relative overflow-hidden">
      {/* Glow Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Native-Speaker Trained Model (adab-tech/murya-piper-hausa-tts)</span>
          </div>
          <h3 className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-500" />
            Murya AI — Hausa Neural Voice Stream
          </h3>
        </div>

        <a
          href="https://app.murya.ng"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-mono text-xs font-bold transition-colors shrink-0"
        >
          <span>Try app.murya.ng</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Voice Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {HAUSA_SAMPLES.map((sample, idx) => (
          <button
            key={sample.id}
            onClick={() => handleSampleSelect(idx)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedSampleIndex === idx
                ? 'border-amber-500/60 bg-amber-500/10 dark:bg-amber-500/15 text-zinc-900 dark:text-zinc-50 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-midnight-950/60 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
            }`}
          >
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 block font-bold">
              {sample.label}
            </span>
            <p className="text-xs font-mono font-bold truncate mt-1 text-zinc-900 dark:text-zinc-100">
              "{sample.text}"
            </p>
            <span className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 block truncate mt-0.5">
              {sample.trans}
            </span>
          </button>
        ))}
      </div>

      {/* Audio Control Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-midnight-950 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handlePlayToggle}
          className="p-3.5 rounded-full bg-gold-500 text-zinc-950 hover:bg-gold-400 transition-transform active:scale-95 shadow-md flex items-center justify-center shrink-0"
          aria-label={isPlaying ? 'Pause Audio Stream' : 'Play Hausa Native Voice Sample'}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 w-full space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-100 font-bold flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-gold-400" />
              {currentSample.text}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {statusText}
            </span>
          </div>
          <canvas ref={canvasRef} width={600} height={36} className="w-full h-9 rounded bg-midnight-900 border border-zinc-800" />
        </div>
      </div>
    </div>
  )
}
