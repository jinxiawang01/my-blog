import { HomeContentSwitcher } from '@/components/home-content-switcher'
import { sortByNewest } from '@/lib/content'
import { getPortfolioItems } from '@/lib/notion'
import { portfolioProjects } from '@/lib/portfolio'

export const revalidate = 300

export default async function HomePage() {
  const items = sortByNewest(await getPortfolioItems()).filter((item) => item.type !== 'portfolio')

  return (
    <main className="home-page fade-bottom-page">
      <section className="optique-hero">
        <div className="hero-statement">
          <h1>
            <span>I record to savor life a second time.</span>
            <br />
            Creating <em>living systems</em> for ideas, work, travel, and thoughts that keep moving.
          </h1>
        </div>
        <div className="hero-title">JINXIA</div>
        <HomeContentSwitcher mode="hero" items={items} projects={portfolioProjects} />
      </section>

      <HomeContentSwitcher items={items} projects={portfolioProjects} />
    </main>
  )
}
