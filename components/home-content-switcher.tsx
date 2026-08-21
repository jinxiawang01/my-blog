'use client'

import { PortfolioGrid } from '@/components/portfolio-grid'
import { type ContentType, type PortfolioItem } from '@/lib/content'
import type { PortfolioProject } from '@/lib/portfolio'

type HomeTab = ContentType | 'latest'

const tabOrder: ContentType[] = ['progress', 'portfolio', 'travelogue', 'thoughts']

function getTabs(items: PortfolioItem[]) {
  return tabOrder
    .map((type) => {
      const item = items.find((entry) => entry.type === type)
      if (item) return { id: type, label: item.category }
      if (type === 'portfolio') return { id: type, label: 'Portfolio' }
      return null
    })
    .filter(Boolean) as Array<{ id: ContentType; label: string }>
}

export function HomeContentSwitcher({
  items,
  projects,
  mode = 'content',
  initialTab = 'latest'
}: {
  items: PortfolioItem[]
  projects: PortfolioProject[]
  mode?: 'hero' | 'content'
  initialTab?: HomeTab
}) {
  const active = initialTab
  const tabs = getTabs(items)

  if (mode === 'hero') {
    return (
      <div className="hero-tabs" aria-label="Homepage sections">
        {tabs.map((tab) => (
          <a key={tab.id} href={tab.id === 'travelogue' ? '/travelogues' : `/${tab.id}`}>
            {tab.label}
          </a>
        ))}
      </div>
    )
  }

  const currentTab = tabs.find((tab) => tab.id === active)
  const visibleItems = active === 'portfolio' ? [] : items.filter((item) => item.type === active)
  const shownItems = active === 'latest' ? items.slice(0, 12) : visibleItems

  return (
    <section className={`container content-switcher ${active === 'latest' ? 'is-latest' : 'is-filtered'}`} id="content">
      <div className="switcher-heading">
        <h2>{active === 'latest' ? 'Latest Updates' : currentTab?.label}</h2>
        <span>{active === 'portfolio' ? `${projects.length.toString().padStart(2, '0')} works` : `${shownItems.length.toString().padStart(2, '0')} articles`}</span>
      </div>
      {active === 'portfolio' ? (
        <PortfolioGrid projects={projects} />
      ) : active === 'latest' ? (
        <div className="piano-grid">
          {shownItems.length ? shownItems.map((item, index) => (
            <a className={`piano-card piano-card-${index % 4}`} href={item.href || `/work/${item.slug}`} key={item.id}>
              <img src={item.cover} alt="" />
              <div className="piano-card-copy">
                <span className="piano-type">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            </a>
          )) : (
            <div className="empty-state">Nothing published yet. Add a Notion page with Status = Published.</div>
          )}
        </div>
      ) : (
        <div className="article-stream">
          {shownItems.length ? shownItems.map((item, index) => (
            <a className="stream-row" href={item.href || `/work/${item.slug}`} key={item.id}>
              <div className="stream-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="stream-copy">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
              <img src={item.cover} alt="" />
            </a>
          )) : (
            <div className="empty-state">Nothing published here yet. Add a Notion page with Status = Published.</div>
          )}
        </div>
      )}
    </section>
  )
}
