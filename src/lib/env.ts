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
