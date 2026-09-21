/**
 * Environment access with explicit failure messages, so a missing value
 * surfaces at boot rather than as an obscure runtime error.
 *
 * ---------------------------------------------------------------------------
 * This module must never return a secret's value.
 * ---------------------------------------------------------------------------
 * It sits on `payload.config`'s import path, which the CLI scripts (`pnpm seed`,
 * `payload migrate`, the QA fixtures) also load — so it cannot carry a
 * `server-only` guard: outside Next's bundler that package throws and every
 * script dies. `tests/unit/lib.test.ts` pins the invariant instead.
 *
 * The credential helpers below therefore return a boolean, never the value.
 * Anything that needs an actual secret reads `process.env` at its own call
 * site, inside a module that is unambiguously server-side.
 */

export const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env and fill it in.`,
    )
  }
  return value
}

export const optionalEnv = (name: string): string | undefined => {
  const value = process.env[name]
  return value && value.length > 0 ? value : undefined
}

export const siteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/**
 * Hosts that hand out a fresh URL per deploy.
 *
 * A preview build is a complete, crawlable copy of the site. Indexed, it
 * competes with the real domain for its own content and the duplicate usually
 * wins on freshness. These platforms are matched by suffix so every
 * per-branch subdomain is covered.
 */
const PREVIEW_HOSTS = [
  'vercel.app',
  'netlify.app',
  'onrender.com',
  'pages.dev',
  'railway.app',
  'fly.dev',
  'ngrok.io',
  'ngrok-free.app',
  'herokuapp.com',
  'amplifyapp.com',
]

/**
 * Whether the configured origin is a real production domain.
 *
 * Search engines are only invited in when all of these hold, because each one
 * failing means the URL in a canonical tag, a sitemap entry or a JSON-LD `@id`
 * would point somewhere that is not the site:
 *
 *   - the value parses as a URL at all (an unset or malformed variable falls
 *     back to localhost, which is not a public address)
 *   - the scheme is https, since canonicals and OG URLs must be the secure
 *     origin and a plain-http public site has a redirect in front of it
 *   - the host is not loopback, a bare hostname or a .local address
 *   - the host does not belong to a preview platform
 *
 * Anything else gets `Disallow: /`. Opening up is therefore automatic once a
 * real domain is configured, and impossible before then.
 */
export const isProductionOrigin = (url: string = siteUrl()): boolean => {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }

  if (parsed.protocol !== 'https:') return false

  const host = parsed.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost')) return false
  if (host === '127.0.0.1' || host === '0.0.0.0' || host === '::1') return false
  if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.test')) return false
  // A public domain has a dot and a TLD; `staging` or `web` alone does not.
  if (!host.includes('.')) return false
  if (PREVIEW_HOSTS.some((preview) => host === preview || host.endsWith(`.${preview}`)))
    return false

  return true
}

/** True when S3 credentials are fully configured. Partial config falls back to
 *  local disk rather than failing at upload time. */
export const hasS3Storage = (): boolean =>
  Boolean(
    process.env.S3_BUCKET &&
    process.env.S3_REGION &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
  )

export const hasSmtp = (): boolean =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.EMAIL_FROM)
