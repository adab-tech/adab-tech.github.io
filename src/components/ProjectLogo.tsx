'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PROJECTS, initials, logoSrc, primaryLink, type Project } from '@/lib/site-content'

// A project's icon on a light tile (like an app icon): its own logo, else its
// live site's favicon, else its initials if neither loads.
export function ProjectLogo({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' }) {
  const src = logoSrc(project)
  const [failed, setFailed] = useState(false)
  const img = useRef<HTMLImageElement>(null)
  const box = size === 'sm' ? 'h-9 w-9 rounded-lg' : 'h-11 w-11 rounded-xl'

  // The image may have failed before React hydrated and attached onError.
  useEffect(() => {
    const el = img.current
    if (el && el.complete && el.naturalWidth === 0) {
      const t = setTimeout(() => setFailed(true), 0)
      return () => clearTimeout(t)
    }
  }, [src])

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`${box} shrink-0 inline-flex items-center justify-center bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs select-none`}
      >
        {initials(project.title)}
      </span>
    )
  }
  return (
    <span
      className={`${box} shrink-0 inline-flex items-center justify-center overflow-hidden border border-zinc-700 ${
        project.logo && project.logoFill ? '' : 'bg-white p-1.5'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, tiny icons */}
      <img
        ref={img}
        src={src}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className={`h-full w-full ${project.logo && project.logoFill ? 'object-cover' : 'object-contain'}`}
        onError={() => setFailed(true)}
      />
    </span>
  )
}

// Row of project icons; each opens the project's site in a new tab.
export function ProjectIcons({ label = PROJECTS.iconRowLabel, className = '' }: { label?: string; className?: string }) {
  const items = PROJECTS.projects.filter((p) => p.iconRow && primaryLink(p))
  if (!items.length) return null
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}>
      {label && <span className="text-xs font-mono text-zinc-400">{label}</span>}
      <ul className="flex flex-wrap items-center gap-2">
        {items.map((p) => {
          const href = primaryLink(p)
          const external = /^https?:/.test(href)
          return (
            <li key={p.id}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                title={p.title}
                aria-label={`${p.title}${external ? ' (opens the site)' : ''}`}
                className="block rounded-lg transition-transform duration-150 hover:scale-110 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <ProjectLogo project={p} size="sm" />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
