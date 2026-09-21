import 'dotenv/config'
import { access, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Media reference integrity.
 *
 * Answers three questions the seed's idempotency depends on, and that nothing
 * else in the suite covers:
 *
 *   1. Does every media row's file, and every generated size, exist on disk?
 *   2. Is anything sitting in `public/media` that no row points at?
 *   3. Has any seeded filename picked up a `-1`, `-2` … collision suffix?
 *
 *   pnpm qa:media
 */

const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/media')

/** `plate-1.webp` and `plate-12.webp` are suffixed; `placeholder-detail-a.webp`
 *  and a hash-named font are not. Only seed-owned rows are judged, because an
 *  editor may legitimately upload `photo-2.jpg`. */
const SUFFIXED = /-\d+(\.[a-z0-9]+)$/i

const run = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'media',
    limit: 1000,
    overrideAccess: true,
  })

  const referenced = new Set<string>()
  const missing: string[] = []
  const suffixed: string[] = []

  for (const doc of docs) {
    const names = [
      doc.filename,
      ...Object.values(doc.sizes ?? {}).map((size) => (size as { filename?: string })?.filename),
    ].filter((name): name is string => Boolean(name))

    for (const name of names) {
      referenced.add(name)
      try {
        await access(path.join(MEDIA_DIR, name))
      } catch {
        missing.push(`${doc.seedKey ?? doc.id}: ${name}`)
      }
    }

    if (doc.seedKey && doc.filename && SUFFIXED.test(doc.filename)) {
      suffixed.push(`${doc.seedKey}: ${doc.filename}`)
    }
  }

  let onDisk: string[] = []
  try {
    onDisk = await readdir(MEDIA_DIR)
  } catch {
    onDisk = []
  }
  const orphans = onDisk.filter((name) => !referenced.has(name) && !name.startsWith('.'))

  const report = (label: string, items: string[]) => {
    if (items.length === 0) {
      console.log(`OK    ${label}`)
      return 0
    }
    console.log(`FAIL  ${label} (${items.length})`)
    for (const item of items.slice(0, 20)) console.log(`        ${item}`)
    if (items.length > 20) console.log(`        ...and ${items.length - 20} more`)
    return 1
  }

  console.log(`${docs.length} media record(s), ${onDisk.length} file(s) in public/media\n`)
  const failures =
    report('every referenced file exists', missing) +
    report('no orphaned files in public/media', orphans) +
    report('no collision suffixes on seeded filenames', suffixed)

  console.log(failures === 0 ? '\nPASS' : '\nFAIL')
  process.exit(failures === 0 ? 0 : 1)
}

run().catch((error) => {
  console.error('\nMedia integrity check failed:\n', error)
  process.exit(1)
})
