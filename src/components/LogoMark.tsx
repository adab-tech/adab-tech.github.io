'use client'

import React from 'react'

export function LogoMark({ className = "h-8 w-8", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center space-x-2.5 group select-none">
      {/* Sovereign Speech AI & Computational Linguistics Acoustic Mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 p-1.5 shadow-sm group-hover:border-amber-400/60 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all ${className}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-amber-400 group-hover:text-amber-300 transition-colors"
        >
          {/* Neural Acoustic Waveform + Phonetic Lattice */}
          <path
            d="M5 16C5 16 7 9 9 9C11 9 12 23 14 23C16 23 17 6 19 6C21 6 22 25 24 25C25.5 25 27 16 27 16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Node Lattice Centers */}
          <circle cx="9" cy="9" r="1.6" className="fill-amber-300" />
          <circle cx="14" cy="23" r="1.6" className="fill-amber-400" />
          <circle cx="19" cy="6" r="1.8" className="fill-amber-300" />
          <circle cx="24" cy="25" r="1.6" className="fill-amber-400" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-sm font-bold tracking-tight text-zinc-100 group-hover:text-amber-400 transition-colors">
              adamu<span className="text-amber-400">.tech</span>
            </span>
          </div>
          <span className="text-[11px] font-sans text-zinc-400 group-hover:text-zinc-200 transition-colors hidden sm:inline-block leading-tight">
            Adamu Danjuma Abubakar
          </span>
        </div>
      )}
    </div>
  )
}
