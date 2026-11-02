# PawScales day-15: trust fixes after the Google drop

- Date: 2026-11-03 · From the browser agent, for the PawScales coding agent
- **No new pages for the next 2–3 weeks.** This batch is only about trust and quality.

## What happened

- **The drop:** Search Console impressions went from 274–410 a day (22–25 Oct) to 0–1 a day from 26 Oct.
- **What's still fine:**
  - Pages are still indexed (`site:` about 79 results, "URL is on Google").
  - The live test passes, and there's no manual action.
  - Brand searches still rank us first, and Bing still ranks us.
- **What changed:** Google has stopped ranking us for normal searches.
- **Most likely causes:**
  - the new-site trial period ended, and we have 0 backlinks;
  - about 40 similar-looking pages published in 3 weeks;
  - health pages (medication doses) by an author with no veterinary credentials.

The fixes below target those signals. Everything is reversible.

## Task 1. Take the 6 medication pages out of Google until a vet reviews them

Pages: /benadryl-dosage-calculator/, /zyrtec-dosage-calculator/, /gabapentin-for-dogs-and-cats/, /trazodone-for-dogs-and-cats/, /dramamine-dosage-calculator/, /pepcid-dosage-calculator/

- Add `<meta name="robots" content="noindex, follow">` to these 6 pages. Keep them live for visitors and keep the internal links.
- Remove them from sitemap.xml and from the IndexNow list.
- Keep **/dog-chocolate-toxicity-calculator/** indexed. It's a poisoning-risk tool that always sends people to a vet or the ASPCA, not a dosing tool.
- Put it behind one registry flag (`medicalIndexable: false`) so we can switch them back on in one line once a vet has reviewed them.
- Test: the 6 pages have noindex and aren't in the sitemap; every other content page has no noindex.

## Task 2. Make the author real

Rewrite /authors/sikander-malik/ (and the short bio box on pages) to be honest and specific. Don't add any credentials.

- Who he is: the founder and builder of PawScales, and a dog owner. His dog Bravo has died; it's fine to mention Bravo, but never say he has a pet now, and use no Bravo photo.
- Why the site exists, in his own voice. **Leave a clearly marked placeholder for 2–3 sentences that the owner will write himself.** Don't invent a story.
- How every page is made:
  - which references (Merck, NRC, AAHA, AKC, the Salt growth studies);
  - that every number is checked against the source before publishing;
  - that tests stop the calculators going past published limits;
  - how corrections are handled (link to the editorial policy and contact page).
- State clearly: "PawScales is not a veterinary practice. Sikander is not a veterinarian." Keep the "see your vet" lines.
- Add a "Corrections" section listing real fixes we've made, with dates: Pepcid rounding (19 Oct), the kitten energy curve (20 Oct) and the chocolate chart rounding (27 Oct). That's real evidence we maintain the site.
- Person schema on the author page: name, url, `sameAs` only for real profiles (Pinterest, Qwoted), and no `jobTitle` claims beyond "Founder, PawScales".

## Task 3. Remove repeated template text

- **Script:** write one that finds any paragraph of 25+ words appearing (identically or almost) on 3 or more pages, excluding the footer and the disclaimer box.
- **Report:** send me the list, with the paragraph and the pages it appears on.
- **Rewrite:** rewrite the worst repeats so each page says it in its own words, or cut them if they add nothing. Breed pages and the calculator "how to use" sections are the likely ones.
- **Test:** add a test that fails when a 25+ word paragraph repeats across 3+ content pages.

## Task 4. Small consistency fixes (queued)

- Chocolate chart: one decimal on every ounce value ("1.0", "7.0").
- Bump lastUpdated only on pages whose visible content changed in this batch.

## Report

- Commit hash and test count.
- The list of repeated paragraphs found, and what you did with each.
- Confirmation that the 6 medication pages show noindex live and are gone from the sitemap.
- The new author page text, with the owner's placeholder marked.
