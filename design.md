# PawScales design system (v2)

- Site: https://pawscales.com
- v2 written 2026-10-10 after the owner reviewed the first build. **v2 replaces v1 completely.**
- Owner direction: "use images and things like wildone.com". Clean, modern, photo-led, professional and compact. No AI look.
- `pawscales-build-spec.md` wins on content, SEO and maths; this file wins on visuals.

---

## 0. Why v1 failed (do not repeat)

- Text-only pages: no photos, home page was three lists of links. It read like documentation.
- Warm beige page background + book serif headings looked old-fashioned.
- Footer repeated every tool link, so the mobile page doubled in length.
- Calculator details: lb/kg toggle not aligned with its field, a segmented option wrapping alone onto a new line, chart label overlapping the line.

## 1. Direction

**Wild One's visual language applied to a calculator site.** We borrow the feel, not their brand: white canvas, one confident modern sans at medium weight, big real photos in clean square tiles, soft solid color bands to separate sections, rounded pill buttons, small labels, lots of breathing room around photos but compact text. The tools stay as compact and fast as NerdWallet's.

What we take from wildone.com (studied 2026-10-10):
- White background everywhere; color only as full-width soft bands or solid blocks.
- Headline font at weight 500, not bold (their H1 is 40 px / 500, H2 24 px / 500).
- Photo tiles in a 4-column grid with 8 px gaps, label + arrow under each photo.
- Split hero: solid color block on one side, full-height photo on the other.
- Pill buttons (44 px tall, fully rounded), small pill badges on photos.
- Minimal header: few links, logo, search icon.

What we do NOT copy: their logo, their wavy/scalloped edge, their product photography, their purple/lavender band, their lime as a dominant color, their carousel.

## 2. Hard rules (MUST)

1. No gradients (backgrounds, buttons, text, borders). Only exception: a 0–35% black overlay under text on a photo.
2. No purple, violet, lavender, indigo, neon or "AI blue".
3. No emoji anywhere.
4. No card, callout or table with a one-sided colored border. Borders are all four sides or none.
5. Real photographs only (section 8). Never AI images, cartoons, drawn animals or stock illustrations.
6. One font family for everything (section 4). No serif.
7. Body text 16 px minimum; UI labels 13 px minimum; H1 max 44 px.
8. Icons only for function (search, menu, copy, share, print, chevrons, arrow-right, info, alert, external).
9. No fake numbers, ratings, testimonials, "trusted by" logos or badges claiming awards.
10. No carousels, autoplay, parallax, popups or scroll animations.
11. Works at 360 px with no horizontal page scroll; nothing wraps awkwardly (test every control at 360 px).

## 3. Color

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--ink` | `#111312` | Headings, body text, primary buttons on light bands |
| `--muted` | `#5E6360` | Secondary text (6.1:1 on white) |
| `--line` | `#E6E4DF` | Dividers, card and table borders (decorative) |
| `--field` | `#7D837F` | Input and checkbox borders (≥ 3:1 for UI controls) |
| `--sand` | `#F5F3EF` | Neutral band, table header, input group bg, footer |
| `--brand` | `#1F5C45` | Spruce green: links, primary buttons, chart line, logo (7.9:1 on white) |
| `--brand-hover` | `#174836` | Hover/pressed |
| `--sage` | `#DDEBDF` | Dog tools color block and bands (ink on sage 15.1:1) |
| `--sky` | `#DCE9F2` | Cat tools color block and bands |
| `--butter` | `#F4E9C8` | Size charts color block and bands |
| `--lime` | `#E9F2B5` | Home hero block only, plus "Your result" table row highlight |
| `--accent` | `#E8A93A` | The user's point on charts; tiny badges ("New"). Never text, never large fills |
| `--danger` | `#B42318` | Errors |

Each hub has its own block color: Dog tools = sage, Cat tools = sky, Size charts = butter. A tool page's top band uses its hub color. This gives the site Wild One-style color without any purple.

## 4. Typography

- **One family: Figtree** (Google Fonts, variable, weights 400 / 500 / 600). Geometric, friendly, modern, very close in spirit to Wild One's "Modern Era". Load with `next/font/google`, `display: swap`.
- Numbers in results, tables, inputs, charts: `font-variant-numeric: tabular-nums`.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Letter-spacing: headings -0.01em; overline labels +0.04em uppercase.

| Role | Desktop | Mobile | Line height | Weight |
|---|---|---|---|---|
| H1 | 40 px | 30 px | 1.12 | 500 |
| H2 | 26 px | 22 px | 1.25 | 500 |
| H3 | 18 px | 17 px | 1.35 | 600 |
| Lead / quick answer | 18 px | 16 px | 1.55 | 400 |
| Body | 16 px | 16 px | 1.6 | 400 |
| Label | 14 px | 14 px | 1.4 | 500 |
| Small / caption / breadcrumb | 13 px | 13 px | 1.45 | 400 |
| Overline | 12 px uppercase | 12 px | 1.3 | 600 |
| Result number | 44 px | 36 px | 1.05 | 500, tabular |
| Tile label | 16 px | 15 px | 1.3 | 500 |

Links in body text: `--brand`, underlined (1 px, offset 3 px). Nav links: `--ink`, no underline, underline on hover.

## 5. Layout, spacing, shape

- Container 1200 px max; side padding 16 / 24 / 40 px (mobile / tablet / desktop).
- 4 px grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- Sections: 48–64 px apart desktop, 40 px mobile. Bands are full-bleed (edge to edge), content inside the container.
- Radius: 999 px (buttons, chips, badges, segmented control), 12 px (inputs), 16 px (cards, calculator, photos in cards, tables). Photo tiles in grids: 4 px radius (Wild One uses nearly square corners).
- Shadow: only the calculator card and search dialog: `0 1px 2px rgba(17,19,18,.05), 0 8px 24px rgba(17,19,18,.06)`.
- Reading column 720 px. Tool pages with 4+ H2s get a sticky table of contents (260 px) on desktop.

## 6. Page templates

### 6.1 Header (64 px desktop, 56 px mobile, white, 1 px `--line` bottom border, sticky on desktop)

```
Dog tools  Cat tools  Size charts        [logo PawScales]        About   (search icon)
```
- Desktop: links left, logo centered, About + search right (Wild One pattern). Mobile: logo left, search + menu icons right; menu = full-width sheet with the 3 hubs (each with its color chip) and About.
- Search opens a dialog: pill input, results list with hub color dot + tool name.

### 6.2 Home

```
┌──────────────── lime block (50%) ───────────────┬──────── photo (50%) ────────┐
│ Free dog and cat calculators,                    │                             │
│ built on real data            (H1 40/500)        │   real photo: happy dog     │
│ One line: what we do, with numbers.              │   and cat together, bright  │
│ [ Search tools ...                        ]      │                             │
│ (Puppy weight) (Dog years) (Pregnancy)  pills    │                             │
└──────────────────────────────────────────────────┴─────────────────────────────┘
Dog tools                                                    View all ->
[photo tile][photo tile][photo tile][photo tile]   4 cols desktop, 2 cols mobile
 Puppy weight ->  Pregnancy ->   Dog years ->  Dog food ->
(sky band) Cat tools  [tile][tile][tile]
Size charts  [tile][tile][tile]
(sand band) Popular answers: 4 small white cards, each = one fact with a bold number + link
Who's behind PawScales: 2 lines + link (no photo)
Footer
```
- Hero on mobile: photo on top (4:3, max 260 px tall), lime block below with H1, search, pills. The H1 text, not the photo, must be the LCP element: give the photo `fetchpriority="low"` on mobile and keep it small.
- Tiles: 1:1 photo, 4 px radius, label + arrow below (16 px / 500), one-line description below in muted 14 px on desktop only. Whole tile is the link. Hover: photo scales 1.02 over 200 ms, label underlines.

### 6.3 Tool page

```
(hub-color band, full bleed)
┌ container ──────────────────────────────────────────────────────────────┐
│ Breadcrumbs                                           ┌──────────────┐  │
│ H1 Puppy Weight Calculator (40/500)                   │ photo 4:3    │  │
│ Quick answer (18 px)                                  │ 16 px radius │  │
│ By Sikander Malik · Updated Oct 10, 2026 · Sources    └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
   ┌──────────── calculator card (white, 16 radius, shadow) ──────────────┐   <- overlaps the band's bottom edge by 48 px
   │ inputs (5/12)                │ result panel (7/12, --sand bg, 12 r)  │
   └──────────────────────────────────────────────────────────────────────┘
   Disclaimer (13 px muted)
article (720) | sticky TOC (260)
```
- Mobile: band holds breadcrumbs, H1, quick answer, author line; photo is NOT shown above the tool on mobile (show it after the "How to use" section, 16:9). Calculator card follows the band with a 16 px overlap. Inputs stack above the result. Sticky bottom result bar (56 px) once the result card scrolls away.
- Chart pages (crate, collar, harness, kitten age) use the same band; the card is a one-row size finder, then the main table.

### 6.4 Hub page

Hub-color band with H1 + 2-line intro, then the tool tiles grid (same as home), then "Which tool do I need?" table, then FAQ.

### 6.5 Text pages

White, 720 px column, H1 40/500, "Last updated", body. No band.

### 6.6 Footer (`--sand`, compact)

```
PawScales logo + one line ("Free dog and cat calculators, built on real data.")
Tools: Dog tools · Cat tools · Size charts        Company: About · How we calculate · Editorial policy · Contact
Legal: Privacy · Terms · Disclaimer · Affiliate disclosure · Sitemap · Photo credits
© 2026 PawScales. Estimates only, not veterinary advice.
```
Do not list every tool in the footer (hubs and the HTML sitemap do that). Mobile footer height target: under 420 px.

## 7. Components

### 7.1 Buttons
- Primary: `--ink` background, white text, 15 px / 500, height 44 px, padding 0 22 px, radius 999. Hover `#2A2E2C`.
- Brand: `--brand` background, white text (used for the single main action on a page, e.g. "Copy result").
- Secondary: white, 1 px `--ink` border, ink text, radius 999. Hover `--sand`.
- On colored bands, the primary button may be white with ink text (Wild One style).
- Icon + label buttons (Copy / Share / Print): secondary style, 36 px tall, icon 16 px.
- Quick-link pills (home hero): white, 1 px `--line`, 36 px tall, 14 px / 500.

### 7.2 Inputs
- Label above (14 px / 500), helper below (13 px muted).
- Field: height 48 px, 16 px text, padding 0 14 px, 1 px `--field` border, radius 12, white.
- Unit is a suffix inside the field. The lb/kg (or in/cm) switch sits on the SAME row as the label, right-aligned, as a small segmented pill (28 px tall). Never next to the field, never stacked under it.
- Option groups (size, life stage): a horizontally scrollable row of pills on mobile (no wrapping onto a new line), segmented pills on desktop; if more than 5 options, use a styled `<select>`.
- Focus: 2 px `--brand` border + 4 px `rgba(31,92,69,.15)` halo. Error: `--danger` border + message under the field.
- `inputMode="decimal"`, accepts comma or dot.

### 7.3 Result panel (`--sand` background, radius 12, padding 24)
- Overline → big number (44 px / 500, tabular) with unit at 22 px muted → range line → divider → 2–4 rows (label left, value right) → chart/timeline → actions.
- Live update as the user types (debounce 150 ms), 150 ms fade on number change.
- `aria-live="polite"`.
- "Show the math": `<details>` in a white box inside the panel.

### 7.4 Photo tile (home, hubs, related tools)
- 1:1 image, radius 4, `object-fit: cover`, focal point from `photos.ts`.
- Optional badge top-left: pill, white bg, 12 px / 600 ink text (only "New" or "Popular", and "Popular" only if analytics confirm it).
- Label row: tool name 16 px / 500 + arrow-right icon 16 px.

### 7.5 Note boxes
- White card, 1 px `--line` border all sides, radius 16, padding 20. Label line 14 px / 600 with a 16 px icon ("Note" with info icon in ink; "See your vet if" with alert icon in `--danger`). No colored background fills, no side stripes.

### 7.6 Tables
- Wrapper: 1 px `--line` border on all four sides, radius 16, overflow hidden; horizontal scroll inside the wrapper on small screens with a fade hint on the right edge.
- Header row: `--sand`, 13 px / 600.
- Rows: 15 px, min height 44 px, 1 px `--line` between rows across the full width, no vertical lines, no zebra.
- Numbers right-aligned, tabular. The user's row: `--lime` background across the whole row plus a small "Your dog" pill in the first cell.
- Caption above (H3), source below (13 px muted, linked). Interpolated values get an asterisk and a footnote.

### 7.7 Charts
- SVG, server-rendered default. Horizontal grid lines only (`--line`), axis labels 12 px muted with round tick values (0, 10, 20, 30... or 0, 25, 50...), never odd values like 61.
- Median line 2.5 px `--brand`; P25–P75 band `rgba(31,92,69,.12)`; user point 10 px `--accent` dot with 2 px white ring. The label sits in a small white pill offset above-left of the dot, with collision logic so it never overlaps the line (place it on whichever side has more space).
- Text equivalent below every chart.

### 7.8 FAQ
- `<details>` rows, 1 px `--line` between rows (complete dividers, top and bottom of the group), question 17 px / 500, plus/minus icon right. Answers always in the DOM.

### 7.9 Author box
- White card, 1 px `--line`, radius 16, padding 20. 48 px circle monogram "SM" (`--sage` bg, `--brand` text, 18 px / 600). Name 16 px / 600, bio, links "About Sikander" and "Editorial policy", "Last updated".

### 7.10 Breadcrumbs
- 13 px muted, "/" separators, current page plain text.

### 7.11 Ads (when enabled)
- "Advertisement" 11 px label, reserved min-height, never between inputs and result, never above the tool on mobile.

## 8. Photography (MUST)

Photos are now the main visual. Every tool, hub and the home hero needs one.

- Sources: **Unsplash** (unsplash.com/license) or **Pexels** (pexels.com/license) only. Record each in `lib/data/photos.ts`: `id, file, sourceUrl, photographer, photographerUrl, license, alt, focalX, focalY, usedOn[]`. Credit on `/photo-credits/` and in a 12 px caption under page photos.
- Never AI-generated or AI-edited. Reject photos with garbled text, odd anatomy, watermarks, visible brand logos, or people's faces as the main subject.
- Never imply a photo shows Sikander's dog.
- **Look (match Wild One):** bright natural light, clean light or plain backgrounds (white wall, light floor, grass, sky), the animal clearly the subject, true colors, no heavy filters, no dark moody shots. Prefer photos where the animal looks at the camera or is doing the thing the page is about.
- Subject per page (search terms to use):

| Page | Photo subject |
|---|---|
| Home hero | dog and cat together, bright home |
| Puppy weight calculator | puppy on a scale or puppy close-up on a light floor |
| Dog pregnancy calculator | pregnant dog resting / mother dog with newborn puppies |
| Dog years calculator | senior dog with grey muzzle |
| Dog food calculator | dog with food bowl |
| Raw dog food calculator | dog bowl with raw food / dog eating |
| Dog heat cycle calculator | adult female dog outdoors (no explicit content) |
| Cat years calculator | older cat portrait |
| Kitten age chart | young kitten close-up |
| Cat food calculator | cat at food bowl |
| Dog crate size chart | dog in a wire or plastic crate |
| Dog collar size chart | dog wearing a plain collar, close-up |
| Dog harness size chart | dog wearing a harness on a walk |
| Hubs | Dog tools: dog running; Cat tools: cat lounging; Size charts: dog being measured or on a leash |

- Formats: AVIF + WebP + JPEG fallback via `<picture>`, explicit `width`/`height`. Sizes: tiles 300 / 600 px, page photo 560 / 1120 px, hero 720 / 1440 px. Quality ~60 AVIF / ~75 WebP. ≤ 180 KB of images above the fold on desktop, ≤ 120 KB on mobile.
- `loading="lazy"` for everything below the fold. Alt text plain and specific.
- OG images (1200×630): left half hub color block with the H1 in Figtree 500, right half the page photo. No emoji, no gradient.

## 9. Logo

- Wordmark "PawScales" in Figtree 600, `--ink`, letter-spacing -0.02em. Optional small mark: a 24 px rounded square in `--brand` with three white vertical ticks of rising height (a scale), placed left of the wordmark. No paw clip art.
- Files: `logo.svg`, `logo-square.png` 512×512, favicons (32 px, 180 px, `.ico`).

## 10. Motion and feel

- 150–200 ms `ease-out` on color, background, border and the tile photo scale (1.02). Nothing else animates.
- `prefers-reduced-motion`: remove all transitions.
- Instant calculations, no "Calculate" button. Inputs stored in the URL hash for sharing.
- CLS 0, INP < 200 ms, JS per tool page < 90 KB gzipped.

## 11. Accessibility

WCAG 2.2 AA: visible labels, focus rings (2 px brand + halo), 44 px touch targets, `aria-live` results, chart text equivalents, `<th scope>`, skip link "Skip to calculator".

## 12. Implementation notes

- Tokens as CSS variables in `app/globals.css`, mapped in `tailwind.config`. Ban default Tailwind palette classes (lint/test).
- Restyle shadcn/ui to these tokens (radius, borders, no default ring colors).
- Keep the `/design/` showcase page, updated for v2, and add: a photo tile row, a home hero, a tool page band at each hub color, and the mobile pill-scroll option group.

## 13. Visual QA before every push

1. Playwright screenshots of home, one tool page per hub color, one chart page and `/design/` at 360, 768, 1280 px into `qa/screenshots/`.
2. Console clean (no 404s, hydration errors, font failures, missing images).
3. Click through each calculator: every input, unit switch, copy, share round-trip.
4. Check at 360 px: nothing wraps alone onto a line, the unit switch sits on the label row, chart label doesn't overlap the line, footer under 420 px tall.
5. Rule check against section 2 (gradients, purple, emoji, one-sided borders, AI/drawn images, serif, text sizes).
6. LCP element on mobile is text (H1), not a photo.
