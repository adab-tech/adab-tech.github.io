'use client'

import React, { useState } from 'react'
import { Image as ImageIcon, ZoomIn, X, BarChart3, FileText } from 'lucide-react'

interface VisualArtifact {
  id: string
  title: string
  category: 'Infographic' | 'Research Datasheet' | 'Manuscript Sample' | 'Architecture Diagram'
  description: string
  type: string
}

const artifacts: VisualArtifact[] = [
  {
    id: 'art-1',
    title: 'Murya Sovereign Speech Pipeline Architecture',
    category: 'Architecture Diagram',
    description: 'System flow diagram mapping acoustic feature extraction, Mel-spectrogram generation, and HiFi-GAN vocoder inference.',
    type: 'SVG Vector / Diagram'
  },
  {
    id: 'art-2',
    title: 'Hausa Tonal & Duration Distribution Matrix',
    category: 'Research Datasheet',
    description: 'Empirical data sheet detailing pitch contours (High/Low/Falling) across 5,000 recorded Hausa audio tokens.',
    type: 'Data Sheet'
  },
  {
    id: 'art-3',
    title: '19th Century Kano Ajami Manuscript High-Res Scan',
    category: 'Manuscript Sample',
    description: 'Archival manuscript digital scan showing orthographic diacritics and poetic verse line demarcations.',
    type: 'Archival Document'
  },
  {
    id: 'art-4',
    title: 'African Language NLP Compute & Tokenization Benchmarks',
    category: 'Infographic',
    description: 'Comparative visual infographic illustrating subword tokenization fertility rates across Hausa, Yoruba, and Igbo corpora.',
    type: 'Infographic'
  }
]

export function AssetGallery() {
  const [selectedItem, setSelectedItem] = useState<VisualArtifact | null>(null)

  return (
    <section className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-mono font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-amber-500" />
          VISUAL ASSET GALLERY & RESEARCH DATA SHEETS
        </h2>
        <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
          Physical manuscript scans, computational linguistics infographics, and architectural diagrams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {artifacts.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedItem(art)}
            className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-midnight-900 p-4 transition-all hover:border-amber-500/40 shadow-sm"
          >
            <div className="w-full h-36 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-6 w-6 text-amber-400 drop-shadow-md" />
              </div>
              <BarChart3 className="h-8 w-8 text-zinc-400 dark:text-zinc-500 mb-2 group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tracking-wider">
                [{art.type}]
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {art.category}
              </span>
              <h3 className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {art.title}
              </h3>
              <p className="text-[11px] font-sans text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-tight">
                {art.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/90 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-midnight-900 p-6 text-zinc-50 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {selectedItem.category}
              </span>
              <h3 className="text-lg font-mono font-bold text-zinc-100">{selectedItem.title}</h3>
            </div>

            <div className="w-full h-64 rounded-xl bg-midnight-950 border border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
              <FileText className="h-12 w-12 text-amber-500 mb-3" />
              <p className="font-mono text-sm text-zinc-300">{selectedItem.title}</p>
              <span className="text-xs font-mono text-zinc-500 mt-1">High-Resolution Research Artifact [{selectedItem.type}]</span>
            </div>

            <p className="text-xs font-sans text-zinc-300 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-mono text-xs text-zinc-200 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
