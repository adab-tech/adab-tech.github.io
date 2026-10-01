// Schema.org structured data (JSON-LD) for search engines. Facts come from
// content/site/*.json so the markup cannot drift from what the pages show.
import cv from '../../content/site/cv.json'
import projects from '../../content/site/projects.json'

export const SITE = 'https://adamu.tech'
export const PERSON_ID = `${SITE}/#person`
const WEBSITE_ID = `${SITE}/#website`

type Node = Record<string, unknown>

const UA = { '@type': 'CollegeOrUniversity', name: 'The University of Alabama', url: 'https://www.ua.edu' }

export function personNode(): Node {
  const orcid = cv.profiles.find((p) => /orcid\.org/.test(p.url))?.url
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: cv.name,
    alternateName: 'Adamu Abubakar',
    givenName: 'Adamu',
    additionalName: 'Danjuma',
    familyName: 'Abubakar',
    url: SITE,
    email: `mailto:${cv.email}`,
    image: `${SITE}/icon-512.png`,
    jobTitle: 'Teaching Fellow',
    worksFor: UA,
    alumniOf: [UA, { '@type': 'CollegeOrUniversity', name: 'University of Ilorin', url: 'https://www.unilorin.edu.ng' }],
    knowsAbout: ['Computational linguistics', 'Speech synthesis', 'Text-to-speech', 'Hausa language', 'Natural language processing', 'Low-resource languages', 'Digital humanities', 'Francophone African literature'],
    knowsLanguage: cv.languages.map((l) => l.name),
    identifier: orcid ? { '@type': 'PropertyValue', propertyID: 'ORCID', value: orcid.replace(/^https?:\/\/orcid\.org\//, '') } : undefined,
    sameAs: [
      'https://github.com/adab-tech',
      'https://www.linkedin.com/in/adamudanjuma/',
      'https://huggingface.co/adab-tech',
      cv.scholarUrl,
      orcid,
    ].filter(Boolean),
  }
}

export function websiteNode(): Node {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE, name: 'adamu.tech', inLanguage: 'en', publisher: { '@id': PERSON_ID } }
}

export const authorRef = { '@id': PERSON_ID }

export function breadcrumbs(items: [string, string][]): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}${path}` })),
  }
}

// The flagship software and datasets from projects.json.
export function projectNodes(): Node[] {
  const byId = Object.fromEntries(projects.projects.map((p) => [p.id, p]))
  const out: Node[] = []
  const murya = byId['murya-os']
  if (murya) out.push({
    '@type': 'SoftwareApplication',
    name: murya.title,
    description: murya.description,
    url: murya.liveUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web browser',
    inLanguage: 'ha',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: authorRef,
    sameAs: murya.modelUrl || undefined,
  })
  const mapping = byId['mapping-voices']
  if (mapping) {
    const doi = (mapping.highlights.join(' ').match(/10\.5281\/zenodo\.\d+/) || [])[0]
    out.push({
      '@type': 'Dataset',
      name: mapping.title,
      description: mapping.description,
      url: mapping.liveUrl,
      identifier: doi ? `https://doi.org/${doi}` : undefined,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: authorRef,
      isAccessibleForFree: true,
    })
  }
  const lexicon = byId['hausa-30k-lexicon']
  if (lexicon) out.push({
    '@type': 'Dataset',
    name: 'Robinson Hausa–English Lexicon (1914)',
    description: lexicon.description,
    url: lexicon.modelUrl,
    inLanguage: ['ha', 'en'],
    creator: authorRef,
    isAccessibleForFree: true,
  })
  return out
}

export function JsonLd({ graph }: { graph: Node[] }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  // Escape "<" so post text can never close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, '\\u003c') }} />
}
