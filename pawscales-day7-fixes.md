# PawScales day-7: quick SEO wins + roadmap update

- Date: 2026-10-15 · From the browser agent, for the PawScales coding agent
- Based on a Semrush SERP review, Google Trends and a competitor review (puppilot.co: about 54K visits a month from tools).
- Don't change URLs. One commit, then run tests and the build, and push.

## Task 1. Dog years page: add "dog age calculator" wording

"dog age calculator" gets 22,200 searches a month and "age calculator of dog" 18,100. Our page never uses that phrase.
- Title: "Dog Age Calculator: Dog Years to Human Years" (keep the URL and the H1 "Dog Years Calculator").
- Add one natural sentence near the top that uses "dog age calculator", and an FAQ entry: "How does a dog age calculator work?"

## Task 2. Cat weight chart: add "kitten weight chart" wording

"kitten weight chart" gets 1,300 a month (KD 24), and its variations about 2,000 more. The phrase appears 0 times on our page.
- Rename the first H2 to "Kitten weight chart by month".
- Change the title to "Cat Weight Chart: Kitten Weight by Month" (40 chars).
- Add one FAQ entry: "How much should a kitten weigh at 3 months?", answered from our table.

## Task 3. Follow-ups from 10-15 (if not done yet)

Dog food calculator updated date and changelog note; 380 kcal/cup in the chart; link from the puppy weight calculator to the feeding chart; small-breed note.

## Roadmap (next pages, in order)

1. **Cavapoo size chart.** SERP is weak (most top-10 pages have 0 backlinks); KD 4 to 21.
2. **Dog chocolate toxicity calculator** (/dog-chocolate-toxicity-calculator/). About 9,000 searches a month across variants, KD 20 to 31, and it's a tool, which AI Overviews can't replace.
   - Source the theobromine and caffeine mg/kg thresholds per chocolate type from the Merck Veterinary Manual and ASPCA.
   - The result must always tell the reader to call their vet or the ASPCA Animal Poison Control Center (888-426-4435). Never say "safe".
   - Report the sources before building.
3. **Maine Coon size and weight chart.** It has the strongest and steadiest search interest of any breed we track (18,100 a month), but KD 45, so it comes later, once the site has some links.

Not planned: medication dosage calculators (Benadryl, gabapentin, trazodone). They drive the competitor's traffic, but they're high-risk health advice and the dose depends on the individual dog.

## Report

Commit hash, test count, the new titles.
