# GSC Team Checklist (RVA + AAL)

Use this checklist after production deploy. Follow in order.

## 0) Preconditions

- Confirm latest commit is deployed on production.
- Wait 3-5 minutes after deploy before inspecting URLs.

## 1) Redirect Validation (RVA)

Run these and confirm `301` plus expected `Location`:

- `curl -I https://www.richvalleyadventures.com/outdoor-adventures`
  - Expect -> `https://www.richvalleyadventures.com/adventures`
- `curl -I https://www.richvalleyadventures.com/service-areas/aspen-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas/aspen`
- `curl -I https://www.richvalleyadventures.com/service-areas/basalt-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas/basalt`
- `curl -I https://www.richvalleyadventures.com/service-areas/carbondale-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas/carbondale`
- `curl -I https://www.richvalleyadventures.com/service-areas/snowmass-village-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas/snowmass-village`
- `curl -I https://www.richvalleyadventures.com/service-areas/rifle-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas`
- `curl -I https://www.richvalleyadventures.com/service-areas/denver-co`
  - Expect -> `https://www.richvalleyadventures.com/service-areas`
- `curl -I https://www.richvalleyadventures.com/blog/best-fly-fishing-guide-aspen-rich-valley-adventures`
  - Expect -> `https://www.richvalleyadventures.com/blog/fly-fishing-aspen-roaring-fork-valley`

If any response is not `301` or destination differs, stop and report before GSC actions.

## 2) Canonical Tag Validation (RVA)

Check canonical tags in live HTML:

- `https://www.richvalleyadventures.com/about` -> canonical ends with `/about`
- `https://www.richvalleyadventures.com/adventures` -> canonical ends with `/adventures`
- `https://www.richvalleyadventures.com/services` -> canonical ends with `/services`
- `https://www.richvalleyadventures.com/service-areas/aspen` -> canonical ends with `/service-areas/aspen`
- `https://www.richvalleyadventures.com/blog/fly-fishing-aspen-roaring-fork-valley` -> canonical ends with full pillar slug

If any canonical points to unrelated URL (for example `/service-areas/aspen` from non-Aspen page), stop and escalate.

## 3) Rich Results Validation (RVA blog pillar)

Test:

- [Rich Results Test](https://search.google.com/test/rich-results?url=https://www.richvalleyadventures.com/blog/fly-fishing-aspen-roaring-fork-valley)

Confirm:

- FAQPage detected
- No invalid FAQ items

## 4) GSC URL Inspection Requests

### RVA property

Request indexing for:

- `https://www.richvalleyadventures.com/adventures`
- `https://www.richvalleyadventures.com/service-areas/aspen`
- `https://www.richvalleyadventures.com/service-areas/basalt`
- `https://www.richvalleyadventures.com/service-areas/carbondale`
- `https://www.richvalleyadventures.com/service-areas/snowmass-village`
- `https://www.richvalleyadventures.com/blog/fly-fishing-aspen-roaring-fork-valley`

### AAL property

Request indexing for:

- `https://www.aspenalpenglowlimousine.com/weddings`
- `https://www.aspenalpenglowlimousine.com/corporate`

## 5) Sitemap Resubmit

In each property:

- Go to `Indexing -> Sitemaps`
- Select `sitemap.xml`
- Click `Resubmit`

## 6) 7-Day Follow-Up

Track these in GSC:

- RVA: decrease in "Page with redirect" for legacy `-co` and old blog slug URLs
- RVA: improvement in impressions/CTR for `/adventures`, `/services`, `/service-areas/aspen`, and pillar blog post
- AAL: `/weddings` and `/corporate` move from unknown to crawled/indexed

If no crawl movement after 7-10 days, export URL Inspection details and escalate with exact URLs and statuses.

