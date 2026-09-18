# Finquiry

An enquiry-led fish-sourcing website for serious collectors across India, built as a
single Next.js application with Payload CMS embedded in it.

Finquiry does not hold stock. A collector describes the specimen they are looking
for, Finquiry searches its network, and shares the individual fish it can actually
confirm. The site is built around that: there is no cart, no live inventory, and
nothing in the content model lets an editor imply availability that has not been
checked.

---

## Stack

| Concern         | Choice                                   | Version |
| --------------- | ---------------------------------------- | ------- |
| Framework       | Next.js (App Router, Turbopack)          | 16.3.5  |
| UI              | React                                    | 19.3.0  |
| CMS             | Payload                                  | 3.89.0  |
| Database        | PostgreSQL via `@payloadcms/db-postgres` | 16      |
| Rich text       | Lexical (`@payloadcms/richtext-lexical`) | 3.89.0  |
| Images          | `sharp` + `next/image`                   | 0.34    |
| Validation      | Zod                                      | 3.24    |
| Styling         | CSS Modules + custom properties          | —       |
| Package manager | pnpm                                     | 10.33   |
| Node            | 20.9+ (22.x used here)                   | —       |

Payload and the public site share one process. Route groups keep them apart:
`src/app/(payload)` owns `/admin` and the Payload REST/GraphQL API, and
`src/app/(frontend)` owns every public page.

---

## Getting started

```bash
# 1. Install
pnpm install

# 2. Configure
cp .env.example .env
#    Fill in DATABASE_URL, PAYLOAD_SECRET and NEXT_PUBLIC_SITE_URL at minimum.
#    Generate a secret with: openssl rand -base64 32

# 3. Create the schema and load the starter content
pnpm seed

# 4. Run
pnpm dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

The seed creates a super-admin using `SEED_ADMIN_EMAIL` (default
`admin@finquiry.local`) and `SEED_ADMIN_PASSWORD`. There is no default password:
in development the seed generates a random one and prints it once, and in
production it refuses to create the account unless you set one yourself.

In development the Postgres adapter runs in `push` mode, so schema changes are
applied automatically. In production it does not — generate and run a migration
with `pnpm payload migrate:create` and `pnpm payload migrate`.

---

## Scripts

| Command                             | What it does                            |
| ----------------------------------- | --------------------------------------- |
| `pnpm dev`                          | Development server                      |
| `pnpm build`                        | Production build                        |
| `pnpm start`                        | Serve the production build              |
| `pnpm seed`                         | Idempotent seed — safe to re-run        |
| `pnpm lint`                         | ESLint (flat config)                    |
| `pnpm typecheck`                    | `tsc --noEmit`                          |
| `pnpm format` / `pnpm format:check` | Prettier                                |
| `pnpm test`                         | Vitest unit and schema tests            |
| `pnpm test:e2e`                     | Playwright, desktop and mobile projects |
| `pnpm check`                        | format:check → lint → typecheck → test  |
| `pnpm generate:types`               | Regenerate `src/payload-types.ts`       |
| `pnpm generate:importmap`           | Regenerate the Payload admin import map |

Run `pnpm generate:types` after any change to a collection, global or block —
the frontend is typed against its output.

### QA harness

The scripts in `qa/` run against a running site (`BASE_URL`, default
`http://localhost:3000`):

| Script                                        | What it checks                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `node qa/routes.mjs`                          | Every route returns the expected status with exactly one H1, and logs console errors         |
| `node qa/a11y.mjs`                            | axe-core, WCAG 2.2 AA, 11 routes × mobile and desktop                                        |
| `node qa/responsive.mjs`                      | Overflow, text size, touch targets, clipped text and broken images at all 12 required widths |
| `node qa/responsive.mjs --shots`              | The above, plus full-page screenshots into `qa/screenshots/`                                 |
| `node qa/perf.mjs`                            | LCP, CLS and transfer weight under 4× CPU and Fast-3G throttling                             |
| `node qa/shot.mjs <url> <out> [w] [h] [full]` | One screenshot                                                                               |

---

## Environment variables

See `.env.example` for the full annotated list. The ones that matter:

**Required** — `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`.

**Recommended** — `PREVIEW_SECRET` and `REVALIDATION_SECRET` (draft preview and
on-demand cache invalidation are disabled without them, returning `501`);
`NEXT_PUBLIC_WHATSAPP_NUMBER` as a fallback before Site Settings is filled in.

**Optional** — S3 storage (`S3_*`); email (`SMTP_*`, `EMAIL_FROM`,
`EMAIL_ADMIN_TO`); analytics (`NEXT_PUBLIC_ANALYTICS_*`); rate-limit tuning
(`ENQUIRY_RATE_LIMIT_MAX`, `ENQUIRY_RATE_LIMIT_WINDOW_MINUTES`).

Every optional group degrades cleanly: with no S3 the uploads go to local disk,
with no SMTP the admin notification is skipped (the enquiry is still saved), and
with no analytics ID no third-party script is loaded at all.

---

## Deployment

1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` (no trailing slash — canonical
   URLs, the sitemap and WhatsApp links are all built from it).
3. Configure S3 if the host has an ephemeral filesystem. Without it, uploads are
   written to `public/media` and `private-uploads`, which most container hosts
   discard on redeploy.
4. Run migrations, then `pnpm build` and `pnpm start`.
5. Run `pnpm seed` once against the new database.
6. Sign in at `/admin`, change the seeded password, and fill in Site Settings —
   particularly the WhatsApp number, which every WhatsApp CTA depends on. Until
   it is set, those buttons are hidden rather than rendered as dead links.

### Cache invalidation

Published content is read through `unstable_cache` under a tag named after its
collection. Publishing through the admin invalidates it automatically via
collection hooks. Two cases need the manual endpoint:

```bash
curl -X POST -H "x-revalidate-secret: $REVALIDATION_SECRET" \
  "$NEXT_PUBLIC_SITE_URL/api/revalidate?tag=pages"
```

- After running `pnpm seed`, which writes from a separate process. The seed calls
  this endpoint itself when `REVALIDATION_SECRET` is set, and says so if it cannot.
- After a scheduled publish fires in a different process from the web server.

---

## Security

- **Enquiries are private.** The collection denies public create, read, update and
  delete. The only public write path is the server action in
  `src/app/(frontend)/source-a-fish/actions.ts`, which rate-limits, spam-checks
  and validates against the shared Zod schema before writing with
  `overrideAccess`.
- **Customer uploads are separated.** Reference images go to `private-media`,
  stored outside `public/`, never listed publicly, and served only to an
  authenticated staff session through `/api/private-media/[id]`.
- **Publishing is a permission.** An editor without `canPublish` cannot move a
  document to `published` through the admin, REST or GraphQL — enforced in a
  `beforeChange` hook, not by hiding a button.
- **Consent is enforced server-side.** A testimonial cannot be saved or published
  without its written-permission flag; the check is a `beforeValidate` hook.
- **Uploads are restricted** to JPEG, PNG and WebP at 8 MB. SVG is deliberately
  not accepted from the public — it can carry script.
- **Rate limiting** is in-process (5 submissions per IP per 10 minutes by
  default). That stops one client hammering the endpoint; it does **not** span
  instances. For a horizontally-scaled deployment, put a shared store or an edge
  rate limit in front of it.
- **Analytics never receives personal data.** `trackEvent` accepts a fixed event
  name plus an optional step number or public label — there is no free-form
  payload, by design.

### Content Security Policy

`src/proxy.ts` sets a strict policy on every public page, with one deliberate
relaxation: `script-src` includes `'unsafe-inline'`.

Most of this site is statically prerendered, which is what keeps it fast. A nonce
must be minted per request, so a prerendered document cannot carry one — and a
nonce-based policy implies `strict-dynamic`, which makes browsers ignore `'self'`
and every host source. The result would be a site whose JavaScript silently never
runs. Everything else stays locked down: `object-src 'none'`, `base-uri 'self'`,
`form-action 'self'`, `frame-ancestors 'self'`, and framing limited to the two
video hosts the Video block supports.

To run a nonce-based policy instead, every route has to be rendered dynamically —
a real performance cost, and a deliberate trade.

`/admin` and `/api/*` are exempt: the Payload admin needs allowances the public
site should not have, and it manages its own security model.

---

## Project layout

```
src/
├── access/           Role and permission rules, shared by every collection
├── app/
│   ├── (frontend)/   Public routes, sitemap, RSS, preview and revalidate APIs
│   ├── (payload)/    Payload admin and its REST/GraphQL routes
│   ├── global-not-found.tsx   Branded 404 for unmatched routes
│   └── robots.ts
├── blocks/           The 15 layout blocks and their shared fields
├── collections/      13 Payload collections
├── components/
│   ├── art/          The aquatic graphic language (inline SVG)
│   ├── blocks/       Block → component dispatcher
│   ├── form/         The multi-step enquiry form
│   ├── layout/       Header, mobile menu, footer, analytics
│   ├── sections/     One component per layout block
│   └── ui/           Button, CmsImage, RichText, JsonLd
├── fields/           Reusable field definitions (slug, SEO)
├── globals/          Site Settings, Header, Footer, Homepage
├── hooks/            Revalidation, redirects, publish guard, reading time
├── lib/              Queries, SEO, schema.org, WhatsApp, rate limit, analytics
├── seed/             Idempotent seed and its content
└── styles/           Design tokens and global styles
```

---

## Further reading

| Document                   | Contents                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| [DESIGN.md](./DESIGN.md)   | The visual system: colour, type, shape, motion, and the contrast maths behind the tokens |
| [CONTENT.md](./CONTENT.md) | Which CMS field drives which part of which page                                          |
| [PAYLOAD.md](./PAYLOAD.md) | Collections, globals, roles, preview and publishing — written for editors                |
| [QA.md](./QA.md)           | What was tested, the measured results, and the known limitations                         |
