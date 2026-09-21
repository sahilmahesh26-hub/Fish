import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { isStaff, isAdmin, nobody } from '@/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Reference images uploaded by the public through the sourcing enquiry form.
 *
 * Kept entirely separate from `media` so a customer's reference photo can
 * never surface in the public media library or be listed by the public API.
 * Files are written outside `public/`, and reads require an authenticated
 * staff session, see `src/app/(frontend)/api/private-media/[id]/route.ts`.
 */
export const PrivateMedia: CollectionConfig = {
  slug: 'private-media',
  labels: { singular: 'Enquiry upload', plural: 'Enquiry uploads' },
  admin: {
    group: 'Enquiries',
    description: 'Customer reference images. Private — never rendered on the public site.',
    defaultColumns: ['filename', 'createdAt'],
  },
  access: {
    read: isStaff,
    // Records are only ever created by the vetted server action that handles
    // the enquiry form, which runs with `overrideAccess: true`.
    create: nobody,
    update: nobody,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../private-uploads'),
    // Deliberately narrow: raster images only. No SVG (script-carrying),
    // no PDFs, no archives.
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    // 8 MB, matching the documented limit shown on the form.
    filesRequiredOnCreate: true,
    disableLocalStorage: false,
    imageSizes: [{ name: 'preview', width: 900, withoutEnlargement: true }],
  },
  fields: [
    {
      name: 'enquiryRequestId',
      type: 'text',
      index: true,
      admin: { readOnly: true, description: 'Request ID this upload belongs to.' },
    },
  ],
}
