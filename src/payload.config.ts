import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  ParagraphFeature,
  HeadingFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  HorizontalRuleFeature,
  UploadFeature,
  InlineCodeFeature,
} from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { PrivateMedia } from '@/collections/PrivateMedia'
import { Pages } from '@/collections/Pages'
import { Posts } from '@/collections/Posts'
import { Authors } from '@/collections/Authors'
import { Categories } from '@/collections/Categories'
import { SourcingCategories } from '@/collections/SourcingCategories'
import { Deliveries } from '@/collections/Deliveries'
import { AquariumProjects } from '@/collections/AquariumProjects'
import { Testimonials } from '@/collections/Testimonials'
import { FAQs } from '@/collections/FAQs'
import { Enquiries } from '@/collections/Enquiries'

import { SiteSettings } from '@/globals/SiteSettings'
import { Header } from '@/globals/Header'
import { Footer } from '@/globals/Footer'
import { Homepage } from '@/globals/Homepage'
import { isStaff, isAdmin } from '@/access'
import { hasS3Storage, siteUrl } from '@/lib/env'
import { seoFieldsOverride } from '@/fields/seo'
import { pathFor } from '@/lib/preview'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ', Finquiry',
    },
    components: {},
  },

  // Editor features are listed explicitly so an editor cannot paste arbitrary
  // HTML into the page through an unexpected node type.
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      InlineCodeFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      BlockquoteFeature(),
      HorizontalRuleFeature(),
      LinkFeature({
        enabledCollections: ['pages', 'posts', 'deliveries'],
      }),
      UploadFeature({ collections: { media: { fields: [] } } }),
    ],
  }),

  collections: [
    Pages,
    Posts,
    Categories,
    Authors,
    SourcingCategories,
    Deliveries,
    AquariumProjects,
    Testimonials,
    FAQs,
    Enquiries,
    Media,
    PrivateMedia,
    Users,
  ],

  globals: [Homepage, SiteSettings, Header, Footer],

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL ?? '' },
    push: process.env.NODE_ENV !== 'production',
  }),

  secret: process.env.PAYLOAD_SECRET ?? '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,

  // `serverURL` keeps generated links (preview, media, emails) absolute and
  // correct behind a proxy.
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  cors: process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : [],
  csrf: process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : [],

  upload: {
    // 8 MB ceiling on every upload endpoint, matching the limit documented on
    // the enquiry form.
    limits: { fileSize: 8 * 1024 * 1024 },
  },

  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
        admin: {
          group: 'Configuration',
          description: 'Old paths that should forward somewhere new.',
        },
        access: { read: () => true, create: isStaff, update: isStaff, delete: isAdmin },
      },
    }),
    seoPlugin({
      collections: ['pages', 'posts', 'deliveries', 'aquarium-projects', 'sourcing-categories'],
      globals: ['homepage'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title ?? 'Finquiry'}, Finquiry`,
      generateDescription: ({ doc }) =>
        doc?.excerpt ?? doc?.shortDescription ?? doc?.summary ?? doc?.requirement ?? '',
      generateURL: ({ doc, collectionSlug }) =>
        `${siteUrl()}${pathFor(String(collectionSlug ?? 'pages'), String(doc?.slug ?? ''))}`,
      tabbedUI: true,
      // The plugin's `meta` group is the only SEO panel an editor sees; these
      // two extra controls are appended to it rather than duplicated elsewhere.
      fields: seoFieldsOverride,
    }),
    ...(hasS3Storage()
      ? [
          s3Storage({
            collections: {
              media: true,
              // Enquiry uploads stay behind Payload access control: the
              // adapter is enabled without `disablePayloadAccessControl`, so
              // every read is still authorised before the file is served.
              'private-media': true,
            },
            bucket: process.env.S3_BUCKET as string,
            config: {
              region: process.env.S3_REGION,
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: Boolean(process.env.S3_ENDPOINT),
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
              },
            },
          }),
        ]
      : []),
  ],
})
