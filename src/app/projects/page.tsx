import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { ProjectLogo } from '@/components/ProjectLogo'
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
            {PROJECTS.intro}
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.projects.map((p) => (
            <div 
              key={p.id}
              className="p-6 rounded-2xl border border-zinc-800 bg-[#0E1526] space-y-5 flex flex-col justify-between hover:border-gold-500/40 transition-all shadow-sm"
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
                      <div className="text-xs font-mono text-gold-500">
                        {p.role}
                      </div>
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

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  {p.description}
                </p>

                {/* Key Highlights */}
                {p.highlights.length > 0 && (
                  <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-zinc-300">
                    {p.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Buttons & Tags */}
              <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400 font-bold hover:underline"
                    >
                      <span>Live site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {p.paperUrl && (
                    <Link
                      href={p.paperUrl}
                      className="inline-flex items-center gap-1.5 text-gold-500 hover:text-gold-400 font-bold hover:underline"
                    >
                      <span>Paper</span>
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
                      <span>{p.modelUrl.includes('/datasets/') ? 'Dataset' : 'Model Weights'}</span>
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
