# Finquiry — content map

Which CMS field drives which part of which page. Everything listed here is
editable without a developer.

**Admin groups:** Content · Knowledge Hub · Sourcing · Aquariums · Enquiries ·
Media · Configuration · Administration.

---

## Homepage

`Globals → Homepage`. The hero is fixed in place because the page must always
open with it; everything below is a blocks list you can **drag to reorder**, and
each block has its own **Hide this section** switch that keeps the content while
taking it off the page.

### Hero (tab: Hero)

| Field                       | Where it appears                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Eyebrow                     | Small red label above the headline                                                                                                  |
| Headline                    | The large display headline. Wrap a run in `*asterisks*` to set it in Scarlet — e.g. `Every Collector Is *Searching* for Something.` |
| Body                        | Supporting paragraph under the rule                                                                                                 |
| Trust line                  | Small reassurance under the buttons                                                                                                 |
| Primary CTA / Secondary CTA | The two buttons. Set type to **WhatsApp** to use the number from Site Settings                                                      |
| Fish image                  | The transparent cutout that drifts over the shapes. Replace this to change the hero artwork                                         |
| Annotation                  | The small italic note beside the artwork                                                                                            |
| Scroll hint                 | Text next to the scroll indicator                                                                                                   |

### Sections (tab: Sections)

Seeded in this order. All of it is reorderable.

| Block             | What it renders                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Section Intro     | "You tell us the fish…" — eyebrow, heading, body, a drawn current                                               |
| Process Route     | The five numbered steps on a weaving current line                                                               |
| Category Grid     | Sourcing categories as an editorial grid. **All active categories** picks them up automatically as you add them |
| Specimen Record   | The journal-style specimen sheet: main image, two detail crops, record rows, caveat note                        |
| Trust Statements  | "Search wider / See the actual fish / Approve before it moves", plus the proof-point chips                      |
| Delivery Stories  | Featured delivery postcards, or the empty state until real records exist                                        |
| Aquarium Feature  | Image with the Scarlet services panel                                                                           |
| Featured Articles | Magazine shelf — one lead article plus supports, or its empty state                                             |
| FAQs              | Accordion, filtered by category                                                                                 |
| CTA               | The closing Scarlet block                                                                                       |

---

## Site-wide furniture

### `Globals → Site Settings`

| Field                      | Where it appears                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Brand name                 | Header, footer, page titles, Organisation schema                                                                   |
| Tagline, Short description | Default SEO and Organisation schema                                                                                |
| Logo, Logo (dark), Favicon | Header, footer, browser tab                                                                                        |
| Contact email              | Footer contact column                                                                                              |
| **WhatsApp number**        | **Every WhatsApp button on the site.** Until this is set, those buttons are hidden rather than shown as dead links |
| WhatsApp default message   | Prefilled into WhatsApp from a generic CTA                                                                         |
| Business address           | Footer, Organisation schema                                                                                        |
| Social links               | Footer, `sameAs` in Organisation schema                                                                            |
| Default SEO                | The last fallback for title, description and social image                                                          |
| Organisation schema        | Legal name, founding year, area served, profile URLs                                                               |
| Analytics                  | Provider and ID. Environment variables win when both are set                                                       |
| Cookie / consent           | The consent banner copy and policy link                                                                            |

### `Globals → Header`

Navigation items (drag to reorder, max 8), the header CTA, and an optional
announcement bar. Nav paths must start with `/`.

### `Globals → Footer`

Brand statement, up to four link columns, the policy links in the small-print
row, a switch to pull contact details from Site Settings, and the copyright
format — `{year}` and `{brand}` are substituted at render time.

---

## Pages

`Collections → Pages`. One record per public route.

| Field                         | Where it appears                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Title                         | H1 fallback, navigation label, SEO fallback                                                                      |
| Slug                          | The URL. Generated from the title; edit to override                                                              |
| Page type                     | `standard`, `policy` (adds the legal-review notice) or `utility`                                                 |
| Draft — requires legal review | On a policy page: shows a prominent notice, adds `noindex`, and keeps the page out of the sitemap until unticked |
| Hero group                    | Eyebrow, heading, intro and image at the top of the page                                                         |
| Layout                        | The block list for the page body                                                                                 |
| SEO tab                       | Title, description, social image, canonical URL, hide-from-search                                                |

Seeded pages: `source-a-fish`, `how-it-works`, `deliveries`, `custom-aquariums`,
`knowledge`, `about`, `contact`, `thank-you`, `not-found`, plus the four policy
pages.

**`source-a-fish`, `deliveries` and `knowledge` have their own routes.** Their
Pages record supplies the hero and any blocks below the main content; the form,
the filtered lists and the cards come from the application.

---

## Knowledge Hub

`Collections → Articles`. Drafts, autosave, version history and scheduled
publishing are all on.

| Field          | Where it appears                                                                           |
| -------------- | ------------------------------------------------------------------------------------------ |
| Title          | Card, article H1, SEO fallback                                                             |
| Excerpt        | Card copy, article intro, meta description fallback, RSS description                       |
| Featured image | Card and article header                                                                    |
| Content        | The article body                                                                           |
| Category       | Card label, the filter chips, related-article fallback                                     |
| Author         | The article sidebar                                                                        |
| Published date | Sidebar, sort order, `datePublished` in Article schema. Set automatically on first publish |
| Reading time   | Sidebar and cards. **Calculated on save** — not editable                                   |
| Related posts  | The "Related reading" row. Left blank, the newest in the same category are used            |

`Collections → Categories` drives the filter chips. `Collections → Authors`
supplies the byline.

---

## Sourcing

### `Collections → Sourcing categories`

| Field                        | Where it appears                                                              |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Name                         | Card title, delivery filters                                                  |
| Short description            | Card copy                                                                     |
| Cover media                  | Card image                                                                    |
| **Sourced-on-request label** | The blue pill on every card. Keep wording that makes availability conditional |
| Display order / Active       | Order on the page; inactive categories disappear from the site                |

### `Collections → Delivery stories`

Nothing here is seeded. A story exists only once the delivery is real and the
customer has agreed to it being published.

| Field                               | Where it appears                                                           |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Title, Public reference             | Card and detail header, the specimen stamp                                 |
| Customer requirement                | Detail intro and meta description                                          |
| Specimen, Variety, Approximate size | The record table                                                           |
| Origin / Destination                | The route line. **City or state only — never a full address**              |
| Main image, Gallery, Packing media  | Detail page imagery                                                        |
| Outcome                             | The "Outcome" section                                                      |
| Testimonial + attribution           | Shown only when the consent box is ticked                                  |
| **Written permission confirmed**    | Required before a testimonial can be saved at all — enforced on the server |
| Delivery date, Featured             | Sort order; featured stories can appear on the homepage                    |

### `Collections → Testimonials`

Standalone quotes. Publication requires the approval checkbox — also enforced on
the server.

---

## Aquariums and FAQs

`Collections → Aquarium services & projects` — title, summary, content, cover,
gallery, service type, featured.

`Collections → FAQs` — question, answer, category (Sourcing, Delivery, Pricing,
Aquariums, General), display order and a published toggle. The FAQ block pulls
by category, and its **Add FAQ structured data** switch should stay on only where
those exact questions are visible on the page.

---

## Enquiries

`Collections → Enquiries` is private: no public read, no public create. Records
arrive only through the form on `/source-a-fish`.

Tabs: **Customer** (name, WhatsApp, email, city, state, PIN) · **Requirement**
(fish, species, variety, sizes, quantity, alternatives) · **Aquarium**
(dimensions, volume, inhabitants, cycled, notes) · **Commercial** (budget,
timeline, delivery city and PIN, reference image) · **Internal** (notes, and the
read-only submission metadata — source page, consent timestamp, the exact consent
wording agreed to, and UTM parameters).

Sidebar: the generated **Request ID** (`FQ-DDMM-NNNN`), **Status** (new →
reviewing → sourcing → options-shared → approved → closed / unsuccessful) and an
optional assignee.

`Collections → Enquiry uploads` holds customer reference images. They are stored
outside the public directory and are never rendered on the site.

---

## Media

`Collections → Media` is the public library. Every meaningful image needs alt
text; tick **Decorative only** for images that carry no information and
assistive technology will skip them.

Generated sizes: thumbnail 400×300, card 768w, tablet 1024w, desktop 1600w, wide
2400w, social 1200×630. Small originals are never upscaled.

Files seeded as placeholders are named `placeholder-*` and tagged `placeholder` —
filter by that tag to find everything still needing a real photograph.

---

## The metadata fallback chain

For every page, in order:

1. The document's **SEO** tab
2. The document's own title, excerpt and featured image
3. **Site Settings → Default SEO**
