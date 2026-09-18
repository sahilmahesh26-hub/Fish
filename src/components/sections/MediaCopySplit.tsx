import { Section } from './Section'
import { Button } from '@/components/ui/Button'
import { CmsImage } from '@/components/ui/CmsImage'
import { RichText } from '@/components/ui/RichText'
import { resolveLink } from '@/lib/links'
import { cn } from '@/lib/cn'
import type { MediaCopySplitBlock as MediaCopySplitBlockType, SiteSetting } from '@/payload-types'
import styles from './MediaCopySplit.module.css'

const shapeClass: Record<string, string> = {
  pool: styles.pool,
  oval: styles.oval,
  rect: styles.rect,
}

export const MediaCopySplit = ({
  block,
  settings,
}: {
  block: MediaCopySplitBlockType
  settings: SiteSetting
}) => {
  const cta = resolveLink(block.cta, settings)
  const headingId = `split-${block.id ?? 'block'}`

  return (
    <Section background={block.background} labelledBy={headingId}>
      <div className={cn(styles.layout, block.mediaPosition === 'start' && styles.mediaStart)}>
        <div className={styles.copy}>
          {block.eyebrow ? <p className="u-eyebrow">{block.eyebrow}</p> : null}
          <h2 id={headingId} className={styles.heading}>
            {block.heading}
          </h2>
          {block.content ? <RichText data={block.content} /> : null}
          {cta ? (
            <Button
              href={cta.href}
              external={cta.external}
              size="lg"
              className={styles.cta}
              event="split_cta"
            >
              {cta.label}
            </Button>
          ) : null}
        </div>

        <div className={cn(styles.media, shapeClass[block.mediaShape ?? 'pool'])}>
          <CmsImage
            media={block.media}
            sizes="(max-width: 1023px) 92vw, 560px"
            placeholderLabel="Image"
          />
        </div>
      </div>
    </Section>
  )
}
