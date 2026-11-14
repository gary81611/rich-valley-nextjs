import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  AAL_PATH_REDIRECTS,
  aalAliasDestination,
  aalSearchWithoutBrandSite,
  canonicalizeAalSitemapEntries,
  canonicalizeAalSitemapUrl,
  canonicalUrlForService,
  canonicalUrlForServiceArea,
  legalCanonicalUrl,
  xRobotsTagForHost,
} from '../lib/aal-canonical.ts'
import { normalizeAalServiceNavHref } from '../lib/alpenglow-nav.ts'
import { hrefForService } from '../lib/alpenglow-services.ts'

const require = createRequire(import.meta.url)

const LIVE_AAL_SITEMAP = [
  'https://aspenalpenglowlimousine.com/about',
  'https://aspenalpenglowlimousine.com/faq',
  'https://aspenalpenglowlimousine.com/night-out',
  'https://aspenalpenglowlimousine.com/ski-resort-transfers',
  'https://aspenalpenglowlimousine.com/wine-tours',
  'https://aspenalpenglowlimousine.com/blog/when-your-aspen-flight-is-diverted',
  'https://aspenalpenglowlimousine.com/blog/wedding-transportation-aspen-guide',
  'https://aspenalpenglowlimousine.com/service-areas/aspen',
  'https://aspenalpenglowlimousine.com/service-areas/snowmass-village',
  'https://aspenalpenglowlimousine.com/service-areas/basalt',
  'https://aspenalpenglowlimousine.com/service-areas/carbondale',
  'https://aspenalpenglowlimousine.com/service-areas/glenwood-springs',
  'https://aspenalpenglowlimousine.com/service-areas/rifle',
  'https://aspenalpenglowlimousine.com/service-areas/eagle-vail',
  'https://aspenalpenglowlimousine.com/service-areas/grand-junction',
  'https://aspenalpenglowlimousine.com/service-areas/denver',
  'https://aspenalpenglowlimousine.com',
  'https://aspenalpenglowlimousine.com/pricing',
  'https://aspenalpenglowlimousine.com/services',
  'https://aspenalpenglowlimousine.com/fleet',
  'https://aspenalpenglowlimousine.com/reservations',
  'https://aspenalpenglowlimousine.com/contact',
  'https://aspenalpenglowlimousine.com/destinations',
  'https://aspenalpenglowlimousine.com/airport-transfers',
  'https://aspenalpenglowlimousine.com/airport-transfers/eagle-ege-to-aspen',
  'https://aspenalpenglowlimousine.com/corporate',
  'https://aspenalpenglowlimousine.com/weddings',
  'https://aspenalpenglowlimousine.com/service-areas',
  'https://aspenalpenglowlimousine.com/blog',
  'https://aspenalpenglowlimousine.com/terms',
  'https://aspenalpenglowlimousine.com/privacy',
  'https://aspenalpenglowlimousine.com/services/hourly-charter',
  'https://aspenalpenglowlimousine.com/services/vehicle-concierge-services',
  'https://aspenalpenglowlimousine.com/events/x-games-aspen-transportation',
  'https://aspenalpenglowlimousine.com/aspen-airport-closure-2027',
]

describe('shared legal canonicals', () => {
  it('uses the AAL apex on AAL hosts and the RVA www origin otherwise', () => {
    for (const host of ['aspenalpenglowlimousine.com', 'www.aspenalpenglowlimousine.com', 'aspenalpenglowlimousine.com:443']) {
      assert.equal(legalCanonicalUrl(host, '/terms'), 'https://aspenalpenglowlimousine.com/terms')
      assert.equal(legalCanonicalUrl(host, '/privacy'), 'https://aspenalpenglowlimousine.com/privacy')
    }
    for (const host of [
      'www.richvalleyadventures.com',
      'richvalleyadventures.com',
      'rich-valley-nextjs.vercel.app',
      'rich-valley-nextjs-git-preview.vercel.app',
      'localhost:3000',
    ]) {
      assert.equal(legalCanonicalUrl(host, '/terms'), 'https://www.richvalleyadventures.com/terms')
      assert.equal(legalCanonicalUrl(host, '/privacy'), 'https://www.richvalleyadventures.com/privacy')
    }
  })

  it('does not hard-code an AAL canonical in the shared page files', () => {
    for (const file of ['app/terms/page.tsx', 'app/privacy/page.tsx']) {
      const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
      assert.match(src, /legalCanonicalUrl\(/)
      assert.match(src, /isAalHost/)
      assert.match(src, /alternates: \{ canonical \}/)
      assert.match(src, /openGraph: \{ url: canonical \}/)
      assert.doesNotMatch(src, /https:\/\/aspenalpenglowlimousine\.com\/(terms|privacy)/)
      assert.doesNotMatch(src, /https:\/\/www\.richvalleyadventures\.com\/(terms|privacy)/)
    }
  })
})

describe('service and service-area canonicals', () => {
  it('builds the service canonical from hrefForService, not the request slug', () => {
    assert.equal(
      canonicalUrlForService({ slug: 'hourly-charter', name: 'Hourly Charter' }),
      'https://aspenalpenglowlimousine.com/services/hourly-charter',
    )
    assert.equal(
      canonicalUrlForService({ slug: 'hourly-charter', name: 'Charter Services' }),
      'https://aspenalpenglowlimousine.com/services/hourly-charter',
    )
    assert.equal(
      canonicalUrlForService({ slug: 'ski-resort-transfers', name: 'Ski Resort Transfers' }),
      'https://aspenalpenglowlimousine.com/ski-resort-transfers',
    )
    assert.equal(
      canonicalUrlForService({ slug: 'airport-transfers', name: 'Airport Transfers' }),
      'https://aspenalpenglowlimousine.com/airport-transfers',
    )
  })

  it('canonicalizes /services/hourly-charter to itself, with og:url on the same value', () => {
    const url = 'https://aspenalpenglowlimousine.com/services/hourly-charter'
    assert.equal(hrefForService({ slug: 'hourly-charter', name: 'Hourly Charter' }), '/services/hourly-charter')
    assert.equal(hrefForService({ slug: 'charter-services', name: 'Hourly Charter' }), '/services/hourly-charter')
    assert.equal(hrefForService({ slug: null, name: 'Charter Services' }), '/services/hourly-charter')
    assert.equal(hrefForService({ slug: '', name: 'Charter Services' }), '/services/hourly-charter')
    assert.equal(canonicalUrlForService({ slug: 'charter-services', name: 'Charter Services' }), url)
    assert.equal(canonicalUrlForService({ slug: 'hourly-charter', name: 'Charter Services' }), url)

    const page = readFileSync(new URL('../app/alpenglow/services/[slug]/page.tsx', import.meta.url), 'utf8')
    assert.match(page, /const canonical = canonicalUrlForService\(service\)/)
    assert.match(page, /alternates:\s*\{\s*canonical\s*\}/)
    assert.match(page, /url:\s*canonical/)
  })

  it('listing, nav, footer, and sitemap use /services/hourly-charter and never the alias', () => {
    const listing = readFileSync(new URL('../app/alpenglow/services/page.tsx', import.meta.url), 'utf8')
    assert.match(listing, /hrefForService\(\{ slug: 'charter-services', name: 'Charter Services' \}\)/)
    assert.equal(hrefForService({ slug: 'charter-services', name: 'Charter Services' }), '/services/hourly-charter')
    assert.doesNotMatch(listing, /\/services\/charter-services/)

    assert.equal(normalizeAalServiceNavHref('/services/charter-services'), '/services/hourly-charter')
    assert.equal(normalizeAalServiceNavHref('/services/charter-services/'), '/services/hourly-charter')
    assert.equal(normalizeAalServiceNavHref('/charter-services'), '/services/hourly-charter')
    assert.equal(normalizeAalServiceNavHref('/services/hourly-charter'), '/services/hourly-charter')
    const nav = readFileSync(new URL('../components/alpenglow/ALPNav.tsx', import.meta.url), 'utf8')
    assert.match(nav, /href: '\/services\/hourly-charter'/)
    assert.match(nav, /normalizeAalServiceNavHref/)
    assert.doesNotMatch(nav, /charter-services/)

    const footer = readFileSync(new URL('../components/alpenglow/ALPFooter.tsx', import.meta.url), 'utf8')
    assert.match(footer, /href="\/services\/hourly-charter"/)
    assert.doesNotMatch(footer, /charter-services/)

    const sitemap = readFileSync(new URL('../app/api/sitemap/route.ts', import.meta.url), 'utf8')
    assert.match(sitemap, /'\/services\/hourly-charter'/)
    assert.doesNotMatch(sitemap, /\/services\/charter-services/)
    const canonical = 'https://aspenalpenglowlimousine.com/services/hourly-charter'
    assert.equal(canonicalizeAalSitemapUrl(canonical), canonical)
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/services/charter-services'),
      canonical,
    )
    assert.equal(aalAliasDestination('/services/charter-services'), '/services/hourly-charter')
  })

  it('page metadata calls the href helpers instead of the request slug', () => {
    const service = readFileSync(new URL('../app/alpenglow/services/[slug]/page.tsx', import.meta.url), 'utf8')
    assert.match(service, /canonicalUrlForService\(service\)/)
    assert.doesNotMatch(service, /\/services\/\$\{slug\}/)
    const area = readFileSync(new URL('../app/alpenglow/service-areas/[slug]/page.tsx', import.meta.url), 'utf8')
    assert.match(area, /canonicalUrlForServiceArea\(area\)/)
    assert.doesNotMatch(area, /\/service-areas\/\$\{slug\}/)
  })

  it('keeps Carbondale self-canonical and remaps known area aliases', () => {
    assert.equal(
      canonicalUrlForServiceArea({ name: 'Carbondale', slug: 'carbondale' }),
      'https://aspenalpenglowlimousine.com/service-areas/carbondale',
    )
    assert.equal(
      canonicalUrlForServiceArea({ name: 'Carbondale', slug: null }),
      'https://aspenalpenglowlimousine.com/service-areas/carbondale',
    )
    assert.equal(
      canonicalUrlForServiceArea({ name: 'Snowmass', slug: 'snowmass' }),
      'https://aspenalpenglowlimousine.com/service-areas/snowmass-village',
    )
    assert.equal(
      canonicalUrlForServiceArea({ name: 'Aspen', slug: 'aspen' }),
      'https://aspenalpenglowlimousine.com/service-areas/aspen',
    )
  })
})

describe('AAL path redirects', () => {
  it('keeps the existing ski, Aspen area, and charter 301 targets', () => {
    assert.equal(AAL_PATH_REDIRECTS['/services/ski-resort-transfers'], '/ski-resort-transfers')
    assert.equal(AAL_PATH_REDIRECTS['/areas/aspen'], '/service-areas/aspen')
    assert.equal(AAL_PATH_REDIRECTS['/services/charter-services'], '/services/hourly-charter')
    assert.equal(aalAliasDestination('/services/ski-resort-transfers/'), '/ski-resort-transfers')
    assert.equal(aalAliasDestination('/areas/aspen'), '/service-areas/aspen')
    assert.equal(aalAliasDestination('/services/charter-services'), '/services/hourly-charter')
    assert.equal(aalAliasDestination('/services/hourly-charter'), null)
    assert.equal(aalAliasDestination('/service-areas/carbondale'), null)
  })

  it('301s /gallery to / and leaves other trailing-slash paths to the generic rule', () => {
    assert.equal(AAL_PATH_REDIRECTS['/gallery'], '/')
    assert.equal(aalAliasDestination('/gallery'), '/')
    assert.equal(aalAliasDestination('/gallery/'), '/')
    assert.equal(aalAliasDestination('/faq/'), null)
  })

  it('still declares those 301s in next.config for AAL hosts only', async () => {
    const nextConfig = require('../next.config.js')
    const redirects = await nextConfig.redirects()
    const want = new Map([
      ['/services/ski-resort-transfers', '/ski-resort-transfers'],
      ['/areas/aspen', '/service-areas/aspen'],
      ['/services/charter-services', '/services/hourly-charter'],
    ])
    for (const [source, destination] of want) {
      const rules = redirects.filter((rule: { source?: string }) => rule.source === source)
      assert.ok(rules.length >= 2, source)
      for (const rule of rules) {
        assert.equal(rule.destination, destination)
        assert.equal(rule.statusCode, 301)
        const host = rule.has?.[0]?.value
        assert.ok(host === 'aspenalpenglowlimousine.com' || host === 'www.aspenalpenglowlimousine.com')
      }
      const rva = rules.filter((rule: { has?: { value?: string }[] }) =>
        /richvalleyadventures/.test(rule.has?.[0]?.value || ''),
      )
      assert.equal(rva.length, 0)
    }
  })
})

describe('AAL ?site= brand param', () => {
  it('drops site=alpenglow and site=rva and keeps every other param', () => {
    assert.equal(aalSearchWithoutBrandSite('?site=alpenglow'), '')
    assert.equal(aalSearchWithoutBrandSite('?site=rva'), '')
    assert.equal(aalSearchWithoutBrandSite('?site=alpenglow&utm=test'), '?utm=test')
    assert.equal(aalSearchWithoutBrandSite('?foo=1&site=rva&bar=2'), '?foo=1&bar=2')
    assert.equal(aalSearchWithoutBrandSite('?site=other'), null)
    assert.equal(aalSearchWithoutBrandSite(''), null)
    assert.equal(aalSearchWithoutBrandSite('?utm=test'), null)
  })

  it('is applied in middleware only for AAL hosts', () => {
    const src = readFileSync(new URL('../middleware.ts', import.meta.url), 'utf8')
    assert.match(src, /if \(aalHost\) \{\s*const strippedSearch = aalSearchWithoutBrandSite\(search\)/)
    assert.match(src, /aalAliasDestination\(pathname\)/)
    assert.match(src, /xRobotsTagForHost\(hostname\)/)
    const stripAt = src.indexOf('const strippedSearch = aalSearchWithoutBrandSite')
    const guard = src.lastIndexOf('if (aalHost)', stripAt)
    assert.ok(guard > -1 && stripAt - guard < 80)
  })
})

describe('non-canonical host robots header', () => {
  it('noindexes vercel, preview, and unknown hosts and leaves production hosts alone', () => {
    assert.equal(xRobotsTagForHost('rich-valley-nextjs.vercel.app'), 'noindex, follow')
    assert.equal(xRobotsTagForHost('rich-valley-nextjs-git-abc-team.vercel.app'), 'noindex, follow')
    assert.equal(xRobotsTagForHost('preview.example.com'), 'noindex, follow')
    assert.equal(xRobotsTagForHost('localhost'), 'noindex, follow')
    assert.equal(xRobotsTagForHost(''), 'noindex, follow')
    assert.equal(xRobotsTagForHost('www.richvalleyadventures.com'), null)
    assert.equal(xRobotsTagForHost('richvalleyadventures.com'), null)
    assert.equal(xRobotsTagForHost('aspenalpenglowlimousine.com'), null)
    assert.equal(xRobotsTagForHost('www.aspenalpenglowlimousine.com'), null)
  })
})

describe('AAL sitemap canonicalization', () => {
  it('leaves the live apex slashless canonicals unchanged', () => {
    for (const url of LIVE_AAL_SITEMAP) {
      assert.equal(canonicalizeAalSitemapUrl(url), url)
    }
    const entries = canonicalizeAalSitemapEntries(LIVE_AAL_SITEMAP.map((url) => ({ url, priority: 1 })))
    assert.deepEqual(entries.map((entry) => entry.url), LIVE_AAL_SITEMAP)
  })

  it('drops gallery and aliases, and rewrites www, slashes, and the /alpenglow prefix', () => {
    assert.equal(canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/gallery'), null)
    assert.equal(canonicalizeAalSitemapUrl('https://www.aspenalpenglowlimousine.com/gallery/'), null)
    assert.equal(canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/alpenglow/gallery'), null)
    assert.equal(
      canonicalizeAalSitemapUrl('https://www.aspenalpenglowlimousine.com/faq/'),
      'https://aspenalpenglowlimousine.com/faq',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/'),
      'https://aspenalpenglowlimousine.com',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/services/charter-services'),
      'https://aspenalpenglowlimousine.com/services/hourly-charter',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/services/ski-resort-transfers/'),
      'https://aspenalpenglowlimousine.com/ski-resort-transfers',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/areas/aspen'),
      'https://aspenalpenglowlimousine.com/service-areas/aspen',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/service-areas/carbondale/'),
      'https://aspenalpenglowlimousine.com/service-areas/carbondale',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/service-areas/snowmass'),
      'https://aspenalpenglowlimousine.com/service-areas/snowmass-village',
    )
    assert.equal(
      canonicalizeAalSitemapUrl('https://aspenalpenglowlimousine.com/alpenglow/faq'),
      'https://aspenalpenglowlimousine.com/faq',
    )
    assert.equal(canonicalizeAalSitemapUrl('https://www.richvalleyadventures.com/gallery'), null)
    assert.equal(canonicalizeAalSitemapUrl('https://www.richvalleyadventures.com/terms'), null)
  })

  it('canonicalizes only the AAL sitemap branch', () => {
    const src = readFileSync(new URL('../app/api/sitemap/route.ts', import.meta.url), 'utf8')
    assert.match(src, /canonicalizeAalSitemapEntries/)
    const rvaBranch = src.slice(src.indexOf(': dedupeByUrl(['), src.indexOf('return sitemapResponse(toXml(merged)'))
    assert.doesNotMatch(rvaBranch, /canonicalizeAalSitemapEntries/)
    assert.match(rvaBranch, /rvaSitemapExtras\(false\)/)
    const fallback = src.slice(src.indexOf('function fallbackSitemap'), src.indexOf('function withRvaSitemapExtras'))
    assert.match(fallback, /if \(!isAAL\) return withRvaSitemapExtras/)
    assert.match(src, /\$\{RVA_ORIGIN\}\/gallery/)
  })
})

describe('metadata sources', () => {
  it('drops the layout homepage og:url and keeps the home page canonical and og:url', () => {
    const layout = readFileSync(new URL('../app/alpenglow/layout.tsx', import.meta.url), 'utf8')
    const og = layout.slice(layout.indexOf('openGraph:'), layout.indexOf('twitter:'))
    assert.doesNotMatch(og, /url:\s*ALP_URL/)
    assert.match(og, /siteName:/)
    const home = readFileSync(new URL('../app/alpenglow/page.tsx', import.meta.url), 'utf8')
    assert.match(home, /canonical:\s*ALP_URL/)
    assert.match(home, /url:\s*ALP_URL/)
  })

  it('sets og:url to the same canonical on faq, services, and service-areas', () => {
    const cases = [
      ['app/alpenglow/faq/page.tsx', 'https://aspenalpenglowlimousine.com/faq'],
      ['app/alpenglow/services/page.tsx', 'https://aspenalpenglowlimousine.com/services'],
      ['app/alpenglow/service-areas/page.tsx', 'https://aspenalpenglowlimousine.com/service-areas'],
    ] as const
    for (const [file, url] of cases) {
      const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
      assert.match(src, new RegExp(`const pageUrl = '${url.replaceAll('/', '\\/')}'`))
      assert.match(src, /canonical: pageUrl/)
      assert.match(src, /url: pageUrl/)
    }
  })

  it('does not declare an AAL /gallery canonical and does not change RVA /gallery', () => {
    const aal = readFileSync(new URL('../app/alpenglow/gallery/page.tsx', import.meta.url), 'utf8')
    assert.doesNotMatch(aal, /aspenalpenglowlimousine\.com\/gallery/)
    assert.doesNotMatch(aal, /alternates/)
    const rva = readFileSync(new URL('../app/rva/gallery/layout.tsx', import.meta.url), 'utf8')
    assert.match(rva, /https:\/\/www\.richvalleyadventures\.com\/gallery/)
  })
})
