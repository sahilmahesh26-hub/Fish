import type { Metadata } from 'next'
import Link from 'next/link'
import { getPosts, getPageBySlug, getSiteSettings, getCategories } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { CmsImage } from '@/components/ui/CmsImage'
import { JsonLd } from '@/components/ui/JsonLd'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import type { Post } from '@/payload-types'
import styles from './knowledge.module.css'

type Props = { searchParams: Promise<{ category?: string }> }

const TRAIL = [
  { name: 'Home', path: '/' },
  { name: 'Knowledge Hub', path: '/knowledge' },
]

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
  const [{ category }, page, settings] = await Promise.all([
    searchParams,
    getPageBySlug('knowledge'),
    getSiteSettings(),
  ])
  return buildMetadata({
    meta: page?.meta,
    title: page?.title ?? 'Knowledge Hub',
    description: page?.hero?.intro,
    // The canonical is always the unfiltered listing, so a filtered view
    // consolidates into it rather than competing with it.
    path: '/knowledge',
    settings,
    forceNoIndex: Boolean(category),
  })
}

const categoryName = (post: Post) =>
  typeof post.category === 'object' && post.category ? post.category.name : null

const KnowledgePage = async ({ searchParams }: Props) => {
  const { category } = await searchParams
  const [page, settings, categories, result] = await Promise.all([
    getPageBySlug('knowledge'),
    getSiteSettings(),
    getCategories(),
    getPosts({ limit: 24, categorySlug: category }),
  ])

  const posts = result.docs

  return (
    <>
      <PageHero
        eyebrow={page?.hero?.eyebrow ?? 'Collector knowledge'}
        heading={page?.hero?.heading ?? page?.title ?? 'Knowledge Hub'}
        intro={page?.hero?.intro}
        breadcrumbs={TRAIL}
      />

      <Section background="linen">
        <nav aria-label="Article categories" className={styles.filters}>
          <ul role="list" className={styles.filterList}>
            <li>
              <Link
                href="/knowledge"
                className={styles.filter}
                aria-current={!category ? 'page' : undefined}
              >
                All
              </Link>
            </li>
            {categories.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/knowledge?category=${item.slug}`}
                  className={styles.filter}
                  aria-current={category === item.slug ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {posts.length === 0 ? (
          <p className={styles.empty}>
            {category
              ? 'No published article matches this category yet. Try another category.'
              : 'The first guides are being written. Check back shortly, or start a sourcing request and ask us directly.'}
          </p>
        ) : (
          <ul className={styles.grid} role="list">
            {posts.map((post) => (
              <li key={post.id} className={styles.card}>
                <Link href={`/knowledge/${post.slug}`} className={styles.cardLink}>
                  <div className={styles.media}>
                    <CmsImage
                      media={post.featuredImage}
                      sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 380px"
                      placeholderLabel="Article image"
                    />
                  </div>
                  <div className={styles.body}>
                    <p className={styles.meta}>
                      {categoryName(post) ? (
                        <span className={styles.category}>{categoryName(post)}</span>
                      ) : null}
                      {post.readingTime ? <span>{post.readingTime} min read</span> : null}
                    </p>
                    <h2 className={styles.title}>{post.title}</h2>
                    <p className={styles.excerpt}>{post.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <RenderBlocks blocks={page?.layout} settings={settings} />

      <JsonLd data={breadcrumbSchema(TRAIL)} />
    </>
  )
}

export default KnowledgePage
