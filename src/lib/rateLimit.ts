/**
 * In-memory sliding-window rate limiter for public form submissions.
 *
 * Deliberately simple. It is per-process, so it does not protect a
 * horizontally-scaled deployment on its own — for that, put a shared store or
 * an edge rate limit in front. It does stop the common case: one client
 * hammering the endpoint. Documented in README under Security.
 */

type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

/**
 * Defaults are deliberately strict for a form a real person fills in once.
 * Both are configurable so an operator can tune them per environment — and so
 * the end-to-end suite, which submits repeatedly from one address, can run
 * deterministically without weakening the production default.
 */
const WINDOW_MS = Number(process.env.ENQUIRY_RATE_LIMIT_WINDOW_MINUTES ?? 10) * 60 * 1000
const MAX_PER_WINDOW = Number(process.env.ENQUIRY_RATE_LIMIT_MAX ?? 5)

/**
 * The looser ceiling on attempts, as opposed to completed enquiries.
 *
 * Counting every attempt against the strict limit meant that someone who
 * mistyped their phone number twice had spent three of their five chances
 * before sending anything — the protection was punishing the people it was
 * meant to serve. So attempts get their own, much larger budget: enough that a
 * person correcting mistakes never notices it, low enough that a script cannot
 * sit on the endpoint.
 */
export const MAX_ATTEMPTS_PER_WINDOW = MAX_PER_WINDOW * 8

/** Drops expired buckets so the map cannot grow without bound. */
const sweep = (now: number) => {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number }

export const checkRateLimit = (
  key: string,
  { windowMs = WINDOW_MS, max = MAX_PER_WINDOW } = {},
): RateLimitResult => {
  const now = Date.now()
  if (buckets.size > 5000) sweep(now)

  const entry = buckets.get(key)

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

/** Test seam. */
export const resetRateLimits = () => buckets.clear()
