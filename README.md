# Portfolio Notion Site

一个独立的个人作品集网站骨架：Next.js 负责网站，Notion 负责文章内容，Vercel 负责部署和增量刷新。作品集 `Portfolio` 区域预留给手写页面，不从 Notion 自动拉取。

## NotionNext 的核心机制

NotionNext 本质上做了三件事：

1. 用一个公开的 Notion 页面或数据库作为文章 CMS。
2. Next.js 在构建或请求时读取 Notion 内容，把数据库条目转换为文章、页面、分类和标签。
3. 部署到 Vercel 后，通过 ISR 或重新部署，让 Notion 里的内容变成公开网页。

这个项目保留这条链路，但去掉 NotionNext 的多主题、多插件和大量配置层，方便你完全掌控作品集的结构和视觉。

## NotionNext 风格发布方式

现在优先支持和 NotionNext 类似的方式：把 Notion database 所在页面发布为公开页面，然后在环境变量里填写 `NOTION_PAGE_ID`。之后你在 Notion 里写文章，只要把文章所在行的 `Status/status/状态` 改成 `Published` 或 `Publish`，网站会在下一次 ISR 刷新后同步。

当前实现也兼容 NotionNext 常用的公开页参数：`API_BASE_URL`、`NOTION_ACTIVE_USER`、`NOTION_TOKEN_V2`。如果你的原 fork 里能正常读通，优先把这几个值也一起配上。

不需要把 Notion secret key 写进代码。`NOTION_TOKEN + NOTION_DATABASE_ID` 仍保留为备用方案，但不是默认推荐路径。

## Notion 数据库字段

建议创建一个 Notion database，并添加这些字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Name` | Title | 标题 |
| `Slug` | Rich text | URL 路径，例如 `my-first-project` |
| `Type` | Select | `Thoughts`、`Travelogue` 或 `Progress`。`Portfolio` 不建议放 Notion，后续手写 |
| `Status` | Status/Select | 设为 `Published` 或 `Publish` 才会公开 |
| `Summary` | Rich text | 首页卡片和详情页摘要 |
| `Date` | Date | 发布日期 |
| `Tags` | Multi-select | 标签 |
| `Cover` | URL/Rich text | 封面图 URL，可选 |
| `URL` | URL | 外部项目链接，可选 |
| `Featured` | Select | 填 `yes` 会出现在 Featured |

字段也兼容部分中文名，例如 `标题`、`类型`、`状态`、`摘要`、`标签`。

## 本地运行

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.local` 里需要：

```bash
NOTION_PAGE_ID=1286a25a7060804a80eaec65eb5f0451
API_BASE_URL=https://app.notion.com/api/v3
NOTION_ACTIVE_USER=你的activeUser
NOTION_TOKEN_V2=你的token_v2
REVALIDATE_SECRET=change-me
```

没有配置 Notion 时，网站会使用 `lib/content.ts` 里的示例内容。

## Vercel 发布

1. 把这个目录推到你自己的 GitHub 仓库。
2. 在 Vercel 导入仓库。
3. 在 Vercel Project Settings 里添加 `NOTION_PAGE_ID`、`API_BASE_URL`、`NOTION_ACTIVE_USER`、`NOTION_TOKEN_V2`、`REVALIDATE_SECRET`。
4. 在 Notion 里把文章数据库所在页面发布为公开页面。

首页默认展示 `Progress`，点击首页按钮会在同一内容区切换 `Portfolio`、`Thoughts`、`Travelogue`、`Progress`。首页和详情页设置了 `revalidate = 300`，也就是最长 5 分钟自动刷新一次。需要即时刷新时，可以请求：

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-revalidate-secret: change-me"
```

后续可以用 Notion automation、Zapier、Make 或 GitHub Action 在你改动 Notion 后调用这个接口。
