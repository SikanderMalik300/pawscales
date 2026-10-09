# PawScales design system

- Site: https://pawscales.com
- Written: 2026-10-10 by the browser agent, approved direction from the owner (Sikander Malik)
- Applies to every page. `pawscales-build-spec.md` covers content, SEO and maths; this file covers look, feel and interaction. Where they overlap, the build spec wins on content and this file wins on visuals.

---

## 1. Direction in one paragraph

PawScales should feel like a calm, trustworthy pet reference book that happens to have very good calculators: think NerdWallet's calculator layout with the warmth of a field guide. Warm paper background, deep forest green, one small amber highlight, real photographs of dogs and cats, a serif for headings and a clean sans for everything else. Dense and compact, never cramped. Nothing on the page is decoration for its own sake: every element either answers the question, helps the visitor enter data, or proves where a number came from.

### What we learned from the research (2026-10-10)

| Source | What to take | What to avoid |
|---|---|---|
| NerdWallet mortgage calculator | Inputs card on the left, result card on the right; prefixed/suffixed unit fields; segmented buttons for options; one big result number, then a breakdown list and a summary row; table of contents beside long content; disclaimer in small text under the tool | Heavy green banner hero (too tall for us) |
| Omni Calculator | Compact type (13–14 px UI text), tool visible above the fold, "Last updated" and author near the H1 | Pale gradient blob background, ad gap above the H1 |
| PupPilot (competitor) | Two-column calculator with result first on the right; "% of adult weight" and "full size by" as secondary results | Dark SaaS hero, purple result text, Inter + Poppins, 20 px body text with low-contrast grey (#A9A9BC), emoji-like icons in result rows |
| Dribbble: "Solar calculator website" by Heads Under | Deep green + warm sand + one bright accent; real photography; results screen with tabs and big numbers; calm whitespace | Oversized marketing headlines |
| Dribbble: pet care sites | Real dog/cat photography is the strongest visual in the category | Cartoon illustrations, orange/yellow candy palettes, giant playful type, stickers |
| Wild One (pet brand) | Confident real pet photography, simple sans type, generous but tidy layout | Neon lime as a dominant color |
| claude-design-skill (github.com/jiji262/claude-design-skill, MIT) | Its anti-slop rules: no aggressive gradients, no emoji, no left-stripe accent cards, no SVG drawings standing in for real photos, no decorative fake stats, commit to one type scale and one spacing grid, verify in a real browser | Its deck/prototype tooling (not relevant to a Next.js site) |

## 2. Hard rules (MUST)

1. No gradients anywhere (backgrounds, buttons, text, borders). Solid colors only. The single exception is a 0–40% black overlay on a photo to keep caption text readable.
2. No purple, violet, indigo, neon or "AI blue". The palette in section 3 is the whole palette.
3. No emoji anywhere: not in headings, buttons, bullets, results, FAQ, meta titles, alt text or OG images.
4. No card or callout with a colored stripe on one side (left-border accent). Containers have an even 1px border on all four sides, or no border.
5. No tables with partial or one-sided borders. Tables follow section 7.6 exactly.
6. Real photographs only for dogs and cats (section 8). Never AI-generated images, never cartoons or SVG-drawn animals, never stock illustrations.
7. Fonts: only the two families in section 4. No Inter, Poppins, Roboto or system-font fallback as the designed look.
8. Body text never below 16 px. UI labels never below 13 px. No hero headline larger than 40 px.
9. No icons used as decoration or as bullet markers. Icons only where they carry meaning (search, copy, share, print, expand, external link, info, warning).
10. No fake numbers, ratings, "trusted by" logos, testimonials, counters or badges.
11. No carousels, autoplay, parallax, scroll-jacking, popups or modal interstitials. The only dialog allowed is site search.
12. Everything must work at 360 px wide with no horizontal page scroll.

## 3. Color

Light theme only at launch (tokens are named so a dark theme can be added later).

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#FBFAF6` | Page background (warm paper) | |
| `--surface` | `#FFFFFF` | Cards, calculator, tables | |
| `--surface-2` | `#F3F0E8` | Table header, note boxes, footer, input group background | |
| `--ink` | `#1B1F1D` | Headings, result numbers | 15.9:1 on bg |
| `--text` | `#2E3532` | Body text | 12.0:1 on bg |
| `--muted` | `#5B6661` | Secondary text, captions, breadcrumbs | 5.7:1 on bg, 5.2:1 on surface-2 |
| `--border` | `#E3DED3` | Card and table borders, dividers | decorative |
| `--border-strong` | `#8C8576` | Input borders, checkbox/radio outlines | 3.7:1 on white (WCAG UI 3:1) |
| `--brand` | `#1F5C45` | Primary buttons, links, active states, chart line, logo | 7.5:1 on bg; white on brand 7.9:1 |
| `--brand-hover` | `#174836` | Hover/pressed for brand | |
| `--brand-tint` | `#E7F0EB` | Selected segment, active nav item background, focus halo | brand text on tint 6.8:1 |
| `--accent` | `#F2C46B` | Highlight only: the puppy's point on a chart, "you are here" row in a table, a small "New" tag. Never text color, never a large fill | ink on accent 10.2:1 |
| `--accent-ink` | `#8A5A12` | Rare text that must read as "highlight" (e.g., "Between sizes") | 5.7:1 on bg |
| `--danger` | `#B42318` | Input errors | 6.6:1 on white |
| `--focus` | `#1F5C45` | Focus ring (2px solid + 2px offset) | |

Usage ratio on any screen: about 85% neutrals (bg, surface, text), 12% brand green, under 3% accent.

## 4. Typography

Two families, loaded with `next/font/google`, `display: swap`, subsets `latin`. Variable fonts, so each family is one file.

- **Headings: Newsreader** (variable, use weight 600; optical size axis on). A sturdy editorial serif that reads like a trusted reference book, very different from competitors' Poppins/Inter.
- **Everything else: Public Sans** (variable, weights 400, 500, 600). Designed for US government sites; very legible at small sizes, compact, has tabular figures.
- All numbers in results, tables, inputs and charts: `font-variant-numeric: tabular-nums;`.
- `text-wrap: balance` on H1–H3; `text-wrap: pretty` on paragraphs.

Type scale (rem at 16 px root). Use only these sizes.

| Role | Font | Desktop | Mobile (<640 px) | Line height | Weight |
|---|---|---|---|---|---|
| H1 | Newsreader | 36 px | 28 px | 1.15 | 600 |
| H2 | Newsreader | 26 px | 22 px | 1.25 | 600 |
| H3 | Public Sans | 18 px | 17 px | 1.35 | 600 |
| Body | Public Sans | 16 px | 16 px | 1.6 | 400 |
| Lead / quick answer | Public Sans | 17 px | 16 px | 1.55 | 400 |
| UI label | Public Sans | 14 px | 14 px | 1.4 | 600 |
| Small / caption / breadcrumb | Public Sans | 13 px | 13 px | 1.45 | 400 |
| Overline (result labels) | Public Sans | 12 px, uppercase, letter-spacing 0.06em | same | 1.3 | 600 |
| Result number | Public Sans | 40 px | 34 px | 1.1 | 600, tabular |
| Secondary result number | Public Sans | 22 px | 20 px | 1.2 | 600, tabular |

- Paragraph max width 68ch. Headings never in all caps. No italics except for book/paper titles in Sources.
- Links in text: `--brand`, underline always (1px, offset 3px), hover thickens to 2px. Navigation links are not underlined.

## 5. Spacing, layout and density

- 4 px grid. Allowed values: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Container: max 1120 px, side padding 16 px mobile, 24 px tablet, 32 px desktop.
- Reading column (article text below the tool): max 720 px. Desktop pages with 4+ H2s get a sticky table of contents in a 260 px right column (gap 48 px).
- Section spacing: 40 px between major sections desktop, 32 px mobile. Never more than 64 px of empty space.
- Breakpoints: 640, 960, 1200.
- Radius: 6 px (inputs, buttons, chips), 10 px (cards, tables, images). No pills except the unit segmented control.
- Shadow: one level only, `0 1px 2px rgba(20,30,25,.06), 0 2px 8px rgba(20,30,25,.05)`, used on the calculator card and the search dialog. Everything else is flat with borders.
- Density target: on a 1280×800 desktop the H1, quick answer and the full calculator with its default result are visible without scrolling. On a 390×844 phone the H1, quick answer and first two inputs are visible.

## 6. Page templates

### 6.1 Global header (56 px tall, white, bottom border 1px `--border`)

```
[logo PawScales]   Dog tools  Cat tools  Size charts  About        [Search (/)]
```
- Mobile: logo left, search icon + menu button right; menu opens a full-width sheet with the same links (no hamburger animation gimmicks).
- Search: button opens a dialog with an input that filters the registry (title + keywords) client-side; keyboard shortcut `/`; results as a list with category label.
- Header is not sticky on mobile (saves space); sticky on desktop.

### 6.2 Tool page (desktop)

```
Breadcrumbs (13px, muted)
H1                                                  [photo 4:3, 280px wide, rounded 10]
Quick answer (17px)                                  caption: photographer, Unsplash
By Sikander Malik · Updated Oct 10, 2026 · Sources (link to section)

┌──────────── Calculator card (surface, 1px border, shadow) ─────────────┐
│ INPUTS (5/12)                     │ RESULT (7/12)                        │
│ Label                             │ ESTIMATED ADULT WEIGHT  (overline)   │
│ [ 16        | weeks ]             │ 48 lb   (40px)                       │
│ Label                             │ Most puppies like yours: 44–53 lb    │
│ [ 20        | lb    ]  [lb|kg]    │ ─────────────────────────────────    │
│ Size  ( Not sure | Toy | ... )    │ Now at 41% of adult weight     41%   │
│                                   │ Based on dogs of 15–30 kg            │
│                                   │ [growth chart, 200px tall]           │
│                                   │ [Copy] [Share] [Print]   Show the math ▾ │
└────────────────────────────────────────────────────────────────────────┘
Disclaimer line (13px, muted)

[Ad slot, if enabled, reserved height]
Two-column below: article (720px) | sticky TOC (260px)
  How to use · Formula + examples · What this doesn't cover · Tables · Tips · FAQ · Related · Sources
Author box
```

- Mobile: photo moves below the calculator (never above the tool on mobile; keeps LCP on text). Inputs stack above results. When the result card scrolls out of view, a sticky bottom bar (56 px, white, top border) shows the main result and a "Back to calculator" link.
- The photo on desktop is `loading="lazy"` unless it is above the fold; it must never be the LCP element on mobile.

### 6.3 Chart page (crate, collar, harness, kitten age)

Same as 6.2, but the calculator card is a compact "size finder" (one row of inputs, result inline), followed directly by the main table. Measuring instructions use a real photo of a person measuring a dog where available (section 8) plus a numbered list. No drawn diagrams of animals.

### 6.4 Home

```
H1 "Free dog and cat calculators, built on real data" (36px)
One-line subhead + search input (full width, 48px tall)
Three columns of tool lists by hub (Dog tools / Cat tools / Size charts):
  each item = 56px row: 48px square photo thumbnail · tool name (600) · one-line description (muted)
"Popular answers": 5 rows, each a fact with its number in bold and a link
"Who's behind PawScales": 2 sentences + link to the author page
```
No hero banner, no big background photo, no feature grid, no stats.

### 6.5 Hub page

H1 + 150–250-word intro, "Which tool do I need?" table (question → tool), list of tools as in the home rows, FAQ.

### 6.6 Text pages (About, Editorial policy, How we calculate, legal)

Single 720 px column, H1, "Last updated", body. How-we-calculate uses the table style for constants.

### 6.7 Footer (`--surface-2`, top border)

Four short columns: Dog tools, Cat tools, Size charts, PawScales (About, How we calculate, Editorial policy, Contact, Privacy, Terms, Disclaimer, Affiliate disclosure, Sitemap). Bottom line: "© 2026 PawScales. Estimates only, not veterinary advice." and photo credits link.

## 7. Components

### 7.1 Buttons
- Primary: bg `--brand`, white text 15 px 600, height 40 px (44 px on touch), padding 0 16 px, radius 6. Hover `--brand-hover`. No uppercase.
- Secondary: white bg, 1px `--border-strong`, text `--ink`. Hover bg `--surface-2`.
- Text button: brand color, underline on hover.
- Icon+label buttons for Copy / Share / Print (icon 16 px + label). After copy: label changes to "Copied" for 2 s.

### 7.2 Inputs
- Label above (14 px 600), optional helper text below (13 px muted).
- Field height 44 px, font 16 px (prevents iOS zoom), padding 0 12 px, 1px `--border-strong`, radius 6, white bg.
- Units sit inside the field on the right as a suffix (`weeks`, `lb`) in muted text.
- Focus: border `--brand` + 3px `--brand-tint` halo. Error: border `--danger` + message below in danger color, never a toast.
- Numbers: `inputMode="decimal"`, accept comma or dot, ignore spaces.
- Dates: native `<input type="date">` styled to match.
- Unit toggle: segmented control (two segments, 32 px tall, radius 999, selected segment `--brand-tint` with brand text).
- Option groups (size, life stage): segmented buttons wrapping to two lines on mobile, or a native `<select>` if more than 5 options.

### 7.3 Result panel
- Overline label → big number (40 px) with unit in 20 px muted → one line of range/context → divider → 2–4 secondary rows (label left, value right, tabular) → chart or timeline if relevant → action row.
- Update results as the user types (debounce 150 ms). Number change: 150 ms opacity crossfade, nothing else.
- `aria-live="polite"` on the result container.
- "Show the math": native `<details>` with the formula and the user's numbers substituted, in a `--surface-2` box, monospace not required (use tabular Public Sans).

### 7.4 Note / warning boxes
- "Note": `--surface-2` background, 1px `--border` on all sides, radius 10, padding 16, bold 14 px label "Note" on its own line. No icon required; if used, a 16 px info icon inline with the label.
- "See your vet if": same box with the label in `--danger` color and a plain bulleted list.

### 7.5 FAQ
- Each question is a `<details>` row: full-width, 1px top border (and bottom border on the last item) as a complete list divider, question in 16 px 600 with a plus/minus icon on the right, answer 16 px body. All answer text is in the DOM.

### 7.6 Tables (the table style, MUST)
- Wrapper: 1px `--border` on all four sides, radius 10, `overflow: hidden`; inside a horizontal scroll container on small screens with a right-edge shadow hint while scrollable.
- Header row: `--surface-2` background, 13 px 600 `--ink`, left-aligned text, right-aligned numbers.
- Body rows: 14 px (16 px on text-heavy tables), row height ≥ 40 px, 1px `--border` line between every row across the full width. No vertical lines except between a frozen first column and the rest on wide tables.
- No zebra stripes. Hover row: `--bg`.
- Highlighted row (user's result): `--accent` at 35% opacity background (`#F2C46B59`) across the full row, plus "Your dog" text tag in the first cell. No colored side border.
- Caption above the table (H3 or 14 px 600) and source line below (13 px muted, linked).
- Sticky header when the table is taller than the viewport.

### 7.7 Charts
- Inline SVG, rendered on the server with the default example, updated on the client.
- 1px `--border` grid lines (horizontal only), axis labels 12 px muted tabular, line 2.5 px `--brand`, P25–P75 band in `--brand-tint`, the user's point as an 8 px `--accent` dot with 1.5 px `--ink` outline and a label.
- Every chart has a text equivalent (table or sentence) for accessibility.

### 7.8 Breadcrumbs, author line, author box
- Breadcrumbs: 13 px muted, separator "/" in `--border-strong`, current page not a link.
- Author line under the quick answer: "By Sikander Malik · Updated Oct 10, 2026 · Sources", 13 px muted, links underlined.
- Author box (end of page): white card, 1px border all sides, radius 10, padding 16; left: 48 px circle monogram "SM" (brand-tint bg, brand text, Newsreader 600) since the owner does not want a photo; right: name (16 px 600), one-line bio, links "About Sikander", "Editorial policy". Never a stock photo as the author.

### 7.9 Related tools
- Rows like the home list: 48 px photo thumbnail, name, one-line description. 3–5 rows. No arrow icons.

### 7.10 Ad slots (when enabled)
- Label "Advertisement" 11 px muted above, reserved min-height (250 px mobile, 90 px desktop leaderboard below the tool, 600 px sticky in the TOC column on desktop only). Never between inputs and result, never above the tool on mobile.

### 7.11 Icons
- Lucide icons, 16 or 20 px, stroke 1.75, color inherits. Allowed set: search, copy, check, share-2, printer, chevron-down, plus, minus, info, alert-triangle, external-link, menu, x.

## 8. Photography (MUST)

- Real photographs only, from **Unsplash** (unsplash.com/license) or **Pexels** (pexels.com/license). Both allow free commercial use. Record each photo in `lib/data/photos.ts`: `id, file, source URL, photographer name, profile URL, license URL, alt text, focalPoint`.
- Never AI-generated or AI-edited images (check: garbled text, wrong anatomy, extra toes, melted fur). Reject any photo with visible brand logos, watermarks or readable product labels.
- Never suggest a photo shows the owner's dog. Captions name the photographer: "Photo: Jane Doe / Unsplash".
- Subject must match the page: puppy for puppy pages, the correct breed when a breed is named, a cat or kitten for cat pages, a dog in a crate for the crate chart, a dog wearing a harness for the harness chart, a person measuring a dog for measuring sections.
- Style: natural light, true colors, uncluttered background, the animal's face in focus. Avoid heavy filters, studio-white cutouts and humans' faces as the main subject.
- Processing: crop to 4:3 (page photo) and 1:1 (thumbnails), export AVIF + WebP + JPEG fallback at 1x and 2x (page photo 560 px / 1120 px wide; thumbnails 96 / 192), quality ~60 AVIF, ~75 WebP. Use `<picture>` with explicit `width`/`height`, `decoding="async"`, `loading="lazy"` except the desktop page photo above the fold. Total image weight per page ≤ 150 KB on mobile.
- Alt text describes the photo plainly ("Golden retriever puppy sitting on a kitchen floor"), no keyword stuffing.
- A `/photo-credits/` page lists every photo and credit (link it in the footer).
- OG images (1200×630): `--bg` background, the page photo on the right half (cropped), H1 in Newsreader 600 on the left, "pawscales.com" small in `--muted`. No gradient, no emoji.

## 9. Logo

- Wordmark "PawScales" in Newsreader 600, `--ink`, with "Scales" in `--brand`. Optional simple mark to the left: a small rounded square in `--brand` containing a white scale/ruler tick pattern (three vertical ticks of different heights). No paw-print clip art, no dog silhouette.
- Deliver: `logo.svg` (header, 28 px tall), `logo-square.png` 512×512 (schema, favicon source), favicons (`favicon.ico`, 32 px PNG, 180 px apple-touch-icon), all generated from the SVG.

## 10. Motion and feel

- Hover/focus transitions 150 ms `ease-out` on color, background and border only.
- Disclosure (details) open/close: no height animation required; if added, 180 ms.
- No entrance animations, no scroll-triggered effects, no skeleton shimmer on static content.
- `@media (prefers-reduced-motion: reduce)`: remove all transitions.
- Calculators respond instantly; no "Calculate" button required (keep one only for date pickers on iOS if needed). Inputs keep their values in the URL hash for sharing.
- Smoothness budget: no layout shift (CLS 0), INP < 200 ms, total JS per tool page < 90 KB gzipped.

## 11. Accessibility

- WCAG 2.2 AA. Contrast values in section 3 already pass.
- Every input has a visible `<label>`. Errors are linked with `aria-describedby`.
- Focus ring visible on every interactive element (2 px `--focus`, offset 2 px). Never `outline: none` without a replacement.
- Touch targets ≥ 44×44 px on mobile.
- Charts have text equivalents; tables use `<th scope>`; the sticky result bar is not announced twice.
- Skip link "Skip to calculator" as the first focusable element.

## 12. Implementation notes for the coding agent

- Define all tokens as CSS variables in `app/globals.css` and map them in `tailwind.config` (`colors.brand`, `colors.ink`, etc.). Do not use Tailwind's default palette classes (`bg-purple-*`, `text-slate-*`, etc.) anywhere; add an ESLint rule or a test that fails if they appear.
- shadcn/ui components must be restyled to these tokens (radius 6/10, borders, no default shadows, no default `ring` colors).
- Fonts via `next/font/google`: `Newsreader` (variable, `axes: ['opsz']`) and `Public_Sans` (variable). Expose as `--font-heading` and `--font-body`.
- Build a `/design/` page (noindex, excluded from sitemap) that shows every component and token (buttons, inputs, result panel, tables, note boxes, FAQ, chart, author box) so the owner can review the system in one place.

## 13. Visual QA before every push (from claude-design-skill's verification loop)

1. Run the site locally and take Playwright screenshots of the home page, one tool page, one chart page and `/design/` at 360, 768 and 1280 px widths. Save them to `qa/screenshots/` (git-ignored) and attach a list of them in the report.
2. Check the browser console is clean (no 404s, no hydration errors, no font failures).
3. Click through each calculator's main flow: change every input, toggle units, copy, share link round-trip.
4. Gut check against section 2: any gradient, purple, emoji, one-sided border, drawn animal, Inter/Poppins, text under 13 px, headline over 40 px? Fix before pushing.
5. Confirm the photo is not the LCP element on mobile (Lighthouse "Largest Contentful Paint element").
