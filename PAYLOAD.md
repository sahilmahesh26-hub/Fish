# Finquiry — Payload CMS

How the CMS is put together, and how to use it. The second half is written for
editors and assumes no technical background.

---

## Collections

| Collection                   | Group          | Drafts                 | Purpose                                 |
| ---------------------------- | -------------- | ---------------------- | --------------------------------------- |
| Pages                        | Content        | ✅ autosave, scheduled | Every public route                      |
| Articles                     | Knowledge Hub  | ✅ autosave, scheduled | Knowledge Hub posts                     |
| Categories                   | Knowledge Hub  | —                      | Article taxonomy, supports nesting      |
| Authors                      | Knowledge Hub  | —                      | Bylines                                 |
| Sourcing categories          | Sourcing       | —                      | The kinds of search supported           |
| Delivery stories             | Sourcing       | ✅ autosave            | Completed, consented journeys           |
| Testimonials                 | Sourcing       | —                      | Approved customer quotes                |
| Aquarium services & projects | Aquariums      | ✅ autosave            | Custom aquarium work                    |
| FAQs                         | Content        | —                      | Question and answer pairs               |
| Enquiries                    | Enquiries      | —                      | **Private.** Customer sourcing requests |
| Enquiry uploads              | Enquiries      | —                      | **Private.** Customer reference images  |
| Media                        | Media          | —                      | Public image and video library          |
| Users                        | Administration | —                      | Staff accounts                          |
| Redirects                    | Configuration  | —                      | Added by the redirects plugin           |

## Globals

| Global        | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| Homepage      | Every homepage section. Versioned with autosave        |
| Site Settings | Brand, contact, SEO defaults, analytics, consent       |
| Header        | Navigation, header CTA, announcement bar               |
| Footer        | Brand statement, link columns, policy links, copyright |

---

## Roles

| Role            | Can do                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Super Admin** | Everything, including changing roles and deleting users                                          |
| **Admin**       | Manage all content, media and users except super-admins. Cannot change roles                     |
| **Editor**      | Create and edit content. Can publish **only** if "Editor may publish" is ticked on their account |

Additional rules:

- A deactivated account keeps its history but loses all access immediately.
- Only a super-admin can change a role or the publish permission — an admin
  cannot promote itself.
- Only admins can edit Site Settings. Editors can see it but not change it.
- Analytics settings are super-admin only.

### Publishing is enforced on the server

An editor without publish permission cannot move a document to `published`
through the admin, the REST API or GraphQL. Payload owns the `_status` field when
drafts are enabled, so the rule lives in a `beforeChange` hook
(`src/hooks/publishGuard.ts`) rather than in a hidden button. Local API calls —
the seed, migrations, internal hooks — are exempt, which is the same trust
boundary Payload itself uses.

---

## Access control summary

| Collection                                           | Public read    | Public create |
| ---------------------------------------------------- | -------------- | ------------- |
| Pages, Articles, Delivery stories, Aquarium projects | Published only | ❌            |
| Sourcing categories                                  | Active only    | ❌            |
| FAQs, Testimonials                                   | Published only | ❌            |
| Categories, Authors, Media, Redirects                | ✅             | ❌            |
| **Enquiries**                                        | ❌             | ❌            |
| **Enquiry uploads**                                  | ❌             | ❌            |

Restrictions are `where` clauses, so they are enforced by the database query, not
by hiding fields in the admin UI.

Enquiries deny create even to the public form. The form posts to a server action
that validates, rate-limits and spam-checks first, then writes with
`overrideAccess`. That keeps the one public write path behind our own schema
rather than an open collection endpoint.

---

## Layout blocks

Fifteen controlled blocks, grouped in the admin as Page openers, Content,
Signature sections, Media and Page closers:

Hero · Section Intro · Rich Text · Media and Copy Split · Process Route ·
Category Grid · Specimen Record · Delivery Stories · Aquarium Feature · Image
Gallery · Video · Trust Statements · Featured Articles · FAQs · CTA

Every block has validation, admin descriptions and a **Hide this section**
switch. Background is a fixed `select` limited to the four approved surfaces.

An unrecognised block renders nothing rather than throwing, so removing a block
from the code never breaks a published page.

---

## Editorial workflow

- **Drafts and autosave** on Pages, Articles, Delivery stories, Aquarium projects
  and the Homepage global. Autosave runs every 800ms.
- **Version history** — 30 versions on Pages and Articles, 20 elsewhere.
- **Live preview** on Pages and Articles with mobile, tablet and desktop frames.
- **Scheduled publishing** on Pages and Articles.
- **Slugs** generate from the title and can be overridden. Changing a published
  slug creates a redirect automatically.
- **Redirects** are managed in Configuration → Redirects.

---

# For editors

## Editing a homepage section

1. **Globals → Homepage**.
2. **Hero** tab for the opening. **Sections** tab for everything below.
3. Drag a section by its handle to reorder it.
4. To take a section off the page without losing it, open it and tick **Hide this
   section**.
5. **Save**. Changes appear on the site immediately.

To emphasise a word in the hero headline, wrap it in asterisks:
`Every Collector Is *Searching* for Something.` The asterisked run is set in
Scarlet.

## Creating and publishing an article

1. **Collections → Articles → Create new**.
2. Fill in **Title**, **Excerpt** (used on cards and in search results) and
   **Content**.
3. Set **Category** in the sidebar — it drives the filter chips and related
   articles.
4. Add a **Featured image** and give it alt text in the media library.
5. **Save draft** as you go — autosave is on.
6. **Preview** to see it in place.
7. **Publish**. Reading time is calculated for you.

To schedule instead, choose a publish date in the publish menu.

## Adding a delivery story

Only publish a story when the delivery is real and the customer has agreed.

1. **Collections → Delivery stories → Create new**.
2. **Record** tab: title, public reference, the original requirement, the
   specimen, and origin/destination — **city or state only, never a full
   address**.
3. **Media** tab: main image, gallery and any packing documentation.
4. **Testimonial** tab: only if you hold written permission. You must tick
   **Written permission … is on file** — the record will not save otherwise.
5. Set the **Delivery date**, tick **Featured** to allow it on the homepage, and
   publish.

Never publish private customer information, full addresses, internal vendor
details or an unapproved quote.

## Updating navigation and the footer

- **Globals → Header** — navigation items (drag to reorder), the header CTA, and
  the announcement bar. Paths start with `/`.
- **Globals → Footer** — the link columns, policy links and brand statement.

## Changing WhatsApp or contact details

**Globals → Site Settings → Contact.**

The WhatsApp number is international format, digits only, no `+` or spaces —
e.g. `919876543210`. Every WhatsApp button on the site uses it. **Until it is
set, those buttons do not appear at all**, which is deliberate: a dead link is
worse than no link.

## Replacing hero media

**Globals → Homepage → Hero → Fish image.** Upload a transparent PNG or WebP
cutout of a single fish. It overlaps the hero shapes and drifts gently.

The site ships with placeholder artwork. Everything still needing a real image is
named `placeholder-*` and tagged `placeholder` in the media library — filter by
that tag to find them all.

## Previewing a draft

Open the document and click **Preview**. You must be signed in to the admin —
preview links check both a shared secret and a live staff session, so a shared
link cannot expose unpublished content. A red banner marks a draft preview;
**Exit preview** returns you to the live site.

## Restoring an earlier version

1. Open the document and click **Versions**.
2. Pick a version to see what changed.
3. **Restore this version**, then publish.

## Sourcing enquiries

**Collections → Enquiries.** Each carries a Request ID like `FQ-1709-0001` —
the reference the customer sees and quotes.

Work the **Status** field: new → reviewing → sourcing → options-shared →
approved → closed or unsuccessful. Use **Internal notes** for anything the
customer should not see. The **Internal** tab also records exactly what the
customer consented to, and when.

Customer reference images live in **Enquiry uploads** and are never shown on the
public site.
