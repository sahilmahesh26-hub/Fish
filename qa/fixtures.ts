import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * QA fixtures — NOT seed data.
 *
 * `pnpm seed` deliberately ships no delivery records and leaves the starter
 * articles unpublished, because inventing a customer delivery or an article
 * nobody wrote would be a false claim on a live site. That is the right
 * default, and it stays.
 *
 * It also means several templates have no route to render: article detail,
 * delivery detail, the populated listings, `Article` structured data, and a
 * sitemap containing anything beyond the static pages. This script puts a
 * local database into the state a launched site would be in, so those can
 * actually be tested and screenshotted.
 *
 * Every record it writes is marked with `[QA FIXTURE]` in its title and is
 * removed again by `reset`. It refuses to run against a non-local database.
 *
 *   pnpm qa:fixtures apply
 *   pnpm qa:fixtures reset
 */

const FIXTURE_MARK = '[QA FIXTURE]'

/** A fixture database is a local one. Anything else is somebody's real data. */
const assertLocalDatabase = () => {
  const url = process.env.DATABASE_URL ?? ''
  const host = url.replace(/^[a-z]+:\/\/[^@]*@/, '').split(/[:/]/)[0]
  if (host !== 'localhost' && host !== '127.0.0.1' && host !== 'db') {
    throw new Error(
      `Refusing to write QA fixtures to a non-local database (host: ${host || 'unknown'}).`,
    )
  }
}

const run = async () => {
  const command = process.argv[2]
  if (command !== 'apply' && command !== 'reset') {
    console.error('Usage: pnpm qa:fixtures <apply|reset>')
    process.exit(1)
  }

  assertLocalDatabase()
  const payload = await getPayload({ config })

  if (command === 'reset') {
    const deliveries = await payload.delete({
      collection: 'deliveries',
      where: { title: { contains: FIXTURE_MARK } },
      overrideAccess: true,
    })
    // Articles are not deleted — the seed owns them. They are only returned to
    // the draft state the seed created them in.
    const posts = await payload.update({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      data: { _status: 'draft' } as never,
      overrideAccess: true,
    })
    // Policy pages go back to awaiting review, which is their honest state.
    const pages = await payload.update({
      collection: 'pages',
      where: { pageType: { equals: 'policy' } },
      data: { legalReviewRequired: true } as never,
      overrideAccess: true,
    })
    console.log(
      `reset: ${deliveries.docs.length} deliveries removed, ` +
        `${posts.docs.length} articles returned to draft, ` +
        `${pages.docs.length} policy pages re-flagged`,
    )
    process.exit(0)
  }

  /* ---------------------------------------------------------------------- */
  /* apply                                                                   */
  /* ---------------------------------------------------------------------- */

  // Publish the starter articles so `/knowledge` and article detail render.
  const drafts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'draft' } },
    limit: 100,
    draft: true,
    overrideAccess: true,
  })
  for (const post of drafts.docs) {
    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { _status: 'published', publishedAt: new Date().toISOString() } as never,
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
  }

  // Clear the legal-review flag so policy pages become indexable, which is what
  // the sitemap looks like once a lawyer has signed the wording off.
  const policies = await payload.update({
    collection: 'pages',
    where: { pageType: { equals: 'policy' } },
    data: { legalReviewRequired: false } as never,
    overrideAccess: true,
  })

  // One delivery record, so the delivery templates have something to render.
  const media = await payload.find({
    collection: 'media',
    where: { seedKey: { equals: 'specimen' } },
    limit: 1,
    overrideAccess: true,
  })
  const image = media.docs[0]?.id

  const existing = await payload.find({
    collection: 'deliveries',
    where: { title: { contains: FIXTURE_MARK } },
    limit: 1,
    draft: true,
    overrideAccess: true,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'deliveries',
      data: {
        title: `${FIXTURE_MARK} Super Red Arowana to Bengaluru`,
        slug: 'qa-fixture-super-red-arowana-to-bengaluru',
        requirement:
          'A collector asked for a Super Red Arowana between 14 and 16 inches with even colour across the gill plate, delivered to Bengaluru.',
        specimen: 'Super Red Arowana, 15 inches',
        variety: 'Super Red',
        approximateSize: '15 inches',
        // Text fields, not groups — the collection deliberately stores a city
        // or state only, never a full address.
        origin: 'Kolkata, West Bengal',
        destination: 'Bengaluru, Karnataka',
        mainImage: image,
        deliveryDate: new Date().toISOString(),
        featured: true,
        _status: 'published',
      } as never,
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
  }

  console.log(
    `apply: ${drafts.docs.length} articles published, ` +
      `${policies.docs.length} policy pages cleared for indexing, ` +
      `1 delivery record present`,
  )
  process.exit(0)
}

run().catch((error) => {
  console.error('\nFixtures failed:\n', error)
  process.exit(1)
})
