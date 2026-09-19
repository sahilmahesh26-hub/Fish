import { revalidatePath, revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

/** Tags whose content appears in the sitemap or the feed. */
const CONTENT_TAGS = new Set(['pages', 'posts', 'deliveries'])

/**
 * On-demand revalidation for changes Payload's own hooks cannot see — for
 * example a scheduled publish that fires in another process, or a deploy that
 * needs the cache cleared.
 *
 * Publishing through the admin already revalidates via collection hooks; this
 * endpoint is the manual escape hatch.
 */
export const POST = async (request: NextRequest) => {
  const secret = request.headers.get('x-revalidate-secret')
  const expected = process.env.REVALIDATION_SECRET

  if (!expected) {
    return Response.json({ error: 'Revalidation is not configured.' }, { status: 501 })
  }
  if (secret !== expected) {
    return Response.json({ error: 'Invalid token.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')
  const path = searchParams.get('path')

  if (!tag && !path) {
    return Response.json({ error: 'Provide a tag or a path.' }, { status: 400 })
  }

  if (tag) {
    revalidateTag(tag, 'max')
    /*
     * The sitemap and the feed are prerendered routes whose own cache entries
     * carry no collection tag — `getAllPageSlugs` is deliberately uncached, so
     * there is nothing for `revalidateTag` to match. Without this, publishing a
     * page refreshed the page itself but left the sitemap up to an hour stale,
     * which is exactly the window in which a crawler notices a new URL.
     */
    if (CONTENT_TAGS.has(tag)) {
      revalidatePath('/sitemap.xml')
      revalidatePath('/rss.xml')
    }
  }
  if (path) revalidatePath(path)

  return Response.json({ revalidated: true, tag, path, now: Date.now() })
}
