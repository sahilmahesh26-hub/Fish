# Finquiry — design system

Bright collector editorial × playful aquatic discovery × confident specialist
service. The site should read like a modern magazine crossed with a collector's
specimen journal — warm, deliberate and a little strange, never a SaaS template.

The reference for the direction was an ocean editorial composition. It was used
for its _qualities_ — a warm canvas, an inner frame inside an outer glow, a fish
cutout crossing organic shapes, fine rules and small annotations — and none of
its artwork, type or colour.

---

## Colour

Four locked foundation colours. Every other value in the system is a documented
tint or shade of one of them; no fifth hue exists.

| Token       | Value     | Share of the page | Role                                                                                                         |
| ----------- | --------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `--linen`   | `#F5F0E8` | 58–62%            | The canvas. Almost every surface.                                                                            |
| `--scarlet` | `#D91A2A` | 18–22%            | The strongest, most memorable accent. Primary CTA, major editorial panels, one emphasised word per headline. |
| `--navy`    | `#081F33` | 10–14%            | Text, borders, footer, selective high-contrast panels.                                                       |
| `--aegean`  | `#1A6FBF` | 6–10%             | Aquatic support only — current lines, bubbles, ripples, contained shapes, links.                             |

### Rules the system enforces

- The first screen is predominantly Sandy Linen.
- Aegean Sky is **never** a full-viewport background. It appears in contained
  shapes, drawn currents, labels and small interactions.
- Block backgrounds are a fixed `select` in the CMS, so an editor cannot
  introduce an off-brand surface.
- No purple, neon cyan, lime, or rainbow gradients.
- The only gradients are the hero's atmospheric glow — transparent tints of the
  four foundation colours — and a faint linen-to-linen wash inside the hero frame.

### Contrast

Every text/background pair meets WCAG 2.2 AA. Two findings shaped the tokens:

**Scarlet is lighter than it looks.** `--scarlet` on `--linen` is **4.48:1** —
just under the 4.5:1 threshold for normal text. So Scarlet is only used at
display sizes on linen, and `--scarlet-ink` (`#B01522`, **6.22:1**) carries every
body-size use: eyebrows, links, list markers, error text.

`--aegean` on linen is **4.55:1**, technically passing but with no headroom, so
`--aegean-ink` (`#155A9B`, **6.24:1**) is the link and body-text value.

**Translucent light text fails on Scarlet.** `--linen-100` at 84% opacity over
Scarlet composites to **4.05:1**. Two tokens keep this straight:

| Token                  | Value                       | Safe on                     |
| ---------------------- | --------------------------- | --------------------------- |
| `--text-on-dark-muted` | `rgb(253 251 247 / 84%)`    | Deep Navy only — **11.2:1** |
| `--text-on-scarlet`    | `--linen-100`, fully opaque | Scarlet — **4.92:1**        |

Body text on a Scarlet panel is always fully opaque. This was a real axe finding,
not a theoretical one.

| Combination              | Ratio  |
| ------------------------ | ------ |
| Navy on Linen            | 14.8:1 |
| `--navy-500` on Linen    | 7.2:1  |
| `--scarlet-ink` on Linen | 6.2:1  |
| `--aegean-ink` on Linen  | 6.2:1  |
| `--linen-100` on Navy    | 16.7:1 |
| `--linen-100` on Scarlet | 4.9:1  |

---

## Typography

Two families, no third.

- **Bricolage Grotesque** — display headings and expressive editorial text.
- **Manrope** — body, UI, forms, navigation, metadata, long-form content.

Both are variable fonts, self-hosted by `next/font` at build time with
`display: swap` and `adjustFontFallback`, so text paints immediately in a
metric-matched fallback. No render-blocking font request, no flash of invisible
text.

### Scale

| Token                | Clamp                                | Used for                 |
| -------------------- | ------------------------------------ | ------------------------ |
| `--fs-hero`          | `clamp(3.25rem, 5.4vw, 6rem)`        | The homepage headline    |
| `--fs-page-title`    | `clamp(3rem, 6vw, 6rem)`             | Page H1                  |
| `--fs-section-title` | `clamp(2.25rem, 4.5vw, 4.5rem)`      | Section H2               |
| `--fs-subsection`    | `clamp(1.75rem, 3vw, 2.75rem)`       | Sub-headings             |
| `--fs-card-title`    | `clamp(1.25rem, 2vw, 2rem)`          | Card H3                  |
| `--fs-lead`          | `clamp(1.0625rem, 1.4vw, 1.3125rem)` | Intros                   |
| `--fs-body`          | `1rem`                               | Body — never smaller     |
| `--fs-small`         | `0.9375rem`, **`1rem` below 768px**  | Secondary content        |
| `--fs-label`         | `0.8125rem`                          | Uppercase microcopy only |
| `--fs-numeral`       | `clamp(3.5rem, 9vw, 8rem)`           | Large section numbers    |

Line heights: `0.94` display, `1.02` titles, `1.6` body. Tracking is `-0.035em`
on display, `-0.02em` on titles.

**Why the hero clamp is 5.4vw and not 7.5vw.** At the brief's suggested scale the
headline wrapped to five lines at 1440×900, left "for" orphaned on its own line,
and pushed both CTAs below the fold on every common laptop size. The coefficient
is tuned so the headline lands on three balanced lines and both CTAs stay visible
at 1280×800, 1366×768 and 1440×900, while still reaching a full 6rem on wide
displays. Verified by measurement, not by eye.

**Why `--fs-small` grows on phones.** Field hints, card excerpts and the
copyright line are read, not skimmed. Below 768px they step up to a full 16px.
`--fs-label` stays small because it is reserved for uppercase microcopy —
eyebrows and metadata — where 13px is conventional and legible.

### A `ch` trap worth knowing

`max-inline-size` in `ch` resolves against **the element's own font**. Setting a
`ch` measure on a wrapper with 16px body text wraps the much larger display
heading inside it to a fraction of its intended width. Every `ch` measure in this
codebase sits on the element that owns the font — headings carry their own, and
`SectionHeading`'s wrapper carries none.

---

## Shape and graphic language

One consistent family, all inline SVG built from the four brand colours, all
`aria-hidden` because all of it is decorative:

Organic pool masks · oval and circular frames · current lines (horizontal and
vertical) · bubble clusters · ripple rings · a light-reflection starburst · route
arrows · specimen stamps · measurement marks · warm paper grain.

Not used: pirates, anchors, wheels, treasure chests, anime, cartoon waves, floral
doodles, or emoji as interface icons.

The **specimen stamp** is real text, not an image, so a request reference stays
selectable, searchable and readable by a screen reader.

### Radii

Deliberately varied — one 16px radius everywhere is the component-library look
the brief rejects.

`--radius-xs` 4px · `--radius-sm` 8px · `--radius-md` 14px · `--radius-lg` 28px ·
`--radius-pill` 999px · `--radius-pool` and `--radius-pool-alt`, eight-value
percentage radii that make an organic blob.

**A rendering bug worth remembering.** An element with an eight-value percentage
radius and `overflow: hidden` can stop painting its child image entirely in
Chromium — every pool-masked image rendered as a flat blob. `CmsImage` now sets
`border-radius: inherit` on the image, so the shape is applied to the image
itself rather than relying on the parent's clip.

---

## Spacing and layout

8px base unit. Content caps at 1320px.

| Breakpoint | Gutter |
| ---------- | ------ |
| 0–767      | 20px   |
| 768–1023   | 32px   |
| 1024–1279  | 48px   |
| 1280–1535  | 64px   |
| 1536+      | 96px   |

Section rhythm is fluid — `--section-y: clamp(4rem, 8vw, 7.5rem)` — never a fixed
oversized gap.

Each major section is art-directed rather than poured into one template: the
process is a weaving route, the categories an asymmetric six-column grid with
controlled overlap, the specimen record a ruled journal sheet, the trust
statements a staggered three-column set on navy, the deliveries a set of tilted
postcards, and the aquarium feature an image under a bold Scarlet panel.

---

## Motion

Subtle, purposeful, and never required for the page to make sense.

| Effect             | Where                           | Constraint                                                                                            |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Pointer parallax   | Hero fish and background shapes | Fine pointers only, capped at 18px, written inside a `requestAnimationFrame` as CSS custom properties |
| Idle drift         | Hero fish                       | 9s breathing loop, disabled while the pointer is driving it                                           |
| Starburst rotation | Hero, CTA                       | 42s, the only continuous animation on the page                                                        |
| Scroll indicator   | Hero                            | 2.2s nudge                                                                                            |
| Hover lift         | Cards                           | Transform and shadow only                                                                             |

Everything animates `transform` and `opacity`, so nothing triggers layout.

**The page is complete without JavaScript.** The hero is rendered entirely on the
server; `HeroMotion` only layers parallax on top. Reveal animations are opt-in:
the CSS hides `[data-reveal]` elements only under `html[data-motion="on"]`, an
attribute set by a client component _after_ it confirms reduced motion is not
preferred. If the script never runs, nothing is ever hidden.

`prefers-reduced-motion: reduce` collapses every duration to ~0 and stops the
starburst and the drift outright.

No scroll hijacking anywhere.

---

## Accessibility decisions baked into the system

- Focus rings are 3px, offset, and never removed. On dark and Scarlet surfaces
  they flip to linen via `[data-on-dark]` / `[data-on-scarlet]`.
- Colour is never the only signal. Form errors carry an icon, a message and a
  thicker border; the FAQ accordion uses a plus/minus shape; active filters
  change fill and weight, not just hue.
- Every interactive target is at least 44×44px, including the skip link and the
  breadcrumb links.
- Decorative images resolve to `alt=""` and `aria-hidden`; alt text is authored in
  Payload and never invented at render time.
- `display: none` is never used to hide something that should stay available to a
  screen reader — the form's step labels use a clip-based visually-hidden
  pattern so the step buttons keep their accessible names on mobile.
