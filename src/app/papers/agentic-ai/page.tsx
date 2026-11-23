import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, Globe, Shield, Sparkles } from 'lucide-react'
import { GlobalShell } from '@/components/GlobalShell'
import { InlineText } from '@/components/InlineText'
import { AGENTIC_AI_PAPER, paperBibTeX, type PaperCard, type PaperSection } from '@/lib/paper-agentic-ai-content'
import { parsePublicUrl } from '@/lib/public-url'
import { CopyCitationButton, PrintPaperButton } from './PaperActions'

const caseStyles = {
  gold: {
    wrapper: 'border-gold-500/40 bg-gold-50/30 dark:bg-gold-950/20',
    title: 'text-gold-600 dark:text-gold-500',
    icon: Shield,
  },
  blue: {
    wrapper: 'border-blue-500/40 bg-blue-50/30 dark:bg-blue-950/20',
    title: 'text-blue-600 dark:text-blue-400',
    icon: Globe,
  },
  emerald: {
    wrapper: 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20',
    title: 'text-emerald-600 dark:text-emerald-400',
    icon: Sparkles,
  },
  purple: {
    wrapper: 'border-purple-500/40 bg-purple-50/30 dark:bg-purple-950/20',
    title: 'text-purple-600 dark:text-purple-400',
    icon: Globe,
  },
}

const headingClass = 'text-xl sm:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 border-l-4 border-gold-500 pl-3'

function SectionCard({ card, style }: { card: PaperCard; style: PaperSection['style'] }) {
  if (style === 'case-studies') {
    const { wrapper, title, icon: Icon } = caseStyles[card.tone]
    return (
      <div className={`p-5 rounded-xl border space-y-2 ${wrapper}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <h3 className={`font-mono text-xs font-bold flex items-center gap-1.5 ${title}`}>
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {card.title}
          </h3>
          {card.subtitle && <span className="text-xs lg:text-[10px] font-mono text-zinc-400">{card.subtitle}</span>}
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed"><InlineText text={card.text} /></p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 space-y-1">
      <h3 className="font-mono text-xs font-bold text-gold-600 dark:text-gold-500">{card.title}</h3>
      <p className={`font-serif text-xs text-zinc-600 ${style === 'lenses' ? 'dark:text-zinc-400' : 'dark:text-zinc-300'}`}>
        <InlineText text={card.text} />
      </p>
    </div>
  )
}

function ArticleSection({ section }: { section: PaperSection }) {
  return (
    <section className={section.style === 'conclusion' ? 'space-y-3 pt-2' : section.cards.length ? 'space-y-4' : 'space-y-3'}>
      <h2 className={headingClass}>{section.heading}</h2>
      {section.paragraphs.map((text, i) => (
        <p key={i} className="font-serif leading-relaxed text-zinc-700 dark:text-zinc-300">
          <InlineText text={text} />
        </p>
      ))}
      {section.cards.length > 0 && (
        <div className={section.style === 'lenses' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2' : section.style === 'case-studies' ? 'space-y-4' : 'space-y-3'}>
          {section.cards.map((card, i) => <SectionCard key={i} card={card} style={section.style} />)}
        </div>
      )}
    </section>
  )
}

export default function AgenticAiPaperPage() {
  const paper = AGENTIC_AI_PAPER
  const bibtex = paperBibTeX(paper)
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${paper.publishedMonth}-01T00:00:00Z`))

  return (
    <GlobalShell>
      <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{paper.actions.backLabel}</span>
          </Link>
          <div className="flex flex-wrap items-start gap-2">
            <PrintPaperButton label={paper.actions.printLabel} />
            <CopyCitationButton bibtex={bibtex} actions={paper.actions} />
          </div>
        </div>

        <article lang={paper.seo.language} className="p-6 sm:p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1526] shadow-sm space-y-8">
          <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-500 text-xs font-mono font-bold">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{paper.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-tight">{paper.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="font-bold text-gold-600 dark:text-gold-500 text-sm">{paper.author}</span>
              <span aria-hidden="true">·</span>
              <span>{paper.institution}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {paper.readingTime}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={paper.publishedMonth}>{date}</time>
            </div>
          </header>

          <section className="p-6 rounded-xl border border-gold-500/30 bg-gold-50/40 dark:bg-gold-950/20 space-y-2 font-sans">
            <h2 className="text-xs font-mono font-bold text-gold-600 dark:text-gold-500 uppercase tracking-wider block">{paper.abstractHeading}</h2>
            <p className="text-sm font-serif text-zinc-700 dark:text-zinc-300 leading-relaxed"><InlineText text={paper.abstract} /></p>
          </section>

          {paper.sections.map((section, i) => <ArticleSection key={i} section={section} />)}

          {paper.references.length > 0 && (
            <section className="space-y-3">
              <h2 className={headingClass}>{paper.referencesHeading}</h2>
              <ul className="list-disc space-y-2 pl-5 font-serif text-gold-600 dark:text-gold-500">
                {paper.references.map((reference, i) => {
                  const link = parsePublicUrl(reference.url)
                  if (!link || link.kind === 'email') return null
                  return (
                    <li key={i}>
                      <a
                        className="underline underline-offset-4"
                        href={link.href}
                        {...(link.kind === 'external' && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          title: link.host,
                          'aria-label': `${reference.label} (${link.host})`,
                        })}
                      >
                        {reference.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-midnight-950 font-mono text-xs space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase text-xs">{paper.citation.heading}</h2>
              <CopyCitationButton bibtex={bibtex} actions={paper.actions} inline />
            </div>
            <pre tabIndex={0} aria-label={paper.citation.accessibleLabel} className="p-4 rounded-lg bg-white dark:bg-midnight-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 overflow-x-auto">
              {bibtex}
            </pre>
          </div>
        </article>
      </div>
    </GlobalShell>
  )
}
