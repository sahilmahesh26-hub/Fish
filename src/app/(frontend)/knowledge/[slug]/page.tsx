import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getPosts, getSiteSettings } from '@/lib/queries'
import { buildMetadata } from '@/lib/seo'
import { articleSchema, breadcrumbSchema } from '@/lib/schema'
import { PageHero } from '@/components/sections/PageHero'
import { Section } from '@/components/sections/Section'
import { RichText } from '@/components/ui/RichText'
import { CmsImage } from '@/components/ui/CmsImage'
import { JsonLd } from '@/components/ui/JsonLd'
import { DraftBanner } from '@/components/ui/DraftBanner'
import { Cta } from '@/components/sections/Cta'
import type { Post } from '@/payload-types'
import styles from './article.module.css'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = async () => {
  const { docs } = await getPosts({ limit: 200 })
  return docs.map((post) => ({ slug: post.slug as string }))
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()])
  if (!post) return {}

  return buildMetadata({
    meta: post.meta,
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    path: `/knowledge/${slug}`,
    settings,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()])
  if (!post) notFound()

  const category = typeof post.category === 'object' && post.category ? post.category : null
  const author = typeof post.author === 'object' && post.author ? post.author : null

  // Editor-chosen related posts, falling back to the newest in the same category.
  const explicitRelated = (post.relatedPosts ?? []).filter(
    (item): item is Post => typeof item === 'object' && item !== null,
  )
  const related =
    explicitRelated.length > 0
      ? explicitRelated
      : (
          await getPosts({
            limit: 3,
            categorySlug: category?.slug ?? undefined,
            excludeId: post.id,
          })
        ).docs

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Knowledge Hub', path: '/knowledge' },
    { name: post.title, path: `/knowledge/${slug}` },
  ]

  return (
    <>
      {post._status === 'draft' ? <DraftBanner label="article" /> : null}

      <PageHero
        eyebrow={category?.name ?? 'Knowledge'}
        heading={post.title}
        intro={post.excerpt}
        breadcrumbs={trail}
      />

      <Section background="linen">
        <div className={styles.layout}>
          <article className={styles.article}>
            {post.featuredImage ? (
              <figure className={styles.figure}>
                <div className={styles.featured}>
                  <CmsImage
                    media={post.featuredImage}
                    priority
                    sizes="(max-width: 1023px) 92vw, 760px"
                  />
                </div>
              </figure>
            ) : null}

            <RichText data={post.content} className={styles.prose} />
          </article>

          <aside className={styles.meta} aria-label="Article details">
            <dl className={styles.metaList}>
              {author ? (
                <div>
                  <dt>Written by</dt>
                  <dd>{author.name}</dd>
                </div>
              ) : null}
              {post.publishedAt ? (
                <div>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </dd>
                </div>
              ) : null}
              {post.readingTime ? (
                <div>
                  <dt>Reading time</dt>
                  <dd>{post.readingTime} minutes</dd>
                </div>
              ) : null}
              {category ? (
                <div>
                  <dt>Category</dt>
                  <dd>
                    <Link href={`/knowledge?category=${category.slug}`}>{category.name}</Link>
                  </dd>
                </div>
              ) : null}
            </dl>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section background="linen-raised" labelledBy="related-heading">
          <h2 id="related-heading" className={styles.relatedHeading}>
            Related reading
          </h2>
          <ul className={styles.related} role="list">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/knowledge/${item.slug}`} className={styles.relatedLink}>
                  <span className={styles.relatedTitle}>{item.title}</span>
                  <span className={styles.relatedExcerpt}>{item.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Cta
        block={{
          id: 'article-cta',
          blockType: 'cta',
          background: 'scarlet',
          heading: 'Looking for a specific fish?',
          body: 'Tell us the species, variety, size and destination. We will search our network and share what we can genuinely confirm.',
          primaryCta: { label: 'Start Your Search', type: 'internal', href: '/source-a-fish' },
          secondaryCta: { label: 'Talk to Us on WhatsApp', type: 'whatsapp' },
        }}
        settings={settings}
      />

      <JsonLd data={articleSchema(post, settings)} />
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}

export default ArticlePage
