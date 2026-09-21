import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { whatsappLink, enquiryWhatsappMessage, resolveWhatsappNumber } from '@/lib/whatsapp'
import { resolveLink } from '@/lib/links'
import { slugify } from '@/fields/slug'
import { richTextToPlainText, richTextExcerpt } from '@/lib/richText'
import { renderEmphasis, stripEmphasis } from '@/lib/emphasis'
import { checkRateLimit, resetRateLimits } from '@/lib/rateLimit'
import { mediaSrc, altFor, isDecorative } from '@/lib/media'
import { buildMetadata } from '@/lib/seo'
import { isProductionOrigin } from '@/lib/env'
import type { SiteSetting } from '@/payload-types'

const settings = {
  whatsappNumber: '919845012345',
  whatsappDefaultMessage: 'Hello Finquiry',
} as SiteSetting

describe('whatsappLink', () => {
  it('builds a wa.me link with the encoded default message', () => {
    const link = whatsappLink(settings)
    expect(link).toBe('https://wa.me/919845012345?text=Hello%20Finquiry')
  })

  it('returns null when no number is configured anywhere', () => {
    const previous = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    expect(whatsappLink({} as SiteSetting)).toBeNull()
    if (previous) process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = previous
  })

  it('strips non-digits from the configured number', () => {
    const link = whatsappLink({ ...settings, whatsappNumber: '+91 98450-12345' } as SiteSetting)
    expect(link).toContain('wa.me/919845012345')
  })
})

describe('enquiryWhatsappMessage', () => {
  it('carries the request ID and the fish, and nothing else', () => {
    const message = enquiryWhatsappMessage('FQ-2609-0001', 'Super red arowana')
    expect(message).toContain('FQ-2609-0001')
    expect(message).toContain('Super red arowana')
    // Must never leak the customer's own contact details.
    expect(message).not.toMatch(/\b\d{10}\b/)
  })
})

describe('resolveLink', () => {
  it('returns null without a label, so nothing renders', () => {
    expect(resolveLink({ type: 'internal', href: '/x' }, settings)).toBeNull()
  })

  it('resolves an internal link', () => {
    expect(resolveLink({ label: 'Go', type: 'internal', href: '/about' }, settings)).toEqual({
      label: 'Go',
      href: '/about',
      external: false,
    })
  })

  it('marks an external link as external', () => {
    const link = resolveLink({ label: 'Go', type: 'external', url: 'https://example.com' }, settings)
    expect(link?.external).toBe(true)
  })

  it('returns null for a WhatsApp link when no number is configured', () => {
    const previous = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    expect(resolveLink({ label: 'Chat', type: 'whatsapp' }, {} as SiteSetting)).toBeNull()
    if (previous) process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = previous
  })
})

describe('slugify', () => {
  it.each([
    ['Super Red Arowana', 'super-red-arowana'],
    ['  Spaces  Everywhere  ', 'spaces-everywhere'],
    ['Punctuation!? & symbols', 'punctuation-symbols'],
    ['Already-slugged', 'already-slugged'],
    ['Accented Café', 'accented-cafe'],
  ])('slugifies %s', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })
})

describe('richText helpers', () => {
  const doc = {
    root: {
      type: 'root',
      children: [
        { type: 'heading', tag: 'h2', children: [{ text: 'A heading' }] },
        { type: 'paragraph', children: [{ text: 'Some body copy here.' }] },
      ],
    },
  }

  it('extracts plain text', () => {
    expect(richTextToPlainText(doc)).toBe('A heading Some body copy here.')
  })

  it('returns an empty string for missing content', () => {
    expect(richTextToPlainText(null)).toBe('')
    expect(richTextToPlainText(undefined)).toBe('')
  })

  it('truncates an excerpt on a word boundary', () => {
    const long = {
      root: { type: 'root', children: [{ type: 'paragraph', children: [{ text: 'word '.repeat(80) }] }] },
    }
    const excerpt = richTextExcerpt(long, 50)
    expect(excerpt.length).toBeLessThanOrEqual(51)
    expect(excerpt.endsWith('…')).toBe(true)
  })
})

describe('headline emphasis', () => {
  it('splits the marked run out of the headline', () => {
    const parts = renderEmphasis('Every Collector Is *Searching* for Something.', 'em')
    expect(parts).toHaveLength(3)
  })

  it('strips the markers for plain-text use', () => {
    expect(stripEmphasis('Every *Collector* Is')).toBe('Every Collector Is')
  })

  it('handles an absent headline', () => {
    expect(renderEmphasis(undefined, 'em')).toEqual([])
    expect(stripEmphasis(null)).toBe('')
  })
})

describe('rate limit', () => {
  beforeEach(() => resetRateLimits())

  it('allows up to the limit then blocks', () => {
    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit('test').allowed).toBe(true)
    }
    const blocked = checkRateLimit('test')
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks each key separately', () => {
    for (let i = 0; i < 5; i += 1) checkRateLimit('a')
    expect(checkRateLimit('a').allowed).toBe(false)
    expect(checkRateLimit('b').allowed).toBe(true)
  })

  it('resets after the window passes', async () => {
    checkRateLimit('short', { windowMs: 5, max: 1 })
    expect(checkRateLimit('short', { windowMs: 5, max: 1 }).allowed).toBe(false)
    // Wait past the window rather than relying on same-millisecond timing.
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(checkRateLimit('short', { windowMs: 5, max: 1 }).allowed).toBe(true)
  })
})

describe('media helpers', () => {
  it('rewrites a same-origin absolute URL to a path', () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_SITE_URL = 'https://finquiry.test'
    expect(mediaSrc('https://finquiry.test/api/media/file/a.webp')).toBe('/api/media/file/a.webp')
    // A genuinely remote host is left alone.
    expect(mediaSrc('https://cdn.example.com/a.webp')).toBe('https://cdn.example.com/a.webp')
    expect(mediaSrc('/already/relative.webp')).toBe('/already/relative.webp')
    expect(mediaSrc(null)).toBeNull()
    process.env.NEXT_PUBLIC_SITE_URL = previous
  })

  it('returns empty alt text for decorative images', () => {
    expect(altFor({ url: '/a.png', decorative: true, alt: 'ignored' } as never)).toBe('')
    expect(isDecorative({ url: '/a.png', decorative: true } as never)).toBe(true)
  })

  it('treats an image with no alt text as decorative rather than inventing one', () => {
    expect(isDecorative({ url: '/a.png' } as never)).toBe(true)
    expect(altFor({ url: '/a.png', alt: 'A red fish' } as never)).toBe('A red fish')
  })
})

describe('env', () => {
  /*
   * `src/lib/env.ts` is reachable from `payload.config`, which the CLI scripts
   * load outside Next's bundler — so it cannot carry a `server-only` guard.
   * This is the guard instead: whatever else it grows, it must never hand back
   * the value of a credential.
   */
  const SECRET_VARS = [
    'PAYLOAD_SECRET',
    'DATABASE_URL',
    'PREVIEW_SECRET',
    'REVALIDATION_SECRET',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'SMTP_USER',
    'SMTP_PASS',
    'SEED_ADMIN_PASSWORD',
  ]

  it('never returns the value of a credential', async () => {
    const sentinels = Object.fromEntries(
      SECRET_VARS.map((name, i) => [name, `sentinel-value-${i}-do-not-leak`]),
    )
    const previous: Record<string, string | undefined> = {}
    for (const [name, value] of Object.entries(sentinels)) {
      previous[name] = process.env[name]
      process.env[name] = value
    }

    try {
      const env = await import('@/lib/env')
      const returned = Object.entries(env)
        .filter(([, value]) => typeof value === 'function')
        // `requireEnv`/`optionalEnv` take a name and are the intended way to
        // read a secret at a server-side call site, so they are not the risk —
        // the zero-argument helpers are, because anything may call them.
        .filter(([, fn]) => (fn as (...args: never[]) => unknown).length === 0)
        .map(([name, fn]) => [name, (fn as () => unknown)()] as const)

      // Without this the test passes trivially if the filter ever stops
      // matching anything.
      expect(returned.map(([name]) => name)).toEqual(
        expect.arrayContaining(['siteUrl', 'hasS3Storage', 'hasSmtp']),
      )

      for (const [name, value] of returned) {
        const serialised = JSON.stringify(value) ?? ''
        for (const secret of Object.values(sentinels)) {
          expect(serialised, `${name}() returned a credential`).not.toContain(secret)
        }
      }
    } finally {
      for (const [name, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[name]
        else process.env[name] = value
      }
    }
  })
})

describe('analytics', () => {
  it('sends only the agreed event names', async () => {
    const { ANALYTICS_EVENTS } = await import('@/lib/analytics')
    expect(Object.values(ANALYTICS_EVENTS).sort()).toEqual(
      [
        'article_viewed',
        'custom_aquarium_cta_clicked',
        'delivery_story_viewed',
        'enquiry_form_started',
        'enquiry_step_completed',
        'enquiry_submitted',
        'page_view',
        'request_confirmation_viewed',
        'start_search_click',
        'whatsapp_click',
      ].sort(),
    )
  })

  it('never puts a request ID or requirement text in a page path', async () => {
    const { analyticsPath } = await import('@/components/layout/Analytics')

    // Exactly how the confirmation page is reached after a submission.
    const confirmation = new URLSearchParams({
      request: 'FQ-1234-5678',
      fish: 'Super red arowana, 14-16 inches, even gill plate colour',
    })
    const path = analyticsPath('/thank-you', confirmation)

    expect(path).toBe('/thank-you')
    expect(path).not.toContain('FQ-1234-5678')
    expect(path).not.toContain('arowana')
  })

  it('keeps the navigational parameters that distinguish a listing view', async () => {
    const { analyticsPath } = await import('@/components/layout/Analytics')
    const filtered = new URLSearchParams({ category: 'monster-fish', page: '2' })
    expect(analyticsPath('/knowledge', filtered)).toBe('/knowledge?category=monster-fish&page=2')
    expect(analyticsPath('/knowledge', new URLSearchParams())).toBe('/knowledge')
  })

  it('drops an unexpected parameter rather than forwarding it', async () => {
    const { analyticsPath } = await import('@/components/layout/Analytics')
    const sneaky = new URLSearchParams({ email: 'someone@example.com', phone: '9876543210' })
    expect(analyticsPath('/', sneaky)).toBe('/')
  })
})

describe('whatsapp number resolution', () => {
  const original = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    else process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = original
  })

  it('accepts a real Indian mobile number', () => {
    expect(resolveWhatsappNumber({ whatsappNumber: '919845012345' })).toBe('919845012345')
  })

  it('strips punctuation an editor is likely to paste', () => {
    expect(resolveWhatsappNumber({ whatsappNumber: '+91 98450 12345' })).toBe('919845012345')
  })

  it('rejects the placeholder shipped in .env.example', () => {
    // This is the whole point of the guard: it is well formed, it builds a
    // working wa.me link, and it belongs to somebody else.
    expect(resolveWhatsappNumber({ whatsappNumber: '919000000000' })).toBeNull()
  })

  it('rejects filler shapes', () => {
    expect(resolveWhatsappNumber({ whatsappNumber: '911111111111' })).toBeNull()
    expect(resolveWhatsappNumber({ whatsappNumber: '911234567890' })).toBeNull()
    expect(resolveWhatsappNumber({ whatsappNumber: '000000000000' })).toBeNull()
  })

  it('rejects a number that is too short or too long', () => {
    expect(resolveWhatsappNumber({ whatsappNumber: '9184' })).toBeNull()
    expect(resolveWhatsappNumber({ whatsappNumber: '9184501234567890123' })).toBeNull()
  })

  it('falls back to the environment when Site Settings is blank', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '919845012345'
    expect(resolveWhatsappNumber({ whatsappNumber: null })).toBe('919845012345')
  })

  it('does not fall back to a placeholder in the environment', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '919000000000'
    expect(resolveWhatsappNumber({ whatsappNumber: null })).toBeNull()
    expect(whatsappLink({ whatsappNumber: null, whatsappDefaultMessage: 'hi' })).toBeNull()
  })

  it('prefers Site Settings over the environment', () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '919845099999'
    expect(resolveWhatsappNumber({ whatsappNumber: '919845012345' })).toBe('919845012345')
  })

  it('never puts personal data in the continuation message', () => {
    const message = enquiryWhatsappMessage('FQ-2609-4417', 'Super Red Arowana')
    expect(message).toContain('FQ-2609-4417')
    expect(message).toContain('Super Red Arowana')
    expect(message).not.toMatch(/\+?\d{10}/)
  })
})

describe('open graph image fallback', () => {
  const settings = { brandName: 'Finquiry' } as SiteSetting

  const ogImage = (meta: Parameters<typeof buildMetadata>[0]['meta']) =>
    (buildMetadata({ meta, path: '/', settings }).openGraph as { images?: unknown })?.images

  const firstUrl = (images: unknown): string => {
    const list = Array.isArray(images) ? images : [images]
    const first = list[0] as { url?: string } | string | undefined
    return typeof first === 'string' ? first : (first?.url ?? '')
  }

  it('uses the generated brand card when no image is set', () => {
    expect(firstUrl(ogImage(undefined))).toContain('/og/default.png')
  })

  it('ignores seeded placeholder artwork so the brand card still wins', () => {
    // The seed fills defaultSeo.image on a fresh install. That must not
    // displace the card that actually carries the Finquiry wordmark.
    const placeholder = {
      id: 1,
      seedKey: 'social',
      url: '/api/media/file/placeholder-social.webp',
      sizes: { social: { url: '/api/media/file/placeholder-social-1200x630.jpg' } },
    }
    expect(firstUrl(ogImage({ image: placeholder } as never))).toContain('/og/default.png')
  })

  it('uses a genuine editor upload when one exists', () => {
    const real = {
      id: 2,
      seedKey: null,
      url: '/api/media/file/finquiry-social.webp',
      sizes: { social: { url: '/api/media/file/finquiry-social-1200x630.jpg' } },
    }
    expect(firstUrl(ogImage({ image: real } as never))).toContain('finquiry-social-1200x630.jpg')
  })
})

describe('production origin detection', () => {
  it('accepts a real https domain', () => {
    expect(isProductionOrigin('https://finquiry.in')).toBe(true)
    expect(isProductionOrigin('https://www.finquiry.in')).toBe(true)
  })

  it('rejects local development origins', () => {
    expect(isProductionOrigin('http://localhost:3000')).toBe(false)
    expect(isProductionOrigin('http://127.0.0.1:3000')).toBe(false)
    expect(isProductionOrigin('https://finquiry.local')).toBe(false)
  })

  it('rejects per-deploy preview hosts, which would outrank the real site', () => {
    expect(isProductionOrigin('https://fish-git-main.vercel.app')).toBe(false)
    expect(isProductionOrigin('https://finquiry.netlify.app')).toBe(false)
    expect(isProductionOrigin('https://abc123.ngrok-free.app')).toBe(false)
  })

  it('rejects plain http on a public domain', () => {
    // Canonicals, OG URLs and JSON-LD @ids must all be the secure origin.
    expect(isProductionOrigin('http://finquiry.in')).toBe(false)
  })

  it('rejects a malformed or bare-host value', () => {
    expect(isProductionOrigin('finquiry.in')).toBe(false)
    expect(isProductionOrigin('https://staging')).toBe(false)
    expect(isProductionOrigin('')).toBe(false)
  })
})
