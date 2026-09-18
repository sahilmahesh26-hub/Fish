# Finquiry — QA

What was tested, what the numbers were, and what is genuinely still open.
Everything below was measured against the production build (`pnpm build` +
`pnpm start`), not the dev server.

---

## Running it

Everything below assumes a **production** server. Several behaviours only exist
there: `dynamicParams = false`, the static/ISR routes, the HTTPS redirect, the
production CSP, and analytics being disabled in development.

```bash
pnpm build
pnpm start -p 3100            # or any free port
BASE_URL=http://127.0.0.1:3100 pnpm test:e2e
BASE_URL=http://127.0.0.1:3100 pnpm qa:overflow
BASE_URL=http://127.0.0.1:3100 pnpm qa:responsive
BASE_URL=http://127.0.0.1:3100 pnpm qa:links
```

`pnpm check` runs format, lint, typecheck and the unit suite, and is what to run
before every commit.

### Two things that will otherwise waste an afternoon

**Start each verification on a fresh port.** A stale `next start` from an
earlier build answers on the old port and serves the old bundle. Chasing a
"bug" that is really a three-builds-ago server is the single most expensive
mistake available here.

**Raise the rate limit for suites that submit the form.** The limiter reads its
configuration at module load in the _server_ process, so it must be set when the
server starts, not on the test command:

```bash
ENQUIRY_RATE_LIMIT_MAX=200 pnpm start -p 3100
```

---

---

## Content fixtures

The seed deliberately ships **no delivery records** and leaves the starter
articles **unpublished**, because inventing a customer delivery or an article
nobody wrote would be a false claim on a live site. That default is correct and
stays.

It also means several templates have no route to render. `qa/fixtures.ts` puts a
local database into the state a launched site would be in:

```bash
pnpm qa:fixtures apply     # publish the starter articles, clear the legal-review
                           # flag, add one marked delivery record
pnpm qa:fixtures reset     # back to the honest shipped state
```

Every record it writes is marked `[QA FIXTURE]` in its title, and it refuses to
run against a non-local database.

**Run the end-to-end suite without fixtures and the visual QA with them.** Two
content tests assert the shipped behaviour — that an unreviewed policy page
stays out of the sitemap and says it is awaiting review — and the fixtures
deliberately violate those preconditions.

The fixtures earn their keep: the first run with a delivery record present
exposed a horizontal-scroll bug on every screen under 430px that the empty
listing had been hiding.

---

---

## Automated suites

### Unit — `pnpm test`

73 tests. The enquiry schema (required fields, consent, Indian phone formats,
PIN codes, optional selects, upload limits, the submission token), rich-text
helpers, WhatsApp link building, rate limiting, media helpers and link
resolution.

Two of them exist to hold a security invariant rather than a behaviour:

- **No helper in `src/lib/env.ts` may return a credential's value.** That module
  cannot carry a `server-only` guard — it is on the CLI scripts' import path,
  where that package throws — so the test is the guard. It was verified to fail
  when a leaking helper was added, and to pass once removed.
- **No request ID or requirement text may reach an analytics page path.** The
  confirmation page is reached as `/thank-you?request=…&fish=…`, so the
  allowlist that strips those is pinned by a test.

### End-to-end — `pnpm test:e2e`

Playwright, Chromium, desktop (1440×900) and mobile (Pixel 5) projects.

| Spec         | Covers                                                                                                                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation` | Header, mobile menu, skip link, footer, keyboard traversal                                                                                                                                                                                                  |
| `content`    | Listings and their empty states, draft protection, policy-page notices, sitemap exclusion while unreviewed                                                                                                                                                  |
| `enquiry`    | Step navigation and value preservation, keyboard-only completion, field errors and focus, server-side phone and PIN rejection, accepted number formats, duplicate submission, cross-origin refusal, upload type rejection, request ID and WhatsApp handover |
| `consent`    | Accept, reject, the preferences modal and its focus trap, reopening from the footer, the cookie policy page                                                                                                                                                 |
| `autosave`   | Draft restore, and the fields that are deliberately never saved                                                                                                                                                                                             |
| `security`   | CSP contents, baseline headers, admin policy, HTTPS redirect in three configurations, no server-only variable in served HTML                                                                                                                                |

### Horizontal overflow — `pnpm qa:overflow`

Measures `scrollWidth` against `clientWidth` at ten widths across every route,
and names the element responsible. It only blames an element when nothing
between it and the root clips it — `getBoundingClientRect` reports the unclipped
box, so a decorative glow bleeding out of a hero with `overflow: hidden` would
otherwise be blamed for every failure. That false positive cost real time before
the check was written properly.

### Responsive — `pnpm qa:responsive`

The full 21-viewport matrix against every distinct template, checking horizontal
overflow, body text under 16px on small screens, touch targets under 44px,
clipped text, line length over ~95 characters on large monitors, fixed heights
cutting off content, and broken images. `--shots` writes full-page screenshots
to `qa/screenshots/`.

### Links — `pnpm qa:links`

Crawls every internal link reachable from the homepage and the confirmation
page, and checks that a nonexistent URL returns a real 404 rather than a 200
with apologetic content. External destinations are reported but never fail the
run: a third-party site being down or blocking a headless request is not this
site's defect, and a crawl that fails on it is a crawl nobody trusts.

### Accessibility — `qa/a11y.mjs`

axe-core via `@axe-core/playwright` across the public routes.

### Performance — `qa/perf.mjs`

Core Web Vitals with CDP throttling.

---

---

## Viewports

All 21 from the brief:

320×568 · 360×800 · 375×812 · 390×844 · 393×873 · 414×896 · 430×932 ·
667×375 landscape · 768×1024 · 820×1180 · 834×1194 · 1024×768 · 1024×1366 ·
1280×720 · 1280×800 · 1366×768 · 1440×900 · 1536×864 · 1920×1080 · 2560×1440 ·
3440×1440 ultrawide

## Routes

Home · Source a Fish · How It Works · Deliveries listing · Delivery detail ·
Custom Aquariums · Knowledge listing · Article detail · About · Contact ·
Privacy · Terms · Cookie Policy · Sourcing and Delivery Policy ·
Restricted-Species Policy · Request confirmation · 404 · filtered listing view

Plus the interactive states: cookie banner, cookie preferences modal, mobile
menu, and the form's error and success states.

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

## Bugs this QA found

Recorded because each one is a reason a particular check exists.

| Found by                       | Bug                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Production build, not dev      | A nonce-based CSP refused every script on every prerendered page. Dev looked perfect.                                               |
| Responsive sweep with fixtures | `1fr` grid tracks are `minmax(auto, 1fr)`; an image's intrinsic width blew single-column card grids out to 630px on a 320px screen. |
| Consent e2e on mobile          | Two 200px-wide buttons could not both fit a 360px phone.                                                                            |
| Metadata audit                 | Explicit SEO titles were being wrapped by the title template, printing the brand twice.                                             |
| Metadata audit                 | Removing the placeholder default social image revealed that Next's `opengraph-image` convention only applied to the homepage.       |
| JSON-LD validation             | Delivery records emitted `Article` with no `author`.                                                                                |
| Header inspection              | The HTTPS redirect read the internal host, so it never fired on a real request.                                                     |
| Analytics review               | `page_view` was sending the request ID and the customer's requirement text.                                                         |
| Empty-form submit              | The consent checkbox reported Zod's default "Invalid input".                                                                        |
| Enquiry e2e                    | React 19 resets uncontrolled fields when a form action settles, emptying an imperatively assigned token.                            |
| Enquiry e2e                    | There were **no** database migrations, so a production deploy would have started against an empty schema.                           |

---

## Reproducing this QA

```bash
pnpm build && pnpm start &          # or point BASE_URL at a deployment
export BASE_URL=http://localhost:3000

pnpm check                          # format, lint, types, unit tests
pnpm test:e2e                       # Playwright, desktop + mobile
pnpm qa:overflow                    # horizontal scroll, 10 widths x every route
pnpm qa:responsive                  # the 21-viewport matrix, every template
pnpm qa:responsive -- --shots       # …and write screenshots to qa/screenshots/
pnpm qa:links                       # internal link crawl + a real 404 check
node qa/routes.mjs                  # status codes, H1 count, console errors
node qa/a11y.mjs                    # axe, WCAG 2.2 AA
node qa/perf.mjs                    # LCP / CLS under throttling
```

Run `pnpm qa:fixtures apply` before the visual sweeps so the article and
delivery templates have something to render, and `pnpm qa:fixtures reset`
before `pnpm test:e2e` so the content specs see the honest shipped state.
