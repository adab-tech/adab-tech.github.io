'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateBlogIndex } from '@/lib/blog-index-content'

const schema: Field[] = [
  { key: 'heading', label: 'Heading', type: 'text' },
  { key: 'intro', label: 'Introduction', type: 'textarea' },
  { key: 'feedLabel', label: 'RSS link label', type: 'text' },
  { key: 'readLabel', label: 'Read link label', type: 'text' },
  { key: 'readingTimeLabel', label: 'Reading time label after the number', type: 'text' },
  { key: 'emptyMessage', label: 'Message when the blog has no posts', type: 'textarea' },
  { key: 'loadErrorMessage', label: 'Message when posts cannot be loaded', type: 'textarea' },
  { key: 'feedTitle', label: 'RSS feed title', type: 'text' },
  { key: 'feedDescription', label: 'RSS feed description', type: 'textarea' },
  { key: 'metadataTitle', label: 'Browser tab title', type: 'text' },
  { key: 'metadataDescription', label: 'Search description', type: 'textarea' },
]

export default function AdminBlogIndexPage() {
  return (
    <ContentEditorPage
      title="Blog index"
      intro="Edit the blog landing page, listing labels, and RSS feed description. Write individual posts under Blog posts."
      file="blog-index"
      schema={schema}
      previewPath="/blog/"
      validate={validateBlogIndex}
    />
  )
}
