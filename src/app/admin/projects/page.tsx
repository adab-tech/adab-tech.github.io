'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { slugify } from '@/lib/blog-format'
import { validateProjects } from '@/lib/site-content'

const project: Field[] = [
  { key: 'title', label: 'Name', type: 'text' },
  { key: 'logo', label: 'Logo', type: 'logo', help: 'Shown on the project cards and in the “My platforms” icon row. Leave empty to use the live site’s own icon.' },
  { key: 'liveUrl', label: 'Live site', type: 'url', help: 'Where the logo and “Launch Platform” go. Leave empty if there is no site.', placeholder: 'https://…' },
  { key: 'iconRow', label: 'Show in the “My platforms” icon row', type: 'bool', default: true },
  { key: 'showOnHome', label: 'Show on the home page', type: 'bool', default: true },
  { key: 'category', label: 'Category', type: 'select', options: (root) => (root.categories as string[]) ?? [] },
  { key: 'role', label: 'My role', type: 'text' },
  { key: 'type', label: 'Kind of project (home page)', type: 'text', placeholder: 'e.g. Open research dataset & atlas' },
  { key: 'status', label: 'Status label', type: 'text', placeholder: 'e.g. Live, Pre-print, Dataset v1.0' },
  { key: 'statusColor', label: 'Status colour', type: 'select', options: ['emerald', 'blue', 'amber'], default: 'emerald', help: 'emerald = live, blue = research/dataset, amber = in progress' },
  { key: 'homeSummary', label: 'Short description (home page)', type: 'textarea' },
  { key: 'homeLinkLabel', label: 'Main link text (home page)', type: 'text', placeholder: 'Visit', default: 'Visit' },
  { key: 'description', label: 'Full description (Projects page)', type: 'textarea' },
  { key: 'highlights', label: 'Highlights (Projects page)', type: 'strings', itemLabel: 'highlight' },
  { key: 'paperUrl', label: 'Paper link', type: 'url', help: 'Shows “Read Paper”. A page on this site starts with /, e.g. /papers/agentic-ai' },
  { key: 'modelUrl', label: 'Model or dataset link', type: 'url' },
  { key: 'repoUrl', label: 'Source / profile link', type: 'url' },
  { key: 'repoLabel', label: 'Source link text', type: 'text', placeholder: 'Source', default: 'Source' },
  { key: 'tags', label: 'Tags', type: 'strings', itemLabel: 'tag' },
  { key: 'id', label: 'Internal id', type: 'text', help: 'Filled in from the name if left empty. Lowercase letters, numbers and dashes.' },
]

const schema: Field[] = [
  { key: 'projects', label: 'Projects', type: 'list', itemLabel: 'project', titleKey: 'title', fields: project, help: 'Order here is the order on the site. Click a project to edit it.' },
  { key: 'iconRowLabel', label: 'Icon row label', type: 'text', help: 'Text beside the row of project icons near the top of the home page. Leave empty for icons only.' },
  { key: 'heading', label: 'Projects page heading', type: 'text' },
  { key: 'intro', label: 'Projects page introduction', type: 'textarea' },
  { key: 'homeHeading', label: 'Home page projects heading', type: 'text' },
  { key: 'homeIntro', label: 'Home page projects introduction', type: 'textarea' },
  { key: 'categories', label: 'Categories (filter buttons)', type: 'strings', itemLabel: 'category' },
]

export default function AdminProjectsPage() {
  return (
    <ContentEditorPage
      title="Projects"
      intro="Add, edit, reorder or remove projects, and set each one’s logo. Changes appear on the Projects page, the home page and the icon row about a minute after saving."
      file="projects"
      schema={schema}
      previewPath="/projects/"
      validate={validateProjects}
      beforeSave={(data) => {
        const projects = (data.projects as Record<string, unknown>[]).map((p) => ({
          ...p,
          id: String(p.id || '') || slugify(String(p.title || '')),
        }))
        return { ...data, projects }
      }}
    />
  )
}
