import { PortfolioShowcase } from '@/components/portfolio-showcase'
import { portfolioProjects } from '@/lib/portfolio'

export default function PortfolioPage() {
  return <PortfolioShowcase projects={portfolioProjects} />
}
