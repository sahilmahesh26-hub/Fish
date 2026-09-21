import { createHash, randomBytes } from 'node:crypto'
import { access, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'
import { doc, p, h } from './lexical'
import { richTextToPlainText } from '@/lib/richText'
import { STARTER_DRAFT_MARKER } from '@/hooks/starterDraftGuard'
import { waterPlate, categoryPlate, placeholderLogo } from './placeholders'
import { SOURCING_CATEGORIES, KNOWLEDGE_CATEGORIES, STARTER_POSTS, FAQS } from './content'

/**
 * Idempotent seed.
 *
 * Every step looks for an existing record first and updates rather than
 * duplicates, so running this repeatedly — on a fresh database or an existing
 * one — converges on the same state without wiping an editor's work.
 *
 * Deliberately NOT seeded: testimonials, customer names, delivery stories,
 * vendor claims, statistics and prices. Those only exist once they are real.
 */

export const log = (message: string) => console.log(`  ${message}`)

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

type MediaSpec = {
  key: string
  filename: string
  alt: string
  build: () => Promise<Buffer>
  mimeType: string
}

/*
 * The caption every seeded image carries.
 *
 * It is editor-facing: captions render only where a component asks for one, and
 * none of the redesigned components do. It exists so the media library can be
 * filtered and cleared in one pass.
 */
const seedCaption = 'Generated artwork. Replace with photography before launch.'

/** The directory Payload's local storage writes uploads into. */
const MEDIA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/media')

type MediaDoc = {
  filename?: string | null
  seedHash?: string | null
  sizes?: Record<string, { filename?: string | null }>
}

/**
 * Delete a media document's files, original and every generated size.
 *
 * Only ever called for a row the seed itself owns, identified by `seedKey`,
 * and only when that row's artwork has genuinely changed. An upload an editor
 * made carries no `seedKey` and is never matched, so a development seed cannot
 * remove production media.
 *
 * Best effort. A missing file is the state we wanted anyway.
 */
const removeMediaFiles = async (doc: MediaDoc) => {
  const names = [doc.filename, ...Object.values(doc.sizes ?? {}).map((size) => size?.filename)]
  await Promise.all(
    names
      .filter((name): name is string => Boolean(name))
      // Defend the directory against a crafted filename: only a bare basename
      // inside the media directory is ever removed.
      .filter((name) => path.basename(name) === name)
      .map((name) => rm(path.join(MEDIA_DIR, name), { force: true })),
  )
}

/** True when a media document's primary file is still on disk. */
const primaryFileExists = async (doc: MediaDoc): Promise<boolean> => {
  const name = doc.filename
  if (!name || path.basename(name) !== name) return false
  try {
    await access(path.join(MEDIA_DIR, name))
    return true
  } catch {
    return false
  }
}

/** Checksum of the bytes the seed generates, stored on the row as `seedHash`. */
const checksum = (data: Buffer): string => createHash('sha256').update(data).digest('hex')

export const upsertMedia = async (payload: Payload, spec: MediaSpec): Promise<number> => {
  // Matched on `seedKey`, not on filename: Payload appends a suffix when a
  // filename collides, so a filename lookup would miss on the second run and
  // upload a duplicate every time.
  const existing = await payload.find({
    collection: 'media',
    where: { seedKey: { equals: spec.key } },
    limit: 1,
    overrideAccess: true,
  })

  const data = await spec.build()

  /*
   * An existing record gets its FILE replaced rather than being deleted and
   * recreated. The id survives, so every page, global and block still points
   * at the right image. Deleting and recreating would orphan those relations
   * and quietly blank out artwork across the site.
   *
   * An editor's own upload is never touched: this only ever matches rows the
   * seed itself created, which are the only ones carrying a `seedKey`.
   */
  const hash = checksum(data)

  if (existing.docs.length > 0) {
    const doc = existing.docs[0]
    const id = doc.id as number

    /*
     * The file is only rewritten when the artwork actually changed.
     *
     * This is what makes re-seeding idempotent. Payload will not reuse a
     * filename that is already taken, and the row being updated holds its own
     * name until the update commits, so passing `file` on every run renamed
     * the image to `plate-1.webp`, then back, then to `-1` again. Prerendered
     * pages kept pointing at the name from the run before and 500'd on their
     * images.
     *
     * Comparing the checksum first means an unchanged plate is never
     * re-uploaded: its filename, its generated sizes and every reference to it
     * survive any number of seed runs untouched. Metadata still converges, so
     * an edited alt string in the spec is picked up without disturbing files.
     */
    if (doc.seedHash === hash && (await primaryFileExists(doc as MediaDoc))) {
      await payload.update({
        collection: 'media',
        id,
        data: { alt: spec.alt, caption: seedCaption, tags: ['placeholder'] },
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
      log(`media: ${doc.filename} (unchanged)`)
      return id
    }

    // The artwork genuinely differs, or the file went missing. Clear the old
    // files off disk first so nothing is stranded in `public/media`.
    await removeMediaFiles(doc as MediaDoc)

    /*
     * Release the row's own filename before rewriting it.
     *
     * Payload treats an occupied filename as a collision and appends `-1`,
     * and the name this row already holds counts as occupied even though we
     * are about to replace it. Parking the row on a throwaway name for one
     * statement means the canonical name is free when the file lands, so the
     * artwork keeps the name the spec asked for instead of drifting to
     * `plate-1.webp` the first time it changes.
     */
    if (doc.filename === spec.filename) {
      await payload.update({
        collection: 'media',
        id,
        data: { filename: `seed-tmp-${spec.key}-${randomBytes(4).toString('hex')}` },
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
    }

    await payload.update({
      collection: 'media',
      id,
      data: { alt: spec.alt, caption: seedCaption, tags: ['placeholder'], seedHash: hash },
      file: {
        data,
        name: spec.filename,
        mimetype: spec.mimeType,
        size: data.byteLength,
      },
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
    log(`media: ${spec.filename} (rewritten)`)
    return id
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: spec.alt,
      caption: seedCaption,
      tags: ['placeholder'],
      seedKey: spec.key,
      seedHash: hash,
    },
    file: {
      data,
      name: spec.filename,
      mimetype: spec.mimeType,
      size: data.byteLength,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })

  log(`media: ${spec.filename}`)
  return created.id as number
}

export const seedMedia = async (payload: Payload) => {
  /*
   * Alt text describes what the image IS, not what it stands in for. A
   * screen-reader user hearing "placeholder for a specimen photograph" learns
   * nothing about the page; hearing "dark water, lit from above" at least
   * matches what a sighted visitor sees.
   */
  const specs: MediaSpec[] = [
    {
      key: 'hero',
      filename: 'placeholder-hero-water.jpg',
      alt: 'Dark water lit from above, the light falling away into depth.',
      build: () => waterPlate(11, 2400, 1600, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'logo',
      filename: 'placeholder-logo.png',
      alt: 'Finquiry logo mark.',
      build: () => placeholderLogo(512),
      mimeType: 'image/png',
    },
    {
      key: 'specimen',
      filename: 'placeholder-specimen.jpg',
      alt: 'Dark water, lit from one side, with the light breaking into bands as it falls.',
      build: () => waterPlate(23, 1600, 1280, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailA',
      filename: 'placeholder-detail-a.jpg',
      alt: 'A close crop of dark water, with a single band of light across it.',
      build: () => waterPlate(37, 900, 900, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailB',
      filename: 'placeholder-detail-b.jpg',
      alt: 'A close crop of dark water, the light falling away towards the lower edge.',
      build: () => waterPlate(53, 900, 900, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquarium',
      filename: 'placeholder-aquarium.jpg',
      alt: 'Dark water lit from above, fading to black at the base.',
      build: () => waterPlate(67, 1600, 1280, 'neutral'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquariumDetail',
      filename: 'placeholder-aquarium-detail.jpg',
      alt: 'A close crop of dark, still water.',
      build: () => waterPlate(83, 900, 900, 'neutral'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'article',
      filename: 'placeholder-article.jpg',
      alt: 'Dark water with shafts of light crossing it.',
      build: () => waterPlate(97, 1600, 1000, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'social',
      filename: 'placeholder-social.jpg',
      alt: 'Dark water lit from above, used as the Finquiry sharing image.',
      build: () => waterPlate(101, 1200, 630, 'warm'),
      mimeType: 'image/jpeg',
    },
  ]

  // Category covers, one per sourcing category.
  for (const category of SOURCING_CATEGORIES) {
    specs.push({
      key: `category-${slugify(category.name)}`,
      filename: `placeholder-category-${slugify(category.name)}.jpg`,
      alt: `Dark water lit from above, shown for ${category.name.toLowerCase()}.`,
      build: () => categoryPlate(category.name, 1200, 1500),
      mimeType: 'image/jpeg',
    })
  }

  const ids: Record<string, number> = {}
  for (const spec of specs) {
    ids[spec.key] = await upsertMedia(payload, spec)
  }
  return ids
}

/* -------------------------------------------------------------------------- */
/* Users                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The first admin's password.
 *
 * There is no default. A constant here would mean that anyone who ran the seed
 * against a real database, which is the documented way to bootstrap one, * created a super-admin account whose password is published in this repository.
 * So: use what the operator supplied, refuse outright in production if they
 * supplied nothing, and in development mint a random one and print it once.
 */
const resolveAdminPassword = (): string => {
  const supplied = process.env.SEED_ADMIN_PASSWORD
  if (supplied && supplied.length > 0) return supplied

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'SEED_ADMIN_PASSWORD is not set. Refusing to create a super-admin account ' +
        'with a default password. Set it to a strong value and run the seed again.',
    )
  }

  const generated = randomBytes(18).toString('base64url')
  log(`user: generated a random admin password for this environment: ${generated}`)
  log('user: save it now. It is not stored anywhere and will not be shown again.')
  return generated
}

export const seedAdminUser = async (payload: Payload) => {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@finquiry.local'

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    log(`user: ${email} (already exists)`)
    return
  }

  // Resolved only once the account is known to be missing, so a re-run neither
  // prints a password nor fails a production seed that has nothing left to do.
  const password = resolveAdminPassword()

  await payload.create({
    collection: 'users',
    data: {
      name: 'Finquiry Admin',
      email,
      password,
      role: 'super-admin',
      active: true,
    },
    overrideAccess: true,
    context: { skipRevalidate: true },
  })

  log(`user: ${email} created, change this password before going live`)
}

/* -------------------------------------------------------------------------- */
/* Taxonomies                                                                  */
/* -------------------------------------------------------------------------- */

export const upsertBySlug = async <
  T extends 'categories' | 'sourcing-categories' | 'pages' | 'posts',
>(
  payload: Payload,
  collection: T,
  slug: string,
  data: Record<string, unknown>,
  { updateExisting = false }: { updateExisting?: boolean } = {},
): Promise<number> => {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id as number
    if (updateExisting) {
      await payload.update({
        collection,
        id,
        data: data as never,
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
    }
    return id
  }

  const created = await payload.create({
    collection,
    data: { ...data, slug } as never,
    overrideAccess: true,
    context: { skipRevalidate: true },
  })
  log(`${collection}: ${slug}`)
  return created.id as number
}

export const seedSourcingCategories = async (payload: Payload, media: Record<string, number>) => {
  const ids: Record<string, number> = {}
  for (const category of SOURCING_CATEGORIES) {
    const slug = slugify(category.name)
    ids[slug] = await upsertBySlug(payload, 'sourcing-categories', slug, {
      name: category.name,
      shortDescription: category.shortDescription,
      availabilityLabel: 'Sourced on request',
      order: category.order,
      active: true,
      coverMedia: media[`category-${slug}`],
    })
  }
  return ids
}

export const seedKnowledgeCategories = async (payload: Payload) => {
  const ids: Record<string, number> = {}
  for (const category of KNOWLEDGE_CATEGORIES) {
    const slug = slugify(category.name)
    ids[slug] = await upsertBySlug(payload, 'categories', slug, {
      name: category.name,
      order: category.order,
    })
  }
  return ids
}

/**
 * The placeholder body every starter article ships with.
 *
 * Exported because `qa/fixtures.ts` restores it on `reset`: the fixture run
 * replaces these bodies with richer test prose, and without a shared
 * definition the two would drift and a reset would leave `[QA FIXTURE]` text
 * sitting in the drafts.
 *
 * `blockStarterDraftPublish` matches on the first sentence, so changing that
 * wording here means changing `STARTER_DRAFT_MARKER` too.
 */
export const starterArticleBody = (excerpt: string) =>
  doc(
    p(
      'This article is a starter draft. Replace this body with the real guidance before publishing.',
    ),
    h('h2', 'What this article will cover'),
    p(excerpt),
  )

export const seedPosts = async (
  payload: Payload,
  categories: Record<string, number>,
  media: Record<string, number>,
) => {
  for (const post of STARTER_POSTS) {
    const slug = slugify(post.title)

    /*
     * Refresh a starter draft, but only while it is still a starter draft.
     *
     * `upsertBySlug` leaves an existing document alone by default, which is
     * right for anything an editor may have touched. Applied to these six it
     * meant they froze at whatever was first written: a copy correction in
     * this file never reached a database that had already been seeded, and
     * stale wording sat in the CMS indefinitely.
     *
     * The compromise is to look at what is actually there. A document that is
     * still an unpublished draft whose body is still the seeded placeholder
     * has had no editorial work done on it, so replacing it loses nothing. The
     * moment somebody writes a real body or publishes it, the condition stops
     * holding and the seed never touches it again.
     */
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      draft: true,
      overrideAccess: true,
    })

    const doc = existing.docs[0]
    const untouched =
      !doc ||
      (doc._status !== 'published' &&
        richTextToPlainText(doc.content as never).includes(STARTER_DRAFT_MARKER))

    await upsertBySlug(
      payload,
      'posts',
      slug,
      {
        title: post.title,
        excerpt: post.excerpt,
        category: categories[post.category],
        featuredImage: media.article,
        // Draft: an editor writes the real article before it is published.
        _status: 'draft',
        content: starterArticleBody(post.excerpt),
      },
      { updateExisting: untouched },
    )
  }
}

export const seedFaqs = async (payload: Payload) => {
  for (const faq of FAQS) {
    const existing = await payload.find({
      collection: 'faqs',
      where: { question: { equals: faq.question } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) continue

    await payload.create({
      collection: 'faqs',
      data: {
        question: faq.question,
        answer: faq.answer as never,
        category: faq.category as never,
        order: faq.order,
        published: true,
      },
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
    log(`faq: ${faq.question.slice(0, 48)}…`)
  }
}
