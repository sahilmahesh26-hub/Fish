import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { revalidateRunningSite } from '../src/seed/revalidate'

/**
 * Content-resilience fixtures.
 *
 * The layout must survive whatever an editor types, not just what the seed
 * happens to contain. This writes the awkward cases — a one-word title, a title
 * that wraps to four lines, a paragraph nobody will read, a card count that
 * does not divide evenly, a category name too long for its chip — so the
 * responsive sweep can be run against them.
 *
 * Marked `[RESILIENCE]`, reversible, and refuses to touch a non-local database,
 * exactly like `qa/fixtures.ts`.
 *
 *   pnpm qa:resilience apply
 *   pnpm qa:resilience reset
 */

const MARK = '[RESILIENCE]'

const assertLocalDatabase = () => {
  const url = process.env.DATABASE_URL ?? ''
  const host = url.replace(/^[a-z]+:\/\/[^@]*@/, '').split(/[:/]/)[0]
  if (host !== 'localhost' && host !== '127.0.0.1' && host !== 'db') {
    throw new Error(`Refusing to write fixtures to a non-local database (host: ${host || 'unknown'}).`)
  }
}

/** Four lines at the widest heading size, not four lines on a phone. */
const FOUR_LINE_TITLE =
  'Sourcing an exceptionally particular specimen for a collector who knows precisely what they want'

const LONG_PARAGRAPH = [
  'A collector came to us with a requirement that would have been easy to answer badly.',
  'They wanted a specific variety, at a specific size, with colour that held under both daylight and aquarium lighting, and they had waited long enough to be sceptical of anyone who answered too quickly.',
  'What follows is the full account of that search, including the options we turned down, the reasons we turned them down, and the questions we asked the supplier before we were willing to show anything at all.',
  'It is longer than most of what we publish, because the detail is the point.',
].join(' ')

/** Titles chosen to stress a heading from one word to four lines. */
const TITLES = [
  `${MARK} Arowana`,
  `${MARK} A title that runs to about two lines at most reading widths`,
  `${MARK} ${FOUR_LINE_TITLE}`,
  `${MARK} Antipodocottus megalops and other unpronounceably-long-compound-species-names`,
  `${MARK} Five`,
]

const run = async () => {
  const command = process.argv[2]
  if (command !== 'apply' && command !== 'reset') {
    console.error('Usage: pnpm qa:resilience <apply|reset>')
    process.exit(1)
  }

  assertLocalDatabase()
  const payload = await getPayload({ config })

  if (command === 'reset') {
    const deliveries = await payload.delete({
      collection: 'deliveries',
      where: { title: { contains: MARK } },
      overrideAccess: true,
    })
    const posts = await payload.delete({
      collection: 'posts',
      where: { title: { contains: MARK } },
      overrideAccess: true,
    })
    console.log(`reset: removed ${deliveries.docs.length} deliveries and ${posts.docs.length} articles`)
    await revalidateRunningSite()
    process.exit(0)
  }

  const media = await payload.find({
    collection: 'media',
    where: { seedKey: { equals: 'specimen' } },
    limit: 1,
    overrideAccess: true,
  })
  const image = media.docs[0]?.id

  let created = 0
  for (const [index, title] of TITLES.entries()) {
    const slug = `resilience-${index + 1}`

    const existing = await payload.find({
      collection: 'deliveries',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) continue

    await payload.create({
      collection: 'deliveries',
      data: {
        title,
        slug,
        // The last record deliberately has no image, to exercise the
        // missing-media state rather than assume one is always present.
        mainImage: index === TITLES.length - 1 ? undefined : image,
        requirement: index === 2 ? LONG_PARAGRAPH : 'A short requirement.',
        specimen: index === 3 ? 'Antipodocottus megalops, approximately 15 inches' : 'One fish',
        origin: 'Kolkata, West Bengal',
        destination:
          index === 3 ? 'Thiruvananthapuram, Kerala' : 'Pune, Maharashtra',
        deliveryDate: new Date().toISOString(),
        _status: 'published',
      } as never,
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
    created += 1
  }

  console.log(
    `apply: ${created} delivery records created (${TITLES.length} total present). ` +
      'Card counts to sweep: visit /deliveries and compare 1, 2, 5 and 9 by ' +
      'unpublishing records in Payload.',
  )
  await revalidateRunningSite()
  process.exit(0)
}

run().catch((error) => {
  console.error('\nResilience fixtures failed:\n', error)
  process.exit(1)
})
