# Launch readiness

Everything technically possible has been built, tested and documented. What
remains needs facts, approvals or assets that only the owner can supply. Until
each item below is done, the site behaves safely: it hides what it cannot
honestly show rather than inventing a value.

**Recommendation: CONDITIONAL GO.** The build is production-ready. Do not point
a public domain at it until items 1, 2 and 4 are complete.

---

## OWNER ACTION REQUIRED

| # | Item | Blocks launch? | Current safe behaviour |
| --- | --- | --- | --- |
| 1 | Production WhatsApp number | Yes | Every WhatsApp control hides itself; the enquiry CTA is shown instead |
| 2 | Production domain / `NEXT_PUBLIC_SITE_URL` | Yes | `robots.txt` serves `Disallow: /`, so nothing is indexed |
| 3 | Social media profile URLs | No | Omitted from structured data |
| 4 | Legal review of the five policy pages | Yes | Pages show a review notice, are `noindex` and are kept out of the sitemap |
| 5 | Real specimen photography | No | Generated dark-water artwork, which depicts water and never a fish |
| 6 | Real delivery records | No | The deliveries listing shows a deliberate empty state |
| 7 | Approval to publish the six knowledge articles | No | They stay drafts; publishing one with its seeded body is blocked by the CMS |
| 8 | Analytics provider and ID | No | No analytics script loads at all |
| 9 | SMTP credentials | No | Email is written to the server log; enquiries still save to the database |

---

### 1. WhatsApp number

**Where to put it:** Payload admin → **Site Settings → Contact → WhatsApp
number**. Digits only, international format, no `+` and no spaces. For an
Indian mobile that is `91` followed by the ten-digit number, for example
`919845012345`.

This takes effect immediately, with no deploy.

As a fallback for a fresh install before anyone has logged into the CMS, set
the `WHATSAPP_NUMBER` environment variable to the same value and restart.

> Do **not** use `NEXT_PUBLIC_WHATSAPP_NUMBER`. Next.js inlines every
> `NEXT_PUBLIC_*` value into the bundle at build time, so that variable cannot
> be changed without rebuilding. It is still read, for compatibility, but
> `WHATSAPP_NUMBER` is the one to set.

**Values that are rejected as placeholders**, because they appear in setup
documentation and belong to someone else: any number whose subscriber part is a
single repeated digit or a straight run, including `919000000000`,
`919876543210`, `911111111111` and `911234567890`. A rejected number behaves
exactly like no number at all.

**Until it is set:** every WhatsApp button, link and footer entry is hidden. The
confirmation page substitutes "Contact the sourcing team" when a request
reference exists and "Start Your Search" when it does not. No enquiry is ever
blocked by a missing number.

**Verify:** load the site and confirm a `wa.me` link appears in the footer and
on the confirmation page.

### 2. Production domain

**Where to put it:** the `NEXT_PUBLIC_SITE_URL` environment variable on the
host, then redeploy. No trailing slash, https only:
`NEXT_PUBLIC_SITE_URL=https://finquiry.in`

This value drives canonical URLs, the sitemap, Open Graph URLs, RSS links and
every JSON-LD `@id`, so all of them move together.

**Indexing opens automatically** when, and only when, the value is a real
production origin: it must parse as a URL, use `https`, and not be loopback, a
`.local` address, a bare hostname, or a per-deploy preview host (`*.vercel.app`,
`*.netlify.app`, `*.pages.dev`, `*.fly.dev`, `*.onrender.com`, `*.railway.app`,
`*.ngrok-free.app`, `*.herokuapp.com`, `*.amplifyapp.com`). Anything else keeps
serving `Disallow: /`, so a staging copy can never outrank the real site.

`/admin`, `/api/` and `/thank-you` stay disallowed in every case.

**Verify:** `curl https://yourdomain/robots.txt` should show `Allow: /`, and
`curl https://yourdomain/sitemap.xml` should list your real URLs.

### 3. Social media URLs

**Where to put them:** Payload admin → **Site Settings → Contact → Social
links**. Pick the platform and paste the full profile URL including `https://`.

Only absolute `http(s)` URLs on a real host are published. An empty value, a
bare `#`, a relative path or an `example.com` URL is dropped, because a broken
profile link in structured data is a false claim about the business rather than
a cosmetic problem.

These currently feed the `sameAs` property in Organization structured data. No
social icons are rendered anywhere in the interface, so nothing looks broken
while the list is empty.

### 4. Legal review

The five policy pages are **drafted, not approved**: Privacy Policy, Terms and
Conditions, Cookie Policy, Sourcing and Delivery Policy, Restricted-Species
Policy.

Each one currently shows a visible notice saying it awaits review, is served
`noindex`, and is excluded from the sitemap. They remain reachable, because the
footer and the enquiry form's consent checkbox link to them.

**To approve one:** Payload admin → **Pages → [the policy] → untick "Draft,
requires legal review before publication"** and save. That single action removes
the notice, makes the page indexable and adds it to the sitemap.

Work through `docs/LEGAL-REVIEW-CHECKLIST.md` before unticking anything. Nobody
on the build side can mark a policy legally approved, and none of them has been.

Pay particular attention to the Restricted-Species Policy. Its wording must not
imply that Finquiry will source prohibited, protected or undocumented animals.

### 5. Photography

See `docs/PHOTO-SHOT-LIST.md` for the full brief: every field, subject,
orientation, aspect ratio, minimum dimensions, art direction, alt-text guidance
and a usage-rights table to fill in.

Replacing an image is a CMS upload, not a code change. The seed will not
overwrite a file it did not generate: it compares a checksum first and leaves
anything it does not recognise alone.

### 6. Delivery records

There are **zero** delivery records, and none will be invented. The listing
shows a deliberate empty state.

**To add a real one:** Payload admin → **Deliveries → Create**. Fill in the
requirement, the specimen, the origin and destination (city or state only,
never a full address), the delivery date and the main image, then publish.

Two things must be true before publishing: the specimen details are accurate,
and the customer has agreed to the delivery being shown publicly.

`[QA FIXTURE]` in a title marks test data. `pnpm qa:fixtures apply` creates one
for QA and `pnpm qa:fixtures reset` removes it. The reset also returns articles
to draft and re-flags the policy pages, and it refuses to run against a
non-local database.

### 7. Publishing knowledge articles

Six articles exist as **titled, categorised drafts with placeholder bodies**.
They are structure, not content.

**To publish one:** Payload admin → **Posts → [article]**, replace the body with
the real guidance, then publish.

The CMS refuses to publish an article whose body still contains the seeded
starter sentence, with a message saying so. That guard exists because the
placeholder text reads as a broken page if it reaches a visitor.

Anything touching animal welfare, water chemistry, transport or species
legality needs either a cited source or a qualification in the wording. The site
must not make a veterinary or legal claim it cannot support.

### 8. Analytics

No analytics script loads, because no provider is configured and because
non-essential scripts wait for consent either way.

**To enable:** set the provider's site ID in the environment (see
`.env.example`) and redeploy. With no valid ID nothing loads, silently, rather
than injecting a broken script tag.

Event names and what triggers them are listed in `docs/ANALYTICS.md`. No event
ever carries a name, phone number, email address, PIN code, budget, uploaded
file or requirement text.

### 9. Email delivery

Without SMTP credentials, Payload writes email to the server log. Enquiries are
still saved to the database, so nothing is lost; the team just will not be
notified. Set `SMTP_HOST`, `SMTP_PORT` and `EMAIL_FROM` to turn it on.

---

## Verified before handover

| Check | Result |
| --- | --- |
| `pnpm format:check`, `pnpm lint`, `pnpm typecheck` | pass |
| `pnpm test` | 90 passed |
| `pnpm test:e2e` | 89 passed, 0 failed, 7 skipped (platform-specific, each with a stated reason) |
| `pnpm build` | clean production build |
| `pnpm qa:seed-idempotency` | 3 consecutive seeds, identical state |
| `pnpm qa:media` | no missing files, no orphans, no collision suffixes |
| `pnpm qa:overflow` | no horizontal overflow, 9 widths x 10 routes |
| `pnpm qa:responsive` | 0 issues, 21 widths x 17 routes |
| axe accessibility | 0 violations, 15 routes x 2 viewports |
| `pnpm qa:links` | pass, no broken internal links |
| QA fixtures apply and reset | round-trips to a clean state |

## Deployment

1. Provision PostgreSQL and set `DATABASE_URL`.
2. Set `PAYLOAD_SECRET` to a long random string (`openssl rand -base64 32`).
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
4. Set `PREVIEW_SECRET` and `REVALIDATION_SECRET`.
5. Deploy. The start command runs migrations first:
   `pnpm start:prod` = wait for the database, `payload migrate`, then `next start`.
6. Run `pnpm seed` once against production to create the site structure and the
   first admin account. The seed refuses to run in production without an
   explicit admin password, and it never creates delivery records or publishes
   articles.
7. Log in at `/admin`, set the WhatsApp number, and work through the items above.

**HSTS** is only safe once HTTPS is confirmed working on the real domain. Do not
add `preload` until the domain is settled, because it is hard to reverse.

## Backup and recovery

- **Database:** the only irreplaceable data. Enquiries live here. Take
  automated daily backups with point-in-time recovery, and test a restore
  before launch.
- **Uploaded media:** `public/media` on local disk, or the S3 bucket when
  `S3_*` is configured. S3 with versioning is strongly preferred in production;
  local disk does not survive a container rebuild.
- **Content:** everything else is reproducible by running `pnpm seed` against a
  fresh database.
- **Secrets:** stored only in the host's environment configuration. They are
  not in the repository and cannot be recovered from it.
