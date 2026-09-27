// Build-time blog loader. Posts are Markdown files in content/blog/ named
// YYYY-MM-DD-slug.md with a small front-matter block (see docs/BLOG.md).
// Only imported by server components and the feed route, never by client code.
import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')
const SHOW_DRAFTS = process.env.NODE_ENV === 'development'

export type PostMeta = {
  slug: string
  title: string
  date: string // YYYY-MM-DD
  summary: string
  tags: string[]
  draft: boolean
  readingMinutes: number
}

export type Post = PostMeta & { html: string }

type FrontMatter = Record<string, string | string[] | boolean>

// Parses the subset of YAML the posts use: `key: value`, `key: [a, b]`,
// `key: true|false`, with optional quotes around values.
function parseFrontMatter(raw: string, file: string): { data: FrontMatter; body: string } {
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

function firstParagraph(markdown: string): string {
  const para = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('!') && !p.startsWith('>'))
  if (!para) return ''
  const text = para.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ')
  return text.length > 200 ? text.slice(0, 197).trimEnd() + '…' : text
}

function readPost(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
  const { data, body } = parseFrontMatter(raw, file)

  const nameMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
  if (!nameMatch) throw new Error(`${file}: name the file YYYY-MM-DD-your-slug.md`)
  const slug = nameMatch[2]
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${file}: use lowercase letters, numbers and hyphens after the date`)
  }

  const title = typeof data.title === 'string' ? data.title : ''
  if (!title) throw new Error(`${file}: add a title`)
  const date = typeof data.date === 'string' ? data.date : nameMatch[1]
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`${file}: date must be YYYY-MM-DD`)
  }

  const words = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    title,
    date,
    summary: typeof data.summary === 'string' && data.summary ? data.summary : firstParagraph(body),
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    html: marked.parse(body, { async: false, gfm: true }) as string,
  }
}

// Newest first. Drafts are left out of production builds.
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .filter((p) => SHOW_DRAFTS || !p.draft)
    .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)))

  const seen = new Set<string>()
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Two posts share the slug "${p.slug}"; rename one file`)
    seen.add(p.slug)
  }
  return posts
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
