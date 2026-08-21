export type PortfolioMedia = {
  src: string
  alt: string
  caption?: string
  type?: 'image' | 'gif'
}

export type PortfolioSection = {
  eyebrow?: string
  title: string
  body: string[]
  media?: PortfolioMedia[]
}

export type PortfolioProject = {
  id: string
  title: string
  slug: string
  discipline: string
  summary: string
  image: string
  href: string
  year: string
  date: string
  role: string
  tools: string[]
  sections: PortfolioSection[]
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: '01',
    title: 'Globetrotter',
    slug: 'globetrotter',
    discipline: 'Travel Planning',
    summary: 'A route planner for spontaneous travelers.',
    image: '/portfolio/globetrotter/cover.png',
    href: '/portfolio/globetrotter',
    year: '2024',
    date: 'December 30, 2024',
    role: 'Product concept, UX flow, interaction prototype',
    tools: ['Figma'],
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Travel more cities with the same transportation budget.',
        body: [
          'Globetrotter helps flexible travelers find low-cost routes from a starting point to a destination. Instead of only optimizing for the shortest path, it explores multi-city and multi-country stopovers that keep transportation costs under control while creating more travel experiences.',
          'The idea came from planning a holiday route where a direct trip was more expensive than a multi-stop journey. The better route took days of manual research across maps, booking apps, airline sites, and rail platforms. Globetrotter turns that research loop into a guided planning tool.'
        ]
      },
      {
        eyebrow: 'Audience',
        title: 'Built for spontaneous planners who still care about cost.',
        body: [
          'The primary user is a flexible traveler who enjoys open-ended itineraries but does not want transportation costs to consume the entire budget. The product helps them compare route options, control constraints, and make decisions faster.'
        ],
        media: [
          { src: '/portfolio/globetrotter/persona.png', alt: 'Globetrotter persona', caption: 'Persona' },
          { src: '/portfolio/globetrotter/wireframe.png', alt: 'Globetrotter wireframe', caption: 'Core route planning wireframe' }
        ]
      },
      {
        eyebrow: 'System',
        title: 'From constraints to route options.',
        body: [
          'Before generating a plan, users define departure city, destination, travel dates, transportation preferences, budget range, cross-city or cross-country preference, and maximum duration for each leg. The system then returns route cards ranked by cost and experience value.',
          'Each route can be expanded into detailed transfer legs, transportation methods, and estimated prices.'
        ],
        media: [
          { src: '/portfolio/globetrotter/setup.gif', alt: 'Set travel conditions', caption: 'Setting route conditions', type: 'gif' },
          { src: '/portfolio/globetrotter/routes.gif', alt: 'Route options', caption: 'Generated route options', type: 'gif' },
          { src: '/portfolio/globetrotter/detail.gif', alt: 'Route detail', caption: 'Transfer detail view', type: 'gif' },
          { src: '/portfolio/globetrotter/profile.gif', alt: 'Profile and wishlist', caption: 'Orders and wishlist', type: 'gif' }
        ]
      },
      {
        eyebrow: 'Next',
        title: 'Future directions',
        body: [
          'Potential extensions include route reviews, machine-learning recommendations based on travel preferences, broader transportation partnerships, social sharing, and a dynamic cost model that accounts for seasonality and time differences.'
        ]
      }
    ]
  },
  {
    id: '02',
    title: 'Present is Present',
    slug: 'present-is-present',
    discipline: 'Gift Commerce',
    summary: 'A scheduled gifting shopping app.',
    image: '/portfolio/present-is-present/cover.png',
    href: '/portfolio/present-is-present',
    year: '2023',
    date: 'March 15, 2023',
    role: 'Product concept, shopping flow, prototype',
    tools: ['Figma'],
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Turn the moment of intention into a future delivery.',
        body: [
          'Present is Present is a scheduled gifting app. Users can choose a product, select a future delivery date at checkout, and make sure the recipient receives it at the right moment.',
          'The concept came from finding a perfect birthday gift months before the actual date. The desire to give was already present, but existing shopping flows forced the user to wait, calculate timing, and risk the item going out of stock.'
        ]
      },
      {
        eyebrow: 'Core Flow',
        title: 'Plan gifts ahead without losing the emotion of now.',
        body: [
          'The product centers on scheduled delivery, smart gift recommendations, personalized greeting cards, and gift management. It supports both emotional expression and logistical reliability.'
        ],
        media: [
          { src: '/portfolio/present-is-present/persona.png', alt: 'Present is Present persona', caption: 'Persona' },
          { src: '/portfolio/present-is-present/wireframe.png', alt: 'Shopping flow wireframe', caption: 'Shopping and checkout wireframe' }
        ]
      },
      {
        eyebrow: 'Prototype',
        title: 'A complete shopping path from browsing to delivery tracking.',
        body: [
          'The prototype covers browsing recommended gifts, viewing product details, adding items to cart, selecting a delivery date before purchase, and checking order delivery details after payment.'
        ],
        media: [
          { src: '/portfolio/present-is-present/browse.gif', alt: 'Gift browsing', caption: 'Browse recommendations and categories', type: 'gif' },
          { src: '/portfolio/present-is-present/product.gif', alt: 'Product detail', caption: 'Product detail and purchase entry', type: 'gif' },
          { src: '/portfolio/present-is-present/checkout.gif', alt: 'Scheduled checkout', caption: 'Choose delivery date before checkout', type: 'gif' },
          { src: '/portfolio/present-is-present/order.gif', alt: 'Order tracking', caption: 'Delivery detail after purchase', type: 'gif' }
        ]
      },
      {
        eyebrow: 'Next',
        title: 'Future directions',
        body: [
          'Future versions could coordinate with delivery providers for stronger scheduling reliability and support deposit-based reservations to balance buyer and seller risk.'
        ]
      }
    ]
  },
  {
    id: '03',
    title: 'dOiT',
    slug: 'doit',
    discipline: 'Decision Tool',
    summary: 'A visual helper for acting now.',
    image: '/portfolio/doit/cover.jpg',
    href: '/portfolio/doit',
    year: '2024',
    date: 'January 23, 2024',
    role: 'Product concept, interaction model, prototype',
    tools: ['Figma'],
    sections: [
      {
        eyebrow: 'Overview',
        title: 'Help procrastinators decide what to do first.',
        body: [
          'dOiT is a lightweight decision tool for people who struggle with procrastination, task overload, and decision fatigue. It visualizes tasks as bubbles and helps users identify what deserves action now.',
          'The concept came from manually sorting a messy annual plan. Some goals were short-term tasks, some were long-term ambitions, and many depended on each other. dOiT turns that sorting process into an interactive system.'
        ]
      },
      {
        eyebrow: 'Interaction Model',
        title: 'Merge related tasks until the priority becomes visible.',
        body: [
          'Users input current goals and plans as task bubbles. When they trigger synthesis, similar or dependent bubbles merge. The most frequently mapped task grows larger and becomes the clearest recommendation for what to do next.',
          'This interaction borrows from Venn diagrams and merging games: overlap, dependency, and similarity become visual signals for priority.'
        ],
        media: [
          { src: '/portfolio/doit/persona.png', alt: 'dOiT persona', caption: 'Persona' },
          { src: '/portfolio/doit/wireframe.png', alt: 'dOiT wireframe', caption: 'End-to-end wireframe' }
        ]
      },
      {
        eyebrow: 'Prototype',
        title: 'From task input to completion feedback.',
        body: [
          'The prototype explores task creation, automatic synthesis, bubble prioritization, long-press completion, edit and delete actions, profile progress, and notification history.'
        ],
        media: [
          { src: '/portfolio/doit/input.gif', alt: 'Task input', caption: 'Input tasks as bubbles', type: 'gif' },
          { src: '/portfolio/doit/merge.gif', alt: 'Task synthesis', caption: 'Merge and identify the priority task', type: 'gif' },
          { src: '/portfolio/doit/complete.gif', alt: 'Task completion', caption: 'Complete and remove a task', type: 'gif' },
          { src: '/portfolio/doit/edit.gif', alt: 'Task editing', caption: 'Edit or delete a task bubble', type: 'gif' },
          { src: '/portfolio/doit/profile.gif', alt: 'Progress profile', caption: 'Progress and notification history', type: 'gif' }
        ]
      }
    ]
  }
]

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug)
}
