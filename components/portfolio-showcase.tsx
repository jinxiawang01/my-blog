'use client'

import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { PortfolioProject } from '@/lib/portfolio'

export function PortfolioShowcase({ projects }: { projects: PortfolioProject[] }) {
  const [activeIndex, setActiveIndex] = useState(Math.max(0, Math.floor(projects.length / 2)))

  const orderedProjects = useMemo(() => {
    if (!projects.length) return []
    return projects.map((project, index) => ({
      project,
      index,
      offset: index - activeIndex
    }))
  }, [activeIndex, projects])

  return (
    <section className="portfolio-page">
      <div className="portfolio-stage">
        <div className="portfolio-intro">
          <h1>Portfolio</h1>
        </div>
        <div className="portfolio-carousel" aria-label="Portfolio showcase">
          {orderedProjects.map(({ project, index, offset }) => {
            const active = offset === 0
            const distance = Math.abs(offset)
            return (
              <button
                key={project.id}
                className={`portfolio-showcase-card ${active ? 'is-active' : ''}`}
                type="button"
                onClick={() => {
                  if (active) {
                    window.location.href = project.href
                    return
                  }
                  setActiveIndex(index)
                }}
                style={{
                  ['--card-offset' as never]: offset,
                  transform: active
                    ? 'translateX(-50%) translateY(0)'
                    : `translateX(calc(-50% + (var(--card-offset) * var(--portfolio-step)))) translateY(var(--portfolio-copy-space))`,
                  opacity: `${Math.max(0.35, 1 - distance * 0.16)}`,
                  zIndex: String(100 - distance)
                }}
                aria-pressed={active}
              >
                <div className="portfolio-showcase-media">
                  <img src={project.image} alt="" />
                </div>
                <div className="portfolio-showcase-copy">
                  <div>
                    <h2>{project.title}</h2>
                    <p>{project.summary}</p>
                  </div>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
