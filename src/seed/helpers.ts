import type { Payload } from 'payload'
import { doc, p, h } from './lexical'
import { placeholderPanel, placeholderFish, placeholderLogo } from './placeholders'
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

  if (existing.docs.length > 0) return existing.docs[0].id as number

  const data = await spec.build()
  const created = await payload.create({
    collection: 'media',
    data: {
      alt: spec.alt,
      caption: 'Placeholder artwork — replace with a real image.',
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
  const specs: MediaSpec[] = [
    {
      key: 'fish',
      filename: 'placeholder-hero-fish.png',
      alt: 'Placeholder illustration of a fish. Replace with a real specimen cutout.',
      build: placeholderFish,
      mimeType: 'image/png',
    },
    {
      key: 'logo',
      filename: 'placeholder-logo.png',
      alt: 'Finquiry placeholder logo mark.',
      build: () => placeholderLogo(512),
      mimeType: 'image/png',
    },
    {
      key: 'specimen',
      filename: 'placeholder-specimen.jpg',
      alt: 'Placeholder for a specimen photograph.',
      build: () => placeholderPanel('Specimen photograph', 1600, 1280),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailA',
      filename: 'placeholder-detail-a.jpg',
      alt: 'Placeholder for a specimen detail crop.',
      build: () => placeholderPanel('Detail crop', 900, 900),
      mimeType: 'image/jpeg',
    },
    {
      key: 'detailB',
      filename: 'placeholder-detail-b.jpg',
      alt: 'Placeholder for a second specimen detail crop.',
      build: () => placeholderPanel('Detail crop', 900, 900),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquarium',
      filename: 'placeholder-aquarium.jpg',
      alt: 'Placeholder for a custom aquarium photograph.',
      build: () => placeholderPanel('Custom aquarium', 1600, 1280),
      mimeType: 'image/jpeg',
    },
    {
      key: 'aquariumDetail',
      filename: 'placeholder-aquarium-detail.jpg',
      alt: 'Placeholder for an aquarium equipment detail.',
      build: () => placeholderPanel('Equipment detail', 900, 900),
      mimeType: 'image/jpeg',
    },
    {
      key: 'article',
      filename: 'placeholder-article.jpg',
      alt: 'Placeholder for an article image.',
      build: () => placeholderPanel('Article image', 1600, 1000),
      mimeType: 'image/jpeg',
    },
    {
      key: 'social',
      filename: 'placeholder-social.jpg',
      alt: 'Placeholder social sharing image for Finquiry.',
      build: () => placeholderPanel('Finquiry — social preview', 1200, 630),
      mimeType: 'image/jpeg',
    },
  ]

  // Category covers, one per sourcing category.
  for (const category of SOURCING_CATEGORIES) {
    specs.push({
      key: `category-${slugify(category.name)}`,
      filename: `placeholder-category-${slugify(category.name)}.jpg`,
      alt: `Placeholder image for the ${category.name} sourcing category.`,
      build: () => placeholderPanel(category.name, 1200, 900),
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

export const seedAdminUser = async (payload: Payload) => {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@finquiry.local'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!2026'

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

  log(`user: ${email} created — change this password before going live`)
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
