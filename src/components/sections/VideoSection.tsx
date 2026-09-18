import { Section } from './Section'
import { RichText } from '@/components/ui/RichText'
import { asMedia } from '@/lib/media'
import type { VideoBlock as VideoBlockType } from '@/payload-types'
import styles from './VideoSection.module.css'

/** Converts a YouTube/Vimeo watch URL into its privacy-friendly embed form. */
const embedUrl = (raw: string): string | null => {
  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v')
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : raw
    }
    if (url.hostname === 'youtu.be') {
      return `https://www.youtube-nocookie.com/embed${url.pathname}`
    }
    if (url.hostname.includes('vimeo.com')) {
      return `https://player.vimeo.com/video${url.pathname}`
    }
    return raw
  } catch {
    return null
  }
}

/**
 * Video block.
 *
 * Never autoplays with sound, always carries a poster so the frame is not blank
 * while loading, and exposes the captions track and transcript the editor
 * supplied.
 */
export const VideoSection = ({ block }: { block: VideoBlockType }) => {
  const headingId = `video-${block.id ?? 'block'}`
  const file = asMedia(block.file)
  const poster = asMedia(block.poster)
  const captions = asMedia(block.captionsTrack)
  const external = block.source === 'external' && block.url ? embedUrl(block.url) : null

  if (!file?.url && !external) return null

  return (
    <Section background={block.background} labelledBy={block.heading ? headingId : undefined}>
      {block.heading ? (
        <h2 id={headingId} className={styles.heading}>
          {block.heading}
        </h2>
      ) : null}

      <div className={styles.frame}>
        {external ? (
          <iframe
            className={styles.embed}
            src={external}
            title={block.heading ?? 'Video'}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video
            className={styles.video}
            controls
            preload="none"
            playsInline
            poster={poster?.url ?? undefined}
          >
            <source src={file?.url ?? ''} type={file?.mimeType ?? 'video/mp4'} />
            {captions?.url ? (
              <track kind="captions" src={captions.url} srcLang="en" label="English" default />
            ) : null}
          </video>
        )}
      </div>

      {block.transcript ? (
        <details className={styles.transcript}>
          <summary className={styles.transcriptSummary}>Read the transcript</summary>
          <RichText data={block.transcript} />
        </details>
      ) : null}
    </Section>
  )
}
