import caseStudies from '../../content/site/case-studies.json'
import { parsePublicUrl } from './public-url'

export type CaseStudy = (typeof caseStudies.studies)[number]
export type CaseStudyContact = typeof caseStudies.contact
export const CASE_STUDY_CONTENT = caseStudies
export const CASE_STUDIES = CASE_STUDY_CONTENT.studies
export const caseStudyPath = (slug: string) => `/case-studies/${encodeURIComponent(slug)}/`

export function caseStudyFor(projectId: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.projectId === projectId)
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function text(value: unknown): value is string {
  return typeof value === 'string' && !!value.trim()
}

export function validateCaseStudies(data: unknown): string[] {
  if (!record(data) || !Array.isArray(data.studies) || !data.studies.length) return ['Add at least one case study.']

  const problems: string[] = []
  const contact = data.contact
  if (!record(contact) || !['heading', 'contactLabel', 'cvLabel'].every((key) => text(contact[key])) ||
      !parsePublicUrl(contact.contactUrl) || !parsePublicUrl(contact.cvUrl)) {
    problems.push('Enter a heading and valid addresses and labels for the contact and CV links.')
  }
  const slugs = new Set<string>()
  const projects = new Set<string>()
  data.studies.forEach((study, index) => {
    const label = `Case study ${index + 1}`
    if (!record(study)) {
      problems.push(`${label} must be an object.`)
      return
    }
    if (!text(study.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(study.slug) || slugs.has(study.slug)) {
      problems.push(`${label} needs a unique URL name with lowercase letters, numbers, and dashes.`)
    } else slugs.add(study.slug)
    if (!text(study.projectId) || projects.has(study.projectId)) {
      problems.push(`${label} needs a unique project ID.`)
    } else projects.add(study.projectId)
    if (!['title', 'headline', 'summary', 'role'].every((key) => text(study[key]))) {
      problems.push(`${label} needs a title, headline, summary, and role.`)
    }
    if (!Array.isArray(study.metrics) || !study.metrics.every((metric) => record(metric) && text(metric.value) && text(metric.label))) {
      problems.push(`${label} has a metric without a value or label.`)
    }
    if (!Array.isArray(study.sections) || !study.sections.every((section) => record(section) && text(section.heading) && text(section.body))) {
      problems.push(`${label} has a section without a heading or body.`)
    }
    if (!Array.isArray(study.links) || !study.links.every((link) => {
      if (!record(link) || !text(link.label)) return false
      const url = parsePublicUrl(link.url)
      return url?.kind === 'local' || url?.kind === 'external'
    })) {
      problems.push(`${label} links need labels and local or HTTPS addresses.`)
    }
  })
  return problems
}
