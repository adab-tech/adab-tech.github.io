'use client'

import React from 'react'
import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { InlineText } from '@/components/InlineText'
import { ProjectIcons, ProjectLogo } from '@/components/ProjectLogo'
import { HOME, PROJECTS, primaryLink } from '@/lib/site-content'
import { 
  Cpu, BookOpen, ExternalLink, ArrowRight, Shield, Activity, 
  Layers, CheckCircle2, 
  FileText, 
  MapPin, Mail, Sparkles,
  type LucideIcon,
} from 'lucide-react'

const BUTTON_ICONS: Record<string, LucideIcon> = { mail: Mail, cpu: Cpu, book: BookOpen, file: FileText, link: ExternalLink }

const H = HOME
const N = HOME.numbers

export default function HomePage() {
  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION — Clear Narrative, Academic Affiliations & Primary CTAs */}
        <section className="space-y-8 pt-4 sm:pt-8">
          
          {/* Status & Verification Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              {H.badge}
            </span>
            
          </div>

          {/* Core Title & Bio */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-mono font-bold text-zinc-50 tracking-tight leading-tight">
              {H.name}
            </h1>
            <p className="text-lg sm:text-xl font-mono text-gold-500 font-medium">
              {H.tagline}
            </p>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              <InlineText text={H.intro} />
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-500" /> {H.location}</span>
              {H.email && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gold-500" /> {H.email}</span>
                </>
              )}
            </div>
          </div>

          {/* Primary Call-to-Actions (Above the Fold) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {H.buttons.map((btn) => {
              const cls = btn.primary
                ? 'inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 text-zinc-950 font-mono text-xs font-bold hover:bg-gold-500 transition-all shadow-lg hover:shadow-gold-500/20'
                : 'inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 bg-[#0E1526] text-zinc-100 font-mono text-xs font-bold hover:border-gold-500 hover:text-gold-500 transition-all shadow-sm'
              const Icon = BUTTON_ICONS[btn.icon]
              const icon = Icon && <Icon className={`w-4 h-4 ${btn.primary ? '' : 'text-gold-500'}`} />
              if (btn.url.startsWith('/'))
                return (
                  <Link key={btn.label} href={btn.url} className={cls}>
                    {icon}
                    <span>{btn.label}</span>
                  </Link>
                )
              const external = /^https?:/.test(btn.url)
              return (
                <a key={btn.label} href={btn.url} className={cls} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {icon}
                  <span>{btn.label}</span>
                  {external && <ExternalLink className="w-3.5 h-3.5" />}
                </a>
              )
            })}
          </div>

          {/* The project sites, one icon each */}
          <ProjectIcons />

        </section>

        {/* SECTION 1: BENCHMARKS & EVALUATION EVIDENCE */}
        {N.show && (
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-500 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              {N.kicker}
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              {N.heading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              <InlineText text={N.intro} />
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {N.items.map((b) => (
              <div key={b.label} className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-2">
                <div className="text-3xl font-mono font-bold text-gold-500">{b.metric}</div>
                <div className="text-xs font-mono font-bold text-zinc-100">{b.label}</div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Technical Specifications Table */}
          <div className="p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-4">
            <div className="font-mono font-bold text-sm text-zinc-100 flex items-center justify-between border-b border-zinc-800 pb-3">
              <span>{N.specsTitle}</span>
              {N.specsLinkUrl && (
                <a href={N.specsLinkUrl} target="_blank" rel="noreferrer" className="text-xs text-gold-500 hover:underline flex items-center gap-1">
                  <span>{N.specsLinkLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              {N.specs.map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <span className="text-zinc-400">{spec.label}:</span>
                  <div className="text-zinc-200">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800/80 space-y-3 font-sans text-xs text-zinc-300 leading-relaxed">
              <div className="flex items-center gap-2 font-mono font-bold text-gold-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{N.evidenceTitle}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-zinc-400">
                {N.evidence.map((e) => (
                  <div key={e.title} className="p-3.5 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1">
                    <strong className="text-zinc-200 font-mono block">{e.title}</strong>
                    <p><InlineText text={e.text} /></p>
                  </div>
                ))}
              </div>
              {N.footnote && (
                <div className="text-[11px] text-zinc-400 font-mono pt-1">
                  <InlineText text={N.footnote} />
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* SECTION 2: DESIGN PRINCIPLES */}
        {H.principles.show && (
        <section className="p-6 sm:p-8 rounded-2xl border border-gold-500/30 bg-[#0E1526] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-500 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            {H.principles.kicker}
          </div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-zinc-50">
            {H.principles.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans text-zinc-300 leading-relaxed">
            {H.principles.items.map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-[#131C31] border border-zinc-800 space-y-1.5">
                <span className="font-mono font-bold text-gold-500 text-sm block">{item.title}</span>
                <p><InlineText text={item.text} /></p>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* SECTION 3: PROJECTS */}
        <section className="space-y-6 border-t border-zinc-800/80 pt-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-500 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Projects
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-50">
              {PROJECTS.homeHeading}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans leading-relaxed">
              {PROJECTS.homeIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROJECTS.projects.filter((p) => p.showOnHome).map((p) => {
              const url = primaryLink(p)
              return (
              <div key={p.id} className="p-5 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-3 min-w-0">
                      {url ? (
                        <a
                          href={url}
                          {...(/^https?:/.test(url) ? { target: '_blank', rel: 'noreferrer' } : {})}
                          aria-label={`Open ${p.title}`}
                          title={`Open ${p.title}`}
                          className="shrink-0 rounded-lg transition-transform hover:scale-105"
                        >
                          <ProjectLogo project={p} size="sm" />
                        </a>
                      ) : (
                        <ProjectLogo project={p} size="sm" />
                      )}
                      <span className="font-mono font-bold text-zinc-100 text-base">{p.title}</span>
                    </span>
                    <span className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      p.statusColor === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                      p.statusColor === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                      'text-gold-500 bg-gold-500/10 border-gold-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gold-500/90">{p.role} · <span className="text-zinc-400">{p.type}</span></div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{p.homeSummary || p.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800 text-xs font-mono">
                  {url && (url.startsWith('/') ? (
                    <Link href={url} className="text-gold-500 hover:underline flex items-center gap-1">
                      <span>{p.homeLinkLabel || 'Open'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <a href={url} target="_blank" rel="noreferrer" className="text-gold-500 hover:underline flex items-center gap-1">
                      <span>{p.homeLinkLabel || 'Visit'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}

                  {p.modelUrl && p.modelUrl !== url && (
                    <a href={p.modelUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                      <span>{p.modelUrl.includes('/datasets/') ? 'Dataset' : 'Weights'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1">
                      <span>{p.repoLabel || 'Source'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 4: CONTACT NOTICE */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-3 text-xs font-sans text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-2 font-mono font-bold text-zinc-200">
            <Mail className="w-4 h-4 text-gold-500" />
            <span>{H.contact.heading}</span>
          </div>
          <p className="text-zinc-300">
            <InlineText text={H.contact.text} linkClassName="text-gold-500 hover:underline font-mono" />
          </p>
          {H.contact.note && <p>{H.contact.note}</p>}
        </section>

      </div>
    </GlobalShell>
  )
}
