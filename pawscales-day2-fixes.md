# PawScales day-2 fixes

- Date: 2026-10-11
- From: browser agent, for the PawScales coding agent
- Live state: pawscales.com is on Cloudflare Pages. These env vars are set in Pages (Production): `NODE_VERSION=22`, `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_GA_ID=G-FLH62BEG4Q` (new today). Email `hello@pawscales.com` forwards to the owner.

Do every task below, one commit per task. Don't change URLs, titles, H1s, formulas or FAQ text. Run `npm test` and `next build`, then push to `main`.

## Task 1. IndexNow on every push

Use this key (32 hex): `75e98a1ac5c3cb5382566ade98c2bf00`

1. Add `public/75e98a1ac5c3cb5382566ade98c2bf00.txt` with the key as its only content. No trailing newline. It must serve at `https://pawscales.com/75e98a1ac5c3cb5382566ade98c2bf00.txt` as `text/plain` with status 200. Make sure `_headers` and the noindex rule for pages.dev don't block it on pawscales.com.
2. Add `.github/workflows/indexnow.yml`:
   - Triggers: `push` to `main`, plus `workflow_dispatch` with an optional input `all` (boolean, default false) that submits every sitemap URL.
   - `runs-on: ubuntu-24.04`. Steps: checkout, `actions/setup-node` with Node 22 and npm cache, `npm ci`, `npm run build`.
   - Read URLs from the built `out/sitemap.xml`. Never fetch the live sitemap.
   - Pick URLs whose `<lastmod>` date equals today's UTC date. If `all` is true, pick every URL.
   - If no URLs are picked, print "Nothing changed" and exit 0.
   - `sleep 120` so Cloudflare Pages finishes deploying before the ping.
   - POST JSON to `https://api.indexnow.org/indexnow` with `Content-Type: application/json; charset=utf-8` and a `User-Agent: PawScales-IndexNow/1.0` header. Body: `{"host":"pawscales.com","key":"75e98a1ac5c3cb5382566ade98c2bf00","keyLocation":"https://pawscales.com/75e98a1ac5c3cb5382566ade98c2bf00.txt","urlList":[...]}`. Batch at 10,000 URLs max.
   - Treat 200 and 202 as success. Any other status: print the status and body, and fail the job.
   - Put the logic in `scripts/indexnow.mjs` (no new dependencies) and call it from the workflow.
3. Check that `lastmod` in `sitemap.xml` comes from each page's real "updated" date in the registry, not from the build time. If it uses the build time, every URL would be sent on every push. Fix that so only edited pages change their `lastmod`.
4. Tests: one unit test for the URL picker (today-only filter, `all` mode, empty case). One test that the key file exists and matches the key in the script.

## Task 2. Puppy page OG image crop

The puppy page's social image (`/puppy-weight-calculator/`, 1200×630) shows the puppy cropped from behind or off-center, so the face is missing in link previews.
- Give each photo used in OG images a focal point (`focalX`, `focalY` from 0 to 1 in `lib/data/photos.ts`, if it isn't there already) and crop around it with `object-position` in the OG template.
- For the puppy photo, set the focal point on the puppy's face. If no crop of the current photo shows the face, swap in a different Unsplash or Pexels puppy photo that faces the camera. Record the photographer and source as usual.
- Check every other OG image the same way and report any that cut off a face.

## Task 3. Add GA4 (it is missing from the build)

`NEXT_PUBLIC_GA_ID=G-FLH62BEG4Q` is set in Pages and the site was rebuilt with it, but the live build has no GA code: no gtag script, no `dataLayer`, no consent banner, and the ID appears in no JS chunk. The Privacy Policy already describes GA4 and the EEA/UK/CH banner, so the code must now match it (build spec section on analytics):
- Add `components/Analytics.tsx`, rendered in the root layout only when `process.env.NEXT_PUBLIC_GA_ID` is set. Load `https://www.googletagmanager.com/gtag/js?id=...` with `next/script` `strategy="lazyOnload"`, then `gtag('config', id)`.
- Run only when `location.hostname === 'pawscales.com'`, so `*.pages.dev` previews and localhost don't send hits.
- Consent Mode v2: before config, `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'})` plus a second default with `region` set to the EEA + UK + CH country codes and `analytics_storage:'denied'`. Show a small banner (Accept / Decline, pill buttons, design.md styles, no emoji) only for visitors whose `Intl` time zone is in Europe (`Europe/*`, plus `Atlantic/Reykjavik`, `Atlantic/Canary`, `Atlantic/Madeira`, `Atlantic/Azores`). Accept calls `gtag('consent','update',{analytics_storage:'granted'})`. Store the choice in `localStorage` (wrapped in try/catch). Ad storage stays denied everywhere.
- Add a "Cookie settings" link in the footer that reopens the banner.
- In the Privacy Policy, add a link to Google's opt-out page (https://tools.google.com/dlpage/gaoptout) and remove "only if enabled" (it is enabled now).
- Tests: the Analytics component renders nothing without the env var; the consent defaults are emitted before `config`.
- Lighthouse mobile on `/` and `/puppy-weight-calculator/`: Performance still at least 90 and LCP is still text. No console errors.

## Report

Commit hashes, test count, the key file URL returning 200, a sample workflow run log (from `workflow_dispatch` with `all=true`) showing the 200 or 202 response, before and after puppy OG images, proof that a pawscales.com page load sends a `collect?v=2&tid=G-FLH62BEG4Q` request (outside Europe), and Lighthouse results.
