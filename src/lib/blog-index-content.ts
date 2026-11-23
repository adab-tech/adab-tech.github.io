import blogIndexJson from '../../content/site/blog-index.json'

export type BlogIndexContent = {
  metadataTitle: string
  metadataDescription: string
  heading: string
  intro: string
  feedLabel: string
  feedTitle: string
  feedDescription: string
  emptyMessage: string
  loadErrorMessage: string
  readingTimeLabel: string
  readLabel: string
}

export const BLOG_INDEX: BlogIndexContent = blogIndexJson

const requiredCopy: Record<keyof BlogIndexContent, string> = {
  metadataTitle: 'Page title',
  metadataDescription: 'Page description',
  heading: 'Heading',
  intro: 'Introduction',
  feedLabel: 'RSS link label',
  feedTitle: 'RSS title',
  feedDescription: 'RSS description',
  emptyMessage: 'Empty blog message',
  loadErrorMessage: 'Loading error message',
  readingTimeLabel: 'Reading time label',
  readLabel: 'Read link label',
}

export function validateBlogIndex(value: unknown): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['Blog index content must be an object.']
  const data = value as Record<string, unknown>
  const problems = Object.entries(requiredCopy).flatMap(([key, label]) => {
    const text = data[key]
    return typeof text === 'string' && text.trim() ? [] : [`${label} is required.`]
  })
  for (const field of ['feedTitle', 'feedDescription'] as const) {
    const text = data[field]
    if (typeof text === 'string' && /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ud800-\udfff\ufffe\uffff]/u.test(text)) {
      problems.push(`${requiredCopy[field]} contains characters that cannot be included in an RSS feed.`)
    }
  }
  return problems
}
