// The blog post file format, shared by the build (src/lib/blog.ts) and the
// admin editor (src/app/admin/blog), so both read and write files the same way.
// A post is content/blog/YYYY-MM-DD-slug.md: a front-matter block, then Markdown.

export type FrontMatter = Record<string, string | string[] | boolean>

export type PostFields = {
  title: string
  date: string // YYYY-MM-DD
  summary: string
  tags: string[]
  draft: boolean
  body: string
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
export const FILE_PATTERN = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/

// Parses the subset of YAML the posts use: `key: value`, `key: [a, b]`,
// `key: true|false`, with optional quotes around values.
export function parseFrontMatter(raw: string, file: string): { data: FrontMatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error(`${file}: missing front matter (a block between two --- lines at the top)`)
  const data: FrontMatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) throw new Error(`${file}: can't read front-matter line "${line}"`)
    const [, key, value] = kv
    const unquote = (v: string) => v.trim().replace(/^(['"])(.*)\1$/, '$2')
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map(unquote).filter(Boolean)
    } else if (value === 'true' || value === 'false') {
      data[key] = value === 'true'
    } else {
      data[key] = unquote(value)
    }
  }
  return { data, body: match[2] }
}

// Reads a post file into editable fields (used by the admin editor).
export function parsePostFile(raw: string, file: string): PostFields {
  const { data, body } = parseFrontMatter(raw, file)
  const fromName = file.match(FILE_PATTERN)?.[1] ?? ''
  return {
    title: typeof data.title === 'string' ? data.title : '',
    date: typeof data.date === 'string' ? data.date : fromName,
    summary: typeof data.summary === 'string' ? data.summary : '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    body: body.replace(/^\r?\n/, ''),
  }
}

// Always double-quoted: parseFrontMatter strips only the outer pair, so
// quotes inside the value survive.
function quote(value: string): string {
  return `"${value.replace(/\r?\n/g, ' ').trim()}"`
}

export function serializePost(p: PostFields): string {
  const lines = ['---', `title: ${quote(p.title)}`, `date: ${p.date}`]
  if (p.summary.trim()) lines.push(`summary: ${quote(p.summary)}`)
  const tags = p.tags.map((t) => t.replace(/[,[\]"']/g, '').trim()).filter(Boolean)
  if (tags.length) lines.push(`tags: [${tags.join(', ')}]`)
  if (p.draft) lines.push('draft: true')
  lines.push('---', '')
  return lines.join('\n') + p.body.trim() + '\n'
}

// "Ƙasar Hausa: a note" -> "kasar-hausa-a-note"
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ƙ/g, 'k')
    .replace(/ɗ/g, 'd')
    .replace(/ɓ/g, 'b')
    .replace(/ƴ/g, 'y')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

export function postFileName(date: string, slug: string): string {
  return `${date}-${slug}.md`
}

// Returns the problems that would make the build reject the post.
export function validatePost(p: PostFields, slug: string): string[] {
  const problems: string[] = []
  if (!p.title.trim()) problems.push('Add a title.')
  if (!DATE_PATTERN.test(p.date) || Number.isNaN(Date.parse(p.date))) problems.push('Date must be YYYY-MM-DD.')
  if (!SLUG_PATTERN.test(slug)) problems.push('The web address may use only lowercase letters, numbers and hyphens.')
  if (!p.body.trim()) problems.push('Write something in the post.')
  return problems
}

// Writers press Enter once between paragraphs; Markdown needs a blank line.
// Insert one between adjacent text lines, but leave lists, tables, quotes,
// indented continuations, and fenced code blocks as they are.
const KEEP_TOGETHER = /^\s*(?:[-*+]\s|\d+[.)]\s|\||>)/
export function normalizeParagraphs(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let inFence = false
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    out.push(line)
    const next = lines[i + 1]
    if (inFence || next === undefined) return
    const bothText = line.trim() !== '' && next.trim() !== ''
    const together =
      (KEEP_TOGETHER.test(line) && KEEP_TOGETHER.test(next)) || /^\s{2,}\S/.test(next) || /^\s*(```|~~~)/.test(next)
    if (bothText && !together) out.push('')
  })
  return out.join('\n')
}
