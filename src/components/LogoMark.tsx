'use client'

import React from 'react'

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md border border-zinc-800 bg-[#0E1526]/90 text-amber-400 font-mono font-bold text-xs sm:text-sm tracking-wider shadow-sm hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-200 cursor-pointer select-none group ${className}`}
      title="Adamu Abubakar · Computational Linguistics & Phonetics [/a/]"
    >
      <span className="text-zinc-400 font-normal">/</span>
      <span className="text-amber-400 font-bold group-hover:text-amber-300">a</span>
      <span className="text-zinc-400 font-normal">/</span>
    </div>
  )
}
