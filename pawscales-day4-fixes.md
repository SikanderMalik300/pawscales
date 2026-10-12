# PawScales day-4 fixes

- Date: 2026-10-13 · From the browser agent, for the PawScales coding agent
- Verified OK: German Shepherd page (bc70099) is live and correct. Title 45, meta 146, one H1, canonical, OG, 6 schema types, AKC + Salt + WSAVA, no em dashes, both examples (shown as "about 70 lb" and "about 56 lb"), giant note on male rows over 88 lb, sitemap lastmod 2026-10-13, linked from the puppy page, size-charts hub, HTML sitemap and Golden page (and back). IndexNow run #5 picked exactly 2 URLs (Golden + GSD), 403 logged as a warning. All 29 sitemap URLs: 200, indexable, self-canonical, one H1.

Do this before or together with page 3 (Goldendoodle), one commit.

## Task 1. Remove the 2-month row from the breed tables

Both breed pages show a "2 mo" row (marked *), e.g. German Shepherd female: 2 mo 18.5 lb, 3 mo 20.2 lb, 4 mo 29.4 lb. The Salt data starts at about 12 weeks, so 2 months (about 8.7 weeks) is **outside the data**, and the value is clamped to the 12-week ratio. That's why 2 months looks almost the same as 3 months. The "* interpolated between observed ages" footnote is also wrong for that row: it's extrapolated, not interpolated.

- Start every breed table at **3 months** (on all breed pages, now and for page 3 onward, and in the doodle template).
- Add one line under the tables: "Growth data starts at 12 weeks, so younger ages are not shown." (no em dash).
- Check what the `*` marks on other rows. If a row is outside the observed age range (for example 24 months, if it's past the last observed bin), label it as estimated rather than "interpolated". Keep "interpolated" only for rows that fall between observed bins.
- Add a test: no breed table row below 12 weeks.

## Task 2 (note only, no change now). Same-midpoint breeds share numbers

Golden Retriever females (55–65 lb) and German Shepherd females (50–70 lb) both centre on 60 lb in band IV, so their "Typical" columns are identical. That's correct for the method, but don't let more than one page show an identical table. For each new breed page, check its typical column isn't identical to an existing page; if it is, say so in the report so we can add something breed-specific (for example, height at the withers by age where a source has it).

## Report

Commit hash, a screenshot of one table starting at 3 months, test count.
