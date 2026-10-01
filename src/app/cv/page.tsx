'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { InlineText } from '@/components/InlineText'
import { CV } from '@/lib/site-content'
import { ArrowLeft, Printer, Mail, Globe, MapPin, BookOpen, GraduationCap, Briefcase, Languages, ExternalLink, Cpu, Database } from 'lucide-react'

const PROFILE_COLORS: Record<string, string> = {
  blue: 'text-blue-400 hover:border-blue-500',
  lime: 'text-lime-400 hover:border-lime-500',
  amber: 'text-gold-500 hover:border-gold-500',
  emerald: 'text-emerald-400 hover:border-emerald-500',
  zinc: 'text-zinc-200 hover:border-zinc-400',
}

export default function AcademicCVPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <GlobalShell>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 bg-[#0B1120]">
        
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-500 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* CV Document Container - 100% Solid Obsidian Dark Canvas */}
        <article className="p-5 sm:p-8 md:p-12 rounded-2xl border border-zinc-800 bg-[#0E1526] text-zinc-100 shadow-xl space-y-8 sm:space-y-10 font-sans">
          
          {/* Header & Bio */}
          <div className="space-y-4 border-b border-zinc-800 pb-6 sm:pb-8">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-zinc-50 tracking-tight">
                  {CV.name}
                </h1>
                <p className="text-sm sm:text-base font-mono text-gold-500 font-semibold">
                  {CV.headline}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 pt-1">
                  {[
                    CV.location && <span key="loc" className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0" /> {CV.location}</span>,
                    CV.website && <span key="web" className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-gold-500 shrink-0" /> {CV.website}</span>,
                    CV.email && <span key="mail" className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-gold-500 shrink-0" /> {CV.email}</span>,
                  ]
                    .filter(Boolean)
                    .flatMap((item, i) => (i ? [<span key={`sep${i}`}>·</span>, item] : [item]))}
                </div>
              </div>

              {/* External Profile Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 lg:shrink-0 lg:max-w-xs lg:justify-end">
                {CV.profiles.map((prof) => (
                  <a
                    key={prof.url}
                    href={prof.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-xs font-semibold transition-colors shadow-sm ${PROFILE_COLORS[prof.color] ?? PROFILE_COLORS.amber}`}
                  >
                    {prof.label === 'Google Scholar' && <BookOpen className="h-3.5 w-3.5" />}
                    <span>{prof.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          {CV.education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <GraduationCap className="h-5 w-5 text-gold-500 shrink-0" />
              Education & Academic Credentials
            </h2>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-sans">
              {CV.education.map((e) => (
                <div key={e.degree} className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                    <span>{e.degree}</span>
                    <span className={`${e.highlight ? 'text-gold-500' : 'text-zinc-400 font-mono'} text-xs`}>{e.date}</span>
                  </div>
                  <div className="text-zinc-400 font-mono text-xs">{e.institution}</div>
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Experience */}
          {CV.experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Briefcase className="h-5 w-5 text-gold-500 shrink-0" />
              Experience
            </h2>

            <div className="space-y-4 text-xs sm:text-sm font-sans">
              {CV.experience.map((x) =>
                x.featured ? (
                  <div key={x.title} className="p-4 sm:p-6 rounded-2xl border border-gold-500/40 bg-[#15213D] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                      <span className="text-sm sm:text-base text-gold-500 flex items-center gap-1.5">
                        <Cpu className="h-4 w-4 shrink-0 text-gold-500" />
                        {x.title}
                      </span>
                      <span className="text-gold-500 text-xs">{x.dates}</span>
                    </div>
                    {x.summary && (
                      <p className="text-zinc-200 leading-relaxed">
                        <InlineText text={x.summary} linkClassName="text-gold-500 underline font-bold" />
                      </p>
                    )}
                    {x.bullets.length > 0 && (
                      <ul className="space-y-2 pl-4 list-disc text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {x.bullets.map((b, i) => (
                          <li key={i}><InlineText text={b} /></li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div key={x.title} className="p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-mono font-bold text-zinc-100 gap-1">
                      <span>{x.title}</span>
                      <span className="text-zinc-400 font-mono text-xs">{x.dates}</span>
                    </div>
                    {x.summary && (
                      <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                        <InlineText text={x.summary} />
                      </p>
                    )}
                    {x.bullets.length > 0 && (
                      <ul className="space-y-1.5 pl-4 list-disc text-zinc-300 text-xs sm:text-sm leading-relaxed">
                        {x.bullets.map((b, i) => (
                          <li key={i}><InlineText text={b} /></li>
                        ))}
                      </ul>
                    )}
                  </div>
                ),
              )}
            </div>
          </section>
          )}

          {/* Languages */}
          {CV.languages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Languages className="h-5 w-5 text-gold-500 shrink-0" />
              Languages
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {CV.languages.map((l) => (
                <div
                  key={l.name}
                  className="p-3.5 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1"
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-100 text-sm">{l.name}</span>
                    <span className="text-[11px] font-bold text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">{l.level}</span>
                  </div>
                  {l.note && <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">{l.note}</p>}
                </div>
              ))}
            </div>
          </section>
          )}

          {/* Publications */}
          {CV.publicationGroups.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gold-500 shrink-0" />
                Publications
              </h2>
              {CV.scholarUrl && (
                <a
                  href={CV.scholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Google Scholar Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {CV.publicationGroups.map((group) => (
              <div key={group.heading} className="space-y-3 text-xs sm:text-sm font-sans">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400">{group.heading}</h3>
                {group.items.map((item) => (
                  <div key={item.title} className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-1">
                    <div className="font-mono font-bold text-zinc-100 text-sm">
                      {item.href ? (
                        item.href.startsWith('/') ? (
                          <Link href={item.href} className="hover:text-gold-500 transition-colors">{item.title}</Link>
                        ) : (
                          <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-gold-500 transition-colors">{item.title}</a>
                        )
                      ) : item.title}
                    </div>
                    <div className="text-zinc-400 font-mono text-[11px]">{item.venue}</div>
                  </div>
                ))}
              </div>
            ))}
          </section>
          )}

          {/* Research Datasets & Digital Projects */}
          {CV.datasets.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-base sm:text-lg font-mono font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Database className="h-5 w-5 text-gold-500 shrink-0" />
              Research Datasets & Digital Projects
            </h2>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              {CV.datasets.map((d) => (
                <div key={d.title} className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-[#131C31] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <div className="font-mono font-bold text-zinc-100 text-sm">{d.title}</div>
                    <span className="text-zinc-400 font-mono text-xs shrink-0">{d.year}</span>
                  </div>
                  {d.meta && (
                    <div className="text-zinc-400 font-mono text-[11px]">
                      <InlineText text={d.meta} linkClassName="text-gold-500 underline break-all" />
                    </div>
                  )}
                  {d.description && <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm"><InlineText text={d.description} /></p>}
                  {d.links.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
                      {d.links.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-gold-500 hover:underline inline-flex items-center gap-1">
                          <span>{l.label}</span><ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          )}

        </article>
      </div>
    </GlobalShell>
  )
}
