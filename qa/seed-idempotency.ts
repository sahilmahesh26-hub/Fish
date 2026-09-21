import 'dotenv/config'
import { execFile } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Repeated-seeding regression.
 *
 * The seed used to rename its own artwork on every run: Payload refuses to
 * reuse an occupied filename, and the row being updated holds its own name
 * until the update commits, so `plate.webp` became `plate-1.webp`, then
 * `plate.webp` again, stranding a copy each time. Thirty-one orphans had
 * accumulated in `public/media` before it was caught, and prerendered pages
 * 500'd on images whose names had moved under them.
 *
 * This runs the seed three times and asserts that the second and third runs
 * change nothing at all: same filenames, same file list, same media ids.
 *
 *   pnpm qa:seed-idempotency
 */

const exec = promisify(execFile)
const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/media')
const RUNS = 3

type Snapshot = { media: string; files: string }

const snapshot = async (): Promise<Snapshot> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', limit: 1000, overrideAccess: true })
  const media = docs
    .filter((doc) => doc.seedKey)
    .map((doc) => `${doc.seedKey}\t${doc.filename}\t${doc.seedHash ?? ''}\t${doc.id}`)
    .sort()
    .join('\n')
  const files = (await readdir(MEDIA_DIR)).sort().join('\n')
  return { media, files }
}

const run = async () => {
  const snapshots: Snapshot[] = []

  for (let i = 1; i <= RUNS; i += 1) {
    process.stdout.write(`seed run ${i}/${RUNS}... `)
    // A child process, because the seed calls `process.exit` when it finishes.
    await exec('pnpm', ['seed'], { env: process.env, maxBuffer: 32 * 1024 * 1024 })
    snapshots.push(await snapshot())
    console.log('done')
  }

  let failures = 0
  const compare = (label: string, key: keyof Snapshot) => {
    const first = snapshots[0][key]
    for (let i = 1; i < snapshots.length; i += 1) {
      if (snapshots[i][key] !== first) {
        console.log(`FAIL  ${label} changed between run 1 and run ${i + 1}`)
        const a = first.split('\n')
        const b = snapshots[i][key].split('\n')
        for (const line of b.filter((l) => !a.includes(l)).slice(0, 10)) console.log(`   +  ${line}`)
        for (const line of a.filter((l) => !b.includes(l)).slice(0, 10)) console.log(`   -  ${line}`)
        failures += 1
        return
      }
    }
    console.log(`OK    ${label} identical across ${RUNS} runs`)
  }

  console.log()
  compare('seeded media rows (key, filename, hash, id)', 'media')
  compare('files in public/media', 'files')

  const suffixed = snapshots[snapshots.length - 1].media
    .split('\n')
    .filter((line) => /-\d+\.[a-z0-9]+\t/i.test(line))
  if (suffixed.length > 0) {
    console.log(`FAIL  ${suffixed.length} seeded filename(s) carry a collision suffix`)
    for (const line of suffixed.slice(0, 10)) console.log(`        ${line}`)
    failures += 1
  } else {
    console.log('OK    no collision suffixes on seeded filenames')
  }

  console.log(failures === 0 ? '\nPASS' : '\nFAIL')
  process.exit(failures === 0 ? 0 : 1)
}

run().catch((error) => {
  console.error('\nSeed idempotency check failed:\n', error)
  process.exit(1)
})
