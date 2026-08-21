import Link from 'next/link'
import { sortByNewest } from '@/lib/content'
import { getPortfolioItems } from '@/lib/notion'

export const revalidate = 300

export default async function ArchivePage() {
  const items = sortByNewest(await getPortfolioItems()).filter((item) => item.type !== 'portfolio')
  const groups = items.reduce<Array<{ year: string; items: typeof items }>>((result, item) => {
    const year = new Date(item.date).getFullYear().toString()
    const group = result.find((entry) => entry.year === year)
    if (group) group.items.push(item)
    else result.push({ year, items: [item] })
    return result
  }, [])

  return (
    <main className="archive-page container">
      <div className="archive-heading">
        <h1>Archive</h1>
        <span>{items.length.toString().padStart(2, '0')} posts</span>
      </div>
      <div className="archive-list">
        {groups.map((group) => (
          <section className="archive-year" key={group.year}>
            <h2>{group.year}</h2>
            <div className="archive-year-list">
              {group.items.map((item) => (
                <Link className="archive-row" href={`/work/${item.slug}`} key={item.id}>
                  <span className="archive-title">{item.title}</span>
                  <time className="archive-date" dateTime={item.date}>
                    {new Intl.DateTimeFormat('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      timeZone: 'UTC'
                    }).format(new Date(item.date))}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
