import navigationJson from '../../content/site/navigation.json'
import { parsePublicUrl } from './public-url'

export const SOCIAL_ICONS = ['scholar', 'github', 'huggingface', 'linkedin', 'mail', 'link'] as const
export type SocialIcon = (typeof SOCIAL_ICONS)[number]

export type NavigationLink = {
  label: string
  url: string
}

type NavigationContent = {
  menu: (NavigationLink & { featured?: boolean })[]
  social: { name: string; url: string; ariaLabel?: string; icon: SocialIcon }[]
  footer: { copyright: string; license: string; links: NavigationLink[] }
}

export const NAVIGATION = navigationJson as NavigationContent

const isRecord = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
)
const hasText = (value: unknown): boolean => typeof value === 'string' && value.trim().length > 0

function validateLinks(value: unknown, section: string, problems: string[], allowEmail: boolean) {
  if (!Array.isArray(value)) {
    problems.push(`${section} must be a list`)
    return
  }
  value.forEach((item, index) => {
    const label = `${section} link ${index + 1}`
    if (!isRecord(item) || !hasText(item.label)) problems.push(`${label}: add a label`)
    const url = isRecord(item) ? parsePublicUrl(item.url) : null
    if (!url || (!allowEmail && url.kind === 'email')) {
      problems.push(`${label}: use a local path or HTTPS URL${allowEmail ? ', or a mailto link' : ''}`)
    }
    if (section === 'Menu' && isRecord(item) && item.featured !== undefined && typeof item.featured !== 'boolean') {
      problems.push(`${label}: featured must be true or false`)
    }
  })
}

export function validateNavigation(value: unknown): string[] {
  if (!isRecord(value)) return ['Navigation must be an object']

  const problems: string[] = []
  validateLinks(value.menu, 'Menu', problems, false)

  if (!isRecord(value.footer)) {
    problems.push('Footer must be an object')
  } else {
    if (typeof value.footer.copyright !== 'string') problems.push('Footer copyright must be text')
    if (typeof value.footer.license !== 'string') problems.push('Footer license must be text')
    validateLinks(value.footer.links, 'Footer', problems, true)
  }

  if (!Array.isArray(value.social)) {
    problems.push('Social profiles must be a list')
  } else {
    value.social.forEach((item, index) => {
      const label = `Social profile ${index + 1}`
      if (!isRecord(item)) {
        problems.push(`${label}: add a name, destination, and icon`)
        return
      }
      if (!hasText(item.name)) problems.push(`${label}: add a name`)
      const url = parsePublicUrl(item.url)
      if (url?.kind !== 'external' && url?.kind !== 'email') problems.push(`${label}: use an HTTPS URL or a mailto link`)
      if (!SOCIAL_ICONS.some(icon => icon === item.icon)) problems.push(`${label}: choose an icon`)
      if (item.ariaLabel !== undefined && typeof item.ariaLabel !== 'string') {
        problems.push(`${label}: screen reader label must be text`)
      }
    })
  }

  return problems
}
