import { getPosts, getSiteSettings } from '@/lib/queries'
import { siteUrl } from '@/lib/env'
import { getPayloadClient } from '@/lib/payload'

/** Escapes text for inclusion in XML character data. */
const escapeXml = (value: string): string =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char,
  )

/**
 * Knowledge Hub RSS feed.
 *
 * Published articles only — `getPosts` applies the published filter, and this
 * route never enables draft mode.
 *
 * Failure is graceful by design. A feed reader polls on a schedule and backs
 * off or unsubscribes after repeated errors, but tolerates an empty channel, so
 * a brief CMS outage returns a valid empty feed rather than a 500. The error is
 * logged server-side; nothing about it reaches the response.
 */
export const GET = async () => {
  const base = siteUrl()

  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  let docs: Awaited<ReturnType<typeof getPosts>>['docs'] = []

  try {
    const [loadedSettings, posts] = await Promise.all([getSiteSettings(), getPosts({ limit: 50 })])
    settings = loadedSettings
    docs = posts.docs
  } catch (error) {
    // Logged with Payload's logger so it lands in the same place as every other
    // server error. No stack trace, message or secret reaches the client.
    try {
      const payload = await getPayloadClient()
      payload.logger.error({ err: error }, 'RSS feed could not read the CMS; serving an empty feed')
    } catch {
      console.error('RSS feed could not read the CMS; serving an empty feed')
    }
  }

  const brand = settings?.brandName ?? 'Finquiry'

  const items = docs
    .map((post) => {
      const url = `${base}/knowledge/${post.slug}`
      const date = post.publishedAt ?? post.createdAt
      const author = typeof post.author === 'object' && post.author ? post.author.name : null
      const category =
        typeof post.category === 'object' && post.category ? post.category.name : null

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt ?? '')}</description>
${author ? `      <dc:creator>${escapeXml(author)}</dc:creator>\n` : ''}${category ? `      <category>${escapeXml(category)}</category>\n` : ''}${date ? `      <pubDate>${new Date(date).toUTCString()}</pubDate>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${brand} — Knowledge Hub`)}</title>
    <link>${escapeXml(`${base}/knowledge`)}</link>
    <description>${escapeXml(
      settings?.defaultSeo?.description ??
        'Practical guides on evaluating fish, preparing aquariums, transport and acclimatisation.',
    )}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />
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
