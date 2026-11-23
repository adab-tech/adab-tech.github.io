import { InlineText } from '@/components/InlineText'
import type { CaseStudy, CaseStudyContact } from '@/lib/case-studies'
import { parsePublicUrl } from '@/lib/public-url'
import { ArrowRight, ExternalLink, Mail } from 'lucide-react'

export function CaseStudyArticle({ study, contact, preview = false }: {
  study: CaseStudy
  contact: CaseStudyContact
  preview?: boolean
}) {
  const contactLink = parsePublicUrl(contact.contactUrl)
  const cv = parsePublicUrl(contact.cvUrl)
  return (
    <article className="space-y-9 sm:space-y-12">
      <header className="max-w-3xl space-y-5">
        <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-gold-500">{study.title}</p>
        <h1 className="break-words font-serif-display text-3xl font-semibold leading-tight tracking-tight text-zinc-50 min-[375px]:text-4xl sm:text-6xl">
          {study.headline}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">{study.summary}</p>
        <p className="border-l-2 border-gold-500 pl-3 font-mono text-xs font-bold text-zinc-200 sm:text-sm">{study.role}</p>
      </header>

      {study.metrics.length > 0 && (
        <dl className="grid grid-cols-1 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-[#0E1526] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {study.metrics.map((metric, index) => (
            <div key={index} className="flex min-w-0 flex-col-reverse gap-2 break-words p-5 sm:p-6">
              <dt className="text-xs leading-relaxed text-zinc-300">{metric.label}</dt>
              <dd className="font-mono text-2xl font-bold text-gold-500 sm:text-3xl">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="space-y-6">
          {study.sections.map((section, index) => (
            <section key={index} className="space-y-3 border-t border-zinc-800 pt-5">
              <h2 className="text-lg font-mono font-semibold text-zinc-100">{section.heading}</h2>
              {section.body.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="leading-relaxed text-zinc-300">
                  {preview ? paragraph : <InlineText text={paragraph} />}
                </p>
              ))}
            </section>
          ))}
        </div>
        {study.links.length > 0 && (
          <section className="self-start space-y-4 rounded-2xl border border-zinc-800 bg-[#0E1526] p-5">
            <h2 className="text-sm font-mono font-bold text-zinc-100">Explore the work</h2>
            <ul className="space-y-3 text-sm">
              {study.links.map((link, index) => {
                const url = parsePublicUrl(link.url)
                if (!url || url.kind === 'email') return null
                return (
                  <li key={index}>
                    {preview ? <span className="text-gold-500">{link.label}</span> : (
                      <a href={url.href} className="inline-flex min-h-11 items-center gap-2 text-gold-500 hover:underline"
                        {...(url.kind === 'external' ? { target: '_blank', rel: 'noopener noreferrer', title: url.host } : {})}>
                        {link.label}
                        {url.kind === 'external' ? <ExternalLink className="h-3.5 w-3.5 shrink-0" /> : <ArrowRight className="h-3.5 w-3.5 shrink-0" />}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>

      {(contactLink || cv) && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-500/30 bg-[#0E1526] p-5 sm:p-6">
          <h2 className="text-base font-mono font-semibold text-zinc-100">{contact.heading}</h2>
          {preview ? (
            <p className="text-sm text-zinc-300">{[contactLink && contact.contactLabel, cv && contact.cvLabel].filter(Boolean).join(' · ')}</p>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {contactLink && (
                <a href={contactLink.href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 text-sm font-semibold text-zinc-950 hover:bg-gold-400"
                  {...(contactLink.kind === 'external' ? { title: contactLink.host } : {})}>
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {contact.contactLabel}
                </a>
              )}
              {cv && (
                <a href={cv.href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-600 px-4 text-sm text-zinc-100 hover:border-gold-500"
                  {...(cv.kind === 'external' ? { title: cv.host } : {})}>
                  {contact.cvLabel} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </section>
      )}
    </article>
  )
}
