import paperJson from '../../content/site/paper-agentic-ai.json'
import { escapeBibTeXText } from './browser-tools'
import { parsePublicUrl } from './public-url'

export const PAPER_SECTION_STYLES = ['paragraphs', 'lenses', 'case-studies', 'pillars', 'conclusion'] as const
export const PAPER_CARD_TONES = ['gold', 'blue', 'emerald', 'purple'] as const

export type PaperCard = {
  title: string
  text: string
  subtitle: string
  tone: (typeof PAPER_CARD_TONES)[number]
}

export type PaperSection = {
  heading: string
  style: (typeof PAPER_SECTION_STYLES)[number]
  paragraphs: string[]
  cards: PaperCard[]
}

export type AgenticAiPaperContent = {
  title: string
  badge: string
  author: string
  institution: string
  publishedMonth: string
  readingTime: string
  abstractHeading: string
  abstract: string
  sections: PaperSection[]
  referencesHeading: string
  references: { label: string; url: string }[]
  citation: {
    key: string
    author: string
    note: string
    url: string
    heading: string
    accessibleLabel: string
  }
  seo: {
    title: string
    description: string
    headline: string
    articleDescription: string
    status: string
    language: string
  }
  actions: {
    backLabel: string
    printLabel: string
    citeLabel: string
    citedLabel: string
    copyLabel: string
    copiedLabel: string
    copyFailed: string
  }
}

export const AGENTIC_AI_PAPER = paperJson as AgenticAiPaperContent

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function checkText(problems: string[], data: Record<string, unknown>, label: string, fields: string[]) {
  for (const field of fields) {
    const value = data[field]
    if (typeof value !== 'string' || !value.trim()) problems.push(`${label}: ${field} is required`)
  }
}

export function validateAgenticAiPaper(data: unknown): string[] {
  const problems: string[] = []
  const paper = record(data)
  checkText(problems, paper, 'Paper', ['title', 'badge', 'author', 'institution', 'readingTime', 'abstractHeading', 'abstract', 'referencesHeading'])
  if (typeof paper.publishedMonth !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(paper.publishedMonth)) {
    problems.push('Published month must be YYYY-MM')
  }

  const citation = record(paper.citation)
  checkText(problems, citation, 'Citation', ['author', 'note', 'heading', 'accessibleLabel'])
  if (typeof citation.key !== 'string' || !/^[a-zA-Z0-9_][a-zA-Z0-9_:.+-]*$/.test(citation.key)) {
    problems.push('Use a BibTeX key such as abubakar2026agentic with no spaces')
  }
  if (parsePublicUrl(citation.url)?.kind !== 'external') problems.push('Citation URL must be a full HTTPS URL')

  const seo = record(paper.seo)
  checkText(problems, seo, 'Search metadata', ['title', 'description', 'headline', 'articleDescription', 'status'])
  if (typeof seo.language !== 'string' || !/^[a-z]{2,8}(?:-[a-z0-9]{1,8})*$/i.test(seo.language)) {
    problems.push('Search metadata: use a language code such as en or en-GB')
  }
  checkText(problems, record(paper.actions), 'Page buttons', [
    'backLabel', 'printLabel', 'citeLabel', 'citedLabel', 'copyLabel', 'copiedLabel', 'copyFailed',
  ])

  if (!Array.isArray(paper.sections) || !paper.sections.length) {
    problems.push('Add at least one paper section')
  } else {
    paper.sections.forEach((entry, i) => {
      const section = record(entry)
      const label = `Section ${i + 1}`
      checkText(problems, section, label, ['heading'])
      if (!PAPER_SECTION_STYLES.some((style) => style === section.style)) problems.push(`${label}: choose a layout`)
      if (!Array.isArray(section.paragraphs) || section.paragraphs.some((p) => typeof p !== 'string' || !p.trim())) {
        problems.push(`${label}: paragraphs must be a list of non-empty text`)
      }
      if (!Array.isArray(section.cards)) {
        problems.push(`${label}: cards must be a list`)
      } else {
        section.cards.forEach((entry, j) => {
          const card = record(entry)
          const cardLabel = `${label}, card ${j + 1}`
          checkText(problems, card, cardLabel, ['title', 'text'])
          if (typeof card.subtitle !== 'string') problems.push(`${cardLabel}: subtitle must be text`)
          if (!PAPER_CARD_TONES.some((tone) => tone === card.tone)) problems.push(`${cardLabel}: choose an accent colour`)
        })
      }
    })
  }

  if (!Array.isArray(paper.references)) {
    problems.push('References must be a list')
  } else {
    paper.references.forEach((entry, i) => {
      const reference = record(entry)
      const label = `Reference ${i + 1}`
      checkText(problems, reference, label, ['label'])
      const link = parsePublicUrl(reference.url)
      if (!link || link.kind === 'email') problems.push(`${label}: use a link to a local page or an HTTPS URL`)
    })
  }

  return problems
}

export function paperBibTeX(paper: AgenticAiPaperContent): string {
  const { citation } = paper
  const destination = parsePublicUrl(citation.url)
  const url = destination?.kind === 'external' ? destination.href.replace(/[{}\\]/g, encodeURIComponent) : ''
  const fields = [
    `title={${escapeBibTeXText(paper.title)}}`,
    `author={${escapeBibTeXText(citation.author)}}`,
    `note={${escapeBibTeXText(citation.note)}}`,
    `year={${paper.publishedMonth.slice(0, 4)}}`,
    `institution={${escapeBibTeXText(paper.institution)}}`,
  ]
  if (url) fields.push(`url={${url}}`)
  return `@unpublished{${citation.key},\n  ${fields.join(',\n  ')}\n}`
}
