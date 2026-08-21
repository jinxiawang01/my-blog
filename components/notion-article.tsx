'use client'

import { NotionRenderer } from 'react-notion-x'
import type { ExtendedRecordMap } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

export function NotionArticle({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <div className="notion-article">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode
        disableHeader
        previewImages
        showCollectionViewDropdown={false}
        mapImageUrl={defaultMapImageUrl}
      />
    </div>
  )
}
