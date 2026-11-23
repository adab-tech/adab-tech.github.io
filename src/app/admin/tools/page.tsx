'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { TOOL_FIELDS, validateTools } from '@/lib/tools-content'

const groupLabels: Record<keyof typeof TOOL_FIELDS, string> = {
  page: 'Page heading and search',
  output: 'Copy output',
  data: 'JSON and JSON Lines',
  unicode: 'Unicode text',
  citation: 'BibTeX citation',
  links: 'Link inspector',
}

const schema: Field[] = Object.entries(TOOL_FIELDS).map(([key, entries]) => ({
  key,
  label: groupLabels[key as keyof typeof groupLabels],
  type: 'group',
  fields: Object.entries(entries).map(([key, label]) => ({
    key,
    label,
    type: ['description', 'intro', 'destinationNote'].includes(key) ? 'textarea' : 'text',
  })),
}))

export default function AdminToolsPage() {
  return (
    <ContentEditorPage
      title="Tools page"
      intro="Edit the heading, instructions, examples, and labels for the browser-based tools."
      file="tools"
      schema={schema}
      previewPath="/tools/"
      validate={validateTools}
    />
  )
}
