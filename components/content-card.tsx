import { ArrowUpRight } from 'lucide-react'
import { formatType, type PortfolioItem } from '@/lib/content'

export function ContentCard({ item }: { item: PortfolioItem }) {
  const href = item.href || `/work/${item.slug}`
  const external = Boolean(item.href)

  const content = (
    <>
      <img className="cover" src={item.cover} alt="" />
      <div className="card-body">
        <div className="meta">
          <span>{formatType(item.type)}</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="tags">
          {item.tags.slice(0, 4).map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  )

  return external ? (
    <a className="card" href={href} target="_blank" rel="noreferrer">{content}</a>
  ) : (
    <a className="card" href={href}>{content}</a>
  )
}
