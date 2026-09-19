import { siteUrl } from '@/lib/env'

/**
 * Asks a running site to drop its cached CMS reads.
 *
 * The seed runs in its own process, so Payload's `afterChange` revalidation
 * hooks cannot reach the Next.js server's cache — without this, freshly seeded
 * content keeps serving from a stale entry (or a cached 404) until the next
 * deploy or restart.
 *
 * Best-effort by design: if the site is not running, or no secret is
 * configured, the seed still succeeds and says what to do instead.
 */
export const revalidateRunningSite = async (baseUrl?: string): Promise<void> => {
  // QA harnesses run the site on a scratch port, not the configured origin.
  const target = (baseUrl ?? process.env.BASE_URL ?? siteUrl()).replace(/\/$/, '')
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) {
    console.log('  cache: REVALIDATION_SECRET not set — restart the site to pick up new content')
    return
  }

  const tags = [
    'pages',
    'posts',
    'deliveries',
    'sourcing-categories',
    'faqs',
    'categories',
    'global',
    'homepage',
  ]

  try {
    for (const tag of tags) {
      const response = await fetch(`${target}/api/revalidate?tag=${tag}`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    }
    console.log(`  cache: revalidated ${target}`)
  } catch (error) {
    console.log(
      `  cache: could not reach ${target} (${
        error instanceof Error ? error.message : 'unknown error'
      }) — restart the site to pick up new content`,
    )
  }
}
