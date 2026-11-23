'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { SOCIAL_ICONS, validateNavigation } from '@/lib/navigation'

const link: Field[] = [
  { key: 'label', label: 'Link text', type: 'text' },
  { key: 'url', label: 'Destination', type: 'url', placeholder: '/about/ or https://…' },
]

const schema: Field[] = [
  {
    key: 'menu', label: 'Main menu', type: 'list', itemLabel: 'menu link', titleKey: 'label',
    fields: [...link, { key: 'featured', label: 'Highlight this link', type: 'bool' }],
    help: 'Reorder these links to set the menu order on desktop and mobile.',
  },
  {
    key: 'social', label: 'Social profiles', type: 'list', itemLabel: 'profile', titleKey: 'name',
    fields: [
      { key: 'name', label: 'Profile name', type: 'text' },
      { key: 'url', label: 'Profile or email link', type: 'url', placeholder: 'https://… or mailto:…' },
      { key: 'ariaLabel', label: 'Screen reader label (optional)', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'select', options: [...SOCIAL_ICONS], default: 'link' },
    ],
  },
  {
    key: 'footer', label: 'Footer', type: 'group',
    fields: [
      { key: 'copyright', label: 'Copyright text', type: 'text' },
      { key: 'license', label: 'License text', type: 'text' },
      { key: 'links', label: 'Footer links', type: 'list', itemLabel: 'footer link', titleKey: 'label', fields: link },
    ],
  },
]

export default function AdminNavigationPage() {
  return (
    <ContentEditorPage
      title="Navigation"
      intro="Edit and reorder the links in the public menu, social profiles, and footer."
      file="navigation"
      schema={schema}
      previewPath="/"
      validate={validateNavigation}
    />
  )
}
