import toolsJson from '../../content/site/tools.json'

export const TOOL_FIELDS = {
  page: {
    title: 'Browser and search title',
    description: 'Search description',
    heading: 'Page heading',
    intro: 'Introduction',
    navigationLabel: 'Accessible tool navigation label',
  },
  output: {
    copyLabel: 'Copy button',
    copied: 'Copy confirmation',
    copyFailed: 'Copy error',
  },
  data: {
    title: 'Tool title',
    description: 'Description',
    formatLabel: 'Format field label',
    jsonLabel: 'JSON option',
    jsonLinesLabel: 'JSON Lines option',
    inputLabel: 'Input field label',
    placeholder: 'Input example',
    submitLabel: 'Action button',
    outputLabel: 'Output field label',
  },
  unicode: {
    title: 'Tool title',
    description: 'Description',
    formLabel: 'Normalization field label',
    nfcLabel: 'NFC option',
    nfdLabel: 'NFD option',
    inputLabel: 'Input field label',
    placeholder: 'Input example',
    submitLabel: 'Action button',
    clusterLabel: 'Text-cluster count label',
    codePointLabel: 'Code-point count label',
    combiningLabel: 'Combining-mark count label',
    bytesLabel: 'UTF-8 byte count label',
    unavailableLabel: 'Unavailable count label',
    previewLabel: 'Code-point preview label',
    outputLabel: 'Output field label',
  },
  citation: {
    title: 'Tool title',
    description: 'Description',
    typeLabel: 'Publication type field label',
    articleLabel: 'Article option',
    bookLabel: 'Book option',
    otherLabel: 'Other publication option',
    keyLabel: 'Citation key field label',
    keyPlaceholder: 'Citation key example',
    authorLabel: 'Author field label',
    authorPlaceholder: 'Author example',
    yearLabel: 'Year field label',
    yearPlaceholder: 'Year example',
    titleLabel: 'Publication title field label',
    journalLabel: 'Journal field label',
    publisherLabel: 'Publisher field label',
    doiLabel: 'DOI field label',
    doiPlaceholder: 'DOI example',
    submitLabel: 'Action button',
    outputLabel: 'Output field label',
  },
  links: {
    title: 'Tool title',
    description: 'Description',
    inputLabel: 'URL field label',
    placeholder: 'URL example',
    submitLabel: 'Action button',
    hostnameLabel: 'Hostname result label',
    originLabel: 'Origin result label',
    destinationNote: 'Destination note',
  },
} as const

export type ToolsContent = {
  [K in keyof typeof TOOL_FIELDS]: Record<keyof (typeof TOOL_FIELDS)[K], string>
}

export const TOOLS: ToolsContent = toolsJson

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

export function validateTools(data: unknown): string[] {
  const problems: string[] = []
  const root = record(data)

  for (const [name, fields] of Object.entries(TOOL_FIELDS)) {
    const group = record(root[name])
    for (const [key, label] of Object.entries(fields)) {
      const value = group[key]
      const optional = key.toLowerCase().endsWith('placeholder')
      if (typeof value !== 'string' || (!optional && !value.trim())) {
        problems.push(`${name}: ${label} ${optional ? 'must be text' : 'is required'}`)
      }
    }
  }

  return problems
}
