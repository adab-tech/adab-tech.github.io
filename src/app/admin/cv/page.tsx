'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateCv } from '@/lib/site-content'

const schema: Field[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'headline', label: 'Headline', type: 'text' },
  { key: 'location', label: 'Location and availability', type: 'text' },
  { key: 'website', label: 'Website shown', type: 'text' },
  { key: 'email', label: 'Email shown', type: 'text' },
  {
    key: 'profiles',
    label: 'Profile buttons',
    type: 'list',
    itemLabel: 'profile',
    titleKey: 'label',
    fields: [
      { key: 'label', label: 'Text', type: 'text' },
      { key: 'url', label: 'Link', type: 'url' },
      { key: 'color', label: 'Colour', type: 'select', options: ['blue', 'lime', 'amber', 'emerald', 'zinc'] },
    ],
  },
  {
    key: 'education',
    label: 'Education',
    type: 'list',
    itemLabel: 'degree',
    titleKey: 'degree',
    fields: [
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. 2023 or Expected Dec 2026' },
      { key: 'institution', label: 'Institution and place', type: 'text' },
      { key: 'highlight', label: 'Show the date in amber (e.g. in progress)', type: 'bool' },
    ],
  },
  {
    key: 'experience',
    label: 'Experience',
    type: 'list',
    itemLabel: 'position',
    titleKey: 'title',
    fields: [
      { key: 'title', label: 'Role — organisation', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'text', placeholder: 'e.g. 2023 – Present' },
      { key: 'featured', label: 'Feature this role (highlighted box)', type: 'bool' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'bullets', label: 'Bullet points', type: 'strings', itemLabel: 'bullet point' },
    ],
  },
  {
    key: 'languages',
    label: 'Languages',
    type: 'list',
    itemLabel: 'language',
    titleKey: 'name',
    fields: [
      { key: 'name', label: 'Language', type: 'text' },
      { key: 'level', label: 'Level', type: 'text' },
      { key: 'note', label: 'Note (optional, e.g. a certificate)', type: 'text' },
    ],
  },
  { key: 'scholarUrl', label: 'Google Scholar link (Publications heading)', type: 'url' },
  {
    key: 'publicationGroups',
    label: 'Publications',
    type: 'list',
    itemLabel: 'group',
    titleKey: 'heading',
    help: 'Groups such as “Book reviews” or “Journal articles”, each with its items.',
    fields: [
      { key: 'heading', label: 'Group heading', type: 'text' },
      {
        key: 'items',
        label: 'Items',
        type: 'list',
        itemLabel: 'publication',
        titleKey: 'title',
        fields: [
          { key: 'title', label: 'Title', type: 'textarea' },
          { key: 'venue', label: 'Venue, year, pages', type: 'text' },
          { key: 'href', label: 'Link (optional)', type: 'url' },
        ],
      },
    ],
  },
  {
    key: 'datasets',
    label: 'Research datasets & digital projects',
    type: 'list',
    itemLabel: 'dataset',
    titleKey: 'title',
    fields: [
      { key: 'title', label: 'Title', type: 'textarea' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'meta', label: 'Details line (version, licence, DOI link)', type: 'textarea' },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'links',
        label: 'Links',
        type: 'list',
        itemLabel: 'link',
        titleKey: 'label',
        fields: [
          { key: 'label', label: 'Text', type: 'text' },
          { key: 'url', label: 'Link', type: 'url' },
        ],
      },
    ],
  },
]

export default function AdminCvPage() {
  return (
    <ContentEditorPage
      title="CV"
      intro="Edit every section of adamu.tech/cv: education, experience, languages, publications and datasets."
      file="cv"
      schema={schema}
      previewPath="/cv/"
      validate={validateCv}
    />
  )
}
