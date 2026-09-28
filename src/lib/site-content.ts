// Editable site content. The text of the home page, the projects, and the CV
// lives in content/site/*.json so it can be changed from adamu.tech/admin
// (or by editing the files on GitHub) without touching the page code.
// The shapes below are the contract between those files, the pages, and the
// admin editors; checkSiteContent() stops a build if a file is malformed.

import homeJson from '../../content/site/home.json'
import projectsJson from '../../content/site/projects.json'
import cvJson from '../../content/site/cv.json'

export type StatusColor = 'emerald' | 'blue' | 'amber'

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
  paperUrl: string
  modelUrl: string
  repoUrl: string
  repoLabel: string
  tags: string[]
}

export interface ProjectsContent {
  heading: string
  intro: string
  homeHeading: string
  homeIntro: string
  iconRowLabel: string
  categories: string[]
  projects: Project[]
}

export interface HomeContent {
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
  name: string
  headline: string
  location: string
  website: string
  email: string
  profiles: { label: string; url: string; color: string }[]
  education: { degree: string; date: string; institution: string; highlight: boolean }[]
  experience: { title: string; dates: string; featured: boolean; summary: string; bullets: string[] }[]
  languages: { name: string; level: string; note: string }[]
  scholarUrl: string
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

export function validateProjects(d: ProjectsContent): string[] {
  const problems: string[] = []
  if (!isList(d.categories)) problems.push('categories must be a list')
  if (!isList(d.projects)) return [...problems, 'projects must be a list']
  const ids = new Set<string>()
  d.projects.forEach((p, i) => {
    const where = `Project ${i + 1} (${p.title || 'untitled'})`
    if (!p.title) problems.push(`${where}: add a title`)
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) problems.push(`${where}: the id must be lowercase letters, numbers and dashes`)
    else if (ids.has(p.id)) problems.push(`${where}: the id "${p.id}" is used by another project`)
    ids.add(p.id)
    if (!d.categories.includes(p.category)) problems.push(`${where}: category "${p.category}" is not in the category list`)
    if (!['emerald', 'blue', 'amber'].includes(p.statusColor)) problems.push(`${where}: status colour must be emerald, blue or amber`)
    if (!isList(p.highlights) || !isList(p.tags)) problems.push(`${where}: highlights and tags must be lists`)
  })
  return problems
}

export function validateHome(d: HomeContent): string[] {
  const problems: string[] = []
  if (!d.name) problems.push('Add a name')
  if (!isList(d.buttons)) problems.push('buttons must be a list')
  if (!d.numbers || !isList(d.numbers.items) || !isList(d.numbers.specs) || !isList(d.numbers.evidence)) problems.push('the numbers section is incomplete')
  if (!d.principles || !isList(d.principles.items)) problems.push('the principles section is incomplete')
  if (!d.contact) problems.push('the contact section is missing')
  return problems
}

export function validateCv(d: CvContent): string[] {
  const problems: string[] = []
  if (!d.name) problems.push('Add a name')
  for (const key of ['profiles', 'education', 'experience', 'languages', 'publicationGroups', 'datasets'] as const) {
    if (!isList(d[key])) problems.push(`${key} must be a list`)
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
  ]
  if (problems.length) throw new Error(`Site content has problems:\n- ${problems.join('\n- ')}`)
}
