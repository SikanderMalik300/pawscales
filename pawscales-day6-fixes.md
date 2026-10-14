# PawScales day-6 fixes + page 6 brief

- Date: 2026-10-15 · From the browser agent, for the PawScales coding agent
- Verified OK: Cat weight chart (e6354e9) is live:
  - Title 40 chars, meta 144, one H1, self-canonical, OG image, 6 schema types, no em dashes, in sitemap (32 URLs, lastmod 2026-10-15).
  - All three tables are non-decreasing, and the female p25 dip is gone.
  - The on-track tool works: 6 mo female at 6 lb gives "within", at 8 lb gives "above".
  - CC BY 3.0 credit and the vet line are present.
  - IndexNow run #10 returned HTTP 200 for 5 URLs.
  - Goldendoodle and Bernedoodle are now indexed in Google.
- One commit. Don't change URLs, titles or H1s. Run `npm test` and `next build`, then push.

## Task 1. Internal links to the cat weight chart (important)

No page links to /cat-weight-chart/ except the HTML sitemap. Missing from: /cat-calculators/ (hub), /kitten-age-chart/, /cat-food-calculator/, /cat-years-calculator/, and the homepage tool list if it lists cat tools.

- Add it to the cat hub and to the related-tools block on the other cat pages. On the kitten age chart, add an in-text link where weight is mentioned ("see the [cat weight chart](/cat-weight-chart/) for typical weight by month").
- Global test: every page in the registry is linked from its hub and from at least 2 other content pages. This would have caught it.

## Task 2. Number formatting

Cat tables show whole numbers without a decimal ("6", "7", "8") next to "6.4", "8.3". Always show one decimal (6.0, 7.0, 8.0) in all growth tables and the tool. Test: every table cell is a number with one decimal.

## Task 3. Table labels

The Female and Male tables have no `<caption>`. Add `<caption>Female kittens (lb)</caption>` and `<caption>Male kittens (lb)</caption>` (and for the intact table, "Intact cats, median weight (lb)"). Captions are good for screen readers and help Google understand the tables.

## Task 4. Soften "above / below the typical range"

Under the tool result, add one line: "By definition, 1 in 4 healthy kittens weigh more than this range and 1 in 4 weigh less." Keep the existing vet line.

## Task 5. 404 page title

The 404 title is "Page not found — PawScales" (em dash). Change it to "Page not found | PawScales", matching the rest of the site's title format.

## Page 6 brief: puppy feeding chart (/puppy-feeding-chart/)

Semrush (US): puppy feeding chart 1,900 (KD 34), how much to feed a puppy 2,900 (KD 29), how much to feed a puppy chart 1,000, puppy feeding chart by weight and age 260 to 1,000. Branded variants (Purina, Blue Buffalo) are out of scope.

- **Before building, report the method and sources.** Reuse the energy method behind /dog-food-calculator/ (RER × growth factor, NRC/WSAVA). Show a table of cups or grams per day by puppy age (2 to 12 months) and expected adult weight (for example 10, 20, 40, 60, 80 lb).
- The kcal density of food varies, so show kcal/day as the main number, with cups per day at a stated example density (e.g. 400 kcal/cup), and link the calculator for exact amounts.
- Add a "meals per day by age" section, with a source.
- Avoid cannibalizing /dog-food-calculator/. The new page is the chart; the calculator is the tool. Cross-link both ways.

## Report

Commit hash, test count, screenshot of the cat hub showing the new link, and the page 6 method and sources (before you build page 6).
