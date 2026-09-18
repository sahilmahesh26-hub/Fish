import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import {
  seedAdminUser,
  seedMedia,
  seedSourcingCategories,
  seedKnowledgeCategories,
  seedPosts,
  seedFaqs,
} from './helpers'
import { seedGlobals } from './globals'
import { seedPages } from './pages'
import { revalidateRunningSite } from './revalidate'

/**
 * Seed entry point.
 *
 * Safe to re-run: every step upserts. See `helpers.ts` for the rule about what
 * is deliberately never seeded.
 */
const run = async () => {
  const payload = await getPayload({ config })

  console.log('\nSeeding Finquiry…\n')

  await seedAdminUser(payload)
  const media = await seedMedia(payload)
  const sourcing = await seedSourcingCategories(payload, media)
  const knowledge = await seedKnowledgeCategories(payload)
  await seedPosts(payload, knowledge, media)
  await seedFaqs(payload)
  await seedGlobals(payload, { media, sourcing })
  await seedPages(payload, { media })
  await revalidateRunningSite()

  console.log('\nSeed complete.\n')
  process.exit(0)
}

run().catch((error) => {
  console.error('\nSeed failed:\n', error)
  process.exit(1)
})
