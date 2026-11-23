import contactJson from '../../content/site/contact.json'

export type ContactContent = {
  metadataTitle: string
  metadataDescription: string
  label: string
  heading: string
  infoHeading: string
  intro: string
  email: string
  emailLinkLabel: string
  nameLabel: string
  emailLabel: string
  messageLabel: string
  sendLabel: string
  sendingLabel: string
  successMessage: string
  fallbackMessage: string
  emailSubject: string
}

export const CONTACT: ContactContent = contactJson

const requiredCopy: Record<Exclude<keyof ContactContent, 'email'>, string> = {
  metadataTitle: 'Page title',
  metadataDescription: 'Page description',
  label: 'Small label above the heading',
  heading: 'Heading',
  infoHeading: 'Contact information heading',
  intro: 'Introduction',
  emailLinkLabel: 'Email link label',
  nameLabel: 'Name field label',
  emailLabel: 'Email field label',
  messageLabel: 'Message field label',
  sendLabel: 'Send button',
  sendingLabel: 'Sending button',
  successMessage: 'Success message',
  fallbackMessage: 'Email fallback message',
  emailSubject: 'Email subject',
}

// The recipient is interpolated into a mailto URL. Accept a plain email
// address, with no query, fragment, encoded characters, or other recipients.
const MAILBOX = /^[a-z0-9_+-]+(?:\.[a-z0-9_+-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i

export function validateContact(value: unknown): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['Contact content must be an object.']
  const data = value as Record<string, unknown>
  const problems = Object.entries(requiredCopy).flatMap(([key, label]) => {
    const text = data[key]
    return typeof text === 'string' && text.trim() ? [] : [`${label} is required.`]
  })
  const email = data.email
  if (typeof email !== 'string' || email.length > 254 || !MAILBOX.test(email)) {
    problems.push('Contact email must be a plain address, such as contact@example.com.')
  }
  if (typeof data.emailSubject === 'string' && /[\r\n]/.test(data.emailSubject)) {
    problems.push('Email subject must fit on one line.')
  }
  return problems
}
