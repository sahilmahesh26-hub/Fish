# Security

What this site does to protect the people who use it and the data they send,
and — where a control is weaker than it looks — exactly how.

---

## Content Security Policy

Built per request in `src/proxy.ts` (Next 16 renamed the `middleware` file
convention to `proxy`; behaviour is unchanged).

### The public policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'          (+ the configured analytics origin)
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob:                 (+ media and analytics origins)
media-src 'self' blob:                     (+ media origins)
font-src 'self'
connect-src 'self'                         (+ media and analytics origins)
frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'self'
upgrade-insecure-requests
```

`'unsafe-eval'` is set in development only, where React's development build
requires it. **It is never set in production.**

### Why there is no nonce

This was a real production-only bug, and the reasoning matters more than the
result.

Most of this site is statically prerendered, which is what makes it fast and
indexable. A nonce must be minted per request, so a prerendered document cannot
carry one. Worse, a nonce-based policy implies `'strict-dynamic'`, which makes
browsers ignore `'self'` and every host source. Applied to static output, the
result is a site whose JavaScript silently never runs — every script on every
prerendered page refused, while the development server looked perfectly fine.

The fix was not to force the public site dynamic; that would cost the
performance and indexability the static rendering exists for. It was to drop the
nonce, let Next's inline bootstrap run under `'unsafe-inline'`, and keep every
other directive tight.

**What this costs.** `script-src 'unsafe-inline'` means the policy does not stop
an injected inline `<script>`. What still holds: no external script from an
unapproved origin, no `eval`, no plugins, no `<base>` injection, no form posting
off-site, no framing by a third party. XSS defence therefore rests on React's
escaping and on Payload's field validation, which is where it rests in most
statically-rendered sites.

If a genuinely dynamic route ever needs a nonce, scope it to that route group
and render it dynamically. Do not reintroduce a nonce expectation in `proxy.ts`,
where it applies to build-time static output.

### The admin policy

The Payload admin bundle evaluates code at runtime, so a `script-src` it could
live with would need `'unsafe-eval'` — the very thing the public policy exists
to forbid. Rather than choose between a policy that breaks the CMS and one that
legitimises `eval`, `/admin` and `/api/` get only the directives that do not
touch script execution:

```
frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests
```

Clickjacking, `<base>` injection, plugin embedding and form exfiltration are
still closed off. Script execution is left to Payload's own model and the
session authentication in front of it. "Not the public policy" is not the same
as "no policy".

---

## Other response headers

Set in `next.config.mjs` for every response.

| Header | Value | Why |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Stops a browser second-guessing a declared content type. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | A full path is never sent to a third party — the confirmation URL carries a request ID. |
| `X-Frame-Options` | `SAMEORIGIN` | Belt and braces with `frame-ancestors`, for older browsers. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Nothing here needs any of them. |
| `X-Powered-By` | removed | Advertising the framework version is free reconnaissance. |

### HSTS

Emitted **only** when `NEXT_PUBLIC_SITE_URL` already starts with `https://`.

Sending HSTS from an origin that is not fully HTTPS locks visitors out in a way
that cannot be undone from the server — the browser remembers it for the full
`max-age`. So it is gated on the site knowing it is HTTPS, not on a build flag.

`preload` is a separate and much stronger commitment: submission to the preload
list is effectively irreversible for months and covers every subdomain. It stays
off until an operator sets `HSTS_PRELOAD=true`, having confirmed the apex and
every required subdomain serve HTTPS.

---

## HTTPS enforcement

`src/proxy.ts` returns a 308 to the HTTPS equivalent of the same URL when the
forwarded protocol is plain HTTP.

The deciding inputs are the **forwarded headers**, not what Next sees:

- `x-forwarded-proto` decides the protocol. `request.nextUrl.protocol` reflects
  the internal hop behind a terminating proxy and would cause a redirect loop.
- `x-forwarded-host` (first entry, for a request that crossed several proxies),
  falling back to `Host`, decides the destination. Using `request.nextUrl.host`
  meant every real request looked like it came from localhost, and **the
  redirect silently never fired**. That regression is now covered by
  `tests/e2e/security.spec.ts`.

localhost and `127.0.0.1` are never redirected, so a production build stays
testable locally. No redirect runs in development.

---

## Secrets

### Server-only

`DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`,
`S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `SMTP_USER`, `SMTP_PASS`,
`SEED_ADMIN_PASSWORD`.

Verified absent from the built client bundle — both the variable names and the
values — and absent from served HTML, which `tests/e2e/security.spec.ts` checks
on every run.

`src/lib/env.ts` **cannot** carry a `server-only` guard: it sits on
`payload.config`'s import path, which the CLI scripts (`pnpm seed`,
`payload migrate`, the QA fixtures) also load, and outside Next's bundler that
package throws and every script dies. The invariant is pinned by a unit test
instead: no zero-argument helper exported from that module may return a
credential's value. The credential helpers there return a boolean — *whether* S3
or SMTP is configured, never the configuration. Anything needing an actual
secret reads `process.env` at its own call site, inside a module that is
unambiguously server-side. `src/lib/payload.ts` and `src/lib/queries.ts`, which
are not on the CLI path, do carry the guard.

### Public by necessity

Every `NEXT_PUBLIC_*` variable in this project, and why each one has to be
readable in the browser:

| Variable | Why it must be public |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The site's own address. It appears in canonical URLs, the sitemap and absolute social-image URLs — all of which are published. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Rendered as a `wa.me` link the visitor clicks. It is a published business contact number, not a credential. |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | Decides which provider script the browser loads. |
| `NEXT_PUBLIC_ANALYTICS_ID` | The site or property identifier, which appears in the provider's own script tag by definition. |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | The `src` of a script tag. |

None is a credential. No secret is prefixed `NEXT_PUBLIC_`.

### Source control

No `.env` file has ever been committed — only `.env.example`, whose values are
all empty. `.gitignore` covers `.env`, `.env.local` and `.env*.local`. A scan of
the tracked tree for secret-shaped assignments returns nothing.

### The first admin account

`pnpm seed` creates a super-admin from `SEED_ADMIN_EMAIL` (default
`admin@finquiry.local`) and `SEED_ADMIN_PASSWORD`. **There is no default
password.** In production the seed refuses to create the account without one; in
development it generates a random password and prints it once.

A constant would have meant that anyone running the documented bootstrap command
against a real database created a super-admin whose password is published in
this repository.

### Logging

The enquiry action logs only the error and the request ID. No name, phone
number, email address, PIN code or requirement text reaches a log. The admin
notification email carries the request ID, the fish description and the
destination city, and points staff to Payload for the rest — it goes to the
business's own inbox.

---

## The enquiry form

The only public write path into the Enquiries collection. The collection denies
public create, so everything arrives through the server action in
`src/app/(frontend)/source-a-fish/actions.ts`, in this order:

1. **Origin check.** An explicit comparison against the configured site URL and
   the host the request arrived on. Next already compares `Origin` to `Host` for
   Server Actions; this is a second layer, and the one an auditor can read. A
   request with no `Origin` is allowed — some privacy tooling strips the header,
   and refusing those would break real submissions to stop an attack the header
   does not prevent anyway.
2. **Attempt rate limit**, generous. See below.
3. **Honeypot.** A filled `website` field returns the generic success shape
   without writing anything, so a bot learns nothing from the difference.
4. **Schema validation** against the same Zod schema the client uses.
5. **Time-to-submit check**, deliberately *after* validation — run before it, a
   fast typist or autofill user would get a confusing "too quick" message
   instead of their real field errors.
6. **Duplicate guard.** See below.
7. **Creation rate limit**, strict.
8. **Upload validation**, then the write.

### Rate limiting, in two tiers

Counting every attempt against one strict limit meant somebody who mistyped
their phone number twice had spent three of their five chances before sending
anything — the protection was punishing the people it was meant to serve.

- **Attempts**: `ENQUIRY_RATE_LIMIT_MAX × 8` per window (default 40 per 10
  minutes), checked first. Enough that correcting mistakes is never noticed, low
  enough that a script cannot sit on the endpoint.
- **Creations**: `ENQUIRY_RATE_LIMIT_MAX` per window (default 5 per 10 minutes),
  charged only when a submission is about to become a real enquiry.

Both return the same message, so neither reveals which tier was hit. The key is
the client IP from `x-forwarded-for`; no cookie or fingerprint is involved.

**Limitation:** the limiter is in-memory and therefore per-process. It does not
protect a horizontally-scaled deployment on its own — put a shared store or an
edge rate limit in front of one.

### Duplicate submissions

The browser mints one `crypto.randomUUID()` per filled-in form. A double click,
an impatient retry or a resubmitted navigation all carry the same token, and the
server returns the **original** request ID rather than opening a second enquiry
or showing an error the customer cannot act on.

The lookup is against the database, not an in-memory set: a retry can land on a
different instance, where an in-memory guard would let it straight through.

The token is validated as a UUID before it reaches that query, and an empty
value is treated as absent. Failing a whole enquiry over a missing idempotency
key would be a worse outcome than the duplicate it prevents.

### Uploads

A reference image is checked for MIME type and size, then written to
`private-media` — a collection with no public read access, served only through
an authenticated route. It can never appear in the public media library or be
listed by the public API.

### CAPTCHA

Deliberately absent. The brief asks for one only if the lighter controls prove
insufficient; there is no evidence yet, and a CAPTCHA is an accessibility and
privacy cost paid by every genuine customer.

---

## Cookies and consent

One first-party cookie, `finquiry_consent`, holding a versioned record of the
choice. No third-party consent platform.

| Category | Contents | Set before consent? |
| --- | --- | --- |
| Necessary | `finquiry_consent` itself; the Payload session cookie on `/admin` | Yes — the site cannot work otherwise |
| Analytics | Whatever the configured provider sets | **No** |

The gate is structural, not a runtime flag: with no consent the provider's
`<Script>` is never rendered, so no third-party request is made at all.
Withdrawing consent unmounts it and clears the analytics cookies.

Accept and Reject are identical in size, weight and colour — neither choice is
nudged. The banner is a `region`, not a modal: it does not trap focus or block
the page. The preferences dialog *is* a real modal, with a focus trap and
Escape to close.

---

## Known limitations

- **`script-src 'unsafe-inline'`** on the public site. Explained above; the
  alternative breaks static rendering.
- **The rate limiter is per-process.** Fine for one instance, insufficient for
  several.
- **No CAPTCHA.** A deliberate trade; revisit with evidence of abuse.
- **The admin has no `script-src`.** Payload requires `eval`; the directives
  that can be set, are.
- **Enquiry data lives in the application database.** There is no separate
  encryption at rest beyond whatever the database provider offers.
