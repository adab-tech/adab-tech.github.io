'use client'

import { ContentEditorPage, type Field } from '@/components/admin/ContentEditor'
import { validateContact } from '@/lib/contact-content'

const schema: Field[] = [
  { key: 'label', label: 'Small label above the heading', type: 'text' },
  { key: 'heading', label: 'Heading', type: 'text' },
  { key: 'infoHeading', label: 'Contact information heading', type: 'text' },
  { key: 'intro', label: 'Introduction', type: 'textarea' },
  {
    key: 'email',
    label: 'Public contact email',
    type: 'text',
    help: 'Used by the email link and when the form opens a visitor’s email app.',
  },
  { key: 'emailLinkLabel', label: 'Email link label for screen readers', type: 'text' },
  { key: 'nameLabel', label: 'Name field label', type: 'text' },
  { key: 'emailLabel', label: 'Email field label', type: 'text' },
  { key: 'messageLabel', label: 'Message field label', type: 'text' },
  { key: 'copyLabel', label: 'Copy address button', type: 'text' },
  { key: 'copiedMessage', label: 'Address copied message', type: 'text' },
  { key: 'copyHelp', label: 'Manual copy instructions', type: 'text' },
  { key: 'emailAppLabel', label: 'Open email app button', type: 'text' },
  { key: 'emailAppHint', label: 'Email app instructions', type: 'text' },
  { key: 'sendLabel', label: 'Send button when direct delivery is enabled', type: 'text' },
  { key: 'sendingLabel', label: 'Sending button', type: 'text' },
  { key: 'successMessage', label: 'Message after a successful submission', type: 'textarea' },
  { key: 'fallbackMessage', label: 'Message when opening the visitor’s email app after a relay error', type: 'textarea' },
  { key: 'emailSubject', label: 'Subject for the visitor’s email app', type: 'text', help: 'Use {name} to insert the visitor’s name.' },
  { key: 'metadataTitle', label: 'Browser tab title', type: 'text' },
  { key: 'metadataDescription', label: 'Search description', type: 'textarea' },
]

export default function AdminContactPage() {
  return (
    <ContentEditorPage
      title="Contact page"
      intro="Edit the public contact address, page text, and contact form labels."
      file="contact"
      schema={schema}
      previewPath="/contact/"
      validate={validateContact}
    />
  )
}
