import { ArrowUpRight } from 'lucide-react'
import type { PortfolioProject } from '@/lib/portfolio'

export function PortfolioGrid({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="portfolio-grid">
      {projects.map((project) => (
        <a className="portfolio-card" href={project.href} key={project.id}>
          <img src={project.image} alt="" />
          <div className="portfolio-card-overlay">
            <span>{project.id}</span>
            <ArrowUpRight size={22} aria-hidden="true" />
          </div>
          <div className="portfolio-card-copy">
            <div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
            <span>{project.discipline} / {project.year}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
