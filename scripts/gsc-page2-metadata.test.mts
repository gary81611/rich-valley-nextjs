import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  AAL_ASE_TO_EGE_FAQ,
  AAL_ASPEN_TO_EGE,
  AAL_CORPORATE,
  AAL_DENVER_RATES_NOTE,
  AAL_DENVER_SERVICE_AREA,
  AAL_KAPA_SECTION,
  AAL_PARKING_FAQ,
  AAL_SNOWMASS_KAPA_NOTE,
  AAL_WINE_TOUR_LEAD,
  RVA_ADVENTURES,
  RVA_CARBONDALE,
  RVA_CARBONDALE_NOTE,
  RVA_FLY_FISHING,
  RVA_FLY_FISHING_BLOG,
  RVA_FLY_FISHING_BLOG_SLUG,
  RVA_HIKING,
  RVA_PADDLE,
  RVA_PRIVATE_RANCH,
  RVA_SNOWSHOEING,
  RVA_WILDLIFE_BLOG,
  RVA_WILDLIFE_BLOG_SLUG,
  RVA_WILDLIFE_SANCTUARY_FAQ,
  applyAalPage2Blog,
  applyRvaPage2Blog,
} from '../lib/gsc-page2-copy.ts'

function read(path: string): string {
  return readFileSync(new URL(path, import.meta.url), 'utf8')
}

const titled = [
  AAL_CORPORATE,
  AAL_ASPEN_TO_EGE,
  AAL_DENVER_SERVICE_AREA,
  RVA_FLY_FISHING,
  RVA_FLY_FISHING_BLOG,
  RVA_WILDLIFE_BLOG,
  RVA_ADVENTURES,
  RVA_HIKING,
  RVA_PRIVATE_RANCH,
  RVA_CARBONDALE,
  RVA_PADDLE,
  RVA_SNOWSHOEING,
]

describe('page-2 title and meta length', () => {
  for (const page of titled) {
    it(`${page.title} is at most 60 characters and the meta is at most 155`, () => {
      assert.ok(page.title.length <= 60, `${page.title} is ${page.title.length}`)
      assert.ok(page.h1.length > 0)
      assert.ok(page.description.length <= 155, `${page.description} is ${page.description.length}`)
    })
  }
})

describe('AAL page-2 copy', () => {
  it('uses Since 2012 on corporate only because layout JSON-LD already has foundingDate 2012', () => {
    const layout = read('../app/alpenglow/layout.tsx')
    const schema = read('../lib/schema/aal-organization.json')
    assert.match(layout, /aalHomeJsonLdBlocks/)
    assert.match(layout, /application\/ld\+json/)
    assert.match(schema, /"foundingDate": "2012"/)
    assert.equal(
      AAL_CORPORATE.description,
      'Executive car service in Aspen for airports, meetings, and retreats. Private Suburbans and a 13-passenger Transit van, since 2012. Call 970-315-6111.',
    )
    assert.doesNotMatch(`${AAL_CORPORATE.title} ${AAL_CORPORATE.h1}`, /since 2012/i)
    const otherAal = JSON.stringify([
      AAL_ASPEN_TO_EGE,
      AAL_DENVER_SERVICE_AREA,
      AAL_DENVER_RATES_NOTE,
      AAL_KAPA_SECTION,
      AAL_SNOWMASS_KAPA_NOTE,
      AAL_PARKING_FAQ,
      AAL_WINE_TOUR_LEAD,
      AAL_ASE_TO_EGE_FAQ,
    ])
    assert.doesNotMatch(otherAal, /since 2012/i)
    const corporate = read('../app/alpenglow/corporate/page.tsx')
    assert.match(corporate, /description: AAL_CORPORATE\.description/)
    assert.match(corporate, /canonical: pageUrl/)
    assert.match(corporate, /url: pageUrl/)
  })

  it('keeps the published EGE and DEN rates and the ASE to EGE explanation', () => {
    assert.match(AAL_ASPEN_TO_EGE.title, /\$720/)
    assert.match(AAL_ASPEN_TO_EGE.description, /\$720/)
    assert.match(AAL_ASPEN_TO_EGE.description, /\$1,200/)
    assert.match(AAL_DENVER_SERVICE_AREA.title, /\$1,375/)
    assert.match(AAL_DENVER_SERVICE_AREA.description, /\$1,600/)
    assert.equal(
      AAL_ASE_TO_EGE_FAQ.answer,
      'ASE is Aspen/Pitkin County Airport. EGE is Eagle County Airport in Gypsum.',
    )
    const outbound = read('../app/alpenglow/airport-transfers/aspen-to-eagle-ege/page.tsx')
    const inbound = read('../app/alpenglow/airport-transfers/eagle-ege-to-aspen/page.tsx')
    assert.match(outbound, /AAL_ASE_TO_EGE_FAQ/)
    assert.match(inbound, /AAL_ASE_TO_EGE_FAQ/)
    assert.match(outbound, /canonical: `https:\/\/aspenalpenglowlimousine\.com\$\{path\}`/)
    assert.match(inbound, /title = 'Eagle Airport \(EGE\) to Aspen Private Car'/)
  })

  it('publishes only the Suburban rate for Centennial and does not invent a Transit price', () => {
    assert.deepEqual(AAL_KAPA_SECTION.content.match(/\$[\d,]+/g), ['$1,475'])
    assert.match(AAL_KAPA_SECTION.content, /not published/)
    assert.match(AAL_KAPA_SECTION.content, /not a Snowmass-only fare/)
    assert.doesNotMatch(AAL_SNOWMASS_KAPA_NOTE, /\$[\d,]+/)
    const hub = read('../app/alpenglow/[...slug]/page.tsx')
    assert.match(hub, /ASE to EGE: Aspen to Eagle Airport/)
    assert.match(hub, /AAL_KAPA_SECTION/)
    assert.doesNotMatch(hub, /meta_description: `\$\{AAL_KAPA/)
  })

  it('adds the parking FAQ and wine-tour link without retitling those posts', () => {
    const parking = applyAalPage2Blog({
      slug: 'aspen-airport-transportation-guide',
      title: 'Aspen Airport Transportation Guide',
      meta_title: 'Aspen Airport Transportation Guide',
      meta_description: 'Existing meta',
      content: 'The parking situation is tight.',
      faqs: [],
      internal_links: [],
    })
    assert.equal(parking.title, 'Aspen Airport Transportation Guide')
    assert.equal(parking.meta_title, 'Aspen Airport Transportation Guide')
    assert.equal(parking.faqs?.[0]?.question, AAL_PARKING_FAQ.question)
    assert.match(parking.faqs?.[0]?.answer || '', /not a parking operator/)

    const wine = applyAalPage2Blog({
      slug: 'aspen-wine-tours-guide-to-local-tastings',
      title: 'Wine guide',
      meta_title: 'Wine guide',
      meta_description: 'Existing meta',
      content: 'Local tastings.',
      faqs: [],
      internal_links: [],
    })
    assert.equal(wine.title, 'Wine guide')
    assert.match(wine.content || '', /\/wine-tours/)
  })
})

describe('RVA page-2 copy', () => {
  it('keeps published trip prices and the paddleboard rental claim', () => {
    assert.match(RVA_FLY_FISHING.description, /\$1,400 for 2/)
    assert.match(RVA_PRIVATE_RANCH.description, /\$800 per adult/)
    assert.match(RVA_PADDLE.title, /From \$100/)
    assert.match(RVA_PADDLE.description, /rental from \$100, not a guided trip/)
    assert.match(RVA_ADVENTURES.description, /rental from \$100, not a guided trip/)
    assert.match(RVA_SNOWSHOEING.title, /Guided Snowshoeing/)
  })

  it('does not put sanctuary in the wildlife title or H1', () => {
    assert.doesNotMatch(`${RVA_WILDLIFE_BLOG.title} ${RVA_WILDLIFE_BLOG.h1}`, /sanctuary/i)
    assert.match(RVA_WILDLIFE_SANCTUARY_FAQ.answer, /not a wildlife sanctuary/)
  })

  it('keeps Carbondale on fishing, not transportation', () => {
    const blob = `${RVA_CARBONDALE.title} ${RVA_CARBONDALE.h1} ${RVA_CARBONDALE.description} ${RVA_CARBONDALE_NOTE}`
    assert.doesNotMatch(blob, /suv|limousine|car service|shuttle|private ride/i)
    assert.match(blob, /private-water|Private-water|Private water/i)
  })

  it('recasts the fly-fishing blog as a guide with booking links', () => {
    const post = applyRvaPage2Blog({
      slug: RVA_FLY_FISHING_BLOG_SLUG,
      title: 'The Ultimate Guide to Fly Fishing in Aspen and the Roaring Fork Valley',
      meta_title: 'The Ultimate Guide to Fly Fishing in Aspen and the Roaring Fork Valley',
      meta_description: 'Old meta',
      content: 'The Roaring Fork is home water.',
      faqs: [],
      internal_links: [],
    })
    assert.equal(post.meta_title, RVA_FLY_FISHING_BLOG.title)
    assert.equal(post.title, RVA_FLY_FISHING_BLOG.h1)
    assert.match(post.content || '', /\/fly-fishing/)
    assert.match(post.content || '', /\/private-ranch-fishing/)
  })

  it('overrides the wildlife post and leaves other posts alone', () => {
    const wildlife = applyRvaPage2Blog({
      slug: RVA_WILDLIFE_BLOG_SLUG,
      title: 'Aspen Wildlife Tours & Nature Experiences | Rich Valley',
      meta_title: 'Aspen Wildlife Tours & Nature Experiences | Rich Valley',
      meta_description: 'Old meta',
      content: 'Elk and deer.',
      faqs: [],
      internal_links: [],
    })
    assert.equal(wildlife.meta_title, RVA_WILDLIFE_BLOG.title)
    assert.equal(wildlife.title, RVA_WILDLIFE_BLOG.h1)
    assert.equal(wildlife.faqs?.[0]?.question, RVA_WILDLIFE_SANCTUARY_FAQ.question)
    assert.ok(wildlife.internal_links?.some((link) => link.url === '/adventures/scenic-wildlife-tours'))

    const other = applyRvaPage2Blog({
      slug: 'some-other-post',
      title: 'Leave this title',
      meta_title: 'Leave this title',
      meta_description: 'Leave this meta',
      content: 'Body',
      faqs: [],
      internal_links: [],
    })
    assert.equal(other.title, 'Leave this title')
  })

  it('keeps canonicals on the commercial pages', () => {
    const fly = read('../app/rva/fly-fishing/page.tsx')
    const adventures = read('../app/rva/adventures/layout.tsx')
    const ranch = read('../app/rva/private-ranch-fishing/page.tsx')
    assert.match(fly, /canonical: pageUrl/)
    assert.match(fly, /https:\/\/www\.richvalleyadventures\.com\/fly-fishing/)
    assert.match(adventures, /canonical/)
    assert.match(adventures, /https:\/\/www\.richvalleyadventures\.com\/adventures/)
    assert.match(ranch, /canonical: pageUrl/)
    assert.match(ranch, /https:\/\/www\.richvalleyadventures\.com\/private-ranch-fishing/)
    const home = read('../app/rva/RVAHomeClient.tsx')
    const blogIndex = read('../app/rva/blog/page.tsx')
    assert.match(home, /href="\/adventures"/)
    assert.match(blogIndex, /Aspen outdoor adventures/)
    assert.match(blogIndex, /href="\/adventures"/)
  })
})
