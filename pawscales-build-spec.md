# PawScales build spec

- Site: https://pawscales.com
- Owner / author: Sikander Malik (real name; former owner of Bravo, a Gull Dong; no current pet)
- Written: 2026-10-10 by the browser agent
- Repo: https://github.com/SikanderMalik300/pawscales (branch `main`, auto-deploys to Cloudflare Pages)
- Design: `design.md` in the repo root. This file covers content, SEO and maths; `design.md` covers look and feel (colors, fonts, layout, components, photos). Where they overlap, this file wins on content and `design.md` wins on visuals.
- Updated: 2026-10-10 (v3): A6.1 body-condition filter corrected to a per-dog filter (Policy C with per-band Policy B fallback). v2: design system added, photos, /design/ and /photo-credits/ pages, visual QA.

Part A is for the coding agent. Part B is the browser agent's checklist.

Words used below: **MUST** = required for Definition of Done. **VERIFY** = check the number against the named source before using it; if the source disagrees, use the source's number, update the examples and tests, and report the change.

---

# PART A: Coding agent

## A0. Non-negotiables (MUST)

1. Static export. Every page is pre-rendered HTML that already contains all text, tables, FAQ and the calculator showing a default example result. View-source must show the answer.
2. All maths runs client-side in pure TypeScript functions in `lib/calc/`. No server, no API calls.
3. Every formula has unit tests (Vitest). Minimum 10 known-answer tests per tool (A12).
4. US units first (lb, in, cups, °F) with a metric toggle (kg, cm, g, °C). The toggle never changes the maths, only input/output conversion. Use `LB_TO_KG = 0.45359237`, `IN_TO_CM = 2.54`, `OZ_TO_G = 28.349523125`.
5. Lighthouse mobile ≥ 95 on the home page, ≥ 90 on tool pages.
6. No fake reviews, ratings, testimonials, vet endorsements or "trusted by" claims. Never say a vet wrote or reviewed a page.
7. Every number shown on the site comes from `lib/constants.ts` (or a generated data file) and has a source comment (`// Source: name, URL, accessed YYYY-MM-DD`).
8. Not veterinary advice. No medication or dosage tools, ever. Health-adjacent pages (pregnancy, feeding, weight) carry the disclaimer line (A7) and a "see your vet if..." list.
9. The author is Sikander Malik. Never claim he currently owns a dog or cat, tested a product, or has veterinary training.

## A1. Stack

- Next.js (App Router), TypeScript `strict`, Tailwind + shadcn/ui, `next/font` with exactly the two variable families in design.md section 4 (Newsreader, Public Sans), Vitest, Playwright (screenshots/QA only, dev dependency).
- `next.config`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`.
- Host: Cloudflare Pages. Build command `npm run build`, output dir `out`. Node 22.
- Env vars (read at build time): `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_GA_ID` (may be empty; render nothing GA-related if empty), `NEXT_PUBLIC_ADSENSE_ID` (empty for now).
- Python 3 is allowed for the one-off data script in A6.1 (`scripts/`), never at runtime.

## A2. Architecture

- Flat keyword URLs with trailing slash: `/puppy-weight-calculator/`.
- `lib/registry.ts` is the single source of truth for every tool/data page: `slug, title, metaDescription, h1, category, related[], lastUpdated, sources[], fromOwner (string|null), notCovered[]`. Sitemap, hubs, related links, llms.txt and breadcrumbs all read from it.
- Hubs (category pages):
  - `/dog-calculators/` (growth, age, breeding, feeding tools)
  - `/cat-calculators/`
  - `/dog-size-charts/` (crate, collar, harness)
- Author page `/authors/sikander-malik/`.

## A3. Technical SEO (MUST)

- `<title>` ≤ 60 characters, meta description ≤ 155, self-referencing canonical with trailing slash on `https://pawscales.com`.
- OG image 1200×630 PNG for every page (build-time generated, page title + brand). `og:image`, `twitter:card=summary_large_image`.
- Exactly one H1. Real `<a href>` links. Visible breadcrumbs matching BreadcrumbList schema text.
- `sitemap.xml` with honest `lastmod` (from registry `lastUpdated`, not build time).
- `robots.txt`: allow all, including Googlebot, Bingbot, OAI-SearchBot, PerplexityBot; `Sitemap:` line.
- `/llms.txt`: site summary + list of tools with one-line descriptions and URLs.
- `public/_headers`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, long cache for `/_next/static/*`.
- Custom 404 with `noindex` and real 404 status. Any URL with query parameters gets `<meta name="robots" content="noindex">` via a small client check is NOT needed; instead canonical always points to the clean URL.
- `www` → apex and http → https are handled by Cloudflare (Part B).

## A4. Schema (JSON-LD)

- Site-wide: `Organization` (name PawScales, url, logo (square PNG ≥ 512px), email hello@pawscales.com, `founder` → `{"@id":"https://pawscales.com/authors/sikander-malik/#person"}`) and `WebSite`.
- Tool pages: `WebApplication` (`applicationCategory: "UtilitiesApplication"`, `operatingSystem: "Any"`, `offers: {price: 0, priceCurrency: "USD"}`, `author` → Person @id) + `BreadcrumbList` + `FAQPage`.
- Chart/data pages: `WebPage` + `BreadcrumbList` + `FAQPage` (+ `Dataset` only on the puppy growth data page, A6.1).
- Hubs: `CollectionPage`. Author page: `ProfilePage` with `mainEntity` = `Person` (`@id` above, name Sikander Malik, `url`, `sameAs` empty for now).
- FAQ JSON-LD text MUST be identical to the visible FAQ text.
- NEVER `AggregateRating`, `Review`, `HowTo`, `MedicalWebPage` or `Product`.

## A5. Tool page order (all tool pages)

1. Breadcrumbs
2. H1 = main keyword
3. Quick answer, 40–60 words, with real numbers (server-rendered, outside the client calculator component), then the author line "By Sikander Malik · Updated Mon D, YYYY · Sources" and, on desktop, the page photo (design.md 6.2 and 8)
4. Calculator, pre-filled with the default example and its result visible on load. "Show the math" toggle. Copy result / Share link (encodes inputs in the hash, never the query string) / Print.
5. How to use (3–6 numbered steps)
6. The formula + 2 worked examples (the A6 examples, word for word)
7. "What this calculator doesn't cover" (from registry `notCovered`)
8. Reference table + a second useful table
9. "From Sikander" note: leave the component in place but render nothing when `fromOwner` is null (all null at launch)
10. Tips (3–5)
11. FAQ (6–7 questions, 40–80-word answers)
12. Related tools (3–5, from registry)
13. Sources (name, link, accessed date)
14. Author box ("By Sikander Malik", 1-line bio, link to author page and editorial policy) + "Last updated: Month D, YYYY"
15. Disclaimer line (A7)

Chart pages (crate, collar, harness, kitten age) use the same order; the "calculator" is a small sizing tool or lookup above the main table.

## A6. Page specs: launch set (12 pages)

Rules for every page: US units first, metric toggle, round displayed results only at the end, default example = Example 1.

---

### A6.1 `/puppy-weight-calculator/`

- Title: `Puppy Weight Calculator: Predict Adult Size by Age` (50)
- Meta: `Estimate your puppy's adult weight from age and current weight, using growth data from 150,000+ vet visits. Free, with a growth chart.` (VERIFY the count after A6.1 data step; update text to the real number)
- H1: `Puppy Weight Calculator`
- Keywords: puppy weight calculator (12,100 / KD 18), determine puppy weight (12,100 / 20), puppy growth calculator (2,900 / 14), dog size calculator (1,900 / 13), puppy weight estimator (1,300 / 12), puppy weight predictor (1,300 / 20), puppy size calculator (1,900 / 13)

**Data step (do this first, separate commit).**
Source: Salt C, Morris PJ, German AJ, et al. *Growth standard charts for monitoring bodyweight in dogs of different sizes.* PLoS ONE 2017;12(9):e0182064. https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/ . Open data (CC BY 4.0): https://datacat.liverpool.ac.uk/377/ (file `Final_Data_PLOS.zip`, 146 MB; readme https://datacat.liverpool.ac.uk/377/3/Salt_PuppyGrowthCharts_Readme.txt). Note: the article has a 2024 correction; read it and report anything that changes the method.

Write `scripts/build_growth_table.py` (pandas). Do not commit the raw data; add it to `.gitignore`. The script:

1. Loads `Final_Data_PLOS.csv` (columns per readme: BREED ID, PET ID, GENDER, NEUTER_DATE, VISIT_DATE, VISIT_AGE (years), WEIGHT (kg), BCS_RECORDED, BCS_PREDICTED, PREVENTIVE_CARE_VISIT, HEALTHY_PET_DIAGNOSIS, AV_BREED-WEIGHT (kg)).
2. Keeps visits where `PREVENTIVE_CARE_VISIT == 'Y'` or `HEALTHY_PET_DIAGNOSIS == 'Y'`; drops rows with missing age/weight/AV_BREED-WEIGHT; keeps `0.20 <= VISIT_AGE <= 2.25`; keeps dogs not yet neutered at the visit (NEUTER_DATE empty or after VISIT_DATE).
   **Body condition is a per-dog filter, not a per-visit filter** (this matches the paper; corrected 2026-10-10, v3):
   - a. Drop every dog that has any visit (any age) with BCS_RECORDED of Thin or Heavy.
   - b. Policy C (primary): keep dogs whose body condition at 2–3 years of age (BCS_RECORDED, else BCS_PREDICTED, at their visit(s) with 2.0 <= VISIT_AGE < 3.0) is Normal. Keep ALL of that dog's growth visits from 0.20 to 2.25 years, whether or not those visits were assessed.
   - c. Policy B (fallback, per size band): dogs with no Thin/Heavy recorded anywhere, unassessed visits allowed.
   - d. Use Policy C for a size band if every age bin from 12 to 100 weeks has n >= 200 under C. Otherwise use Policy B for that band only, and say so on the page and in `/how-we-calculate/`.
   - e. Sensitivity check, report it: for every band and bin where both C and B have n >= 200, the % difference between their medians. If any difference is over 3%, stop and report before choosing.
   - f. Record in `data/growth-ratios.json` which policy each band used, and the dog/visit counts per band and policy.
3. Size category from AV_BREED-WEIGHT exactly as the paper: I < 6.5 kg; II 6.5–<9; III 9–<15; IV 15–<30; V 30–<40. Drop ≥ 40 kg (the paper's charts do not cover them).
4. `ratio = WEIGHT / AV_BREED-WEIGHT`. For each category and each age bin (weekly bins from 12 to 52 weeks, then 4-weekly to 104 weeks), compute n, P25, median, P75 of ratio. Drop bins with n < 200 and report them.
5. Smooth the median series per category with a monotone non-decreasing fit (isotonic regression) and cap at 1.0.
6. Writes `data/growth-ratios.json`: `{ source, generatedAt, filters, categories: { I: { minKg, maxKg, points: [{ weeks, n, p25, median, p75, medianSmoothed }] }, ... } }` and `data/growth-ratios-summary.md` (counts per category, total dogs, total visits). Commit both.
7. Print a summary and include it in the report.

**Calculator logic** (`lib/calc/puppyWeight.ts`):

- Inputs: age (weeks, 8–104, or months), current weight (lb/kg), optional "expected adult size" (Toy/Small/Medium/Large/X-Large = categories I–V; default "Not sure").
- `ratioAt(cat, weeks)`: linear interpolation of `medianSmoothed` between points; clamp to the table range.
- If category given: `adult = weight / ratioAt(cat, weeks)`.
- If "Not sure": compute the estimate for each category; choose the category whose kg band contains its own estimate; if none or more than one qualifies, choose the qualifying one closest to its band midpoint, else the one whose band edge is nearest. Return the chosen category in the result ("Based on dogs that grow to 15–30 kg").
- Range: `weight / ratioP75` to `weight / ratioP25` (interpolated the same way), shown as "most puppies like yours end up between X and Y".
- If the estimate is ≥ 40 kg (88 lb), show the result with the note: "Giant breeds keep growing past 2 years and aren't covered by this data. Treat this as a minimum."
- Under 12 weeks: show "Too young to predict reliably. Try again at 12 weeks."
- Output also: % of adult weight now, a growth chart (median curve for the category scaled to the predicted adult weight, with the puppy's point).
- Worked examples: Example 1 = 16 weeks, 20 lb, size "Not sure". Example 2 = 24 weeks, 9 kg, size "Medium". Compute both from the generated table, write them into the page text, and make both tests. Report the numbers.

**Second page from the same data** is NOT in the launch set; the Dataset schema goes on this page's "About the data" section (`Dataset` with name, description, creator = Salt et al., license CC BY 4.0, `isBasedOn` the datacat URL).

- Quick answer (fill numbers after the data step): "Most puppies reach about [X]% of their adult weight by 16 weeks if they're small breeds and about [Y]% if they're large. Enter your puppy's age and weight and we'll project their adult weight from growth data on [N] healthy dogs seen at US vet clinics."
- notCovered: mixed breeds (the data is purebred only, but mixes of similar size usually follow the same curve); dogs over 88 lb adult weight; puppies under 12 weeks; puppies who are under- or overweight now; height or length.
- Tables: (1) "% of adult weight by age" for categories I–V at 12, 16, 20, 24, 32, 40, 52, 78 weeks. (2) "Typical adult weight by breed" for 15 common breeds with ranges from AKC breed standard pages (VERIFY each, link each).
- FAQ (answers 40–80 words, real numbers from the table): How accurate is a puppy weight calculator? / At what age is a puppy half its adult weight? / When do puppies stop growing? / Does the 16-week rule (double the weight) work? / Do paws predict size? / Does neutering change adult size? (cite the paper: small shifts) / What if my puppy is a mix?
- Related: dog food calculator, dog crate size chart, dog years calculator, dog harness size chart.

---

### A6.2 `/dog-pregnancy-calculator/`

- Title: `Dog Pregnancy Calculator: Due Date & Week-by-Week` (48)
- Meta: `Find your dog's due date from the breeding date. Dogs whelp about 63 days after ovulation. See the full timeline, from day 1 to whelping.`
- H1: `Dog Pregnancy Calculator`
- Keywords: dog pregnancy calculator (2,900 / 14), dog pregnancy estimator (2,400 / 16), dog due date calculator (1,300 / 17), dog gestation calculator (1,000 / 15), how long are dogs pregnant (cluster, 12,100 / 19)
- Constants (VERIFY):
  - `DOG_GESTATION_FROM_BREEDING = 63`, range ±7 days. Source: Cornell Riney Canine Health Center, "Normal whelping process": "63 +/-7 days from the date of the first breeding"; "average of 63 days from ovulation". https://www.vet.cornell.edu/departments/riney-canine-health-center/canine-health-information/normal-whelping-process
  - From a progesterone-confirmed ovulation date: 63 ± 2 days (same source).
  - Temperature drop: below 99 °F within 24 hours of whelping; normal 100–102.5 °F (same source).
  - Merck Veterinary Manual (owner version) gives 62–64 days and says X-rays after day 55 are best for counting puppies: https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs
  - Timeline milestones for weeks 1–9 (ultrasound detection window, abdominal palpation window, relaxin blood test window, X-ray skeletal visibility, appetite/weight changes, nesting): take each day number from VCA Animal Hospitals or Merck pages and cite them. VERIFY each; do not invent.
- Inputs: date of first breeding (or "ovulation date confirmed by progesterone test" checkbox).
- Outputs: due date, earliest/latest normal dates, today's day of pregnancy and week, countdown, the week-by-week timeline with today highlighted, "prepare the whelping box by" date (day 55, VERIFY from source), "start taking temperature twice daily from" date (day 57, VERIFY).
- Example 1: bred 2026-11-01 → due 2027-01-03, normal range 2026-12-27 to 2027-01-10.
- Example 2: bred 2027-03-15 → due 2027-05-17, range 2027-05-10 to 2027-05-24.
- Date maths in UTC date-only (no time zones). Tests include a leap year (bred 2028-01-15 → due 2028-03-18).
- notCovered: confirming pregnancy (only a vet can, by ultrasound, relaxin test or X-ray); false pregnancy; problems during whelping; cats (link the cat calculator when it exists).
- "See your vet if" list (from Cornell/Merck, VERIFY): more than 30–60 minutes of strong straining with no puppy; green or bloody discharge before the first puppy; no labor 24 hours after the temperature drop; pregnancy past day 70.
- FAQ: How long are dogs pregnant? / How accurate is a dog due date? / How soon can you tell a dog is pregnant? / When can a vet count the puppies? / Can a dog give birth at 58 days? / What is the temperature drop before labor? / Do small and large dogs have different pregnancy lengths?
- Related: dog heat cycle calculator, puppy weight calculator, dog food calculator (pregnancy factor).

---

### A6.3 `/dog-years-calculator/`

- Title: `Dog Years Calculator: Dog Age in Human Years` (44)
- Meta: `Convert your dog's age to human years by size, plus the 2020 DNA-based formula. Includes a full chart from 1 to 16 years.`
- H1: `Dog Years Calculator`
- Keywords: how many dog years is one human year (4,400 / 25), dog age chart in human years (720 / 24), dog years calculator, "X in dog years" long tail (2,900 each for 10, 13, 4)
- Method 1 (default): size-based chart. Small ≤ 20 lb, Medium 21–50 lb, Large 51–100 lb, Giant > 100 lb. Values for ages 1–16 (VERIFY against the AVMA chart; if AVMA no longer publishes it, use the source that does and cite it):

  | Age | Small | Medium | Large | Giant |
  |---|---|---|---|---|
  | 1 | 15 | 15 | 15 | 12 |
  | 2 | 24 | 24 | 24 | 22 |
  | 3 | 28 | 28 | 28 | 31 |
  | 4 | 32 | 32 | 32 | 38 |
  | 5 | 36 | 36 | 36 | 45 |
  | 6 | 40 | 42 | 45 | 49 |
  | 7 | 44 | 47 | 50 | 56 |
  | 8 | 48 | 51 | 55 | 64 |
  | 9 | 52 | 56 | 61 | 71 |
  | 10 | 56 | 60 | 66 | 79 |
  | 11 | 60 | 65 | 72 | 86 |
  | 12 | 64 | 69 | 77 | 93 |
  | 13 | 68 | 74 | 82 | 100 |
  | 14 | 72 | 78 | 88 | 107 |
  | 15 | 76 | 83 | 93 | 114 |
  | 16 | 80 | 87 | 99 | 121 |

  Between whole years: linear interpolation. Under 1 year: interpolate from 0 → 0 to 1 → (15 or 12). Over 16: extend by the 15→16 step per year, and label "beyond the chart".
- Method 2: epigenetic formula, `human = 16 × ln(dogAgeYears) + 31`, valid for dogs aged 1 year and older. Source: Wang T, et al. *Quantitative translation of dog-to-human aging by conserved remodeling of the DNA methylome.* Cell Systems 2020;11(2):176–185. VERIFY the DOI and formula from the paper. Show it as a second line: "DNA-based estimate (from a study of Labrador retrievers): N". Under 1 year: show "The DNA formula is only meaningful from age 1."
- Also show the life stage per AAHA 2019 Canine Life Stage Guidelines (https://www.aaha.org/resources/life-stage-canine-2019/canine-life-stage-definitions/): puppy (to ~6–9 months), young adult (to ~3–4 years), mature adult, senior (last 25% of expected lifespan). Use a lifespan by size table only if you can source it (VERIFY; otherwise skip senior detection and link the senior FAQ).
- Example 1: 5-year-old, 40 lb (Medium) → 36 human years; DNA formula 16 × ln 5 + 31 = 56.75 → "about 57".
- Example 2: 10-year-old, 75 lb (Large) → 66 human years; DNA formula 16 × ln 10 + 31 = 67.84 → "about 68".
- Display rounding: whole years.
- notCovered: individual health; mixed-size dogs (use the adult weight); the "7 years" rule (explain why it's wrong).
- FAQ: Is one dog year really 7 human years? / How old is a 2-year-old dog in human years? / Why do big dogs age faster? / What is the new DNA formula? / At what age is a dog a senior? / How old is the oldest dog? (source it or drop the question) / Do dog years work for puppies?
- Related: cat years calculator, puppy weight calculator, dog food calculator.

---

### A6.4 `/cat-years-calculator/`

- Title: `Cat Years Calculator: Cat Age in Human Years` (44)
- Meta: `Convert your cat's age to human years. The first year equals about 15 human years, the second 9 more, then about 4 per year.`
- H1: `Cat Years Calculator`
- Keywords: cat years to human years calculator (1,300 / 23), cat year calculator (880 / 24), how do cat years work (1,300 / 25), "X year old cat in human years" long tail
- Table (VERIFY against International Cat Care's cat age chart, and cite the page used):
  - Months: 1 → 1, 3 → 4, 6 → 10, 12 → 15, 18 → 21, 24 → 24.
  - From 2 years: human = 24 + 4 × (catYears − 2). So 3 → 28, 5 → 36, 10 → 56, 15 → 76, 20 → 96.
  - Between points: linear interpolation.
- Life stages: AAHA/AAFP 2021 Feline Life Stage Guidelines (https://www.aaha.org/aaha-guidelines/life-stage-feline-2021/feline-life-stage-home/): kitten, young adult, mature adult, senior. The stage ages are in the guidelines' Table 1; VERIFY them from the PDF and use those.
- Example 1: 7-year-old cat → 44 human years.
- Example 2: 6-month-old kitten → 10 human years.
- notCovered: breed differences, individual health, the outdated "×7" rule.
- FAQ: How old is a 1-year-old cat in human years? / Do cats age faster than dogs? / When is a cat a senior? / How long do indoor cats live? (source it) / How old is a 15-year-old cat? / How do vets estimate a cat's age?
- Related: kitten age chart, cat food calculator, dog years calculator.

---

### A6.5 `/kitten-age-chart/`

- Title: `Kitten Age Chart: Tell a Kitten's Age by Week` (45)
- Meta: `Estimate a kitten's age from weight, teeth, eyes and ears. Week-by-week chart from birth to 8 weeks, plus adult teeth timing.`
- H1: `Kitten Age Chart`
- Keywords: kitten age chart (6,600 / 10), kitten age by teeth (1,300 / 5), how to tell kitten age (1,000 / 4), kitten weight by age (590 / 15), kitten teeth age chart (880 / 6)
- Data (VERIFY): Alley Cat Allies, "Determining Kitten Age" https://www.alleycat.org/wp-content/uploads/2016/01/Determining-Kitten-Age.pdf :
  - Under 12 hours: umbilical cord wet; 3–4 oz.
  - 1–5 days: umbilical cord dry.
  - 1 week: about 8 oz.
  - 7–10 days: eyes open.
  - 2½–3½ weeks: incisors begin.
  - 3 weeks: ears upright; canines begin (3–4 weeks).
  - 4 weeks: about 1 lb; walking, tail up.
  - 5–8 weeks: premolars; all baby teeth by 8 weeks.
  - After 4 weeks: gains about 4–6 oz per week.
  - Adult teeth: incisors 3–3½ months, canines 3–4 months, premolars 4½–6 months, molars 5–6 months, all by 6 months.
  - Weight alone isn't accurate before 2–3 weeks.
- Tool: "Kitten age estimator". Inputs: weight (oz/g, optional), checkboxes for eyes open / ears upright / baby teeth visible (incisors, canines, premolars) / walking steadily. Output: an age range in weeks from the overlapping rules, with which signs drove it. Weight-only estimate after 4 weeks: `weeks = 4 + (weightOz − 16) / 5` (midpoint of 4–6 oz/week), shown as a range using 4 and 6.
- Example 1: 24 oz, eyes open, ears up, incisors and canines → weight gives 4 + 8/6 to 4 + 8/4 = 5.3 to 6.0 weeks; teeth agree (canines 3–4+ weeks, no premolars noted) → "about 5 to 6 weeks".
- Example 2: 8 oz, eyes just opening, no teeth → "about 1 to 1½ weeks".
- notCovered: health checks, orphan kitten feeding amounts (link out to a sourced guide), older kittens beyond 6 months.
- FAQ: How can you tell how old a kitten is? / How much should a 4-week-old kitten weigh? / When do kittens open their eyes? / When do kittens get their teeth? / When can kittens leave their mother? (source it) / When do kittens lose baby teeth?
- Related: cat years calculator, cat food calculator.

---

### A6.6 `/dog-crate-size-chart/`

- Title: `Dog Crate Size Chart: Find the Right Crate by Size` (49)
- Meta: `Measure your dog nose to tail base and add 2 to 4 inches. Use our crate size calculator and chart from 18 to 54 inches, with breed examples.`
- H1: `Dog Crate Size Chart`
- Keywords: dog crate sizes (6,600 / 25), dog crate size chart (1,900 / 7), dog crate size guide (880 / 21), how to size a dog crate (480 / 22), crate size by breed
- Method (VERIFY): AKC crate guidance: measure from nose to base of tail and add 2–4 in; measure height from floor to top of head (or ear tips if erect) and add 2–4 in. Find the current AKC page and cite it.
- Standard crate lengths: 18, 22, 24, 30, 36, 42, 48, 54 in. Typical heights and weight ranges per length: take from one major manufacturer's published chart (MidWest Homes for Pets) and cite it (VERIFY every row).
- Calculator: inputs length (in), height (in), optional puppy toggle ("size for adult, use a divider"). `minLength = L + 2`, `idealLength = L + 4`; recommend the smallest standard length ≥ idealLength whose typical height ≥ H + 2; if height fails, step up.
- Example 1: length 28 in, height 22 in → ideal length 32 → 36-inch crate (if its height ≥ 24 in per the chart; VERIFY).
- Example 2: length 17 in, height 14 in → ideal 21 → 22-inch crate (if height ≥ 16 in).
- Tables: (1) crate length → typical dog weight and height (manufacturer); (2) 20 breeds → typical crate size (derive from AKC standard heights/weights and the manufacturer chart; label "typical").
- notCovered: travel/airline crates (IATA rules differ), anxious dogs, very long-bodied breeds (dachshunds, measure them).
- Affiliate-ready: an `AffiliateBox` placeholder under the table that renders nothing until links are added.
- FAQ (6–7): How do I measure my dog for a crate? / What size crate for a puppy? / Can a crate be too big? / What size crate for a Golden Retriever / French Bulldog / German Shepherd? (one question covering 3 breeds) / Wire vs plastic crate sizes? / How much room should a dog have in a crate?
- Related: dog harness size chart, dog collar size chart, puppy weight calculator.

---

### A6.7 `/dog-collar-size-chart/`

- Title: `Dog Collar Size Chart: Measure for a Perfect Fit` (48)
- Meta: `Measure your dog's neck and add 2 inches for a collar. Size chart from XS to XXL with neck sizes for 25 common breeds.`
- H1: `Dog Collar Size Chart`
- Keywords: dog collar size chart (2,400 / 15), dog collar sizes (1,600 / 14), dog collar size (1,300 / 10), collar size dog (720 / 9), collar sizes for dogs (390 / 12)
- Method (VERIFY with AKC and one brand page): measure around the neck where the collar sits; collar size = neck + 2 in (two-finger rule). VERIFY whether the source uses +1 in for very small dogs; if it does, apply it with the source's weight cut-off.
- Calculator: neck (in/cm) → collar length, plus which generic size (table) it falls in.
- Table 1: generic sizes XS–XXL by neck range (take one major brand's published chart, cite it, label "sizes vary by brand"). Table 2: 25 breeds → typical neck range (cite a source per row or a single published brand table; VERIFY).
- Example 1: neck 14 in → collar 16 in.
- Example 2: neck 30 cm → 30 + 5.08 = 35.08 → "35 cm".
- notCovered: puppies (re-measure every 2 weeks), martingale and prong collars, harness fit.
- FAQ: How do I measure my dog's neck? / How tight should a collar be? / What size collar for a puppy? / Collar or harness? / What size collar does a Lab need? / How do I know if a collar is too small?
- Related: dog harness size chart, dog crate size chart.

---

### A6.8 `/dog-harness-size-chart/`

- Title: `Dog Harness Size Chart: Measure & Compare Brands` (48)
- Meta: `Measure your dog's chest girth and compare harness sizes across popular brands. Free size finder with a breed chart.`
- H1: `Dog Harness Size Chart`
- Keywords: dog harness size chart (1,900 / 12), how to size a dog harness (1,000 / 15), dog harness sizes (590 / 14), dog harness size guide (390 / 13)
- Method: measure chest girth at the widest point behind the front legs; some brands also use neck. Size finder: input girth (and neck optional) → list the matching size for each brand in the table, flag "between sizes" when within 1 in of a boundary.
- Brand table (VERIFY each from the brand's official size page, cite URL and date): Ruffwear Front Range, PetSafe Easy Walk, Rabbitgoo No-Pull, Kurgo Tru-Fit, Julius-K9 IDC. Store as data in `lib/data/harnessSizes.ts`. If a brand page can't be read, drop that brand.
- Example 1: girth 22 in → list each brand's size (fill from data, becomes a test).
- Example 2: girth 30 in, neck 18 in → same.
- notCovered: custom harnesses, medical/support harnesses, cats.
- FAQ: How do I measure a dog for a harness? / What if my dog is between sizes? / How tight should a harness be? / Front-clip vs back-clip? (no product claims) / What size harness for a puppy? / Harness size by weight: does it work?
- Related: dog collar size chart, dog crate size chart.

---

### A6.9 `/dog-food-calculator/`

- Title: `Dog Food Calculator: How Much to Feed Your Dog` (46)
- Meta: `Work out your dog's daily calories and cups of food from weight and life stage, using the standard vet formula RER = 70 × kg^0.75.`
- H1: `Dog Food Calculator`
- Keywords: how much wet food to feed a dog calculator (590 / 25), dog feeding guide calculator (390 / 19), how much to feed a puppy calculator (320 / 23), dog calorie calculator
- Constants (VERIFY): Pet Nutrition Alliance, "Calculating Calories Based on Pet Needs" https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf :
  - `RER = 70 × kg^0.75` kcal/day
  - Dog MER factors: neutered adult 1.6; intact adult 1.8; inactive/overweight-prone 1.2–1.4 (use 1.3); weight loss 1.0; growth 2–3 (use 3.0 under 4 months, 2.0 from 4 months to adult; VERIFY this split against WSAVA or NRC 2006 and cite); gestation 1.6–2.0; lactation 2–6 (link to a vet, show range only).
  - Note from the source: individual needs vary by up to 50%; adjust by body condition.
- Inputs: weight (lb/kg), life stage/activity (select), food energy (kcal per cup, from the bag; default 380), optional wet food (kcal per can) with % of calories from wet.
- Outputs: RER, daily kcal, cups/day (and grams if kcal/kg given), per-meal split (2 or 3 meals), treats budget = 10% of kcal (VERIFY the 10% rule from WSAVA or AAHA and cite).
- Example 1: 20 kg (44.1 lb) neutered adult, 380 kcal/cup → RER 662 kcal; MER 1,059 kcal/day; 2.79 cups/day.
- Example 2: 40 lb (18.14 kg) intact adult, 350 kcal/cup → RER 615 kcal; MER 1,108 kcal/day; 3.16 cups/day.
- notCovered: medical diets, pregnant/nursing dogs beyond the range shown, dogs with illness, weight-loss plans (link the AAHA weight management guidelines).
- FAQ: How many cups of food should my dog eat a day? / How much should a puppy eat? / Why does the bag say a different amount? / How many calories does a dog need? / How do I know if I'm overfeeding? / Should I feed once or twice a day? / How many treats are OK?
- Related: raw dog food calculator, puppy weight calculator, cat food calculator.

---

### A6.10 `/raw-dog-food-calculator/`

- Title: `Raw Dog Food Calculator: Grams Per Day by Calories` (49)
- Meta: `Calculate how much raw food to feed from your dog's calorie needs and the food's kcal per pound, plus the % of body weight it works out to.`
- H1: `Raw Dog Food Calculator`
- Keywords: raw dog food calculator (1,000 / 23), raw feeding calculator for dogs (720 / 23), raw food calculator dog (590 / 24), puppy raw food calculator (390 / 17)
- Method: energy-based (same RER/MER as A6.9), then `grams/day = kcal/day ÷ (kcal per kg of food) × 1000`. Show the "% of body weight" the result equals, and compare it with the common 2–3% rule (say plainly that the rule ignores energy density).
- Inputs: weight, life stage, food energy (kcal/lb or kcal/kg from the label; default 1,400 kcal/kg ≈ 635 kcal/lb, labelled "typical, check your label").
- Safety section (MUST, VERIFY wording/links): FDA "Get the Facts! Raw Pet Food Diets can be Dangerous to You and Your Pet" and the AVMA policy on raw or undercooked animal-source protein. Neutral tone, no product claims.
- Example 1: 20 kg neutered adult, 1,400 kcal/kg → 1,059 kcal/day → 757 g/day (26.7 oz), 3.78% of body weight.
- Example 2: 60 lb (27.22 kg) intact adult, 1,800 kcal/kg → 1,501 kcal/day → 834 g/day (29.4 oz), 3.06% of body weight.
- notCovered: recipe balancing (calcium/phosphorus, vitamins), puppies' mineral needs (vet nutritionist), cats.
- FAQ: How much raw food should I feed my dog? / Is 2–3% of body weight right? / How much raw food for a puppy? / Is raw food safe? / Can I mix raw and kibble? / How do I find the calories in raw food?
- Related: dog food calculator, puppy weight calculator.

---

### A6.11 `/dog-heat-cycle-calculator/`

- Title: `Dog Heat Cycle Calculator: Next Heat & Fertile Days` (50)
- Meta: `Predict your dog's next heat and fertile window from the first day of her last heat. Dogs cycle about every 7 months, from 4 to 13.`
- H1: `Dog Heat Cycle Calculator`
- Keywords: dog heat cycle calculator (880 / 10), dog heat cycle calendar (590 / 18), dog heat cycle stages (590 / 22)
- Constants (VERIFY): Merck Veterinary Manual (owner version) https://www.merckvetmanual.com/dog-owners/reproductive-disorders-of-dogs/management-of-reproduction-in-dogs : interestrous interval average 7 months (range 4–13; some large breeds 9–12); proestrus about 9 days (2 days–3 weeks); estrus about 9 days (3 days–3 weeks); diestrus about 2 months.
- Inputs: first day of last heat (bleeding start), optional "her usual interval" (months, 4–13).
- Outputs: proestrus window (day 1–9), likely estrus/fertile window (day 10–18), end of heat, next heat date (+7 calendar months or the user's interval), and a 12-month calendar. Wording: "most likely", "averages"; say ovulation timing varies and only progesterone testing confirms it.
- Example 1: heat started 2026-10-01 → proestrus 2026-10-01 to 2026-10-09; estrus about 2026-10-10 to 2026-10-18; next heat about 2027-05-01 (range 2027-02-01 to 2027-11-01).
- Example 2: started 2027-01-31, usual interval 6 months → next heat 2027-07-31. Month-end test: start 2027-08-31 + 6 months → 2028-02-29 (clamp to last day of month).
- notCovered: preventing pregnancy, spaying timing (link AAHA), irregular or silent heats, cats.
- FAQ: How long is a dog in heat? / How often do dogs go into heat? / When is a dog most fertile? / What are the stages of a heat cycle? / At what age does a dog have her first heat? (source it) / Can a dog get pregnant outside the fertile window?
- Related: dog pregnancy calculator, dog years calculator.

---

### A6.12 `/cat-food-calculator/`

- Title: `Cat Food Calculator: How Much Wet & Dry Food` (44)
- Meta: `Find your cat's daily calories and how many cans or cups to feed, split between wet and dry food. Uses RER = 70 × kg^0.75.`
- H1: `Cat Food Calculator`
- Keywords: how much dry food to feed cat (1,000 / 23), how much wet food to feed cat (720 / 17), how much wet and dry food to feed a cat (480 / 15), how many calories does a cat need a day (590 / 23)
- Constants (VERIFY, same PNA source): cat MER neutered adult 1.2; intact adult 1.4; inactive 1.0; weight loss 0.8; growth 2.5 (2–3).
- Inputs: weight, life stage, wet food kcal per can (default 85 kcal per 3 oz can) and/or dry food kcal per cup (default 400), % wet.
- Example 1: 4.5 kg (9.9 lb) neutered adult, all wet at 85 kcal/can → RER 216 kcal; MER 260 kcal/day; 3.05 cans/day.
- Example 2: 10 lb (4.54 kg) intact adult, all dry at 400 kcal/cup → RER 218 kcal; MER 305 kcal/day; 0.76 cups/day.
- notCovered: kidney/diabetic diets, kittens under 8 weeks, weight-loss plans.
- FAQ: How much wet food should a cat eat a day? / How much dry food per day? / How many calories does a cat need? / Wet or dry? (neutral) / How much should a kitten eat? / Is my cat overweight?
- Related: cat years calculator, kitten age chart, dog food calculator.

---

## A7. Trust and legal pages

- `/about/`: what PawScales is (free calculators and charts for dog and cat owners, built from published veterinary research and open data, each with sources). Who runs it: Sikander Malik. Include this short story (owner-approved; keep it in his voice, no photo):
  > "I grew up with Bravo, a Gull Dong. He was strong, loyal, protective and endlessly playful, and he was family, not just a pet. Looking after him taught me how many everyday questions owners have: how big will he get, how much should he eat, what does this number on the bag actually mean. PawScales is my attempt to answer those questions with real numbers and real sources."
  Then: how the tools are built, what they don't do (not vet advice), contact.
- `/how-we-calculate/`: every constant with its value, source link and accessed date (generated from `lib/constants.ts` / sources registry), plus the A6.1 data method.
- `/editorial-policy/`: who writes (Sikander Malik); how tools are built and tested; sources we accept (vet schools, veterinary associations, peer-reviewed papers, manufacturers' official charts); AI use disclosure ("We use AI tools to help draft and code. Every number is checked against the cited source and covered by automated tests, and every page is reviewed by Sikander before publishing."); update policy; public corrections log section (empty table at launch); ads and affiliate policy.
- `/authors/sikander-malik/`: name, bio (A-box), what he does on the site, the Bravo line (one sentence), contact link. ProfilePage + Person schema.
- `/contact/`: Web3Forms form (name, email, message, honeypot field), `hello@pawscales.com`.
- `/privacy-policy/`: name only real processors: Cloudflare (hosting, Web Analytics), Google Analytics 4 (if `NEXT_PUBLIC_GA_ID` set), Web3Forms (contact form). Ads/affiliates sections written but marked "not active yet". Consent for EEA/UK/CH (A9).
- `/terms/`, `/disclaimer/` ("PawScales provides estimates for general information. It is not veterinary advice. Always ask your vet about your pet's health, diet, breeding or weight."), `/affiliate-disclosure/`, `/sitemap/` (HTML sitemap with one-line descriptions), `/photo-credits/` (every photo, photographer, source and license link, from `lib/data/photos.ts`), custom 404.
- `/design/`: internal component and token showcase (design.md 12), `noindex`, not in any sitemap or nav.
- Disclaimer line on tool pages: "Estimates only, not veterinary advice. Ask your vet about your pet's health."

## A8. GEO / AI answers

- Quick answer box first on every page, question-style H2s, exact numbers with units, tables in HTML.
- Consistent entity everywhere: "PawScales", logo, "Sikander Malik", hello@pawscales.com.

## A9. Analytics

- Cloudflare Web Analytics (enabled in the dashboard, no code needed if auto-injected; otherwise add the beacon with the token from Part B).
- GA4 only when `NEXT_PUBLIC_GA_ID` is set: `next/script` with `strategy="lazyOnload"`. Consent Mode v2 defaults: `analytics_storage` and `ad_storage` denied for EEA + UK + CH (region list), granted elsewhere; a small banner shown only in those regions (detect via `Intl` time zone fallback; keep it simple and documented).
- Events: `tool_used` (first input change), `tool_result_shown`, `copy_result`, `share_link`, `outbound_click`.

## A10. Monetization-ready

- `AdSlot` component with reserved min-height that renders nothing until `NEXT_PUBLIC_ADSENSE_ID` is set. Never between inputs and result; never above the tool on mobile.
- `public/ads.txt` (empty placeholder comment for now).
- `AffiliateLink` component: `rel="sponsored nofollow noopener"`, `target="_blank"`, plus a disclosure line on any page that uses it. No affiliate links at launch.

## A11. Performance rules

- H1 + quick answer server-rendered outside the client calculator component.
- `prefetch={false}` on footer, related, hub and breadcrumb links.
- Fonts per design.md section 4 only (two variable files, `display: swap`). Photos per design.md section 8 (AVIF/WebP, explicit sizes, never the LCP element on mobile, ≤ 150 KB per page on mobile). Reserved heights for ad slots and charts (CLS 0). Charts: lightweight SVG, no heavy chart library.
- Shared helpers in `lib/calc/round.ts`: `ceilCount = x => Math.ceil(Math.round(x * 1e6) / 1e6)`; `roundTo(x, d)`. Use them everywhere.

## A12. Tests and launch checks

Per tool, at least 10 known-answer tests, including:
- both worked examples (exact page text numbers);
- whole-number and decimal inputs;
- unit toggle equivalence (lb vs kg, in vs cm give the same result);
- boundary inputs (min/max age, size-band edges, month-end dates, leap years);
- empty/zero/negative input → friendly message, never NaN or Infinity;
- very large input;
- every number in the tables and FAQ answers that comes from a calculation.

Launch checks: clean `next build`; schema validation (no errors in Google Rich Results test for FAQ/Breadcrumb); internal link crawl (0 broken); 360 px mobile layout; view-source shows quick answer, table and default result; `/404-test/` returns 404; title/meta lengths script passes.

## A13. Content style (all visible text)

Answer first. Plain verbs, contractions, mixed sentence lengths. No em dashes. No filler ("delve", "Indeed", "it's worth noting", "versatile", "comprehensive guide", "in today's world"). A real number in every paragraph where possible. US units, US spelling. Never use paraphraser tools. Never invent a statistic, study, quote or vet.

## A14. Definition of done (launch)

- [ ] 12 pages in A6, 3 hubs, home, all A7 pages live in the build
- [ ] Growth table generated and committed with summary; numbers filled in A6.1
- [ ] Every VERIFY value checked, sourced in `lib/constants.ts`, listed in the report with the source URL
- [ ] ≥ 10 tests per tool, all passing; total test count reported
- [ ] Lighthouse mobile: home ≥ 95, tools ≥ 90 (report each)
- [ ] All A12 launch checks pass
- [ ] Every rule in design.md section 2 holds; `/design/` page built; visual QA in design.md section 13 done (screenshots at 360/768/1280 listed in the report)
- [ ] Every photo is a real Unsplash/Pexels photo recorded in `lib/data/photos.ts` and credited on `/photo-credits/`
- [ ] Pushed to `main`; report: commit hashes, test count, VERIFY table (value, source, any changes), Lighthouse scores, growth table summary

Home page: H1 "Free dog and cat calculators, built on real data"; tool search; the 12 tools grouped by hub with one-line descriptions; "Popular answers" (5 quick facts with links, e.g., "Dogs are pregnant about 63 days"); short "Who's behind this" with link to the author page.

---

# PART B: Browser agent tasks (not for the coding agent)

1. After the first push: Cloudflare Pages → connect `SikanderMalik300/pawscales` (owner authorizes GitHub), build `npm run build`, output `out`, `NODE_VERSION=22`, `NEXT_PUBLIC_WEB3FORMS_KEY`.
2. Custom domains `pawscales.com` + `www.pawscales.com` on Pages; remove the Hostinger parking A/CNAME records; redirect rule www → apex (301, keep query string).
3. Web Analytics on. Email Routing `hello@pawscales.com` → owner's Gmail. Web3Forms key + live test.
4. Search Console (Domain property, DNS TXT), submit sitemap, request indexing for home + 12 tools over 2 days. AI features: Include.
5. Bing Webmaster Tools (CNAME verify, DNS only), submit sitemap.
6. GA4 property + stream → `NEXT_PUBLIC_GA_ID` in the same push as the privacy section.
7. IndexNow spec (separate fix file after launch).
8. Verify every page per the Phase 5 checklist; recompute every worked example; write `pawscales-day1-fixes.md` if needed.
9. Log everything in the Project Memory Sheet.
