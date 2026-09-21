import Link from 'next/link'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { resolveLink } from '@/lib/links'
import { getPosts, getPostsByIds } from '@/lib/queries'
import type {
  FeaturedArticlesBlock as FeaturedArticlesBlockType,
  SiteSetting,
  Post,
} from '@/payload-types'
import styles from './FeaturedArticles.module.css'

const categoryName = (post: Post): string | null =>
  typeof post.category === 'object' && post.category ? post.category.name : null

/** Magazine shelf: one lead article and a stack of supporting ones. */
export const FeaturedArticles = async ({
  block,
  settings,
}: {
  block: FeaturedArticlesBlockType
  settings: SiteSetting
}) => {
  const ids = (block.posts ?? []).map((item) => (typeof item === 'object' ? item.id : item))
  const posts =
    block.mode === 'selected'
      ? await getPostsByIds(ids)
      : (await getPosts({ limit: block.limit ?? 4 })).docs

  const isEmpty = posts.length === 0
  if (isEmpty && block.emptyState?.behaviour === 'hide') return null

  const [lead, ...supporting] = posts
  const cta = resolveLink(block.cta, settings)
  const headingId = `articles-${block.id ?? 'featured'}`

  return (
    <Section background={block.background} labelledBy={headingId}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      {isEmpty ? (
        <div className={styles.empty}>
          <p className={styles.emptyHeading}>
            {block.emptyState?.heading ?? 'The first guides are being written.'}
          </p>
          {block.emptyState?.body ? (
            <p className={styles.emptyBody}>{block.emptyState.body}</p>
          ) : null}
        </div>
      ) : (
        <div className={styles.shelf}>
          <article className={styles.lead}>
            <Link href={`/knowledge/${lead.slug}`} className={styles.leadLink}>
              <div className={styles.leadMedia}>
                <CmsImage
                  media={lead.featuredImage}
                  sizes="(max-width: 1023px) 92vw, 640px"
                  fallbackLabel="Article image"
                />
              </div>
              <div className={styles.leadBody}>
                <p className={styles.meta}>
                  {categoryName(lead) ? (
                    <span className={styles.category}>{categoryName(lead)}</span>
                  ) : null}
                  {lead.readingTime ? <span>{lead.readingTime} min read</span> : null}
                </p>
                <h3 className={styles.leadTitle}>{lead.title}</h3>
                <p className={styles.excerpt}>{lead.excerpt}</p>
              </div>
            </Link>
          </article>

          {supporting.length > 0 ? (
            <ul className={styles.supporting} role="list">
              {supporting.map((post) => (
                <li key={post.id}>
                  <Link href={`/knowledge/${post.slug}`} className={styles.supportingLink}>
                    <div className={styles.supportingMedia}>
                      <CmsImage media={post.featuredImage} sizes="140px" fallbackLabel="Image" />
                    </div>
                    <div className={styles.supportingBody}>
                      <p className={styles.meta}>
                        {categoryName(post) ? (
                          <span className={styles.category}>{categoryName(post)}</span>
                        ) : null}
                        {post.readingTime ? <span>{post.readingTime} min</span> : null}
                      </p>
                      <h3 className={styles.supportingTitle}>{post.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      {cta ? (
        <div className={styles.cta}>
          <Button href={cta.href} external={cta.external} size="lg" event="knowledge_cta">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
