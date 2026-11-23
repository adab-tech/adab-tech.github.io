'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { PAPER_CARD_TONES, PAPER_SECTION_STYLES, validateAgenticAiPaper } from '@/lib/paper-agentic-ai-content'

const schema: Field[] = [
  { key: 'title', label: 'Paper title', type: 'text' },
  { key: 'badge', label: 'Label above the title', type: 'text' },
  { key: 'author', label: 'Author name', type: 'text' },
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'publishedMonth', label: 'Published month', type: 'text', placeholder: '2026-08', help: 'Use YYYY-MM. The year also appears in the BibTeX citation.' },
  { key: 'readingTime', label: 'Reading time label', type: 'text', placeholder: '~18 min read' },
  { key: 'abstractHeading', label: 'Abstract heading', type: 'text' },
  { key: 'abstract', label: 'Abstract', type: 'textarea' },
  {
    key: 'sections',
    label: 'Paper sections',
    type: 'list',
    titleKey: 'heading',
    itemLabel: 'section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'style', label: 'Layout', type: 'select', options: [...PAPER_SECTION_STYLES], default: 'paragraphs' },
      { key: 'paragraphs', label: 'Paragraphs', type: 'strings', itemLabel: 'paragraph', help: 'Use *italics*, **bold**, and [link label](https://example.org/) for inline formatting.' },
      {
        key: 'cards',
        label: 'Section cards',
        type: 'list',
        titleKey: 'title',
        itemLabel: 'card',
        fields: [
          { key: 'title', label: 'Heading', type: 'text' },
          { key: 'text', label: 'Text', type: 'textarea' },
          { key: 'subtitle', label: 'Case-study subtitle (optional)', type: 'text' },
          { key: 'tone', label: 'Case-study accent', type: 'select', options: [...PAPER_CARD_TONES], default: 'gold' },
        ],
      },
    ],
  },
  { key: 'referencesHeading', label: 'Reference section heading', type: 'text' },
  {
    key: 'references',
    label: 'Reference links',
    type: 'list',
    itemLabel: 'reference',
    titleKey: 'label',
    fields: [
      { key: 'label', label: 'Link label', type: 'text' },
      { key: 'url', label: 'Link destination', type: 'url' },
    ],
  },
  {
    key: 'citation',
    label: 'BibTeX citation',
    type: 'group',
    fields: [
      { key: 'key', label: 'Citation key', type: 'text' },
      { key: 'author', label: 'BibTeX author name', type: 'text' },
      { key: 'note', label: 'Publication note', type: 'text' },
      { key: 'url', label: 'Canonical citation URL', type: 'url' },
      { key: 'heading', label: 'Citation section heading', type: 'text' },
      { key: 'accessibleLabel', label: 'Accessible citation label', type: 'text' },
    ],
  },
  {
    key: 'seo',
    label: 'Search and article metadata',
    type: 'group',
    fields: [
      { key: 'title', label: 'Browser and search title', type: 'text' },
      { key: 'description', label: 'Search description', type: 'textarea' },
      { key: 'headline', label: 'Structured article headline', type: 'text' },
      { key: 'articleDescription', label: 'Structured article description', type: 'textarea' },
      { key: 'status', label: 'Publication status', type: 'text' },
      { key: 'language', label: 'Language code', type: 'text', placeholder: 'en' },
    ],
  },
  {
    key: 'actions',
    label: 'Page action labels',
    type: 'group',
    fields: [
      { key: 'backLabel', label: 'Back link', type: 'text' },
      { key: 'printLabel', label: 'Print button', type: 'text' },
      { key: 'citeLabel', label: 'Toolbar citation button', type: 'text' },
      { key: 'citedLabel', label: 'Toolbar copy confirmation', type: 'text' },
      { key: 'copyLabel', label: 'Citation box copy button', type: 'text' },
      { key: 'copiedLabel', label: 'Citation box copy confirmation', type: 'text' },
      { key: 'copyFailed', label: 'Copy error', type: 'text' },
    ],
  },
]

export default function AdminAgenticAiPaperPage() {
  return (
    <ContentEditorPage
      title="Agentic AI preprint"
      intro="Edit the paper, its citation, reference links, and search metadata."
      file="paper-agentic-ai"
      schema={schema}
      previewPath="/papers/agentic-ai/"
      validate={validateAgenticAiPaper}
    />
  )
}
