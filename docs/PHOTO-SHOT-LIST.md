# Photography shot list

Every image on the public site is currently generated dark-water artwork. It is
deliberate, branded and honest: it depicts water, never a fish, so no visitor
can mistake it for a specimen Finquiry holds. Replacing it with real
photography is the single largest remaining visual upgrade.

## How replacement works

Replacing an image is a CMS task, not a code change. Upload the new file in
Payload against the field named below and every page using it updates. No
deploy, no rebuild, no developer involvement.

1. Open **Payload admin → Media**.
2. Filter by the tag `placeholder` to see everything still awaiting real
   photography.
3. Either upload a new file and repoint the field, or open the existing record
   and replace its file in place. Replacing in place keeps the record id, so
   every page already pointing at it picks up the new image immediately.
4. Rewrite the **Alt text** to describe the new photograph. The generated
   artwork's alt text describes water; a specimen photograph must describe the
   specimen.
5. Clear the `placeholder` tag and fill in **Credit / source**.
6. Record the usage rights in the table below.

> The seed never overwrites a file whose bytes it did not generate. Once you
> replace an image, `pnpm seed` leaves it alone: it compares a checksum first
> and only rewrites artwork it still recognises as its own.

## Art direction

One consistent treatment across the whole set, because the site grades every
CMS image identically (`--image-filter`, a slight desaturation and contrast
lift, in `src/styles/tokens.css`).

- Dark water. Near-black backgrounds, light entering from one direction.
- Shot against a dark ground, not a bright aquarium wall or a shop tank.
- Specimen fills the frame or is cropped confidently. No small fish adrift in
  a large empty rectangle.
- Fins, scales, gill plate and colour transitions readable at 100%.
- No visible price tags, shop signage, nets, bags, hands or people.
- No text, watermark or logo burned into the image.
- Landscape frames need usable space on the leading edge, because type sits
  over them.

Avoid: bright white gravel, blue-lit shop tanks, flash glare on glass, heavy
vignettes, obvious phone-camera HDR, and any image implying a fish is in stock
or has been delivered.

## Priority 1 — the first screen

| Page / section | CMS field | Subject | Orientation | Aspect | Min dimensions | Suggested shot | Alt-text guidance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage hero | Homepage → Hero → `heroImage` | Dark water, or a specimen cropped very close and low-contrast enough for white type over it | Landscape | 3:2 | 2400 × 1600 | Light entering top-right, falling away to black bottom-left; leading third kept quiet for the headline | Describe the water and the light, not the brand |
| Social sharing card | Site Settings → SEO defaults → `image` | Brand-safe wide crop | Landscape | 1.91:1 | 1200 × 630 | Same treatment as the hero, centred, nothing important near the edges | Short; it is read as a link preview |

> Until a real file is uploaded to Site Settings → SEO defaults → `image`, the
> site serves its own generated brand card at `/og/default.png`, which carries
> the Finquiry wordmark. That is the better fallback, so leaving this field
> empty is a valid choice.

## Priority 2 — the sourcing categories

Seven tiles on the homepage, each 4:5 portrait, each cropped to the same
treatment so the grid reads as one set.

| Page / section | CMS field | Subject | Orientation | Aspect | Min dimensions | Suggested shot | Alt-text guidance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Category: Arowanas | Sourcing Categories → Arowanas → `image` | Arowana, side profile | Portrait | 4:5 | 1200 × 1500 | Head and shoulder crop, scale detail readable, dark ground | Name the variety only if you are certain of it |
| Category: Stingrays | Sourcing Categories → Stingrays → `image` | Freshwater ray, from above | Portrait | 4:5 | 1200 × 1500 | Disc pattern filling the frame | Describe the pattern |
| Category: Monster fish | Sourcing Categories → Monster fish → `image` | Large-growing species | Portrait | 4:5 | 1200 × 1500 | Mass and scale conveyed by the crop | Describe the fish, not its size in litres |
| Category: Exotic freshwater fish | Sourcing Categories → Exotic freshwater fish → `image` | Uncommon variety | Portrait | 4:5 | 1200 × 1500 | Colour transition as the subject | Describe colour and markings |
| Category: Predatory fish | Sourcing Categories → Predatory fish → `image` | Predatory species | Portrait | 4:5 | 1200 × 1500 | Head-on or three-quarter | Neutral wording, no drama |
| Category: Specific-size specimens | Sourcing Categories → Specific-size specimens → `image` | Any specimen with a scale reference | Portrait | 4:5 | 1200 × 1500 | Fish against a measured background | Do not state a size you cannot verify |
| Category: Special collector requests | Sourcing Categories → Special collector requests → `image` | Abstract or detail crop | Portrait | 4:5 | 1200 × 1500 | Texture rather than a whole fish | Describe the texture |

## Priority 3 — the specimen record

The homepage section that shows a collector what a record looks like.

| Page / section | CMS field | Subject | Orientation | Aspect | Min dimensions | Suggested shot | Alt-text guidance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Specimen record, main | Homepage → Specimen record block → `mainImage` | One specimen, full body | Landscape | 5:4 | 1600 × 1280 | The frame a collector would actually be sent | Describe the specimen plainly |
| Specimen record, detail A | Homepage → Specimen record block → `detailImages[0]` | Close crop: gill plate or fin | Square | 1:1 | 900 × 900 | Macro, same lighting as the main frame | Name the body part shown |
| Specimen record, detail B | Homepage → Specimen record block → `detailImages[1]` | Close crop: scale or colour transition | Square | 1:1 | 900 × 900 | Macro, same lighting | Name what is shown |

> The detail crops are optional. With none uploaded the record renders as a
> sheet of data with one photograph, which is a deliberate layout, not a
> degraded one. Do not upload filler to fill the column.

## Priority 4 — supporting pages

| Page / section | CMS field | Subject | Orientation | Aspect | Min dimensions | Suggested shot | Alt-text guidance |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Custom Aquariums, feature | Page: Custom Aquariums → Aquarium feature block → `image` | A finished installation | Landscape | 5:4 | 1600 × 1280 | Lit tank in a real room, shot dark | Describe the installation |
| Custom Aquariums, detail | Page: Custom Aquariums → Aquarium feature block → `detailImages` | Equipment or cabinetry detail | Square | 1:1 | 900 × 900 | Macro on a join, sump or light rail | Name the component |
| Knowledge article | Posts → *article* → `featuredImage` | Relevant to the article | Landscape | 8:5 | 1600 × 1000 | Whatever the article is actually about | Describe the image, not the headline |
| Delivery record | Deliveries → *record* → `mainImage` | The specimen that was delivered | Landscape | 5:4 | 1600 × 1280 | The specimen, with the customer's permission | Describe the specimen |
| Brand mark | Site Settings → Branding → `logo`, `logoOnDark` | Finquiry wordmark | Square | 1:1 | 512 × 512 | Flat PNG or SVG-derived raster, transparent where possible | `Finquiry logo` |

## Usage rights

Nothing goes on the public site without a confirmed right to use it. Photographs
of a customer's fish also need that customer's permission, separately from the
photographer's.

Fill one row per uploaded image.

| Image file | Source | Photographer / owner | Licence | Customer permission (deliveries only) | Confirmed by | Date |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Acceptable sources: photography Finquiry commissioned or took; images a
supplier has given written permission to use; stock with a verified commercial
licence covering web use. Not acceptable: images found through a search engine,
taken from a supplier's website or social account without written permission,
or any stock file whose licence has not been checked.
