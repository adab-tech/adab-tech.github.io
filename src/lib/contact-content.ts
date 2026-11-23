import contactJson from '../../content/site/contact.json'

const emailAppDefaults = {
  emailAppLabel: 'Open email app',
  emailAppHint: 'This opens a draft in your email app. Review it there and press Send.',
  copyLabel: 'Copy email address',
  copiedMessage: 'Email address copied.',
  copyHelp: 'Select the email address above and copy it.',
}

export type ContactContent = typeof emailAppDefaults & {
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

export const CONTACT: ContactContent = { ...emailAppDefaults, ...contactJson }

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
  emailAppLabel: 'Open email app button',
  emailAppHint: 'Email app instructions',
  copyLabel: 'Copy address button',
  copiedMessage: 'Address copied message',
  copyHelp: 'Manual copy instructions',
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
  const data: Record<string, unknown> = { ...emailAppDefaults, ...value }
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
