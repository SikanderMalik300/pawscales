# PawScales growth pages, batch 1 (5 pages)

- Date: 2026-10-12 · From the browser agent, for the PawScales coding agent
- Follows `pawscales-build-spec.md` (v6) and `design.md` (v2). Everything in A0–A5, A11–A14 applies to these pages too (tool page order, schema, OG image, tests, no em dashes, real photos, author line, sources, FAQ in visible text).
- Keyword data: Semrush, US database, 2026-10-12 (volume / KD%).

## 0. Ground rules for this batch (MUST)

1. **Unique data, not rewritten content.** Each breed page must show numbers nobody else has: the Salt et al. 2017 growth curves (already in `data/growth-ratios.json`) scaled to that breed's sourced adult weight. Doodle and cat pages must use sourced size categories and show the source's own numbers. Never invent a weight range.
2. **Every breed or size number needs a source** listed on the page (AKC breed standard page, breed club, vet school, peer-reviewed paper). If a source can't be found for a number, drop that number and tell me in the report.
3. **Publishing cadence (steady, not a burst):** build all five, but push to `main` in this order, one page per day, starting the day you finish: 1, 2, 3, 4, 5. Each page's `updated` date = its publish day (so IndexNow sends only that page).
4. **No cannibalization:** the existing `/kitten-age-chart/` owns "kitten age" and 0–8 week weights. The new cat page covers 2 months to adult and links to the kitten age chart for younger kittens. The existing `/puppy-weight-calculator/` stays the generic tool; breed pages link to it, and it links back to each breed page from a new "Breed growth charts" list.
5. Add each page to the registry, the sitemap (with its own `lastmod`), the HTML sitemap, and the right hub: dog pages under `/dog-size-charts/` in a new "Breed growth charts" section; the cat page under `/cat-calculators/`.

## 1. Shared breed growth template (pages 1 and 2)

Component `BreedGrowthChart` (one template, driven by a registry entry per breed):

- Inputs: sex (Male / Female), age (weeks or months, 8–104 weeks), current weight (lb/kg, optional).
- Data: breed adult weight range by sex from the breed standard (VERIFY on akc.org). Size band = the Salt band containing the sex's midpoint in kg (I < 6.5; II 6.5–<9; III 9–<15; IV 15–<30; V 30–<40). Midpoints at or above 40 kg: use band V and show the giant-breed note from A6.1.
- Output 1 (always visible, no input needed): **"Expected weight by age"** table for Male and Female at 2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 24 months = `normalized ratio(band, age) × adult range` (low, typical, high: low end × p25, midpoint × median, high end × p75, all normalized as in A6.1 v5). Mark interpolated ages with the footnote from A6.1.
- Output 2 (if current weight entered): predicted adult weight with the puppy calculator's logic, forced to this breed's band, plus "% of adult weight now" and the growth chart with the puppy's point. Also show whether the puppy is below, inside, or above the typical range for its age.
- Copy for the table caption: "Based on growth data from [N] healthy dogs (Salt et al. 2017) scaled to the AKC breed standard."
- Schema: `WebPage` + `BreadcrumbList` + `FAQPage` + `Dataset` reference (same as puppy page "About the data").
- Photos: a real photo of the breed (adult) for the band and a puppy photo for the tiles, Unsplash or Pexels, recorded in `lib/data/photos.ts`.

### Page 1. `/golden-retriever-weight-chart/`

- Title: `Golden Retriever Weight Chart: Puppy to Adult by Age` (≤ 60)
- Meta: `See how much a Golden Retriever should weigh at every month, for males and females. Based on growth data from [N] dogs and the AKC breed standard.`
- H1: `Golden Retriever Weight Chart`
- Keywords: golden retriever weight (1,900 / 24), average golden retriever weight (1,000 / 23), how much should a golden retriever weigh (480 / 7), female golden retriever weight (390 / 15), male golden retriever weight (320 / 15), golden retriever weight chart (320 / 22), golden retriever weight by age (210 / 18), golden retriever healthy weight (210 / 12)
- Data (VERIFY on https://www.akc.org/dog-breeds/golden-retriever/): males 65–75 lb, females 55–65 lb.
- Quick answer: give the adult ranges and the 6-month and 12-month typical weights from your table.
- Second table: "Is my Golden Retriever a healthy weight?" Body condition basics with a link to a vet body condition chart (WSAVA or Purina BCS, VERIFY), no diagnosis.
- FAQ: How much should a Golden Retriever weigh? / How big is a 6-month-old Golden Retriever? / When is a Golden Retriever full grown? / Male vs female Golden Retriever size? / My puppy is below the chart, should I worry? / How accurate is this chart?
- Worked examples: Example 1 = female, 16 weeks, 25 lb. Example 2 = male, 6 months, 45 lb. Compute from the table, write into the page, add tests.
- Related: puppy weight calculator, dog food calculator, dog crate size chart, German Shepherd weight chart.

### Page 2. `/german-shepherd-weight-chart/`

- Title: `German Shepherd Weight Chart: Growth by Month` (≤ 60)
- Meta: `How much should a German Shepherd weigh? Month-by-month weights for males and females, based on growth data from [N] dogs and the AKC standard.`
- H1: `German Shepherd Weight Chart`
- Keywords: german shepherd weight (2,400 / 27), average german shepherd weight (880 / 19), female german shepherd weight (590 / 18), german shepherd dog weight (590 / 23), normal german shepherd weight (480 / 26), german shepherd weight calculator (320 / 13), german shepherd weight chart (320 / 13), average weight of german shepherd puppy (320 / 22)
- Data (VERIFY on https://www.akc.org/dog-breeds/german-shepherd-dog/): males 65–90 lb, females 50–70 lb. The male high end passes 40 kg: show the giant-breed note on male rows above 88 lb.
- FAQ: How much should a German Shepherd weigh? / How big is a 4-month-old German Shepherd? / When do German Shepherds stop growing? / Male vs female size? / Why is my German Shepherd puppy skinny? (general, link to vet) / How accurate is this chart?
- Worked examples: Example 1 = male, 16 weeks, 30 lb. Example 2 = female, 8 months, 50 lb.
- Related: puppy weight calculator, Golden Retriever weight chart, dog crate size chart, dog food calculator.

## 2. Doodle size template (pages 3 and 4)

Component `DoodleSizeChart`:

- Inputs: size type (from the source's categories), or the parents' weights (mother lb, father lb). Optional: puppy age + current weight.
- Logic: (a) Size type → adult weight and height range from the source table. (b) Parents' weights → expected adult range = from the lighter parent's weight to the average of both parents' weights, plus a clear note that mixes vary and this is a rough guide (write it from a source if one gives a rule; otherwise present it only as a range, not a formula claim). (c) If age + weight given → reuse the puppy calculator's logic with the band from the expected adult weight.
- Output: size category, adult weight range, height range, and an "Expected weight by age" table for that category (same method as section 1).
- Second table: crate size and harness size by category (link to our crate and harness charts).
- Photos: real doodle photos, one per size where possible.

### Page 3. `/goldendoodle-size-chart/`

- Title: `Goldendoodle Size Chart: Mini, Medium & Standard` (≤ 60)
- Meta: `Goldendoodle sizes by weight and height, from toy to standard, plus a growth chart by age. Find out how big your Goldendoodle will get.`
- H1: `Goldendoodle Size Chart`
- Keywords: goldendoodle size (2,400 / 8), mini goldendoodle size (1,900 / 31), miniature goldendoodle size (1,300 / 16), medium size goldendoodle (880 / 42), mini goldendoodle size chart (880 / 18), full size goldendoodle (590 / 19), goldendoodle size chart (590 / 7), standard goldendoodle size (390 / 2)
- Data (VERIFY): the Goldendoodle Association of North America (GANA) size categories (weight and height at the shoulder). If GANA doesn't publish numbers, use another breed association or a vet source and name it. Show the source's numbers only.
- FAQ: How big do Goldendoodles get? / What size is a mini Goldendoodle? / Medium vs standard Goldendoodle? / When is a Goldendoodle full grown? / How can I tell how big my Goldendoodle puppy will get? / Do F1 and F1B sizes differ?
- Worked examples: Example 1 = Medium, 20 weeks, 22 lb. Example 2 = parents 15 lb and 65 lb.
- Related: Bernedoodle size chart, puppy weight calculator, dog crate size chart, dog harness size chart.

### Page 4. `/bernedoodle-size-chart/`

- Title: `Bernedoodle Size Chart: Tiny, Mini & Standard` (≤ 60)
- Meta: `How big will a Bernedoodle get? Tiny, mini and standard Bernedoodle weight and height ranges, plus expected weight by age.`
- H1: `Bernedoodle Size Chart`
- Keywords: bernedoodle size (1,900 / 5), mini bernedoodle size (1,300 / 8), full size bernedoodle (720 / 9), bernedoodle full size (590 / 10), bernedoodle size chart (590 / 4), bernedoodle size comparison (590 / 5)
- Data (VERIFY): there is no kennel club standard. Use the originating breeder's published size categories (Swiss Rolling Hills, which first bred Bernedoodles) or a breed association if one exists, and say plainly on the page that these are breeder categories, not a breed standard. Standard Bernedoodles can pass 40 kg: apply the giant-breed note.
- Comparison table: Tiny vs Mini vs Standard Bernedoodle vs Bernese Mountain Dog vs Standard Poodle (AKC standards for the two parent breeds, VERIFY).
- FAQ: How big do Bernedoodles get? / Mini vs standard Bernedoodle size? / When is a Bernedoodle full grown? / How big is a 6-month-old Bernedoodle? / Is a Bernedoodle bigger than a Goldendoodle?
- Worked examples: Example 1 = Mini, 16 weeks, 14 lb. Example 2 = Standard, 6 months, 45 lb.
- Related: Goldendoodle size chart, puppy weight calculator, dog crate size chart, dog food calculator.

## 3. Page 5. `/cat-weight-chart/`

- Title: `Cat Weight Chart: Healthy Weight by Age` (≤ 60)
- Meta: `What should your cat weigh? Kitten weight by month from 2 to 12 months, healthy adult ranges, and how to check your cat's body condition.`
- H1: `Cat Weight Chart`
- Keywords: cat weight chart (5,400 / 25), cat weight chart by age (590 / 17), kitten weight chart (1,300 / 30), kitten weight chart by age (590 / 23), healthy cat weight chart (320 / 42), cat age and weight chart (320 / 34)
- Data step (VERIFY, do first): search for a peer-reviewed cat growth standard (for example, a WALTHAM or Banfield kitten growth chart paper, with open data or published centiles). If one exists with a usable license, use its centiles for the 2–12 month table and cite it like the puppy data. If not, use vet sources (Cornell Feline Health Center, VCA, WSAVA body condition chart) for the kitten rule of thumb and the healthy adult range, and show only what they state.
- Tool: inputs: age (months), weight (lb/kg), optional body condition score (1–9, with the WSAVA picture guide linked). Output: where the weight sits for that age (below, typical, above) and a plain note that body condition matters more than the number for adults.
- Tables: (1) Kitten weight by month, 2–12 months. (2) Typical adult weight for 10 common breeds (Maine Coon, Ragdoll, Siamese, etc.) from breed association or CFA pages (VERIFY each, link each).
- Link to `/kitten-age-chart/` for kittens under 8 weeks, and to `/cat-food-calculator/`.
- FAQ: How much should my cat weigh? / How much should a 6-month-old kitten weigh? / When do cats stop growing? / Is my cat overweight? / How big do Maine Coons get? / Why do weight charts differ by breed?
- Worked examples: Example 1 = 4 months, 4 lb. Example 2 = adult, 12 lb, BCS 7.
- Related: cat food calculator, cat years calculator, kitten age chart.

## 4. Puppy calculator update (same push as page 1)

- On `/puppy-weight-calculator/`, add a "Breed growth charts" list under Related tools that grows as pages ship (Golden Retriever, German Shepherd, Goldendoodle, Bernedoodle).
- When the user picks no size and the estimate lands in band IV or V, show a small line: "See breed-specific charts:" with links.

## 5. Tests and report

- Unit tests for each worked example, the band choice per breed and sex, and the doodle parent-weight range.
- Guard tests: every number in the breed and category tables has a source ID in the registry; no em dashes; titles ≤ 60, metas ≤ 155.
- Lighthouse mobile ≥ 90 on each new page, LCP = text.
- Report per page: commit, publish date, sources used (with the numbers you took from each), worked example results, screenshots at 360 and 1280 px, and anything you couldn't source.
