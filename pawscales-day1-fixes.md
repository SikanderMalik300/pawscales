# PawScales day-1 fixes

- Date: 2026-10-11
- Found by: browser agent, verifying https://pawscales.pages.dev (commit e13579e)
- Verified OK (no change needed): all 27 sitemap URLs return 200; titles ≤ 60, metas ≤ 155; one H1 per page; canonicals; FAQ JSON-LD text present in the visible page on all 12 tools; worked examples on all 11 calculators match independent recalculation; puppy calculator live test (16 wk, 30 lb, Not sure → 69.9 lb, 30–40 kg band) matches; security headers; `x-robots-tag: noindex` on pages.dev; brotli; 404 status; robots/llms/sitemap present.

Do every task below, one commit per task. Don't change URLs, titles, H1s, formulas or FAQ text unless a task says so. Run `npm test` and `next build`, then push to `main`.

## Task 1. Puppy page has no OG image

`/puppy-weight-calculator/` has `og:title`, `og:description`, `og:url`, `twitter:card` but no `og:image` / `twitter:image`. Every other page has one.
- Add `og:image` (1200×630 PNG, same template as the other pages) and `twitter:image` to the puppy page.
- Add a test that every route in the registry outputs an `og:image` meta tag.

## Task 2. Em dashes in visible text

- `/how-we-calculate/`: 3 em dashes in constant labels, e.g. "Dog MER — neutered / intact adult". Replace " — " with ": " → "Dog MER: neutered / intact adult", "Dog MER: growth (<4mo / ≥4mo)", "Cat MER: neutered / intact adult".
- `/sitemap/` (HTML sitemap): 25 em dashes between link and description. Replace with a line break or put the description in its own muted line under the link (no dash).
- Extend the design-guard test so the build fails on "—" in any page's `<main>` text (allow it only inside the Sources/citation titles if a source title contains one).

## Task 3. robots.txt

Current file has `Disallow: /design/` in the `*` group and a `Host:` line.
- Remove `Disallow: /design/` (the page already has `noindex`; a Disallow stops crawlers from seeing that noindex). Keep `/design/` out of the sitemap.
- Remove the non-standard `Host:` line.
- Keep the Sitemap line and the named-bot groups.

## Task 4. Desktop page photo loads late

On tool pages the band photo (desktop, above the fold, top right) uses `loading="lazy"` and appears 2–3 s after the text. On mobile it is placed lower, which is fine.
- Make the band photo `loading="eager"` with `decoding="async"` and leave `fetchpriority` at default (not high), so it doesn't compete with the H1 for LCP. Re-run Lighthouse mobile on the puppy page and confirm Performance is still ≥ 90 and the LCP element is still text.

## Task 5. Unsourced pregnancy prep days

The pregnancy page shows "Prepare the whelping box by" (day 55) and "Start temperature twice daily from" (day 57). You flagged these as not directly sourced.
- Find a veterinary source for each (VCA Animal Hospitals, Merck Veterinary Manual, a vet school, or AKC breeding guidance). If found, cite it in Sources and `/how-we-calculate/` with the source's own day number.
- If no source gives a specific day, change the labels to sourced wording, e.g. "Have the whelping box ready about 1–2 weeks before the due date" and "Start checking her temperature twice a day in the last week" (only if a source supports those windows), and update the tests and examples. Report which option you used and the source URL.

## Re-verify list (browser agent, after push)

1. `/puppy-weight-calculator/` has `og:image` and `twitter:image`; the image URL returns 200 and is 1200×630.
2. No "—" in `<main>` on `/how-we-calculate/` and `/sitemap/`.
3. `/robots.txt` has no `Disallow: /design/` and no `Host:` line; `/design/` still has `noindex` and is absent from `sitemap.xml`.
4. The puppy band photo is visible immediately on desktop load; Lighthouse mobile puppy page Perf ≥ 90, LCP element is text.
5. Pregnancy page: prep-day labels match their cited source; Sources list includes it.
6. Test count reported (expect 139 + new tests).
