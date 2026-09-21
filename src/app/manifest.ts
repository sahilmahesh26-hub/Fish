import type { MetadataRoute } from 'next'

/**
 * Web app manifest.
 *
 * Deliberately minimal: Finquiry is a website, not an installable app. The
 * manifest exists so Android and desktop browsers have a real name, colour and
 * icon set to work with rather than guessing from the page.
 */
const manifest = (): MetadataRoute.Manifest => ({
  name: 'Finquiry, Collector Fish Sourcing Across India',
  short_name: 'Finquiry',
  description:
    'Tell Finquiry the species, variety, colour and size you are searching for. Review actual specimen photos, videos and individual pricing before approval.',
  start_url: '/',
  display: 'browser',
  background_color: '#F5F0E8',
  theme_color: '#F5F0E8',
  lang: 'en-IN',
  categories: ['shopping', 'lifestyle'],
  icons: [
    { src: '/icon-32.png', sizes: '32x32', type: 'image/png' },
    { src: '/icon-48.png', sizes: '48x48', type: 'image/png' },
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
})

export default manifest
