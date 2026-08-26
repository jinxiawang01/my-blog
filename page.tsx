import { notFound } from 'next/navigation'
import { NotionArticle } from '@/components/notion-article'
import { PasswordGate } from '@/components/password-gate'
import { RichText } from '@/components/rich-text'
import { formatType } from '@/lib/content'
import { getArticleBlocks, getPortfolioItemBySlug, getPublicRecordMapBySlug } from '@/lib/notion'

export const revalidate = 300

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = await getPortfolioItemBySlug(params.slug)
  return {
    title: item ? `${item.title} | Jinxia Wang` : 'Work | Jinxia Wang',
    description: item?.summary
  }
}

function getHeadingText(block: any) {
  if (Array.isArray(block?.richText)) {
    return block.richText.map((span: any) => span.plainText).join('').trim()
  }
  if (Array.isArray(block?.properties?.title)) {
    return block.properties.title.map((span: any) => span?.[0] || '').join('').trim()
  }
  return ''
}

function getRecordMapToc(recordMap: any) {
  if (!recordMap?.block) return []
  return Object.values(recordMap.block)
    .map((entry: any) => entry?.value?.value ?? entry?.value)
    .filter((block: any) => ['header', 'sub_header', 'sub_sub_header'].includes(block?.type))
    .map((block: any) => ({
      id: block.id,
      title: getHeadingText(block)
    }))
    .filter((item) => item.id && item.title)
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const item = await getPortfolioItemBySlug(params.slug)
  if (!item) notFound()

  const recordMap = await getPublicRecordMapBySlug(item.slug)
  const blocks = await getArticleBlocks(item.id)
  const blockTocItems = blocks
    .filter((block) => ['heading_1', 'heading_2', 'heading_3'].includes(block.type))
    .map((block) => ({ id: block.id, title: getHeadingText(block) }))
    .filter((item) => item.title)
  const tocItems = recordMap ? getRecordMapToc(recordMap) : blockTocItems

  return (
    <main className="container article article-detail">
      <section className="article-hero" style={{ backgroundImage: `url(${item.cover})` }}>
        <div className="article-hero-copy">
          <p className="eyebrow">{formatType(item.type)} / {new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }).format(new Date(item.date))}</p>
          <h1>{item.title}</h1>
          <div className="tags">
            {item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <p className="article-summary">{item.summary}</p>
        </div>
      </section>
      <PasswordGate expected={item.password || ''}>
        <div className="article-layout">
          {tocItems.length ? (
            <nav className="article-toc" aria-label="Article contents">
              {tocItems.map((block, index) => (
                <a key={block.id} href={`#${block.id}`}>{block.title || `Section ${index + 1}`}</a>
              ))}
            </nav>
          ) : <div />}
          <div className="article-body">
            <article className="prose">
              {recordMap ? (
                <NotionArticle recordMap={recordMap} />
              ) : blocks.length === 0 ? (
                <p>连接 Notion 后，这里会渲染页面正文。当前显示的是本地示例内容。</p>
              ) : blocks.map((block) => {
                if (block.type === 'paragraph') return <p key={block.id}><RichText spans={block.richText} /></p>
                if (block.type === 'heading_1') return <h2 key={block.id} id={block.id}><RichText spans={block.richText} /></h2>
                if (block.type === 'heading_2') return <h2 key={block.id} id={block.id}><RichText spans={block.richText} /></h2>
                if (block.type === 'heading_3') return <h3 key={block.id} id={block.id}><RichText spans={block.richText} /></h3>
                if (block.type === 'bulleted_list_item') return <ul key={block.id}><li><RichText spans={block.richText} /></li></ul>
                if (block.type === 'numbered_list_item') return <ol key={block.id}><li><RichText spans={block.richText} /></li></ol>
                if (block.type === 'quote' || block.type === 'callout') return <blockquote key={block.id}><RichText spans={block.richText} /></blockquote>
                if (block.type === 'code') return <pre key={block.id}><code>{block.text}</code></pre>
                if (block.type === 'image') return <img key={block.id} src={block.url} alt="" />
                if (block.type === 'divider') return <hr key={block.id} />
                return null
              })}
            </article>
          </div>
        </div>
      </PasswordGate>
    </main>
  )
}
