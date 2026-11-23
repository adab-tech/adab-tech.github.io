'use client'

import { CaseStudyArticle } from '@/components/CaseStudyArticle'
import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateCaseStudies, type CaseStudy, type CaseStudyContact } from '@/lib/case-studies'
import { PROJECTS } from '@/lib/site-content'

const schema: Field[] = [
  {
    key: 'contact', label: 'Contact and CV links', type: 'group',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'contactLabel', label: 'Contact link label', type: 'text' },
      { key: 'contactUrl', label: 'Contact link address', type: 'url' },
      { key: 'cvLabel', label: 'CV link label', type: 'text' },
      { key: 'cvUrl', label: 'CV link address', type: 'url' },
    ],
  },
  {
    key: 'studies', label: 'Case studies', type: 'list', itemLabel: 'case study', titleKey: 'title',
    fields: [
      { key: 'slug', label: 'URL name', type: 'text', help: 'Changing this changes the public address.' },
      { key: 'projectId', label: 'Related project ID', type: 'select', options: PROJECTS.projects.map((project) => project.id) },
      { key: 'title', label: 'Project name', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'role', label: 'Your role', type: 'text' },
      {
        key: 'metrics', label: 'Evidence at a glance', type: 'list', itemLabel: 'metric', titleKey: 'label',
        fields: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
      {
        key: 'sections', label: 'Sections', type: 'list', itemLabel: 'section', titleKey: 'heading',
        fields: [
          { key: 'heading', label: 'Heading', type: 'text' },
          { key: 'body', label: 'Body', type: 'textarea' },
        ],
      },
      {
        key: 'links', label: 'Evidence links', type: 'list', itemLabel: 'link', titleKey: 'label',
        fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'url', label: 'Address', type: 'url' },
        ],
      },
    ],
  },
]

function preview(data: Record<string, unknown>) {
  const problems = validateCaseStudies(data)
  if (problems.length) return <ul className="list-inside list-disc text-sm text-red-200">{problems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
  return (
    <div className="space-y-10 divide-y divide-zinc-800 [&>*+*]:pt-8">
      {(data.studies as CaseStudy[]).map((study) => <CaseStudyArticle key={study.slug} study={study} contact={data.contact as CaseStudyContact} preview />)}
    </div>
  )
}

export default function CaseStudiesEditorPage() {
  return (
    <ContentEditorPage title="Case studies" intro="Edit your contributions, research evidence, and public project links."
      file="case-studies" schema={schema} previewPath="/projects/" validate={validateCaseStudies} renderPreview={preview} />
  )
}
