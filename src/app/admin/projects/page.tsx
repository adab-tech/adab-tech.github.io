'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { slugify } from '@/lib/blog-format'
import { validateProjects } from '@/lib/site-content'

const project: Field[] = [
  { key: 'title', label: 'Name', type: 'text' },
  { key: 'logo', label: 'Logo', type: 'logo', help: 'Shown on the project cards and in the “My platforms” icon row. Leave empty to use the live site’s own icon.' },
  { key: 'logoFill', label: 'Logo has its own background (fill the whole tile, no white frame)', type: 'bool' },
  { key: 'liveUrl', label: 'Live site', type: 'url', help: 'Where the logo and the live-site link go. Leave empty if there is no site.', placeholder: 'https://…' },
  { key: 'liveLinkLabel', label: 'Live-site link text (Projects page)', type: 'text', placeholder: 'Live site' },
  { key: 'iconRow', label: 'Show in the “My platforms” icon row', type: 'bool', default: true },
  { key: 'showOnHome', label: 'Feature on the home page and Projects page', type: 'bool', default: true },
  { key: 'category', label: 'Category', type: 'select', options: (root) => (root.categories as string[]) ?? [] },
  { key: 'role', label: 'My role', type: 'text' },
  { key: 'type', label: 'Kind of project (home page)', type: 'text', placeholder: 'e.g. Open research dataset & atlas' },
  { key: 'status', label: 'Status label', type: 'text', placeholder: 'e.g. Live, Pre-print, Dataset v1.0' },
  { key: 'statusColor', label: 'Status colour', type: 'select', options: ['emerald', 'blue', 'amber'], default: 'emerald', help: 'emerald = live, blue = research/dataset, amber = in progress' },
  { key: 'homeSummary', label: 'Short description (home page)', type: 'textarea' },
  { key: 'homeLinkLabel', label: 'Main link text (home page)', type: 'text', placeholder: 'Visit', default: 'Visit' },
  { key: 'description', label: 'Full description (Projects page)', type: 'textarea' },
  { key: 'highlights', label: 'Highlights (Projects page)', type: 'strings', itemLabel: 'highlight' },
  { key: 'paperUrl', label: 'Paper link', type: 'url', help: 'A page on this site starts with /, such as /papers/agentic-ai.' },
  { key: 'paperLinkLabel', label: 'Paper link text (Projects page)', type: 'text', placeholder: 'Paper' },
  { key: 'modelUrl', label: 'Model or dataset link', type: 'url' },
  { key: 'modelLinkLabel', label: 'Model or dataset link text', type: 'text', help: 'Used on project cards when the model or dataset has a separate link. Leave empty to use the default label.' },
  { key: 'repoUrl', label: 'Source / profile link', type: 'url' },
  { key: 'repoLabel', label: 'Source link text', type: 'text', placeholder: 'Source', default: 'Source' },
  { key: 'tags', label: 'Tags', type: 'strings', itemLabel: 'tag' },
  { key: 'id', label: 'Internal id', type: 'text', help: 'Filled in from the name if left empty. Lowercase letters, numbers and dashes.' },
]

const schema: Field[] = [
  { key: 'projects', label: 'Projects', type: 'list', itemLabel: 'project', titleKey: 'title', fields: project, help: 'Order here is the order on the site. Click a project to edit it.' },
  { key: 'iconRowLabel', label: 'Icon row label', type: 'text', help: 'Text beside the row of project icons below the featured projects. Leave empty for icons only.' },
  { key: 'heading', label: 'Projects page heading', type: 'text' },
  { key: 'intro', label: 'Projects page introduction', type: 'textarea' },
  { key: 'homeKicker', label: 'Small label above Home page projects', type: 'text', placeholder: 'Projects' },
  { key: 'homeHeading', label: 'Home page projects heading', type: 'text' },
  { key: 'homeIntro', label: 'Home page projects introduction', type: 'textarea' },
  { key: 'categories', label: 'Project categories', type: 'strings', itemLabel: 'category' },
  {
    key: 'metadata',
    label: 'Search',
    type: 'group',
    help: 'Leave a field empty to use the site default.',
    fields: [
      { key: 'title', label: 'Browser and search title', type: 'text', placeholder: 'Projects' },
      { key: 'description', label: 'Search description', type: 'textarea' },
    ],
  },
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
