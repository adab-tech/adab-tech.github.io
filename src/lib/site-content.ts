// Public content lives in content/site/*.json. The same validators run in
// the admin editors and during the static site build.

import homeJson from '../../content/site/home.json'
import projectsJson from '../../content/site/projects.json'
import cvJson from '../../content/site/cv.json'
import { BLOG_INDEX, validateBlogIndex } from './blog-index-content'
import { CASE_STUDY_CONTENT, validateCaseStudies } from './case-studies'
import { CONTACT, validateContact } from './contact-content'
import { NAVIGATION, validateNavigation } from './navigation'
import { AGENTIC_AI_PAPER, validateAgenticAiPaper } from './paper-agentic-ai-content'
import { parsePublicUrl } from './public-url'
import { SITE_SETTINGS, validateSiteSettings } from './site-settings'
import { TOOLS, validateTools } from './tools-content'

export type StatusColor = 'emerald' | 'blue' | 'amber'

// Editorial fields are optional so content saved before these controls still loads.
interface PageMetadata {
  title?: string
  description?: string
}

export interface Project {
  id: string
  title: string
  logo: string // path under public/ or an https URL; empty = the site's own favicon or initials
  logoFill?: boolean // the logo has its own background: show it edge to edge, not on a white tile
  iconRow: boolean // show in the row of project icons
  category: string
  role: string
  type: string
  status: string
  statusColor: StatusColor
  showOnHome: boolean
  homeSummary: string
  homeLinkLabel: string
  description: string
  highlights: string[]
  liveUrl: string
  liveLinkLabel?: string
  paperUrl: string
  paperLinkLabel?: string
  modelUrl: string
  modelLinkLabel?: string
  repoUrl: string
  repoLabel: string
  tags: string[]
}

export interface ProjectsContent {
  metadata?: PageMetadata
  heading: string
  intro: string
  homeKicker?: string
  homeHeading: string
  homeIntro: string
  iconRowLabel: string
  categories: string[]
  projects: Project[]
}

export interface HomeContent {
  metadata?: PageMetadata & { shareTitle?: string; shareDescription?: string }
  badge: string
  name: string
  tagline: string
  intro: string
  location: string
  email: string
  buttons: { label: string; url: string; icon: string; primary: boolean }[]
  numbers: {
    show: boolean
    kicker: string
    heading: string
    intro: string
    items: { metric: string; label: string; sub: string }[]
    specsTitle: string
    specsLinkLabel: string
    specsLinkUrl: string
    specs: { label: string; value: string }[]
    evidenceTitle: string
    evidence: { title: string; text: string }[]
    footnote: string
  }
  principles: { show: boolean; kicker: string; heading: string; items: { title: string; text: string }[] }
  contact: { heading: string; text: string; note: string }
}

export interface CvContent {
  metadata?: PageMetadata
  sectionHeadings?: {
    education?: string
    experience?: string
    languages?: string
    publications?: string
    datasets?: string
  }
  name: string
  headline: string
  summary?: string
  location: string
  website: string
  websiteUrl?: string
  email: string
  profiles: { label: string; url: string; color: string }[]
  education: { degree: string; date: string; institution: string; highlight: boolean }[]
  experience: { title: string; dates: string; featured: boolean; summary: string; bullets: string[] }[]
  languages: { name: string; level: string; note: string }[]
  scholarUrl: string
  scholarLabel?: string
  publicationGroups: { heading: string; items: { title: string; venue: string; href: string }[] }[]
  datasets: { title: string; year: string; meta: string; description: string; links: { label: string; url: string }[] }[]
}

export const HOME = homeJson as HomeContent
export const PROJECTS = projectsJson as ProjectsContent
export const CV = cvJson as CvContent

// The main link of a project: its live site, else its paper, else its dataset.
export const primaryLink = (p: Project) => p.liveUrl || p.paperUrl || p.modelUrl

// Where a project's icon comes from: an uploaded/committed logo, else the
// live site's own favicon (loaded by the visitor's browser).
export function logoSrc(p: Project): string {
  if (p.logo) return p.logo
  if (p.liveUrl && /^https?:\/\//.test(p.liveUrl)) {
    try {
      return `${new URL(p.liveUrl).origin}/favicon.ico`
    } catch {}
  }
  return ''
}

export function initials(title: string): string {
  const words = title.replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /^[\p{L}\p{N}]/u.test(w))
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? '?').slice(0, 2)).toUpperCase()
}

// Checks shared by the build and the admin editors. Each returns a list of
// problems in plain words (empty = fine).
const isList = (v: unknown) => Array.isArray(v)

function checkLink(problems: string[], label: string, value: unknown, allowEmail = false) {
  if (value === '') return
  const destination = parsePublicUrl(value)
  if (!destination || (destination.kind === 'email' && !allowEmail)) {
    problems.push(`${label}: use a local path or an HTTPS URL${allowEmail ? ', or a mailto link' : ''}`)
  }
}

function checkOptionalText(problems: string[], label: string, value: unknown) {
  if (value !== undefined && typeof value !== 'string') problems.push(`${label}: enter text`)
}

function checkOptionalTextGroup(problems: string[], label: string, value: unknown, keys: string[]) {
  if (value === undefined) return
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    problems.push(`${label}: use a group of text fields`)
    return
  }
  const fields = value as Record<string, unknown>
  for (const key of keys) checkOptionalText(problems, `${label} ${key}`, fields[key])
}

export function validateProjects(d: ProjectsContent): string[] {
  const problems: string[] = []
  checkOptionalTextGroup(problems, 'Projects page metadata', d.metadata, ['title', 'description'])
  checkOptionalText(problems, 'Home projects section label', d.homeKicker)
  if (!isList(d.categories)) problems.push('categories must be a list')
  if (!isList(d.projects)) return [...problems, 'projects must be a list']
  const ids = new Set<string>()
  d.projects.forEach((p, i) => {
    const where = `Project ${i + 1} (${p.title || 'untitled'})`
    if (!p.title) problems.push(`${where}: add a title`)
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) problems.push(`${where}: the id must be lowercase letters, numbers and dashes`)
    else if (ids.has(p.id)) problems.push(`${where}: the id "${p.id}" is used by another project`)
    ids.add(p.id)
    if (isList(d.categories) && !d.categories.includes(p.category)) problems.push(`${where}: category "${p.category}" is not in the category list`)
    if (!['emerald', 'blue', 'amber'].includes(p.statusColor)) problems.push(`${where}: status colour must be emerald, blue or amber`)
    if (!isList(p.highlights) || !isList(p.tags)) problems.push(`${where}: highlights and tags must be lists`)
    for (const field of ['liveUrl', 'paperUrl', 'modelUrl', 'repoUrl', 'logo'] as const) {
      checkLink(problems, `${where} ${field}`, p[field])
    }
    for (const field of ['liveLinkLabel', 'paperLinkLabel', 'modelLinkLabel'] as const) {
      checkOptionalText(problems, `${where} ${field}`, p[field])
    }
  })
  return problems
}

export function validateHome(d: HomeContent): string[] {
  const problems: string[] = []
  checkOptionalTextGroup(problems, 'Home page metadata', d.metadata, ['title', 'description', 'shareTitle', 'shareDescription'])
  if (!d.name) problems.push('Add a name')
  if (!isList(d.buttons)) problems.push('buttons must be a list')
  else d.buttons.forEach((button) => checkLink(problems, `Button "${button.label}"`, button.url, true))
  if (!d.numbers || !isList(d.numbers.items) || !isList(d.numbers.specs) || !isList(d.numbers.evidence)) problems.push('the numbers section is incomplete')
  else checkLink(problems, 'Technical specifications link', d.numbers.specsLinkUrl)
  if (!d.principles || !isList(d.principles.items)) problems.push('the principles section is incomplete')
  if (!d.contact) problems.push('the contact section is missing')
  return problems
}

export function validateCv(d: CvContent): string[] {
  const problems: string[] = []
  checkOptionalTextGroup(problems, 'CV metadata', d.metadata, ['title', 'description'])
  checkOptionalText(problems, 'CV profile', d.summary)
  checkOptionalTextGroup(problems, 'CV section headings', d.sectionHeadings, ['education', 'experience', 'languages', 'publications', 'datasets'])
  checkOptionalText(problems, 'Google Scholar link text', d.scholarLabel)
  if (d.websiteUrl !== undefined) checkLink(problems, 'CV website link', d.websiteUrl)
  if (!d.name) problems.push('Add a name')
  for (const key of ['profiles', 'education', 'experience', 'languages', 'publicationGroups', 'datasets'] as const) {
    if (!isList(d[key])) problems.push(`${key} must be a list`)
  }
  checkLink(problems, 'Google Scholar link', d.scholarUrl)
  if (isList(d.profiles)) d.profiles.forEach((profile) => checkLink(problems, `Profile "${profile.label}"`, profile.url))
  if (isList(d.publicationGroups)) {
    d.publicationGroups.forEach((group) => {
      if (!isList(group.items)) problems.push(`Publications in "${group.heading}" must be a list`)
      else group.items.forEach((entry) => checkLink(problems, `Publication "${entry.title}"`, entry.href))
    })
  }
  if (isList(d.datasets)) {
    d.datasets.forEach((dataset) => {
      if (!isList(dataset.links)) problems.push(`Links for "${dataset.title}" must be a list`)
      else dataset.links.forEach((link) => checkLink(problems, `Dataset "${dataset.title}" link "${link.label}"`, link.url))
    })
  }
  return problems
}

// Build-time check: a malformed file stops the deploy with a message that
// names the problem, and the live site stays as it was.
export function checkSiteContent(): void {
  const problems = [
    ...validateHome(HOME).map((p) => `home.json: ${p}`),
    ...validateProjects(PROJECTS).map((p) => `projects.json: ${p}`),
    ...validateCv(CV).map((p) => `cv.json: ${p}`),
    ...validateContact(CONTACT).map((p) => `contact.json: ${p}`),
    ...validateBlogIndex(BLOG_INDEX).map((p) => `blog-index.json: ${p}`),
    ...validateCaseStudies(CASE_STUDY_CONTENT).map((p) => `case-studies.json: ${p}`),
    ...validateNavigation(NAVIGATION).map((p) => `navigation.json: ${p}`),
    ...validateSiteSettings(SITE_SETTINGS).map((p) => `site-settings.json: ${p}`),
    ...validateAgenticAiPaper(AGENTIC_AI_PAPER).map((p) => `paper-agentic-ai.json: ${p}`),
    ...validateTools(TOOLS).map((p) => `tools.json: ${p}`),
  ]
  if (problems.length) throw new Error(`Site content has problems:\n- ${problems.join('\n- ')}`)
}
