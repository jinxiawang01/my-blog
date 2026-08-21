import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import 'react-notion-x/src/styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jinxia Wang Portfolio',
  description: 'Ideas, projects, and writing from Jinxia Wang.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="shell">
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="container footer-inner">
              <span>© {new Date().getFullYear()} Jinxia Wang</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
