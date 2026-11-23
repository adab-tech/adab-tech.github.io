import Link from 'next/link'
import { CaseStudyLink } from '@/components/CaseStudyLink'
import { GlobalShell } from '@/components/GlobalShell'
import { InlineText } from '@/components/InlineText'
import { ProjectLogo } from '@/components/ProjectLogo'
import { caseStudyFor } from '@/lib/case-studies'
import { PROJECTS, primaryLink } from '@/lib/site-content'
import { ArrowRight, Code2, ExternalLink } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <GlobalShell>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        
        {/* Header Banner */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-zinc-50 tracking-tight">
            {PROJECTS.heading}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl font-sans leading-relaxed">
            <InlineText text={PROJECTS.intro} />
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.projects.map((p) => (
            <div 
              key={p.id}
              className={p.showOnHome
                ? 'min-w-0 rounded-2xl border border-zinc-800 bg-[#0E1526] p-5 sm:p-6 space-y-5'
                : 'min-w-0 border-t border-zinc-800 py-5 space-y-4 md:col-span-2'}
            >
              <div className="space-y-4">
                {/* Title & Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {primaryLink(p) ? (
                      <a
                        href={primaryLink(p)}
                        {...(/^https?:/.test(primaryLink(p)) ? { target: '_blank', rel: 'noreferrer' } : {})}
                        aria-label={`Open ${p.title}`}
                        title={`Open ${p.title}`}
                        className="shrink-0 rounded-xl transition-transform hover:scale-105"
                      >
                        <ProjectLogo project={p} />
                      </a>
                    ) : (
                      <ProjectLogo project={p} />
                    )}
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-mono font-bold text-zinc-50">
                        {p.title}
                      </h2>
                    </div>
                  </div>
                  <span className={`text-xs lg:text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border max-w-full ${
                    p.statusColor === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                    p.statusColor === 'blue' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                    'text-gold-500 bg-gold-500/10 border-gold-500/30'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <p className="text-base text-zinc-300 font-sans leading-relaxed">
                  {p.description}
                </p>

                <p className="text-sm font-mono text-gold-500">{p.role}</p>
              </div>

              {/* Action Buttons & Tags */}
              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-mono [&_a]:min-h-11">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400 font-bold hover:underline"
                    >
                      <span>{p.liveLinkLabel?.trim() || 'Live site'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <CaseStudyLink projectId={p.id} />

                  {p.paperUrl && (
                    <Link
                      href={p.paperUrl}
                      className="inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400 font-bold hover:underline"
                    >
                      <span>{p.paperLinkLabel?.trim() || 'Paper'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {p.modelUrl && (
                    <a
                      href={p.modelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                    >
                      <span>{p.modelLinkLabel?.trim() || (p.modelUrl.includes('/datasets/') ? 'Dataset' : 'Model Weights')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{p.repoLabel || 'Source'}</span>
                    </a>
                  )}
                </div>

                {/* Key Highlights */}
                {!caseStudyFor(p.id) && p.highlights.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-zinc-300">
                    {p.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs lg:text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </GlobalShell>
  )
}
