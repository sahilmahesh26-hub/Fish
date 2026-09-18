import { Section } from './Section'
import { CmsImage } from '@/components/ui/CmsImage'
import type { ImageGalleryBlock as ImageGalleryBlockType } from '@/payload-types'
import styles from './ImageGallery.module.css'

export const ImageGallery = ({ block }: { block: ImageGalleryBlockType }) => {
  const images = block.images ?? []
  if (images.length === 0) return null
  const headingId = `gallery-${block.id ?? 'block'}`

  return (
    <Section background={block.background} labelledBy={block.heading ? headingId : undefined}>
      {block.heading ? (
        <h2 id={headingId} className={styles.heading}>
          {block.heading}
        </h2>
      ) : null}

      <ul className={styles.grid} role="list">
        {images.map((item, index) => (
          <li key={item.id ?? index} className={styles.item}>
            <figure className={styles.figure}>
              <div className={styles.media}>
                <CmsImage
                  media={item.image}
                  sizes="(max-width: 767px) 92vw, (max-width: 1279px) 46vw, 400px"
                />
              </div>
              {item.caption ? (
                <figcaption className={styles.caption}>{item.caption}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  )
}
