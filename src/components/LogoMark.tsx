'use client'

import React from 'react'

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md border border-zinc-800 bg-[#0E1526]/90 text-gold-500 font-mono font-bold text-xs sm:text-sm tracking-wider shadow-sm hover:border-gold-500/50 hover:bg-gold-500/10 hover:text-gold-400 transition-all duration-200 cursor-pointer select-none group ${className}`}
      title="Adamu Abubakar · Computational Linguistics & Phonetics [/a/]"
    >
      <span className="text-zinc-400 font-normal">/</span>
      <span className="text-gold-500 font-bold group-hover:text-gold-400">a</span>
      <span className="text-zinc-400 font-normal">/</span>
    </div>
  )
}
