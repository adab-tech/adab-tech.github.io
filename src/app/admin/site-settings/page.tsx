'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateSiteSettings } from '@/lib/site-settings'

const affiliation: Field[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'url', label: 'Website', type: 'url' },
]

const schema: Field[] = [
  { key: 'siteName', label: 'Site name', type: 'text' },
  { key: 'keywords', label: 'Search keywords', type: 'strings', itemLabel: 'keyword' },
  { key: 'appDescription', label: 'Site description for browser installation', type: 'textarea' },
  {
    key: 'shareCard',
    label: 'Default social preview image',
    type: 'group',
    fields: [
      { key: 'kicker', label: 'Label above the headline', type: 'text' },
      { key: 'title', label: 'Headline in the image', type: 'textarea' },
      { key: 'footer', label: 'Footer in the image', type: 'text' },
      { key: 'alt', label: 'Image description', type: 'text' },
    ],
  },
  {
    key: 'profile',
    label: 'Public search profile',
    type: 'group',
    fields: [
      { key: 'alternateName', label: 'Alternate name', type: 'text' },
      { key: 'givenName', label: 'First name', type: 'text' },
      { key: 'additionalName', label: 'Middle name', type: 'text' },
      { key: 'familyName', label: 'Last name', type: 'text' },
      { key: 'jobTitle', label: 'Job title', type: 'text' },
      { key: 'image', label: 'Profile image URL', type: 'url' },
      { key: 'employer', label: 'Employer', type: 'group', fields: affiliation },
      { key: 'alumni', label: 'Institutions attended', type: 'list', itemLabel: 'institution', titleKey: 'name', fields: affiliation },
      { key: 'expertise', label: 'Areas of expertise', type: 'strings', itemLabel: 'area' },
      { key: 'profileLinks', label: 'Public profile links', type: 'strings', itemLabel: 'link' },
    ],
  },
]

export default function AdminSiteSettingsPage() {
  return (
    <ContentEditorPage
      title="Search and sharing"
      intro="Edit the public information that search engines and social previews read."
      file="site-settings"
      schema={schema}
      previewPath="/og.png"
      validate={validateSiteSettings}
    />
  )
}
