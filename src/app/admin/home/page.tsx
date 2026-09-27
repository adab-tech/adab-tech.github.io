'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateHome } from '@/lib/site-content'

const titleText: Field[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'text', label: 'Text', type: 'textarea' },
]

const schema: Field[] = [
  { key: 'badge', label: 'Small badge above the name', type: 'text' },
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'tagline', label: 'Title line under the name', type: 'text' },
  { key: 'intro', label: 'Introduction', type: 'textarea' },
  { key: 'location', label: 'Location and availability', type: 'text' },
  { key: 'email', label: 'Email shown (leave empty to hide)', type: 'text' },
  {
    key: 'buttons',
    label: 'Buttons',
    type: 'list',
    itemLabel: 'button',
    titleKey: 'label',
    help: 'The buttons under the introduction. Links to pages on this site start with /; email links start with mailto:',
    fields: [
      { key: 'label', label: 'Text', type: 'text' },
      { key: 'url', label: 'Link', type: 'url' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['mail', 'cpu', 'book', 'file', 'link'] },
      { key: 'primary', label: 'Highlighted (amber) button', type: 'bool' },
    ],
  },
  {
    key: 'numbers',
    label: 'Murya in numbers',
    type: 'group',
    fields: [
      { key: 'show', label: 'Show this section', type: 'bool', default: true },
      { key: 'kicker', label: 'Small label', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Introduction', type: 'textarea' },
      {
        key: 'items',
        label: 'Figures',
        type: 'list',
        itemLabel: 'figure',
        titleKey: 'label',
        fields: [
          { key: 'metric', label: 'Figure', type: 'text', placeholder: 'e.g. 30,729' },
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'sub', label: 'Explanation', type: 'textarea' },
        ],
      },
      { key: 'specsTitle', label: 'Specifications box title', type: 'text' },
      { key: 'specsLinkLabel', label: 'Specifications link text', type: 'text' },
      { key: 'specsLinkUrl', label: 'Specifications link', type: 'url' },
      {
        key: 'specs',
        label: 'Specifications',
        type: 'list',
        itemLabel: 'specification',
        titleKey: 'label',
        fields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
        ],
      },
      { key: 'evidenceTitle', label: 'Evidence heading', type: 'text' },
      { key: 'evidence', label: 'Evidence boxes', type: 'list', itemLabel: 'box', titleKey: 'title', fields: titleText },
      { key: 'footnote', label: 'Footnote', type: 'textarea' },
    ],
  },
  {
    key: 'principles',
    label: 'Design principles',
    type: 'group',
    fields: [
      { key: 'show', label: 'Show this section', type: 'bool', default: true },
      { key: 'kicker', label: 'Small label', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'items', label: 'Principles', type: 'list', itemLabel: 'principle', titleKey: 'title', fields: titleText },
    ],
  },
  {
    key: 'contact',
    label: 'Contact box (bottom of the page)',
    type: 'group',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'text', label: 'Text', type: 'textarea' },
      { key: 'note', label: 'Small print', type: 'textarea' },
    ],
  },
]

export default function AdminHomePage() {
  return (
    <ContentEditorPage
      title="Home page"
      intro="Edit the text, buttons and sections of the home page. The projects on the home page are edited under Projects."
      file="home"
      schema={schema}
      previewPath="/"
      validate={validateHome}
    />
  )
}
