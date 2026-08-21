import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import {
  defaultMapImageUrl,
  getBlockTitle,
  getPageProperty,
  parsePageId
} from 'notion-utils'
import type { ExtendedRecordMap } from 'notion-types'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints'
import { fallbackItems, type ContentType, type PortfolioItem } from './content'

const notionToken = process.env.NOTION_TOKEN
const databaseId = process.env.NOTION_DATABASE_ID
const publicPageId = parsePageId(process.env.NOTION_PAGE_ID)
const apiBaseUrl = process.env.API_BASE_URL || 'https://app.notion.com/api/v3'
const notionActiveUser = process.env.NOTION_ACTIVE_USER || undefined
const notionTokenV2 = process.env.NOTION_TOKEN_V2 || undefined

const officialNotion = notionToken ? new Client({ auth: notionToken }) : null
const publicNotion = new NotionAPI({
  apiBaseUrl,
  activeUser: notionActiveUser,
  authToken: notionTokenV2,
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

let cachedPublicArticleData: Promise<{
  recordMap: ExtendedRecordMap
  allPages: Array<{ page: any; recordMap: ExtendedRecordMap }>
  pages: Array<{ page: any; recordMap: ExtendedRecordMap }>
}> | null = null

type NotionPage = PageObjectResponse
type NotionBlock = BlockObjectResponse

export type RichTextSpan = {
  plainText: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    code: boolean
    strikethrough: boolean
    underline: boolean
  }
}

export type ArticleBlock =
  | { id: string; type: 'paragraph'; richText: RichTextSpan[] }
  | { id: string; type: 'heading_1' | 'heading_2' | 'heading_3'; richText: RichTextSpan[] }
  | { id: string; type: 'bulleted_list_item' | 'numbered_list_item'; richText: RichTextSpan[] }
  | { id: string; type: 'quote' | 'callout'; richText: RichTextSpan[] }
  | { id: string; type: 'code'; language: string; text: string }
  | { id: string; type: 'image'; url: string; caption: RichTextSpan[] }
  | { id: string; type: 'divider' }

function isFullPage(page: QueryDatabaseResponse['results'][number]): page is NotionPage {
  return 'properties' in page
}

function isFullBlock(block: PartialBlockObjectResponse | BlockObjectResponse): block is NotionBlock {
  return 'type' in block && 'has_children' in block
}

function richTextToPlain(richText: Array<{ plain_text: string }>) {
  return richText.map((text) => text.plain_text).join('')
}

function readProperty(page: NotionPage, names: string[]) {
  const properties = page.properties
  const key = names.find((name) => properties[name])
  return key ? properties[key] : undefined
}

function getTitle(page: NotionPage) {
  const property = readProperty(page, ['Name', 'Title', '标题'])
  if (property?.type === 'title') return richTextToPlain(property.title)
  return 'Untitled'
}

function getRichText(page: NotionPage, names: string[]) {
  const property = readProperty(page, names)
  if (property?.type === 'rich_text') return richTextToPlain(property.rich_text)
  if (property?.type === 'url') return property.url ?? ''
  return ''
}

function getSelect(page: NotionPage, names: string[], fallback = '') {
  const property = readProperty(page, names)
  if (property?.type === 'select') return property.select?.name ?? fallback
  if (property?.type === 'status') return property.status?.name ?? fallback
  return fallback
}

function getTags(page: NotionPage) {
  const property = readProperty(page, ['Tags', 'Tag', '标签'])
  if (property?.type === 'multi_select') return property.multi_select.map((tag) => tag.name)
  return []
}

function getDate(page: NotionPage) {
  const property = readProperty(page, ['Date', 'Published', 'Created', '日期'])
  if (property?.type === 'date') return property.date?.start ?? page.created_time
  if (property?.type === 'created_time') return property.created_time
  return page.created_time
}

function getTypeFromText(raw: string): ContentType {
  const value = raw.toLowerCase()
  if (['portfolio', 'project', 'projects', '作品', '项目'].includes(value)) return 'portfolio'
  if (['travelogue', 'travelogues', 'travel', 'journey', '游记', '旅行', '旅行记录'].includes(value)) return 'travelogue'
  if (['progress', 'wip', 'doing', '进展', '进行中'].includes(value)) return 'progress'
  if (['thought', 'thoughts', 'writing', 'post', '文章', '思考', '随笔'].includes(value)) return 'thoughts'
  return 'thoughts'
}

function normalizeCategoryLabel(raw: string) {
  const type = getTypeFromText(raw)
  const mapped = {
    portfolio: 'Portfolio',
    thoughts: 'Thoughts',
    travelogue: 'Travelogues',
    progress: 'Progress'
  }[type]

  return raw.trim() || mapped
}

function getPropertyValue<T = string>(page: any, recordMap: ExtendedRecordMap, names: string[], fallback: T): T | unknown {
  for (const name of names) {
    const value = getPageProperty(name, page, recordMap)
    if (value !== null && value !== undefined && String(value).trim() !== '') return value
  }
  return fallback
}

function normalizeSlug(raw: unknown) {
  return String(raw ?? '')
    .trim()
    .replace(/^\//, '')
    .toLowerCase()
}

function expandPropertyReference(raw: unknown): string[] {
  if (raw === null || raw === undefined) return []
  if (Array.isArray(raw)) return raw.flatMap((value) => expandPropertyReference(value))
  if (typeof raw === 'object') {
    const value = raw as Record<string, unknown>
    return [
      value.page_id,
      value.pageId,
      value.id,
      value.slug,
      value.url,
      value.href,
      value.link,
      value.title,
      value.name,
      value.value,
      value.text,
      value.plain_text
    ].flatMap((entry) => expandPropertyReference(entry))
  }
  const normalized = normalizeSlug(raw)
  return normalized ? [normalized] : []
}

function pageMatchesSlugOrTitle(page: any, recordMap: ExtendedRecordMap, slug: string) {
  const pageSlug = normalizeSlug(getPropertyValue(page, recordMap, ['slug', 'Slug'], ''))
  const title = normalizeSlug(getBlockTitle(page, recordMap))
  const normalizedSlug = normalizeSlug(slug)
  return Boolean(normalizedSlug) && (
    pageSlug === normalizedSlug ||
    title === normalizedSlug ||
    title === normalizedSlug.replaceAll('-', ' ')
  )
}

function pageMatchesReference(page: any, recordMap: ExtendedRecordMap, references: string[]) {
  const pageSlug = normalizeSlug(getPropertyValue(page, recordMap, ['slug', 'Slug'], ''))
  const title = normalizeSlug(getBlockTitle(page, recordMap))
  const pageId = normalizeSlug(page.id)
  return references.some((reference) => {
    const normalized = normalizeSlug(reference)
    return Boolean(normalized) && (
      normalized === pageSlug ||
      normalized === title ||
      normalized === pageId
    )
  })
}

function normalizePublicCover(rawCover: string | undefined, page: any) {
  if (!rawCover) return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop'
  return defaultMapImageUrl(rawCover, page) || rawCover
}

function getCover(page: NotionPage) {
  const explicitCover = getRichText(page, ['Cover', '封面'])
  if (explicitCover) return explicitCover
  if (page.cover?.type === 'external') return page.cover.external.url
  if (page.cover?.type === 'file') return page.cover.file.url
  return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop'
}

function pageToItem(page: NotionPage): PortfolioItem {
  const type = getSelect(page, ['Type', '类型'], 'thoughts')
  const category = getSelect(page, ['Category', '分类'], type)

  return {
    id: page.id,
    title: getTitle(page),
    slug: getRichText(page, ['Slug', 'slug']) || page.id.replaceAll('-', ''),
    type: getTypeFromText(category),
    category: normalizeCategoryLabel(category),
    summary: getRichText(page, ['Summary', 'Description', '摘要', '简介']),
    date: getDate(page),
    tags: getTags(page),
    cover: getCover(page),
    href: getRichText(page, ['URL', 'Link', '链接']),
    featured: getSelect(page, ['Featured', '精选']).toLowerCase() === 'yes'
  }
}

function publicPageToItem(page: any, recordMap: ExtendedRecordMap): PortfolioItem {
  const category = getPropertyValue(page, recordMap, ['category', 'Category', '分类'], 'Thoughts')
  const date = getPropertyValue(page, recordMap, ['date', 'Date', '日期'], page.created_time)
  const cover = normalizePublicCover(page.format?.page_cover, page)
  const slug = getPropertyValue(page, recordMap, ['slug', 'Slug'], page.id.replaceAll('-', ''))
  const summary = getPropertyValue(page, recordMap, ['summary', 'Summary', 'description', 'Description', '摘要'], '')
  const tags = getPropertyValue(page, recordMap, ['tags', 'Tags', 'tag', 'Tag', '标签'], [])
  const password = String(getPropertyValue(page, recordMap, ['password', 'Password', '密码'], '')).trim()

  return {
    id: page.id,
    title: getBlockTitle(page, recordMap),
    slug: String(slug),
    type: getTypeFromText(String(category)),
    category: normalizeCategoryLabel(String(category)),
    summary: String(summary),
    date: typeof date === 'number' ? new Date(date).toISOString() : String(date),
    tags: Array.isArray(tags) ? tags.map(String) : String(tags).split(',').filter(Boolean),
    cover,
    password,
    featured: ['yes', 'true', 'featured', '精选'].includes(String(getPageProperty('featured', page, recordMap)).toLowerCase())
  }
}

function publicPageIsPublished(page: any, recordMap: ExtendedRecordMap) {
  const status = String(getPageProperty('status', page, recordMap) || getPageProperty('Status', page, recordMap) || getPageProperty('状态', page, recordMap) || 'Published')
  return ['published', 'publish', 'public', 'done', '已发布'].includes(status.toLowerCase())
}

function publicPageIsContentPost(page: any, recordMap: ExtendedRecordMap) {
  const notionType = String(getPropertyValue(page, recordMap, ['type', 'Type', '类型'], '')).toLowerCase()
  const category = String(getPropertyValue(page, recordMap, ['category', 'Category', '分类'], '')).trim()
  return notionType === 'post' && Boolean(category)
}

function getPublicCollectionPages(recordMap: ExtendedRecordMap) {
  const blockIds = Object.values(recordMap.collection_query ?? {})
    .flatMap((views: any) => Object.values(views ?? {}))
    .flatMap((query: any) => query?.collection_group_results?.blockIds ?? [])

  return Array.from(new Set(blockIds))
    .map((pageId) => {
      const entry = (recordMap.block as any)?.[pageId as string]
      return entry?.value?.value ?? entry?.value
    })
    .filter((page) => page?.type === 'page')
}

async function getPublicArticleData() {
  if (!publicPageId) return null
  if (!cachedPublicArticleData) {
    cachedPublicArticleData = (async () => {
      const recordMap = await publicNotion.getPage(publicPageId, {
        fetchCollections: true,
        signFileUrls: true
      })

      const allPages = getPublicCollectionPages(recordMap)
        .filter((page) => page.id !== publicPageId)
        .map((page) => ({ page, recordMap }))

      const pages = allPages
        .map(({ page }) => page)
        .filter((page) => page.id !== publicPageId)
        .filter((page) => publicPageIsPublished(page, recordMap))
        .filter((page) => publicPageIsContentPost(page, recordMap))
        .map((page) => ({ page, recordMap }))

      return { recordMap, allPages, pages }
    })().catch((error) => {
      cachedPublicArticleData = null
      throw error
    })
  }

  return cachedPublicArticleData
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (publicPageId) {
    try {
      const data = await getPublicArticleData()
      if (data) return data.pages.map(({ page, recordMap }) => publicPageToItem(page, recordMap))
    } catch (error) {
      console.error('Unable to read public Notion page:', error)
    }
  }

  if (!officialNotion || !databaseId) return fallbackItems

  const response = await officialNotion.databases.query({
    database_id: databaseId,
    sorts: [{ timestamp: 'created_time', direction: 'descending' }]
  })

  return response.results.filter(isFullPage).filter((page) => {
    const status = getSelect(page, ['Status', '状态'], 'Published').toLowerCase()
    const notionType = getSelect(page, ['Type', '类型'], '').toLowerCase()
    const category = getSelect(page, ['Category', '分类'], '').toLowerCase()
    return ['published', 'publish', 'done', 'public', '已发布'].includes(status) && notionType === 'post' && Boolean(category)
  }).map(pageToItem)
}

export async function getPortfolioItemBySlug(slug: string) {
  const items = await getPortfolioItems()
  return items.find((item) => item.slug === slug)
}

export async function getPublicRecordMapBySlug(slug: string) {
  try {
    const data = await getPublicArticleData()
    if (!data) return null
    const entry = data.pages.find(({ page, recordMap }) => publicPageToItem(page, recordMap).slug === slug)
    if (!entry) return null
    return publicNotion.getPage(entry.page.id, { fetchCollections: true, signFileUrls: true })
  } catch (error) {
    console.error('Unable to read public Notion record map:', error)
    return null
  }
}

export async function getPublicMenuPage(slug: string) {
  try {
    const data = await getPublicArticleData()
    if (!data) return null

    const normalizedSlug = normalizeSlug(slug)
    const pageEntry =
      data.allPages.find(({ page, recordMap }) => {
        const type = normalizeSlug(getPropertyValue(page, recordMap, ['type', 'Type', '类型'], ''))
        return !type.includes('menu') && pageMatchesSlugOrTitle(page, recordMap, normalizedSlug)
      }) ??
      data.allPages.find(({ page, recordMap }) => {
        const type = normalizeSlug(getPropertyValue(page, recordMap, ['type', 'Type', '类型'], ''))
        return type.includes('page') && pageMatchesSlugOrTitle(page, recordMap, normalizedSlug)
      })

    if (pageEntry) {
      return {
        title: getBlockTitle(pageEntry.page, pageEntry.recordMap),
        summary: String(getPropertyValue(pageEntry.page, pageEntry.recordMap, ['summary', 'Summary', 'description', 'Description', '摘要'], '')),
        recordMap: pageEntry.recordMap
      }
    }

    const menuEntry = data.allPages.find(({ page, recordMap }) => {
      const type = normalizeSlug(getPropertyValue(page, recordMap, ['type', 'Type', '类型'], ''))
      return type.includes('menu') && pageMatchesSlugOrTitle(page, recordMap, normalizedSlug)
    })

    if (!menuEntry) return null

    const references = expandPropertyReference(
      getPropertyValue(menuEntry.page, menuEntry.recordMap, ['page', 'Page', 'content', 'Content', 'target', 'Target', 'link', 'Link', 'url', 'URL', 'href', 'Href', 'page_id', 'Page Id', 'pageId'], '')
    )

    const linkedEntry =
      data.allPages.find(({ page, recordMap }) => {
        const type = normalizeSlug(getPropertyValue(page, recordMap, ['type', 'Type', '类型'], ''))
        return !type.includes('menu') && (
          pageMatchesReference(page, recordMap, references) ||
          pageMatchesSlugOrTitle(page, recordMap, normalizedSlug)
        )
      }) ?? menuEntry

    return {
      title: getBlockTitle(linkedEntry.page, linkedEntry.recordMap),
      summary: String(getPropertyValue(linkedEntry.page, linkedEntry.recordMap, ['summary', 'Summary', 'description', 'Description', '摘要'], '')),
      recordMap: linkedEntry.recordMap
    }
  } catch (error) {
    console.error('Unable to read public Notion menu page:', error)
    return null
  }
}

function richText(spans: Array<any>): RichTextSpan[] {
  return spans.map((span) => ({
    plainText: span.plain_text,
    href: span.href,
    annotations: {
      bold: span.annotations.bold,
      italic: span.annotations.italic,
      code: span.annotations.code,
      strikethrough: span.annotations.strikethrough,
      underline: span.annotations.underline
    }
  }))
}

export async function getArticleBlocks(pageId: string): Promise<ArticleBlock[]> {
  if (!officialNotion || pageId.startsWith('sample-')) return []

  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  do {
    const response = await officialNotion.blocks.children.list({ block_id: pageId, start_cursor: cursor })
    blocks.push(...response.results.filter(isFullBlock))
    cursor = response.next_cursor ?? undefined
  } while (cursor)

  return blocks.flatMap((block): ArticleBlock[] => {
    const value = block[block.type as keyof typeof block] as any
    if (['paragraph', 'heading_1', 'heading_2', 'heading_3', 'bulleted_list_item', 'numbered_list_item', 'quote', 'callout'].includes(block.type)) {
      return [{ id: block.id, type: block.type as ArticleBlock['type'], richText: richText(value.rich_text) } as ArticleBlock]
    }
    if (block.type === 'code') return [{ id: block.id, type: 'code', language: value.language, text: richTextToPlain(value.rich_text) }]
    if (block.type === 'image') {
      const url = value.type === 'external' ? value.external.url : value.file.url
      return [{ id: block.id, type: 'image', url, caption: richText(value.caption) }]
    }
    if (block.type === 'divider') return [{ id: block.id, type: 'divider' }]
    return []
  })
}
