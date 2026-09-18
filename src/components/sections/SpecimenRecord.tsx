import { Section } from './Section'
import { SectionHeading } from './SectionHeading'
import { CmsImage } from '@/components/ui/CmsImage'
import { SpecimenStamp } from '@/components/art/SpecimenStamp'
import { MeasurementMark } from '@/components/art/Shapes'
import type { SpecimenRecordBlock as SpecimenRecordBlockType } from '@/payload-types'
import styles from './SpecimenRecord.module.css'

const MEDIA_STATUS_LABEL: Record<string, string> = {
  confirmed: 'Photos and video confirmed',
  partial: 'Photos confirmed · video pending',
  pending: 'Awaiting media',
}

/**
 * A collector's specimen sheet.
 *
 * Every row is driven by CMS data and omitted when blank. When no media has
 * been uploaded the component shows an explicitly labelled placeholder — it
 * never fabricates a specimen, a measurement or an origin to fill the layout.
 */
export const SpecimenRecord = ({ block }: { block: SpecimenRecordBlockType }) => {
  const record = block.record
  const details = [
    record?.measurement ? { label: 'Approximate size', value: record.measurement } : null,
    record?.origin ? { label: 'Origin', value: record.origin } : null,
    record?.mediaStatus
      ? { label: 'Media', value: MEDIA_STATUS_LABEL[record.mediaStatus] ?? record.mediaStatus }
      : null,
    record?.notes ? { label: 'Notes', value: record.notes } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))

  const headingId = `specimen-${block.id ?? 'record'}`
  const details2 = block.detailImages ?? []

  return (
    <Section background={block.background} labelledBy={headingId}>
      <SectionHeading
        eyebrow={block.eyebrow}
        heading={block.heading}
        body={block.body}
        id={headingId}
      />

      <div className={styles.sheet}>
        <figure className={styles.mainFigure}>
          <div className={styles.mainImage}>
            <CmsImage
              media={block.mainImage}
              sizes="(max-width: 1023px) 92vw, 620px"
              placeholderLabel="Specimen photograph — added per enquiry"
            />
          </div>
          <MeasurementMark className={styles.measurement} />
          {record?.measurement ? (
            <figcaption className={styles.measurementCaption}>{record.measurement}</figcaption>
          ) : null}
        </figure>

        <div className={styles.side}>
          {record?.requestId ? (
            <SpecimenStamp label="Request" value={record.requestId} className={styles.stamp} />
          ) : null}

          <div className={styles.crops}>
            {details2.length > 0
              ? details2.map((detail, index) => (
                  <figure key={detail.id ?? index} className={styles.crop}>
                    <CmsImage media={detail.image} sizes="180px" />
                    {detail.caption ? (
                      <figcaption className={styles.cropCaption}>{detail.caption}</figcaption>
                    ) : null}
                  </figure>
                ))
              : [0, 1].map((index) => (
                  <div key={index} className={styles.crop}>
                    <CmsImage media={null} placeholderLabel="Detail crop" />
                  </div>
                ))}
          </div>

          {details.length > 0 ? (
            <dl className={styles.record}>
              {details.map((item) => (
                <div key={item.label} className={styles.recordRow}>
                  <dt className={styles.recordLabel}>{item.label}</dt>
                  <dd className={styles.recordValue}>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {block.note ? <p className={styles.note}>{block.note}</p> : null}
        </div>
      </div>
    </Section>
  )
}
