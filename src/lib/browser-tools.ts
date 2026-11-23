type DataFormat = 'json' | 'jsonl'

function jsonTokens(value: string): string[] {
  JSON.parse(value)
  // Keep the original tokens so formatting never rounds large identifiers
  // or silently drops duplicate keys.
  return value.match(/"(?:\\.|[^"\\])*"|[{}[\]:,]|[^{}[\]:,"\s]+/g) ?? []
}

function indentJson(tokens: string[]): string {
  const pieces: string[] = []
  let depth = 0

  for (const [index, token] of tokens.entries()) {
    if (token === '{' || token === '[') {
      pieces.push(token)
      depth += 1
      if (tokens[index + 1] !== (token === '{' ? '}' : ']')) {
        pieces.push('\n', '  '.repeat(depth))
      }
    } else if (token === '}' || token === ']') {
      depth -= 1
      if (tokens[index - 1] !== (token === '}' ? '{' : '[')) {
        pieces.push('\n', '  '.repeat(depth))
      }
      pieces.push(token)
    } else if (token === ',') {
      pieces.push(',\n', '  '.repeat(depth))
    } else if (token === ':') {
      pieces.push(': ')
    } else {
      pieces.push(token)
    }
  }

  return pieces.join('')
}

export function formatData(value: string, format: DataFormat) {
  if (format === 'json') {
    return { output: indentJson(jsonTokens(value)), summary: 'Valid JSON.' }
  }

  const lines = value.split('\n')
  if (lines.at(-1) === '') lines.pop()

  const records = lines.map((line, index) => {
    try {
      return jsonTokens(line).join('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid JSON.'
      throw new Error(`Line ${index + 1}: ${message}`)
    }
  })

  if (!records.length) throw new Error('Enter at least one JSON Lines record.')

  return {
    output: records.join('\n'),
    summary: `Valid JSON Lines. ${records.length} ${records.length === 1 ? 'record' : 'records'}.`,
  }
}

export function inspectText(value: string, form: 'NFC' | 'NFD') {
  const output = value.normalize(form)
  const codePoints = Array.from(output)
  const graphemes = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(output)).length
    : null

  return {
    output,
    graphemes,
    codePoints: codePoints.length,
    combiningMarks: output.match(/\p{M}/gu)?.length ?? 0,
    bytes: new TextEncoder().encode(output).length,
    preview: codePoints.slice(0, 32).map((character) =>
      `U+${character.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
    ).join(' '),
  }
}

type Citation = {
  type: 'article' | 'book' | 'misc'
  key: string
  author: string
  title: string
  year: string
  publisher: string
  doi: string
}

const latexCharacters: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '{': '\\textbraceleft{}',
  '}': '\\textbraceright{}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
}

export function escapeBibTeXText(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/[\\{}%&#_$~^]/g, (character) =>
    latexCharacters[character] ?? `\\${character}`,
  )
}

export function buildBibTeX(citation: Citation): string {
  const { type } = citation
  const key = citation.key.trim()
  const year = citation.year.trim()
  const doi = citation.doi.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, '')
  const publication = citation.publisher.trim()

  if (!/^[a-zA-Z0-9_][a-zA-Z0-9_:.+-]*$/.test(key)) {
    throw new Error('Use a citation key such as Musa2026 with no spaces.')
  }
  if (!citation.author.trim() || !citation.title.trim() || !/^\d{4}$/.test(year)) {
    throw new Error('Enter an author, title and four-digit year.')
  }
  if (type !== 'misc' && !publication) {
    throw new Error(type === 'article' ? 'Enter the journal name.' : 'Enter the publisher.')
  }
  if (doi && !/^10\.\d{4,9}\/[^\s{}\\]+$/.test(doi)) {
    throw new Error('Enter a DOI such as 10.1234/example or leave it empty.')
  }

  const fields = [
    `author = {${escapeBibTeXText(citation.author)}}`,
    `title = {{${escapeBibTeXText(citation.title)}}}`,
    `year = {${year}}`,
  ]
  if (type !== 'misc') fields.push(`${type === 'article' ? 'journal' : 'publisher'} = {${escapeBibTeXText(publication)}}`)
  if (doi) fields.push(`doi = {${doi}}`)

  return `@${type}{${key},\n  ${fields.join(',\n  ')}\n}`
}

export function inspectLink(value: string) {
  const input = value.trim()
  if (!/^https?:\/\//i.test(input)) throw new Error('Enter a full HTTP or HTTPS URL.')

  let url: URL
  try {
    url = new URL(input)
  } catch {
    throw new Error('Enter a valid URL.')
  }

  const warnings = []
  if (url.protocol === 'http:') warnings.push('The URL uses HTTP, which does not encrypt the connection.')
  if (url.hostname.split('.').some((part) => part.startsWith('xn--'))) {
    warnings.push('The hostname uses Punycode. Check the spelling against the site you expect.')
  }
  if (url.username || url.password) {
    warnings.push('The URL includes user information before the hostname. Check the destination shown below.')
  }
  if (input.includes('\\')) warnings.push('The URL includes a backslash and may look different from the parsed destination.')
  if (url.port) warnings.push(`The URL uses the non-default port ${url.port}.`)

  return { origin: url.origin, hostname: url.hostname, warnings }
}
