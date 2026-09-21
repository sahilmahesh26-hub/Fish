import { randomBytes } from 'node:crypto'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'
import { doc, p, h } from './lexical'
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

type MediaDoc = { filename?: string | null; sizes?: Record<string, { filename?: string | null }> }

/**
 * Delete a media document's files, original and every generated size.
 *
 * Payload will not reuse a filename that is already taken, so re-seeding
 * republishes the artwork under a suffixed name and the previous file is left
 * behind in `public/media`. Left alone that accumulates: this project reached
 * 31 stranded `-1`, `-2`, `-3` copies of the same eight plates.
 *
 * This clears them, so each seeded image keeps exactly one file on disk. The
 * name itself still alternates between `plate.webp` and `plate-1.webp` from
 * run to run, because the collision is with the row being updated and its own
 * name is not free until the update commits. That is why the seed revalidates
 * the running site afterwards: a page prerendered against the previous name
 * will 500 on its images until it is refreshed.
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
  if (existing.docs.length > 0) {
    const doc = existing.docs[0]
    const id = doc.id as number
    // Clear the old files off disk BEFORE writing the new ones. Payload will
    // not overwrite an occupied filename, it appends `-1`, `-2` and so on, so
    // without this every re-seed renames the image, strands the previous file
    // in `public/media`, and breaks any HTML still pointing at the old name
    // until the next full rebuild. See `removeMediaFiles`.
    await removeMediaFiles(doc as MediaDoc)
    await payload.update({
      collection: 'media',
      id,
      data: { alt: spec.alt, caption: seedCaption, tags: ['placeholder'] },
      file: {
        data,
        name: spec.filename,
        mimetype: spec.mimeType,
        size: data.byteLength,
      },
      overrideAccess: true,
      context: { skipRevalidate: true },
    })
    log(`media: ${spec.filename} (refreshed)`)
    return id
  }

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: spec.alt,
      caption: seedCaption,
      tags: ['placeholder'],
      seedKey: spec.key,
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
      alt: 'Dark water, awaiting a specimen photograph.',
      build: () => waterPlate(23, 1600, 1280, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailA',
      filename: 'placeholder-detail-a.jpg',
      alt: 'Dark water, awaiting a detail crop.',
      build: () => waterPlate(37, 900, 900, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailB',
      filename: 'placeholder-detail-b.jpg',
      alt: 'Dark water, awaiting a second detail crop.',
      build: () => waterPlate(53, 900, 900, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquarium',
      filename: 'placeholder-aquarium.jpg',
      alt: 'Dark water, awaiting a custom aquarium photograph.',
      build: () => waterPlate(67, 1600, 1280, 'neutral'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquariumDetail',
      filename: 'placeholder-aquarium-detail.jpg',
      alt: 'Dark water, awaiting an equipment detail.',
      build: () => waterPlate(83, 900, 900, 'neutral'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'article',
      filename: 'placeholder-article.jpg',
      alt: 'Dark water, awaiting an article image.',
      build: () => waterPlate(97, 1600, 1000, 'cold'),
      mimeType: 'image/jpeg',
    },
    {
      key: 'social',
      filename: 'placeholder-social.jpg',
      alt: 'Dark water, used as a social sharing image.',
      build: () => waterPlate(101, 1200, 630, 'warm'),
      mimeType: 'image/jpeg',
    },
  ]

  // Category covers, one per sourcing category.
  for (const category of SOURCING_CATEGORIES) {
    specs.push({
      key: `category-${slugify(category.name)}`,
      filename: `placeholder-category-${slugify(category.name)}.jpg`,
      alt: `Dark water, awaiting photography for ${category.name}.`,
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

export const seedPosts = async (
  payload: Payload,
  categories: Record<string, number>,
  media: Record<string, number>,
) => {
  for (const post of STARTER_POSTS) {
    const slug = slugify(post.title)
    await upsertBySlug(payload, 'posts', slug, {
      title: post.title,
      excerpt: post.excerpt,
      category: categories[post.category],
      featuredImage: media.article,
      // Draft: an editor writes the real article before it is published.
      _status: 'draft',
      content: doc(
        p(
          'This article is a starter draft. Replace this body with the real guidance before publishing.',
        ),
        h('h2', 'What this article will cover'),
        p(post.excerpt),
      ),
    })
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
