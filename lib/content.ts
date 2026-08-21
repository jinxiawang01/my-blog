export type ContentType = 'portfolio' | 'thoughts' | 'travelogue' | 'progress'

export type PortfolioItem = {
  id: string
  title: string
  slug: string
  type: ContentType
  category: string
  summary: string
  date: string
  tags: string[]
  cover: string
  password?: string
  href?: string
  featured?: boolean
}

export const fallbackItems: PortfolioItem[] = [
  {
    id: 'sample-project-1',
    title: 'Personal AI Workflow Lab',
    slug: 'personal-ai-workflow-lab',
    type: 'portfolio',
    category: 'Portfolio',
    summary: 'A compact system for collecting prompts, experiments, and reusable automations across daily creative work.',
    date: '2026-08-01',
    tags: ['AI', 'System Design', 'Product'],
    cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'sample-writing-1',
    title: 'Why Personal Software Should Feel Quiet',
    slug: 'quiet-personal-software',
    type: 'thoughts',
    category: 'Thoughts',
    summary: 'Notes on building tools that stay out of the way while still making complex work feel composed.',
    date: '2026-07-18',
    tags: ['Writing', 'Design'],
    cover: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'sample-idea-1',
    title: 'Archive First Portfolio',
    slug: 'archive-first-portfolio',
    type: 'progress',
    category: 'Progress',
    summary: 'A portfolio model where raw notes, half-formed ideas, finished work, and essays can coexist without feeling messy.',
    date: '2026-06-22',
    tags: ['Portfolio', 'Knowledge Base'],
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'sample-travelogue-1',
    title: 'Tokyo Notes in Transit',
    slug: 'tokyo-notes-in-transit',
    type: 'travelogue',
    category: 'Travelogues',
    summary: 'A quiet visual log of bookstores, train platforms, small meals, and the texture of moving through a city.',
    date: '2026-05-12',
    tags: ['Travel', 'Field Notes'],
    cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'sample-progress-2',
    title: 'Portfolio CMS Refactor',
    slug: 'portfolio-cms-refactor',
    type: 'progress',
    category: 'Progress',
    summary: 'Moving from a forked blog theme into a fully owned Notion-powered portfolio system.',
    date: '2026-08-19',
    tags: ['Progress', 'Next.js'],
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    featured: true
  }
]

export function formatType(type: ContentType) {
  return {
    portfolio: 'Portfolio',
    thoughts: 'Thoughts',
    travelogue: 'Travelogue',
    progress: 'Progress'
  }[type]
}

export function sortByNewest(items: PortfolioItem[]) {
  return [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date))
}
