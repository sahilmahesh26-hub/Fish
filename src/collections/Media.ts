import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone, isStaff, isAdmin } from '@/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Image formats accepted for public media. SVG is deliberately excluded —
 *  see PrivateMedia notes in PAYLOAD.md. */
const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const VIDEO_MIME = ['video/mp4', 'video/webm']
const TRACK_MIME = ['text/vtt']

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    description: 'Public images and video used across the website.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: [...IMAGE_MIME, ...VIDEO_MIME, ...TRACK_MIME],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
    // `withoutEnlargement` keeps a small source file from being upscaled into
    // a blurry "large" size.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        withoutEnlargement: true,
      },
      { name: 'card', width: 768, withoutEnlargement: true },
      { name: 'tablet', width: 1024, withoutEnlargement: true },
      { name: 'desktop', width: 1600, withoutEnlargement: true },
      { name: 'wide', width: 2400, withoutEnlargement: true },
      {
        name: 'social',
        width: 1200,
        height: 630,
        position: 'centre',
        withoutEnlargement: false,
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
  fields: [
    {
      name: 'decorative',
      type: 'checkbox',
      defaultValue: false,
      label: 'Decorative only',
      admin: {
        description:
          'Tick for images that carry no information. Assistive technology will ignore them and no alt text is needed.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        condition: (data) => !data?.decorative,
        description:
          'Describe what the image shows and why it matters. Required for meaningful images.',
      },
      validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
        if (data?.decorative) return true
        const mimeType = data?.mimeType
        // Only still images and video need alt text; caption tracks do not.
        if (typeof mimeType === 'string' && mimeType.startsWith('text/')) return true
        if (typeof value !== 'string' || value.trim().length === 0) {
          return 'Add alt text, or tick "Decorative only".'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Shown under the image where supported.' },
    },
    { name: 'credit', type: 'text', label: 'Credit / source' },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: { description: 'Free-form labels to help find this file later.' },
    },
    {
      name: 'seedKey',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Set by the seed script so re-seeding updates this file instead of uploading a duplicate. Leave blank for files you upload yourself.',
      },
    },
    {
      name: 'seedHash',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description:
          'Checksum of the artwork the seed last wrote here. The seed compares it before touching the file, so re-running the seed leaves an unchanged image completely alone. Blank for files you upload yourself.',
      },
    },
  ],
}
