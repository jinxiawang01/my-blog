import { HomeContentSwitcher } from '@/components/home-content-switcher'
import { sortByNewest, type ContentType } from '@/lib/content'
import { getPortfolioItems } from '@/lib/notion'
import { portfolioProjects } from '@/lib/portfolio'

export async function ModulePage({ type, pageClassName }: { type: ContentType; pageClassName?: string }) {
  const items = sortByNewest(await getPortfolioItems()).filter((item) => item.type !== 'portfolio')

  return (
    <main className={`module-page ${pageClassName || ''}`}>
      <HomeContentSwitcher items={items} projects={portfolioProjects} initialTab={type} />
    </main>
  )
}
