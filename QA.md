# Finquiry — QA

What was tested, what the numbers were, and what is genuinely still open.
Everything below was measured against the production build (`pnpm build` +
`pnpm start`), not the dev server.

---

## Automated checks

| Check               | Command             | Result                                      |
| ------------------- | ------------------- | ------------------------------------------- |
| Formatting          | `pnpm format:check` | Pass                                        |
| Linting             | `pnpm lint`         | Pass — 0 errors, 0 warnings                 |
| Type checking       | `pnpm typecheck`    | Pass                                        |
| Unit + schema tests | `pnpm test`         | **49 passed**                               |
| End-to-end          | `pnpm test:e2e`     | **45 passed**, 5 skipped (project-specific) |
| Production build    | `pnpm build`        | Pass — 24 static pages, no warnings         |

### Unit coverage (49 tests)

`tests/unit/enquirySchema.test.ts` — required fields, consent, Indian mobile and
PIN formats, untouched optional selects, honeypot rejection, quantity coercion,
whitespace trimming, step coverage, upload allowlist.

`tests/unit/lib.test.ts` — WhatsApp link building and the guarantee that the
handover message carries no phone number, link resolution, slugify, rich-text
extraction, headline emphasis parsing, rate-limit windows, and media URL/alt-text
handling.

### End-to-end coverage (45 tests, desktop + mobile)

- Desktop navigation reaches every primary page; header CTA routes correctly.
- Exactly one H1 per page.
- Skip link is the first tab stop and moves focus to the content.
- Mobile menu: opens, locks body scroll, traps focus, closes on Escape, restores
  focus to the trigger, and closes on navigation.
- Enquiry form: field errors with focus moved to the error summary; values
  preserved across steps; completable by keyboard alone; creates a record;
  displays the Request ID; offers a WhatsApp handover; rejects an SVG upload.
- Autosave: restores the requirement, never stores the name or phone number,
  persists only allowlisted fields, discards a draft older than 24 hours, and
  clears on submit.
- Knowledge Hub listing, filters and RSS feed.
- Deliveries empty state shows no invented content.
- Policy pages resolve and declare that they await legal review; they stay out
  of the sitemap.
- Draft posts are invisible to the public API; preview requires a secret;
  enquiries and enquiry uploads return 403.
- 404 returns a 404 status with a branded page.

---

## Responsive review

`node qa/responsive.mjs` — **12 widths × 8 routes, 0 issues.**

Widths: 320×568 · 360×800 · 390×844 · 414×896 · 667×375 (landscape) · 768×1024 ·
834×1194 · 1024×768 · 1280×800 · 1366×768 · 1440×900 · 1920×1080.

Each combination is checked for horizontal overflow, content text under 16px,
touch targets under 44px, clipped text, and broken images. Full-page screenshots
for all 96 combinations are produced by `node qa/responsive.mjs --shots`.

### Issues found and fixed during this review

| Issue                                                                                                                 | Fix                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero CTAs fell below the fold at 1280×800, 1366×768 and 1440×900; the headline wrapped to 5 lines with "for" orphaned | Retuned `--fs-hero` to `clamp(3.25rem, 5.4vw, 6rem)` and widened the measure. Now 3 balanced lines with both CTAs visible at every laptop size           |
| Section headings wrapped to a fraction of their width                                                                 | `max-inline-size` in `ch` was on the wrapper, where it resolved against 16px body text instead of the display font. Moved onto the headings              |
| Pool-masked images rendered as flat blobs                                                                             | An 8-value percentage radius with `overflow: hidden` stopped Chromium painting the child image. `CmsImage` now inherits the radius onto the image itself |
| The process route's current line ran through the step copy                                                            | Constrained the weave to the band the markers occupy                                                                                                     |
| Hero annotation overflowed the frame on mobile and sat over the Scarlet shape                                         | Given a reserved band on plain linen below the artwork                                                                                                   |
| Skip link was 42px tall                                                                                               | Raised to the 44px minimum                                                                                                                               |
| Breadcrumb links were 18px tall                                                                                       | Made genuinely 44px                                                                                                                                      |
| Field hints, card excerpts and the copyright line were 13px on phones                                                 | `--fs-small` steps up to 16px below 768px                                                                                                                |

---

## Accessibility

`node qa/a11y.mjs` — axe-core against WCAG 2.0/2.1/2.2 A and AA plus best
practice, across 11 routes at 390×844 and 1440×900.

**Result: 0 violations at moderate severity or above.**

Manual keyboard verification is covered by the e2e suite: tab order, the skip
link, the mobile menu focus trap, Escape handling, focus restoration, and
completing the enquiry form without a mouse.

### Issues found and fixed

| Issue                                                    | Fix                                                                                                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Body text on Scarlet panels was 4.05:1 — below AA        | Translucent light text is safe on Navy but not on Scarlet. Split into `--text-on-dark-muted` and a fully opaque `--text-on-scarlet` (4.92:1) |
| The 404 page had no `lang`, no `main` landmark and no H1 | See "Known limitations" below                                                                                                                |
| Enquiry step buttons had no accessible name on mobile    | The step label was `display: none`, which removes it from the accessibility tree. Switched to a clip-based visually-hidden pattern           |

---

## Performance

`node qa/perf.mjs` — 4× CPU throttling and a Fast-3G network profile, against
the production build.

| Route            | LCP    | CLS   | TTFB  | Transfer | Scripts |
| ---------------- | ------ | ----- | ----- | -------- | ------- |
| `/`              | 1072ms | 0.084 | 164ms | 77KB     | 8       |
| `/source-a-fish` | 948ms  | 0.005 | 183ms | 70KB     | 9       |
| `/knowledge`     | 924ms  | 0.044 | 180ms | 70KB     | 8       |
| `/about`         | 932ms  | 0.006 | 163ms | 70KB     | 8       |

Targets met: LCP well under 2.5s, CLS under 0.1, transfer weight under 80KB.

The homepage CLS of 0.084 passes but has the least headroom. It occurs only under
network throttling, at roughly 1040ms — the moment the webfonts swap in and the
hero headline reflows. `next/font` already self-hosts both families with
metric-matched fallbacks; eliminating the last of it would mean `font-display:
optional`, which would cost some first-time visitors the display font entirely.
That trade was not taken.

**No Lighthouse score is quoted.** No Lighthouse binary was available in this
environment, so quoting one would be inventing it. The measurements above cover
the same primitives; run Lighthouse against a deployed instance for the headline
number.

---

## Browsers

Automated runs used Chromium 1194 (the browser available in this environment) in
two configurations: a 1440×900 desktop profile and a Pixel 5 mobile profile with
touch and a mobile user agent.

**Safari, Firefox, Edge, iOS Safari and Android Chrome have not been executed
here** — those engines are not installed in this environment, and reporting them
as tested would be false. The code avoids the usual cross-engine traps:

- No engine-specific APIs; `-webkit-text-stroke` has an `@supports` fallback.
- Logical properties throughout, supported across current engines.
- `dvh` and `env(safe-area-inset-*)` for mobile browser chrome and notches.
- 16px minimum on form inputs, so iOS Safari does not zoom on focus.
- `backdrop-filter` is decorative only — the header stays legible without it.
- Native `<details>` for the FAQ accordion rather than a custom widget.

Run the suite against a real device grid before launch:
`BASE_URL=https://… pnpm test:e2e`.

---

## Content resilience

Verified by construction and by the empty states rendered in the current build:

- **Zero published delivery stories** — the homepage section and the index page
  both render their explicit empty state. Nothing is invented to fill the space.
- **Six draft articles, none published** — the homepage shelf and the Knowledge
  Hub explain that guides are being written rather than rendering an empty grid.
- **Missing images** — `CmsImage` renders a labelled placeholder instead of a
  broken frame.
- **Long titles** — no fixed heights on any CMS-driven text; `text-wrap: balance`
  on headings and `pretty` on paragraphs.
- **Varying card counts** — the category grid's size rhythm repeats every four
  cards, so it works for 1, 2, 5 or 9.
- **CMS unavailable** — the RSS feed returns a valid empty channel rather than a
  500, and the 404 page makes no CMS queries at all.

---

## Known limitations

1. **New top-level pages need a rebuild.**
   `src/app/(frontend)/[slug]` sets `dynamicParams = false`. This is deliberate:
   the app has no root layout — each route group owns its own `<html>`, which is
   the Payload convention — and in that shape a `notFound()` raised from a
   matched route renders Next's bare fallback with no `lang`, no `<main>` and no
   H1. Leaving unknown slugs unmatched routes them to `app/global-not-found.tsx`,
   which renders the full branded 404 with the correct status.
   The cost lands on the routes least affected by it: About, Contact and the
   policies are set up once. `/knowledge/[slug]` and `/deliveries/[slug]` keep
   `dynamicParams` on, so new articles and delivery stories go live the moment
   they are published.

2. **Rate limiting is per-process.** In-memory, 5 submissions per IP per 10
   minutes. It stops one client hammering the endpoint but does not span
   instances. A horizontally-scaled deployment needs a shared store or an edge
   rate limit. Tunable via `ENQUIRY_RATE_LIMIT_MAX` and
   `ENQUIRY_RATE_LIMIT_WINDOW_MINUTES`; the local `.env` raises it so the e2e
   suite is deterministic.

3. **CSP uses `'unsafe-inline'` for scripts.** A nonce cannot be minted for a
   prerendered document, and a nonce-based policy implies `strict-dynamic`, which
   would block every script on the static pages. Every other directive is strict.
   See README → Security.

4. **WhatsApp is a deep link, not an API integration.** No message is sent
   automatically, and nothing in the UI claims otherwise. The confirmation page
   opens a prefilled `wa.me` link carrying only the Request ID and the fish
   description — never a name, number, budget or the full requirement.

5. **Policy pages are drafts in substance.** They carry section headings and
   neutral placeholders, are flagged **Draft — requires legal review**, show a
   prominent notice, are `noindex`, and are excluded from the sitemap. They are
   published as _routes_ because the footer and the enquiry form's consent
   checkbox link to them, and a 404 there is worse than a page that states its
   own status. No liability, refund, mortality, transport or species claim has
   been invented.

6. **Seeded media is placeholder artwork.** Named `placeholder-*` and tagged
   `placeholder`. The hero fish is a stylised illustration, deliberately not a
   photograph, so it cannot be mistaken for a specimen Finquiry is claiming to
   have.

7. **No Lighthouse score, and no Safari/Firefox/Edge run.** See above. Both need
   a deployed instance.

---

## Reproducing this QA

```bash
pnpm build && pnpm start &          # or point BASE_URL at a deployment
export BASE_URL=http://localhost:3000

pnpm check                          # format, lint, types, unit tests
pnpm test:e2e                       # Playwright, desktop + mobile
node qa/routes.mjs                  # status codes, H1 count, console errors
node qa/a11y.mjs                    # axe, WCAG 2.2 AA
node qa/responsive.mjs              # 12 widths × 8 routes
node qa/responsive.mjs --shots      # …and write screenshots to qa/screenshots/
node qa/perf.mjs                    # LCP / CLS under throttling
```
