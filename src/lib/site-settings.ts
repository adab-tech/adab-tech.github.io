import settings from '../../content/site/site-settings.json'
import { parsePublicUrl } from './public-url'

export const SITE_SETTINGS = settings

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isExternalLink(value: unknown): boolean {
  return parsePublicUrl(value)?.kind === 'external'
}

function isAffiliation(value: unknown, optional = false): boolean {
  if (!isRecord(value) || typeof value.name !== 'string' || typeof value.url !== 'string') return false
  if (optional && !value.name.trim() && !value.url) return true
  return hasText(value.name) && (value.url === '' || isExternalLink(value.url))
}

export function validateSiteSettings(value: unknown): string[] {
  if (!isRecord(value)) return ['Site details must be a JSON object.']

  const problems: string[] = []
  if (!hasText(value.siteName)) problems.push('Enter a site name.')
  if (!hasText(value.appDescription)) problems.push('Enter a site description.')
  if (!Array.isArray(value.keywords) || !value.keywords.every(hasText)) problems.push('Enter each search keyword on its own line.')

  const card = value.shareCard
  if (!isRecord(card) || !hasText(card.title) || !hasText(card.alt) || typeof card.kicker !== 'string' || typeof card.footer !== 'string') {
    problems.push('Enter the social preview title and image description.')
  }

  const profile = value.profile
  if (!isRecord(profile)) return [...problems, 'Add your search profile.']
  if (!['alternateName', 'givenName', 'additionalName', 'familyName', 'jobTitle'].every((key) => typeof profile[key] === 'string')) {
    problems.push('Enter profile names and job title as text.')
  }
  const image = parsePublicUrl(profile.image)
  if (profile.image !== '' && !(image?.kind === 'external' || (image?.kind === 'local' && image.href.startsWith('/')))) {
    problems.push('Use a local image path or an HTTPS image URL for your profile.')
  }
  if (!isAffiliation(profile.employer, true)) problems.push('Enter an employer name and, optionally, its HTTPS URL.')
  if (!Array.isArray(profile.alumni) || !profile.alumni.every((entry) => isAffiliation(entry))) {
    problems.push('Enter a name and, optionally, a valid HTTPS URL for each institution.')
  }
  if (!Array.isArray(profile.expertise) || !profile.expertise.every(hasText)) problems.push('Enter each area of expertise on its own line.')
  if (!Array.isArray(profile.profileLinks) || !profile.profileLinks.every(isExternalLink)) problems.push('Use HTTPS links for your public profiles.')

  return problems
}
