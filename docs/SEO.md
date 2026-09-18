# SEO

How discovery works on this site, and why each decision was made. Everything
described here is implemented in code — there is no manual step between a
content change and the search-facing result.

---

## The one rule

**A page is either indexable or it is not, and everything agrees.**

`isIndexablePage` in `src/lib/seo.ts` is the only place that decides. Both the
sitemap and the page's own `robots` directive read it. A page listed in the
sitemap while serving `noindex` is a contradiction that Search Console reports
as an error, and that is easy to create by accident when two files answer the
same question separately.

A page is not indexable when:

| Condition | Why |
| --- | --- |
| `meta.noIndex` is ticked in Payload | The editor said so. |
| It is a policy page still flagged `legalReviewRequired` | Draft legal wording must not be offered to search engines as settled terms. The page stays reachable, because the footer and the enquiry form's consent checkbox link to it — it just says plainly that it is awaiting review. |

Unticking **Requires legal review** in Payload makes a policy page indexable and
adds it to the sitemap in one step.

---

## Sitemap

`src/app/(frontend)/sitemap.ts`, served at `/sitemap.xml`.

**Included:** the homepage; every published Page that is indexable, which covers
Source a Fish, How It Works, Deliveries, Custom Aquariums, Knowledge Hub, About,
Contact and all five policy pages; every published article; every published
delivery record.

**Excluded, and why:**

| Excluded | Reason |
| --- | --- |
| `home`, `not-found` | Page records backing code-owned routes that already have their own URL. The slugs are not addressable. |
| `thank-you` | A request confirmation, reachable only after a submission. Also `noindex, nofollow`. |
| Drafts and unpublished records | The queries request published content only. |
| `/admin`, `/api/*` | Not content. |
| Query-string views | The canonical is always the unfiltered listing, so a filtered view has no separate URL to submit. |

**Deduplication.** A Pages record can share a slug with a code-owned route —
`/deliveries`, `/knowledge` and `/source-a-fish` all do, because the record
supplies the hero and blocks while the route supplies the listing. The URL is
emitted once: those three arrive through the Pages loop with a real `updatedAt`,
and `STATIC_ROUTES` holds only `/`. A final pass over the assembled list drops
any duplicate `<loc>`, because duplicates make the document invalid.

**`lastModified`** is each record's `updatedAt` — when the record last changed,
which is what a crawler wants for recrawl scheduling. `publishedAt` is an
editorial date and can be backdated.

**`changeFrequency` and `priority`** are set only where they can be justified:
weekly for the homepage, monthly for content pages and articles, yearly for
policy pages and delivery records (a delivery describes finished work and is not
revised afterwards).

**Splitting.** Not implemented, and not needed: the limit is 50,000 URLs. Next's
metadata API supports `generateSitemaps` when it becomes relevant.

---

## Robots

`src/app/robots.ts`, served at `/robots.txt` as `text/plain`.

**Production** (any `NEXT_PUBLIC_SITE_URL` that is not localhost): allows
everything, disallows `/admin`, `/api/` and `/thank-you`, and points at the
absolute sitemap URL.

**Anything else** — local, staging, a preview deployment — returns
`Disallow: /`. A staging copy of the site must never compete with the real one
in the index.

**Filtered listing views are deliberately *not* disallowed.** `/knowledge?category=…`
stays crawlable so that no article is reachable only through a blocked URL, and
is kept out of the index by `noindex, follow` plus a canonical pointing at the
unfiltered listing. That consolidates the signals; a robots block would only
hide the duplication and would strand the links inside.

`robots.txt` is not a security control and is not used as one — `/admin` is
protected by authentication.

---

## Metadata

`buildMetadata` in `src/lib/seo.ts` builds every page's metadata from one
fallback chain:

1. The document's Payload SEO override (`meta.title`, `meta.description`, `meta.image`)
2. The document's own title, excerpt or intro, and featured image
3. The site defaults in **Site Settings → Default SEO**

**Titles.** The layout applies `%s — Finquiry` to child pages. An explicit SEO
title from Payload is marked `absolute`, because an editor writing a title
writes the whole title — the seeded ones already end in `| Finquiry`, and
letting the template wrap them printed the brand twice.

The starting titles and descriptions live in `PAGE_SEO` in `src/seed/content.ts`
and are written into Payload by the seed **only where the field is empty**. They
are an editable starting point, not managed copy: re-running the seed never
overwrites an editor.

**Canonicals** are absolute and built from `NEXT_PUBLIC_SITE_URL`. A filtered
listing view canonicalises to the unfiltered listing.

**Language** is `en-IN` on `<html>` and `en_IN` as `og:locale`.

---

## Social cards

Served at a fixed path by `src/app/(frontend)/og/default.png/route.tsx`, which
renders the card with `next/og` at build time (`force-static`).

**Why a route handler and not `opengraph-image.tsx`.** Next's file convention
attaches the image to the route segment holding the file. Every page here
returns its own `openGraph` object from `generateMetadata`, and a deeper
segment's explicit value replaces what the parent attached — so the convention
produced a card on the homepage and on no other page. A fixed path lets
`buildMetadata` name the fallback outright, and one rule then covers every
route.

**The chain:** a Payload SEO image override, else the document's featured image
at its generated 1200×630 size, else the Site Settings default image, else the
generated card. Articles and delivery records therefore share their own
artwork; everything else shares the brand card.

No default social image is seeded. Pointing it at the placeholder artwork would
put the words "placeholder artwork" on every link ever shared.

**The card takes no request input.** A `/og?title=…` endpoint would render
arbitrary text as an image under this domain, which is a phishing surface for a
marginal gain. A document that wants its own card supplies one through Payload.

**Fonts.** Satori cannot read WOFF2, which is the only format `next/font` keeps,
so `assets/brand/fonts/` holds static TTF cuts of Bricolage Grotesque 700 and
Manrope 500 from the same Google Fonts source. `outputFileTracingIncludes` in
`next.config.mjs` traces them into a standalone build; nothing imports them, so
tracing cannot infer them and the card would 500 on first share.

---

## On-page

- Exactly one `<h1>` per page, verified across every route.
- Breadcrumbs are rendered by `PageHero` and mirrored as `BreadcrumbList`
  JSON-LD on every page below the top level.
- Descriptive internal links; related articles and related sourcing categories
  on the detail templates, so no record is an orphan.
- Slugs are generated from titles and are human-readable.
- Indexable content is server-rendered HTML — the listing and detail templates
  are static or ISR, not client-fetched.

### Structured data

| Type | Where |
| --- | --- |
| `Organization` | Every page, with a stable `@id` |
| `WebSite` | Every page, referencing the organisation |
| `BreadcrumbList` | Every page below the top level |
| `Article` | Knowledge articles and delivery records |
| `FAQPage` | Only where the same questions are visibly rendered, and only when the block's **Emit structured data** switch is on |

Nothing fabricates ratings, reviews, prices, stock or `LocalBusiness`
locations. Finquiry holds no inventory, so `Product`/`Offer` schema would be a
false claim. A delivery record is modelled as `Article` — it describes completed
work, not something purchasable.

Validated by `qa/` tooling: 40 JSON-LD blocks across 12 routes, checking
required properties per type, breadcrumb position ordering, absolute URLs,
resolvable `@id` references, and the absence of any rating, review, price or
availability key.

---

## Feeds

`/rss.xml`. `/knowledge/rss.xml` 308-redirects to it. If the CMS is unreachable
the route returns a valid empty feed rather than a 500, and logs the reason
server-side.

---

## Known limitations

- **Sitemap splitting** is not implemented. It is not needed below 50,000 URLs.
- **The `priority` and `changeFrequency` values are hints** that Google largely
  ignores. They are set consistently rather than tuned.
- **The generated social card is not per-page.** That is a deliberate trade
  against opening a text-rendering endpoint; see above.
- **`hreflang` is not set.** The site is single-locale (`en-IN`). It would need
  adding before a second locale.
