import 'dotenv/config'
import { Client } from 'pg'

/**
 * Blocks until Postgres accepts a real query, or fails loudly.
 *
 * Startup races are the usual cause of a "database is down" report that is
 * really "the database was still booting". This distinguishes the three cases
 * the team needs to tell apart:
 *
 *   - unavailable  — nothing is listening, or auth/DNS fails
 *   - empty        — reachable, but Payload's tables do not exist yet
 *   - ready        — reachable and migrated
 *
 * It never invents success: after the timeout it exits non-zero with the last
 * real error.
 */
const TIMEOUT_MS = Number(process.env.DB_WAIT_TIMEOUT_MS ?? 60_000)
const INTERVAL_MS = 1_000

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

/** Redacts the password so a connection string never reaches a log. */
const safeTarget = (() => {
  try {
    const url = new URL(connectionString)
    return `${url.protocol}//${url.username ? '***@' : ''}${url.host}${url.pathname}`
  } catch {
    return '(unparseable DATABASE_URL)'
  }
})()

const deadline = Date.now() + TIMEOUT_MS
let lastError = null

while (Date.now() < deadline) {
  const client = new Client({ connectionString, connectionTimeoutMillis: 3_000 })
  try {
    await client.connect()
    const { rows } = await client.query(
      "select to_regclass('public.payload_migrations') is not null as migrated",
    )
    await client.end()

    if (rows[0]?.migrated) {
      console.log(`database ready and migrated — ${safeTarget}`)
      process.exit(0)
    }

    console.log(`database reachable but EMPTY (no Payload tables) — ${safeTarget}`)
    console.log('run `pnpm payload migrate` (production) or `pnpm seed` (development)')
    process.exit(0)
  } catch (error) {
    lastError = error
    await client.end().catch(() => {})
    const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000))
    process.stdout.write(`waiting for ${safeTarget} … ${remaining}s left\r`)
    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS))
  }
}

console.error(`\ndatabase UNAVAILABLE after ${TIMEOUT_MS / 1000}s — ${safeTarget}`)
console.error(lastError instanceof Error ? lastError.message : String(lastError))
process.exit(1)
