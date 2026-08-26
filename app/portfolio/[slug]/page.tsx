import { notFound } from 'next/navigation'
import { getPortfolioProject, portfolioProjects } from '@/lib/portfolio'
import { PortfolioMediaViewer } from '@/components/portfolio-media-viewer'

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getPortfolioProject(params.slug)
  return {
    title: project ? `${project.title} | Jinxia Wang` : 'Portfolio | Jinxia Wang',
    description: project?.summary
  }
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = getPortfolioProject(params.slug)
  if (!project) notFound()

  return (
    <main className={`portfolio-detail project-${project.slug}`}>
      <section className="portfolio-detail-hero">
        <h1>{project.title}</h1>
        <p className="portfolio-detail-date">{project.date}</p>
      </section>

      <div className="portfolio-detail-sections">
        {project.sections.map((section) => (
          <section
            className={`portfolio-case-section ${section.media?.length ? 'has-media' : 'is-text-only'} ${section.media?.length === 1 ? 'has-single-media' : ''}`}
            key={`${project.slug}-${section.title}`}
          >
            <div className="portfolio-case-copy">
              {section.eyebrow ? <p className="portfolio-case-eyebrow">{section.eyebrow}</p> : null}
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.media?.length ? (
              <div className="portfolio-case-media-grid">
                {section.media.map((media) => (
                  <figure className={media.type === 'gif' ? 'is-phone-media' : ''} key={media.src}>
                    <PortfolioMediaViewer media={media} />
                    {media.caption ? <figcaption>{media.caption}</figcaption> : null}
                  </figure>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  )
}
