'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import type { PortfolioMedia } from '@/lib/portfolio'

export function PortfolioMediaViewer({ media }: { media: PortfolioMedia }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="portfolio-media-button"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View ${media.alt}`}
      >
        <img src={media.src} alt={media.alt} />
      </button>
      {open ? (
        <div className="portfolio-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button
            className="portfolio-lightbox-close"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close image view"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <img src={media.src} alt={media.alt} onClick={(event) => event.stopPropagation()} />
          {media.caption ? <p>{media.caption}</p> : null}
        </div>
      ) : null}
    </>
  )
}
