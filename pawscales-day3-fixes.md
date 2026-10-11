# PawScales day-3 fixes

- Date: 2026-10-12 · From the browser agent, for the PawScales coding agent
- Verified OK: Golden Retriever page (commit b615086) is live. Title 52 chars, meta 149, one H1, canonical, OG image, JSON-LD (Organization, WebSite, BreadcrumbList, WebPage, FAQPage, Dataset), AKC + Salt + WSAVA cited, no em dashes, both worked examples present, in sitemap with lastmod 2026-10-12, linked from the puppy page and the size-charts hub. Google indexing requested; Bing URL submission done.
- **Do not build `pawscales-pinterest-pins.md`.** Pins are now made and scheduled directly in Pinterest by the browser agent. Skip that spec and the deploy-hook secret.

## Task 1. IndexNow date bug (timezone)

Run #3 (push of b615086) printed "Nothing changed". Cause: `lastmod` for the new page is 2026-10-12 (owner's local date), but the script compares it to **today in UTC**, which was still 2026-10-11 at push time. Every push made in Pakistan before 05:00 local time will miss its pages.

Fix in `scripts/indexnow.mjs`:
- Pick URLs whose `lastmod` is **within the last 2 days in UTC** (today UTC, yesterday UTC, or tomorrow UTC to allow for timezones ahead of UTC), not only equal to today. Re-sending a URL is harmless.
- Better still, if it's simple: get changed routes from the push's diff (`git diff --name-only ${{ github.event.before }} ${{ github.sha }}`) mapped through the registry, and union that with the lastmod window.
- Update the unit tests for the picker (UTC boundary case: lastmod 2026-10-12 with "now" = 2026-10-11T22:00Z must be picked).

## Task 2. IndexNow 403 (no code change, just handling)

Bing still answers `403 UserForbiddedToAccessSite` for our key. The key file is correct (200, text/plain, exact 32-char body). The cause was Cloudflare Crawler Hints owning the domain's IndexNow source; the browser agent turned Crawler Hints off on 2026-10-12, and Bing usually takes a while to accept a new key.
- Make a 403 a **warning, not a failure**: print the body and exit 0, so a red X doesn't show on every push while Bing catches up. Keep any other non-2xx status as a failure.
- The browser agent will re-test and run the workflow with `all=true` once Bing accepts the key.

## Report

Commit hash, the test for the UTC boundary, and the log of the next push run.
