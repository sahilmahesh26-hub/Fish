# Seeding and media

`pnpm seed` builds the site's structure: site settings, navigation, pages,
sourcing categories, FAQs, six article drafts and the generated artwork. It is
safe to run repeatedly against an existing database.

It deliberately never creates a delivery record, a testimonial, a price, a
customer name or a published article. Those only exist once they are real.

## The idempotency contract

Running the seed twice must leave the database and `public/media` byte for byte
as they were after the first run. Three consecutive runs are checked
automatically:

```bash
pnpm qa:seed-idempotency
```

It seeds three times and asserts that the seeded media rows (key, filename,
checksum, id) and the file listing are identical across all three, and that no
filename has picked up a collision suffix.

### How each kind of record converges

| Record | Matched on | On re-run |
| --- | --- | --- |
| Media | `seedKey` | Checksum compared; file rewritten only if the artwork changed |
| Pages, posts, categories | `slug` | Updated in place, id preserved |
| Globals | singleton | Updated in place |
| FAQs | question text | Skipped if present, so edited answers survive |
| Users | email | Created once, never updated |

### Why media needs a checksum

This was a real bug, and the fix is not obvious.

Payload refuses to reuse a filename that is already taken, and appends `-1`,
`-2` and so on instead. The row being updated still holds its own filename
until the update commits, so passing a file on every seed run renamed
`plate.webp` to `plate-1.webp`, then back to `plate.webp`, alternating forever.
Each rename stranded the previous file: thirty-one orphaned copies of eight
plates had accumulated in `public/media` before it was caught. Worse, pages
prerendered against the previous name returned 500s for their images until the
next full rebuild.

Three things fix it together:

1. **Compare a checksum first.** Each seeded media row stores `seedHash`, the
   SHA-256 of the bytes the seed generated. If the hash matches and the file is
   still on disk, only metadata is updated and the file is never touched. This
   is the normal path, and it is why a re-run changes nothing at all.
2. **Clear the old files before writing new ones.** When artwork genuinely
   changes, the previous file and every generated size are deleted first, so
   nothing is stranded.
3. **Release the row's own filename.** The row is parked on a throwaway name
   for one statement, so the canonical name is free when the new file lands and
   the artwork keeps the name the spec asked for.

Verify the result at any time:

```bash
pnpm qa:media
```

That reports any media row whose file is missing, any file in `public/media`
that no row references, and any seeded filename carrying a collision suffix.

### What the seed will not touch

- **Anything without a `seedKey`.** An image an editor uploads is invisible to
  the seed. It is never renamed, never overwritten and never deleted.
- **An edited FAQ answer**, because FAQs are skipped when already present.
- **Delivery records**, which the seed does not create at all.
- **Published state.** Articles stay drafts; policy pages keep their legal
  review flag.

Replacing a seeded image in Payload therefore survives every future seed run:
once you replace the file, its bytes no longer match `seedHash`, and the seed
rewrites it only if you also change the generator, which you will not.

Paths are built with `path.join` against a resolved media directory, and only a
bare basename inside that directory is ever removed, so the same code is
correct on Windows, macOS and Linux.

## QA fixtures

The seed's honest defaults mean several templates have no route to render:
article detail, delivery detail, the populated listings, `Article` structured
data, and a sitemap containing anything beyond the static pages.

```bash
pnpm qa:fixtures apply   # publish articles, clear legal flags, add one delivery
pnpm qa:fixtures reset   # put all of that back
```

Every fixture record is marked `[QA FIXTURE]` in its title. `apply` also swaps
the articles' placeholder bodies for richer test prose so the article template
is genuinely exercised; `reset` restores the original starter bodies, returns
articles to draft, re-flags the policy pages and deletes the fixture delivery.

The script refuses to run against a non-local database.

### Caching, and why a QA run can flap

Pages are cached and revalidated on demand. `apply` and `reset` both call the
running site's revalidation endpoint, but the request returns before every
affected page has re-rendered, so for a few seconds afterwards a cached listing
can still link to an article that has just gone back to draft, and a
just-published article can still 404.

This is ordinary stale-while-revalidate behaviour, not a bug, and it has the
same shape in production: an editor who unpublishes something urgently will see
it linger briefly. Two practical consequences:

- Point the fixtures at the site you are testing, or the revalidation goes to
  the wrong origin: `BASE_URL=http://127.0.0.1:3320 pnpm qa:fixtures reset`.
- Give it a few seconds before running `pnpm qa:links`, which otherwise
  reports the transient 404s as broken links.

Production builds are made from a reset database, so no fixture can reach a
production build. `pnpm qa:media` and the e2e content tests both assert the
honest state.

## Regenerating the artwork

The generated plates live in `src/seed/placeholders.ts`. Changing the generator
changes the checksum, so the next seed run rewrites every affected image in
place, keeping ids and every relation intact. Run `pnpm qa:media` afterwards.
