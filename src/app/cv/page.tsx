'use client'

import Link from 'next/link'
import { GlobalShell } from '@/components/GlobalShell'
import { InlineText } from '@/components/InlineText'
import { parsePublicUrl } from '@/lib/public-url'
import { CV } from '@/lib/site-content'
import './cv.css'
import './print.css'

const headings = CV.sectionHeadings
const downloadPath = '/downloads/Adamu-Danjuma-Abubakar-CV'

function CvLink({ url, label }: { url?: string; label: string }) {
  const destination = parsePublicUrl(url)
  if (!destination) return <>{label}</>
  if (destination.kind === 'local' && destination.href.startsWith('/')) {
    return <Link href={destination.href}>{label}</Link>
  }
  return <a href={destination.href}>{label}</a>
}

export default function AcademicCVPage() {
  return (
    <GlobalShell>
      <div className="cv-page">
        <nav className="cv-actions" aria-label="CV downloads and print">
          <a href={downloadPath + '.pdf'} download>Download PDF</a>
          <a href={downloadPath + '.docx'} download>Download Word (.docx)</a>
          <button type="button" onClick={() => window.print()}>Print CV</button>
        </nav>

        <article className="cv-document" aria-labelledby="cv-name">
          <header>
            <h1 id="cv-name">{CV.name}</h1>
            <p className="cv-headline">{CV.headline}</p>
            {CV.location && <p className="cv-location">{CV.location}</p>}
            <ul className="cv-links" aria-label="Contact and profiles">
              {CV.email && <li><CvLink url={`mailto:${CV.email}`} label={CV.email} /></li>}
              {CV.website && <li><CvLink url={CV.websiteUrl} label={CV.website} /></li>}
              {CV.profiles.map((profile) => (
                <li key={profile.url} data-color={profile.color}><CvLink url={profile.url} label={profile.label} /></li>
              ))}
            </ul>
            {CV.summary && <p className="cv-summary"><InlineText text={CV.summary} /></p>}
          </header>

          {CV.education.length > 0 && (
            <section>
              <h2>{headings?.education?.trim() || 'Education'}</h2>
              {CV.education.map((education) => (
                <div className="cv-entry" key={education.degree}>
                  <div className="cv-entry-line">
                    <h3>{education.degree}</h3>
                    <span className={education.highlight ? 'cv-date cv-emphasis' : 'cv-date'}>{education.date}</span>
                  </div>
                  <p className="cv-detail">{education.institution}</p>
                </div>
              ))}
            </section>
          )}

          {CV.datasets.length > 0 && (
            <section>
              <h2>{headings?.datasets?.trim() || 'Research datasets and digital projects'}</h2>
              {CV.datasets.map((dataset) => (
                <div className="cv-entry" key={dataset.title}>
                  <div className="cv-entry-line">
                    <h3>{dataset.title}</h3>
                    <span className="cv-date">{dataset.year}</span>
                  </div>
                  {dataset.meta && <p className="cv-detail"><InlineText text={dataset.meta} /></p>}
                  {dataset.description && <p><InlineText text={dataset.description} /></p>}
                  {dataset.links.length > 0 && (
                    <ul className="cv-links" aria-label={`Resources for ${dataset.title}`}>
                      {dataset.links.map((resource) => (
                        <li key={resource.url}><CvLink url={resource.url} label={resource.label} /></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {CV.experience.length > 0 && (
            <section>
              <h2>{headings?.experience?.trim() || 'Experience'}</h2>
              {CV.experience.map((role) => (
                <div className="cv-entry" key={role.title}>
                  <div className="cv-entry-line">
                    <h3 className={role.featured ? 'cv-emphasis' : undefined}>{role.title}</h3>
                    <span className="cv-date">{role.dates}</span>
                  </div>
                  {role.summary && <p><InlineText text={role.summary} /></p>}
                  {role.bullets.length > 0 && (
                    <ul className="cv-bullets">
                      {role.bullets.map((bullet, index) => <li key={index}><InlineText text={bullet} /></li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {CV.publicationGroups.length > 0 && (
            <section>
              <h2>{headings?.publications?.trim() || 'Publications'}</h2>
              {CV.publicationGroups.map((group) => (
                <div className="cv-publications" key={group.heading}>
                  <h3>{group.heading}</h3>
                  {group.items.map((item) => (
                    <p className="cv-citation" key={item.title}>
                      <CvLink url={item.href} label={item.title} />
                      {item.venue && <span className="cv-detail"> — {item.venue}</span>}
                    </p>
                  ))}
                </div>
              ))}
              {CV.scholarUrl && (
                <p><CvLink url={CV.scholarUrl} label={CV.scholarLabel?.trim() || 'Google Scholar Profile'} /></p>
              )}
            </section>
          )}

          {CV.languages.length > 0 && (
            <section>
              <h2>{headings?.languages?.trim() || 'Languages'}</h2>
              <ul className="cv-languages">
                {CV.languages.map((language) => (
                  <li key={language.name}>
                    <strong>{language.name}</strong> ({language.level}){language.note && <span className="cv-detail"> — {language.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </GlobalShell>
  )
}
