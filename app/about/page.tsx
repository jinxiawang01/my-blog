import { AboutMarkdownContent } from '@/lib/about'

export const metadata = {
  title: 'About me | Jinxia Wang',
  description: 'About Jinxia Wang.'
}

export default function AboutPage() {
  return (
    <main className="about-page container">
      <div className="about-heading">
        <h1>About me</h1>
      </div>
      <article className="about-content">
        <AboutMarkdownContent />
      </article>
    </main>
  )
}
