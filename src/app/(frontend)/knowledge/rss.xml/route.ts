import { getPosts, getSiteSettings } from '@/lib/queries'
import { siteUrl } from '@/lib/env'

/** Escapes text for inclusion in XML character data. */
const escapeXml = (value: string): string =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char,
  )

/** RSS feed for the Knowledge Hub. */
export const GET = async () => {
  const base = siteUrl()

  /*
   * A feed reader polls this on a schedule. If the CMS is briefly unreachable,
   * a valid but empty channel is far better than a 500 — readers back off or
   * unsubscribe after repeated errors, but tolerate an empty feed.
   */
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let docs: Awaited<ReturnType<typeof getPosts>>['docs'] = []

  try {
    const [loadedSettings, posts] = await Promise.all([getSiteSettings(), getPosts({ limit: 50 })])
    settings = loadedSettings
    docs = posts.docs
  } catch {
    // Fall through to an empty feed with the default channel details.
  }

  const items = docs
    .map((post) => {
      const url = `${base}/knowledge/${post.slug}`
      const date = post.publishedAt ?? post.createdAt
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt ?? '')}</description>
      ${date ? `<pubDate>${new Date(date).toUTCString()}</pubDate>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${settings?.brandName ?? 'Finquiry'} — Knowledge Hub`)}</title>
    <link>${escapeXml(`${base}/knowledge`)}</link>
    <description>${escapeXml(
      settings?.defaultSeo?.description ?? 'Guides for serious aquarium collectors.',
    )}</description>
    <language>en-IN</language>
    <atom:link href="${escapeXml(`${base}/knowledge/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
