# Site Audit — Rich Valley Adventures & Aspen Alpenglow Limousine
**Date:** 2026-03-26
**Auditor:** Claude Code (claude-sonnet-4-6)
**Branch:** claude/nostalgic-mestorf
**Scope:** Full codebase review — all pages, components, SEO, accessibility, performance, code quality

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4     |
| High     | 12    |
| Medium   | 10    |
| Low      | 9     |
| **Total**| **35**|

---

## Routes Audited

### RVA (richvalleyadventures.com)
`/` → `/rva` (redirect)
`/rva` — Homepage
`/rva/about` — About
`/rva/contact` — Contact
`/rva/adventures` — Adventures listing
`/rva/adventures/[slug]` — Adventure detail (fly-fishing, paddle-boarding, mountain-biking, trail-hiking, scenic-escalade-tours, elevated-camping)
`/rva/gallery` — Gallery
`/rva/fleet` — Fleet (sister company vehicles)
`/rva/services` — Services overview
`/rva/service-areas` — Service areas
`/rva/destinations` — Destinations
`/rva/blog` — Blog listing
`/rva/blog/[slug]` — Blog post
`/rva/winter` — Winter offerings
`/rva/elevated-camping` — Elevated camping
`/rva/[...slug]` — CMS catch-all (dynamic pages from Supabase)

### AAL (aspenalpenglowlimousine.com)
`/alpenglow` — Homepage
`/alpenglow/about` — About
`/alpenglow/contact` — Contact
`/alpenglow/services` — Services listing
`/alpenglow/services/[slug]` — Service detail (airport-transfers, hourly-charter, corporate-travel, wedding-transportation)
`/alpenglow/fleet` — Fleet
`/alpenglow/gallery` — Gallery
`/alpenglow/destinations` — Destinations
`/alpenglow/service-areas` — Service areas listing
`/alpenglow/service-areas/[slug]` — Service area detail (8 areas)
`/alpenglow/blog` — Blog listing
`/alpenglow/blog/[slug]` — Blog post
`/alpenglow/[...slug]` — CMS catch-all

### Shared
`/terms` — Terms of Service
`/privacy` — Privacy Policy

---

## Critical Issues

### CRIT-1 — RVA Winter Page: All 4 Images Missing (Broken)
**File:** `app/rva/winter/page.tsx:28-53`
**Sites:** RVA

The winter page references 4 images in `/images/rva/winter/` which **does not exist**:
- `/images/rva/winter/snowshoeing.jpeg`
- `/images/rva/winter/cross-country.jpeg`
- `/images/rva/winter/ice-fishing.jpeg`
- `/images/rva/winter/winter-escalade.jpeg`

All images on `/rva/winter` will show broken image placeholders. This page is a primary SEO target for winter traffic.

**Fix:** Either create the `/public/images/rva/winter/` directory with appropriate images, or update the image paths to point to existing images (e.g., reuse `/images/adventures/` or `/images/about/` images).

---

### CRIT-2 — RVA About Page: Two Broken Image Paths
**File:** `app/rva/about/page.tsx:105,160`
**Sites:** RVA

The About page references images in `/images/rva/about/` which doesn't exist:
- Line 105: `/images/rva/about/founder-kit.jpeg` → should be `/images/about/founder-kit.jpeg`
- Line 160: `/images/rva/about/team-1.jpeg` → should be `/images/about/team-1.jpeg`

Both images exist at `/public/images/about/`. The Founder and Team sections will show broken images.

**Fix:**
```tsx
// Line 105
src="/images/about/founder-kit.jpeg"

// Line 160
src="/images/about/team-1.jpeg"
```

---

### CRIT-3 — AAL Google Search Console Verification: Placeholder Not Replaced
**File:** `app/alpenglow/layout.tsx:41`
**Sites:** AAL

```tsx
verification: {
  google: 'REPLACE_WITH_AAL_GSC_VERIFICATION_CODE',
},
```

This placeholder is being served to Google, which will cause GSC verification to fail for `aspenalpenglowlimousine.com`. Google cannot verify ownership of the AAL domain, meaning no index coverage, performance data, or crawl error alerts.

**Fix:** Replace with the actual GSC HTML tag verification code from Google Search Console for the AAL property.

---

### CRIT-4 — Wrong Phone Number in RVA CMS Page JSON-LD Schema
**File:** `app/rva/[...slug]/page.tsx:77`
**Sites:** RVA

```tsx
telephone: '+19709487474',
```

This is the wrong phone number. The correct number is `+19704563666`. Every CMS-powered service/location page (fly-fishing, hiking, etc.) emits structured data with the wrong phone number to Google.

**Fix:** Change to `'+19704563666'`.

---

## High Issues

### HIGH-1 — Missing Gallery Image: `fly-fishing-action.jpeg`
**File:** `lib/site-data.ts:47`
**Sites:** RVA

`rvaData.gallery` references `/images/adventures/fly-fishing-action.jpeg` which doesn't exist in `/public/images/adventures/`. When Supabase is not configured (or returns no data), the static gallery fallback will render a broken image on the RVA homepage and gallery page.

**Fix:** Either add the missing image to `/public/images/adventures/fly-fishing-action.jpeg` or replace with an existing image such as `/images/adventures/fishing-catch.jpeg`.

---

### HIGH-2 — Hiking Adventure: Slug Mismatch Causes "Adventure Not Found"
**Files:** `app/rva/adventures/page.tsx:29-37`, `app/rva/adventures/[slug]/page.tsx:98-123`
**Sites:** RVA

The adventures listing page generates slug `hiking` from `rvaData.adventures` title "Hiking" via `toSlug()`, and links to `/adventures/hiking`. The adventure detail page only has key `trail-hiking` — there is no `hiking` key in `adventureDetails`. Clicking "Hiking" → **"Adventure Not Found"** page.

Similarly, "Snowshoeing" is in the adventures list and links to `/adventures/snowshoeing`, but no `snowshoeing` entry exists in `adventureDetails`.

**Fix:** Either rename the `trail-hiking` key to `hiking` and add a `snowshoeing` detail entry, or align `rvaData.adventures` slugs to match the existing detail keys.

---

### HIGH-3 — AAL Homepage Service Cards Link to Non-Existent Pages
**File:** `app/alpenglow/page.tsx:68-104` (`transportationServices` array)
**Sites:** AAL

The homepage service cards link to these paths which do not exist as routes:
- `/alpenglow/corporate-events` — no such page
- `/alpenglow/airport-transfers` — no such page
- `/alpenglow/wedding-transportation` — no such page

The correct slugs for the AAL services detail pages are: `airport-transfers`, `hourly-charter`, `corporate-travel`, `wedding-transportation` at `/alpenglow/services/[slug]`.

**Fix:** Update `transportationServices` hrefs to:
- `/alpenglow/services/airport-transfers`
- `/alpenglow/services/corporate-travel`
- `/alpenglow/services/wedding-transportation`

---

### HIGH-4 — AAL Nav Fallback Dropdown Links to Non-Existent Pages
**File:** `app/alpenglow/page.tsx:119-132` (`FALLBACK_SERVICE_PAGES`, `FALLBACK_AREA_PAGES`)
**Sites:** AAL

When Supabase navigation is not configured, the nav dropdown shows these broken links:
- `/alpenglow/corporate-events` — doesn't exist
- `/alpenglow/ski-resort-transfers` — doesn't exist
- `/alpenglow/wine-tours` — doesn't exist
- `/alpenglow/night-out` — doesn't exist
- `/alpenglow/areas/aspen` — wrong path (should be `/alpenglow/service-areas/aspen`)
- `/alpenglow/areas/snowmass` — same issue
- `/alpenglow/areas/vail` — same + Vail has no service-area detail page

**Fix:** Update FALLBACK_SERVICE_PAGES to use `/alpenglow/services/[slug]` paths and FALLBACK_AREA_PAGES to use `/alpenglow/service-areas/[slug]` paths. Remove entries with no corresponding pages.

---

### HIGH-5 — RVA Nav "Wine Tours" Links to Non-Existent Page
**File:** `components/rva/RVANav.tsx:12`
**Sites:** RVA

`SERVICE_PAGES` in `RVANav.tsx` includes `{ label: 'Wine Tours', slug: 'wine-tours' }`, linking to `/rva/wine-tours`. No adventure detail page or CMS page exists for this slug. Clicking "Wine Tours" in the nav dropdown will 404.

**Fix:** Remove the "Wine Tours" entry from `SERVICE_PAGES`, or create a CMS page for it.

---

### HIGH-6 — AAL Contact Page Has No SEO Metadata (Client-Only Component)
**File:** `app/alpenglow/contact/page.tsx:1`
**Sites:** AAL

This page is marked `'use client'` at the top level with no `export const metadata`. Next.js App Router cannot export metadata from client components. The result: the AAL contact page has no `<title>`, no `<meta description>`, no OG tags, and no canonical URL — making it invisible to search engines and unfavorable for sharing.

**Fix:** Split into a server component wrapper (for metadata) and a client component for the form. The `metadata` export and static content should live in a server component.

---

### HIGH-7 — RVA Homepage Adventure Links Point to CMS Routes, Not Detail Pages
**File:** `app/rva/page.tsx:272`
**Sites:** RVA

Homepage adventure cards use:
```tsx
<Link href={`/rva/${adventure.slug}`}>Learn More</Link>
```

This routes to the CMS catch-all `[...slug]/page.tsx` (e.g., `/rva/fly-fishing`), not the static adventure detail pages at `/rva/adventures/fly-fishing`. If CMS pages aren't seeded for these slugs, users get a 404. The adventures listing page routes correctly to `/rva/adventures/{slug}`. There are now two different routes for the same content, split across homepage vs adventures page.

**Fix:** Change homepage adventure links to `/rva/adventures/${adventure.slug}`.

---

### HIGH-8 — Sitemap Missing Most RVA Static Pages
**File:** `app/sitemap.ts:14-28`
**Sites:** RVA

The static sitemap entries for RVA only include the homepage and blog. These pages are excluded and will not be indexed unless CMS pages exist in Supabase:
- `/rva/about`
- `/rva/contact`
- `/rva/adventures`
- `/rva/gallery`
- `/rva/fleet`
- `/rva/service-areas`
- `/rva/services`
- `/rva/destinations`
- `/rva/winter`
- `/rva/elevated-camping`
- All 6 adventure detail pages (`/rva/adventures/fly-fishing`, etc.)

**Fix:** Add all static RVA and AAL pages to the `staticEntries` array in `sitemap.ts`.

---

### HIGH-9 — No ESLint Configuration in Project
**Sites:** Shared

`npm run lint` fails with an interactive prompt since there is no `.eslintrc` or `eslint.config.*` file. There is no automated lint enforcement, allowing code quality issues to accumulate silently.

**Fix:** Add `.eslintrc.json`:
```json
{ "extends": "next/core-web-vitals" }
```

---

### HIGH-10 — TypeScript Error: `@google-analytics/data` Module Missing
**File:** `app/api/analytics/route.ts:2`
**Sites:** Shared

```
error TS2307: Cannot find module '@google-analytics/data'
```

The package `@google-analytics/data` is imported but not listed in `package.json` dependencies. `npx tsc --noEmit` surfaces 6 TypeScript errors in this file. This will not prevent production builds (Next.js uses Babel) but signals a real dependency gap.

**Fix:** Run `npm install @google-analytics/data` and add it to `package.json`.

---

### HIGH-11 — RVA Blog Post CTA Links to Homepage, Not Adventures
**File:** `app/rva/blog/page.tsx:119` and `app/rva/blog/[slug]/page.tsx:259`
**Sites:** RVA

Both the blog listing CTA and the blog post sidebar CTA use:
```tsx
<Link href="/">View All Adventures</Link>
```

This takes users to the homepage, not `/adventures`. The label says "View All Adventures" but the destination is the homepage.

**Fix:** Change `href="/"` to `href="/adventures"`.

---

### HIGH-12 — RVA Footer "Review Us" Is a Dead Link
**File:** `app/rva/page.tsx:414`
**Sites:** RVA

```tsx
<li><a href="#" className="...">Review Us</a></li>
```

The "Review Us" footer link points to `#` (current page) — it has no destination. If there's a review platform (Google, TripAdvisor), the link should go there.

**Fix:** Either link to the Google Business Profile review URL or remove the item.

---

## Medium Issues

### MED-1 — Duplicate `alpenglowFaqs` Data
**Files:** `lib/site-data.ts:224-233`, `app/alpenglow/page.tsx:18-51`
**Sites:** AAL

The FAQ data is defined identically in both `lib/site-data.ts` (as `alpenglowFaqs`) and locally in `app/alpenglow/page.tsx`. The local definition shadows the exported one. Any updates to one must be mirrored manually.

**Fix:** Remove the local definition in `app/alpenglow/page.tsx` and import from `lib/site-data.ts`.

---

### MED-2 — RVANav Scroll Conditional Is Dead Code
**File:** `components/rva/RVANav.tsx:29`
**Sites:** RVA

```tsx
className={`... ${scrolled ? 'bg-rva-forest/95 backdrop-blur-md shadow-lg' : 'bg-rva-forest/95 backdrop-blur-md shadow-lg'}`}
```

Both branches of the ternary are identical — the nav always appears opaque. The `scrolled` state and its event listener are running for no effect.

**Fix:** Remove the ternary and use the static class directly. If a transparent-on-scroll effect is desired (as in `app/rva/page.tsx`'s inline nav), implement it here too.

---

### MED-3 — Open Graph Image on Elevated Camping Page Uses Relative URL
**File:** `app/rva/elevated-camping/page.tsx:20`
**Sites:** RVA

```tsx
images: [{ url: '/images/adventures/elevated-camping.jpeg', ... }]
```

OG image URLs must be absolute for social media sharing to work (Facebook, Twitter/X, Slack). A relative path will result in broken preview images.

**Fix:** Change to `https://www.richvalleyadventures.com/images/adventures/elevated-camping.jpeg`.

---

### MED-4 — Several Pages Missing Canonical URLs and Open Graph Metadata

| Page | Missing |
|------|---------|
| `app/rva/fleet/page.tsx` | canonical, og:image |
| `app/rva/service-areas/page.tsx` | canonical, og:image |
| `app/rva/services/page.tsx` | canonical, og:image |
| `app/rva/destinations/page.tsx` | canonical, og:image |
| `app/alpenglow/about/page.tsx` | canonical, og:image |
| `app/alpenglow/services/[slug]/page.tsx` | canonical |
| `app/alpenglow/service-areas/[slug]/page.tsx` | canonical |

Canonical URLs help prevent duplicate content penalties and are important for multi-site deployments where both `/rva/fleet` and the external domain serve the same content.

---

### MED-5 — RVA About and Adventures Pages Use Unsplash OG Images
**Files:** `app/rva/about/page.tsx:22`, `app/rva/adventures/[slug]/page.tsx:207`
**Sites:** RVA

OG images point to `images.unsplash.com` — third-party images outside your control. If those images are removed or Unsplash blocks hotlinking, OG previews will break. For a local business, own brand photography should be used.

---

### MED-6 — RVA Service Areas Page Uses Alpenglow-Specific Locations
**File:** `app/rva/service-areas/page.tsx:11`
**Sites:** RVA

```tsx
const areas = alpenglowData.serviceAreas
```

The RVA service areas page pulls from `alpenglowData.serviceAreas`, which includes Denver, Eagle/Vail, Rifle, and Glenwood Springs — all of which are limo/transfer destinations, not areas where Rich Valley Adventures guides outdoor adventures. This is misleading for RVA visitors.

**Fix:** Create a separate `rvaData.serviceAreas` array with areas relevant to outdoor guiding (Aspen, Snowmass, Basalt, Carbondale).

---

### MED-7 — Phone `href` in RVANav Missing Country Code
**File:** `components/rva/RVANav.tsx:34`
**Sites:** RVA

```tsx
<a href="tel:9704563666" ...>
```

This is missing the `+1` prefix. The correct format is `tel:+19704563666`. Some devices and browsers may fail to dial without the country code prefix.

**Fix:** Change to `href="tel:+19704563666"`.

---

### MED-8 — RVA Fleet Page Metadata Has Wrong Title/Description
**File:** `app/rva/fleet/page.tsx:6-9`
**Sites:** RVA

The page title says `'Fleet | Rich Valley Adventures'` but the page is entirely about the **sister company's** fleet (Aspen Alpenglow Limousine). Search engines would attribute this fleet content to RVA, not AAL. The description also reads oddly: "Our sister company Aspen Alpenglow Limousine provides luxury transportation..."

**Fix:** Update the title to something like `'Luxury Fleet | Aspen Alpenglow Limousine — Transportation via Rich Valley Adventures'` and ensure the metadata reflects the correct brand.

---

### MED-9 — AAL Breadcrumb "Home" Links on Sub-Pages Are Ambiguous
**Files:** Multiple AAL pages (about, services, contact, etc.)
**Sites:** AAL

All AAL sub-pages have breadcrumbs like:
```tsx
<Link href="/">Home</Link>
```

On the `aspenalpenglowlimousine.com` domain, the middleware rewrites `/` to `/alpenglow/`, then the root `page.tsx` redirects to `/rva`. This creates a redirect chain: `/ → /rva`. AAL visitors clicking "Home" in the breadcrumb momentarily see an RVA redirect.

**Fix:** Change AAL breadcrumb home links to `/alpenglow` (or just `/` with trust in the middleware if the redirect is fast enough).

---

### MED-10 — `app/rva/about/page.tsx` Breadcrumb Home Link Incorrect
**File:** `app/rva/about/page.tsx:37`
**Sites:** RVA

```tsx
<Link href="/">Home</Link>
```

This routes to `/` which redirects to `/rva` — an extra redirect hop. For RVA sub-pages, the home link should be `/rva`.

---

## Low Issues

### LOW-1 — All Images Use `unoptimized` Flag, Disabling Next.js Image Optimization
**Sites:** Both

Every `<Image>` component across all pages uses `unoptimized`, which disables WebP/AVIF conversion, responsive resizing, and automatic compression via Next.js. This results in serving full-resolution PNGs/JPEGs to all devices, significantly increasing page weight.

**Note:** This may be intentional since images are served directly from `/public` and the CDN (Cloudflare) may handle compression. But it means no automatic next-gen format conversion.

**Fix:** Remove `unoptimized` from most images. Keep it only for images that must be served as-is (e.g., SVG, animated GIFs). Configure `next.config.js` with appropriate image domains if needed.

---

### LOW-2 — Below-Fold Images Use `loading="eager"`
**Sites:** RVA, AAL

Several components use `loading="eager"` on non-hero images (adventure cards, gallery grid). This forces the browser to load all images immediately, even those far below the fold, increasing initial page load time.

**Fix:** Remove `loading="eager"` from all images that are not in the visible viewport on load. Only the hero image should use `priority` or `loading="eager"`.

---

### LOW-3 — Generic Alt Text on Gallery Images
**File:** `app/rva/page.tsx:345`, `app/rva/gallery/page.tsx:18`
**Sites:** RVA

Gallery images use alt text like `"gallery photo 1"`, `"gallery photo 2"` etc. This is poor for accessibility (screen readers) and misses a significant SEO opportunity — images with descriptive alt text rank in Google Image Search.

**Fix:** When loading gallery from Supabase, the `alt_text` field is used. For the static fallback, replace generic alt text with the actual descriptions from `galleryImages` in `lib/site-data.ts`.

---

### LOW-4 — No Layout Shift Protection for Client-Side Data Fetches
**Files:** `app/rva/page.tsx`, `app/alpenglow/page.tsx`
**Sites:** Both

Both homepages fetch Supabase data client-side after render. The page first renders with static data, then re-renders with Supabase data. Without skeleton loaders or stable dimensions, this causes visible layout shift (CLS), which hurts Core Web Vitals scores.

**Fix:** Use skeleton loading states in adventure cards, testimonials, and gallery sections during the Supabase fetch.

---

### LOW-5 — Root Layout Metadata Is Generic
**File:** `app/layout.tsx:5-8`
**Sites:** Both

```tsx
export const metadata: Metadata = {
  title: 'Rich Valley Adventures & Aspen Alpenglow Limousine',
  description: 'Premium adventure experiences and luxury transportation...',
}
```

This fallback metadata appears in search results if any page fails to set its own title/description. It's not site-specific and would confuse users landing from search if it ever appears.

---

### LOW-6 — AAL Service Area Sidebar Links Use Wrong Path Construction
**File:** `app/alpenglow/service-areas/[slug]/page.tsx:174`
**Sites:** AAL

```tsx
href={`/services/${s.toLowerCase().replace(/\s+/g, '-')}`}
```

On the AAL domain, this generates paths like `/services/airport-transfers`. With middleware rewriting, this would become `/alpenglow/services/airport-transfers`. The correct path should be `/alpenglow/services/airport-transfers` or just `/services/airport-transfers` which the middleware handles. However `corporate-travel` becomes `corporate-travel` while the actual slug in the services details is also `corporate-travel` — this one works. But it should be cleaner.

---

### LOW-7 — `app/rva/page.tsx` Has Inline Nav Duplicating `RVANav` Component
**Files:** `app/rva/page.tsx:87-166`, `components/rva/RVANav.tsx`
**Sites:** RVA

The RVA homepage has a complete inline navigation implementation that duplicates `components/rva/RVANav.tsx`. They have different behavior (homepage nav is transparent-until-scroll, RVANav is always opaque). This means nav changes must be made in two places.

**Fix:** Unify into one component, passing a `transparent` prop or CSS variant to control the initial state.

---

### LOW-8 — AAL Homepage Has Inline Nav Not Using a Reusable Component
**File:** `app/alpenglow/page.tsx`
**Sites:** AAL

Similar to LOW-7: the AAL homepage has an entirely inline nav (400+ lines of JSX) but `components/alpenglow/ALPNav.tsx` (referenced in the project) also likely exists. This duplication applies to mobile menu state, dropdown logic, etc.

---

### LOW-9 — `app/rva/contact/ContactForm.tsx` and `components/shared/BookingPlaceholder.tsx` Are Near-Identical
**Files:** `app/rva/contact/ContactForm.tsx`, `components/shared/BookingPlaceholder.tsx`
**Sites:** RVA

Both components implement a contact/booking form with nearly identical fields (name, email, phone, service, date, details), the same `/api/contact` endpoint, and the same success/error states. `ContactForm.tsx` is used on the `/rva/contact` page; `BookingPlaceholder.tsx` is used on the homepage. They could be unified into one component.

---

## Accessibility Issues

### ACC-1 — BookingPlaceholder Form Labels Not Associated with Inputs
**File:** `components/shared/BookingPlaceholder.tsx:56-84`
**Sites:** Both

The booking form uses `<label>` elements without `htmlFor` attributes. Without `htmlFor`, clicking a label does not focus the associated input, and screen readers may not correctly associate labels with inputs.

**Fix:** Add `htmlFor` to each label matching the `id` on the input, or use `<label>` wrapping the input.

---

### ACC-2 — No Skip to Content Link on AAL Site
**File:** `app/layout.tsx:15`
**Sites:** AAL

The root layout has a skip-to-content link but it targets `#main-content`. The AAL pages have their nav inline without a proper focus management setup for the inline nav. Keyboard users cannot skip past the nav on AAL pages.

---

### ACC-3 — Mobile Menu Doesn't Trap Focus
**Files:** `app/rva/page.tsx:133-165`, `app/alpenglow/page.tsx`
**Sites:** Both

When the mobile menu opens, focus is not trapped inside it. Keyboard and screen reader users can tab through background content while the menu overlay is open.

---

## Performance Issues

### PERF-1 — YouTube `<iframe>` Loads Without Facade
**File:** `app/rva/page.tsx:293-301`
**Sites:** RVA

The YouTube embed loads a full iframe immediately, pulling in ~500KB of scripts and initiating connections to `youtube.com`. Using a facade (click-to-load thumbnail) would eliminate this load until the user explicitly plays the video.

---

### PERF-2 — Supabase Client Initialized on Every Client Render
**Files:** `app/rva/page.tsx:44`, `app/alpenglow/page.tsx`
**Sites:** Both

`createClient()` is called inside a `useEffect` on every mount. While the Supabase client is lightweight, there is no singleton pattern, so it's re-created each time.

---

## Code Quality Issues

### QUAL-1 — No ESLint Config (Repeated from HIGH-9)
No automated code quality enforcement is in place.

### QUAL-2 — `app/rva/adventures/[slug]/page.tsx` Uses Deprecated Synchronous Params
**File:** `app/rva/adventures/[slug]/page.tsx:192,220`
**Sites:** RVA

```tsx
export function generateMetadata({ params }: { params: { slug: string } })
export default function AdventureDetailPage({ params }: { params: { slug: string } })
```

In Next.js 15, `params` in Server Components must be awaited (`Promise<{ slug: string }>`). The blog post pages (`app/rva/blog/[slug]/page.tsx`) use the correct async pattern but the adventure detail pages do not. This will trigger deprecation warnings in Next.js 15+.

**Fix:** Update to `params: Promise<{ slug: string }>` and `await params`.

### QUAL-3 — Inconsistent Breadcrumb Pattern Between RVA and AAL
- RVA uses `<div className="flex items-center gap-2">` pattern
- AAL uses `<nav className="flex text-sm">` with accessible `<nav>` semantics

The AAL approach is better for accessibility (uses semantic `<nav>`) but the pattern should be consistent across both sites.

### QUAL-4 — `app/rva/service-areas/page.tsx` Uses `alpenglowData` Import for RVA Page
This is noted in MED-6 but bears repeating as a code smell: an RVA page file imports and renders AAL-branded service area data with no comment explaining why.

---

## Footer Verification

| Field | RVA | AAL |
|-------|-----|-----|
| Phone number (970-456-3666) | ✅ Correct | ✅ Correct |
| Phone href (tel:+19704563666) | ✅ Correct | ✅ Correct |
| Address (Aspen, Colorado) | ✅ Correct | ✅ Correct |
| Terms link (/terms) | ✅ Present | ❌ Not in AAL footer |
| Privacy link (/privacy) | ✅ Present | ❌ Not in AAL footer |
| Facebook link | ✅ richvalleyadventures | ✅ aspenalpenglow |
| Instagram link | ✅ richvalleyadventures | ✅ aspenalpenglow |
| Sister company link | ✅ aspenalpenglowlimousine.com | ✅ richvalleyadventures.com |
| Review Us link | ❌ Dead link (href="#") | N/A |

**Note:** AAL homepage footer (in the inline page component) does not appear to include Terms/Privacy links.

---

## SEO Summary

| Check | RVA | AAL |
|-------|-----|-----|
| Homepage title | ✅ | ✅ |
| Homepage description | ✅ | ✅ |
| Open Graph tags | ✅ homepage | ⚠️ missing on several pages |
| Twitter card | ✅ homepage | ✅ homepage |
| Canonical URLs | ✅ homepage, about, contact, adventures | ❌ missing on many pages |
| Schema markup (LocalBusiness) | ✅ RVA layout | ✅ AAL layout |
| Schema markup (FAQ) | ✅ homepage | ✅ homepage |
| Schema markup (Article) | ✅ blog posts | ✅ blog posts |
| Google verification | ✅ RVA | ❌ PLACEHOLDER not set |
| Robots.txt | ✅ | ✅ (shared) |
| Sitemap | ⚠️ incomplete (HIGH-8) | ⚠️ incomplete |
| Alt text on images | ⚠️ generic in gallery | ✅ generally good |
| Structured data phone | ❌ wrong number (CRIT-4) | ✅ correct |

---

## Recommended Fix Priority

### Fix Immediately (Before Next Deploy)
1. **CRIT-2** — Fix broken About page image paths
2. **CRIT-3** — Set AAL Google Search Console verification code
3. **CRIT-4** — Fix wrong phone number in JSON-LD schema
4. **HIGH-2** — Fix hiking slug mismatch (Adventure Not Found)
5. **HIGH-3** — Fix AAL homepage service card links
6. **HIGH-4** — Fix AAL nav fallback links
7. **HIGH-5** — Remove/fix RVA nav "Wine Tours" link
8. **MED-7** — Fix phone href missing `+1` in RVANav

### Fix This Week
9. **CRIT-1** — Add winter page images
10. **HIGH-1** — Fix/add missing `fly-fishing-action.jpeg`
11. **HIGH-6** — Add Metadata to AAL contact page
12. **HIGH-7** — Fix homepage adventure links to `/rva/adventures/{slug}`
13. **HIGH-11** — Fix blog CTA links to `/adventures`
14. **HIGH-12** — Fix "Review Us" dead link
15. **HIGH-8** — Expand sitemap to include all static pages
16. **MED-3** — Fix elevated camping OG image to absolute URL

### Fix This Sprint
17. **HIGH-9** — Add `.eslintrc.json` config
18. **HIGH-10** — Install `@google-analytics/data` package
19. **MED-1** — Deduplicate FAQ data
20. **MED-4** — Add canonical URLs to all pages
21. **MED-6** — Create RVA-specific service areas list
22. **QUAL-2** — Update adventure detail page to async params

---

*Generated by Claude Code audit — run `npx tsc --noEmit` and add `.eslintrc.json` + `npm run lint` to your CI pipeline to catch issues automatically.*
