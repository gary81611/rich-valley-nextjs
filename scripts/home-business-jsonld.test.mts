import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import http from 'node:http'
import { describe, it } from 'node:test'

const FORBIDDEN_STREET = '212 Woody Creek Plaza'
const AAL_ORG_ID = 'https://aspenalpenglowlimousine.com/#organization'
const RVA_ORG_ID = 'https://www.richvalleyadventures.com/#organization'
const AAL_WEBSITE_ID = 'https://aspenalpenglowlimousine.com/#website'
const RVA_WEBSITE_ID = 'https://www.richvalleyadventures.com/#website'

type Json = null | string | number | boolean | Json[] | { [key: string]: Json }

function load(path: string): Json {
  return JSON.parse(readFileSync(path, 'utf8')) as Json
}

function walk(value: Json, visit: (node: { [key: string]: Json }) => void) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit)
    return
  }
  if (value && typeof value === 'object') {
    visit(value)
    for (const child of Object.values(value)) walk(child, visit)
  }
}

/** A node with `@id` plus any other field is an entity definition. `{ "@id" }` alone is a reference. */
function entityDefinitions(blocks: Json[]): Map<string, number> {
  const defs = new Map<string, number>()
  for (const block of blocks) {
    walk(block, (node) => {
      const id = node['@id']
      if (typeof id !== 'string') return
      const extra = Object.keys(node).filter((key) => key !== '@id')
      if (extra.length === 0) return
      defs.set(id, (defs.get(id) ?? 0) + 1)
    })
  }
  return defs
}

function assertOneDefinitionPerId(blocks: Json[], label: string) {
  const defs = entityDefinitions(blocks)
  for (const [id, count] of defs) {
    assert.equal(count, 1, `${label} defines ${id} ${count} times`)
  }
  return defs
}

function assertNoStreet(value: Json, label: string) {
  const serialized = JSON.stringify(value)
  assert.equal(serialized.includes(FORBIDDEN_STREET), false, `${label} includes the hidden street address`)
  walk(value, (node) => {
    assert.equal('streetAddress' in node, false, `${label} includes streetAddress`)
  })
}

function phoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

const aal = load(new URL('../lib/schema/aal-organization.json', import.meta.url))
const rva = load(new URL('../lib/schema/rva-organization.json', import.meta.url))

const aalHome: Json[] = [
  {
    '@type': 'WebSite',
    '@id': AAL_WEBSITE_ID,
    publisher: { '@id': AAL_ORG_ID },
  },
  aal,
  { '@type': 'Service', name: 'Chevrolet Suburban — 7 Passenger Luxury SUV', provider: { '@id': AAL_ORG_ID } },
  { '@type': 'Service', name: 'Ford Transit Passenger Van — 13 Passenger Group Transportation', provider: { '@id': AAL_ORG_ID } },
]

const aalAbout: Json = {
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://aspenalpenglowlimousine.com/about#aboutpage',
      isPartOf: { '@id': AAL_WEBSITE_ID },
      mainEntity: { '@id': AAL_ORG_ID },
    },
  ],
}

const rvaHome: Json[] = [
  {
    '@type': 'WebSite',
    '@id': RVA_WEBSITE_ID,
    publisher: { '@id': RVA_ORG_ID },
  },
  rva,
]

describe('AAL organization JSON-LD', () => {
  it('parses as one LimousineService entity at #organization', () => {
    assert.equal(Array.isArray(aal), false)
    const org = aal as { [key: string]: Json }
    assert.deepEqual(org['@type'], ['LimousineService', 'LocalBusiness'])
    assert.equal(org['@id'], AAL_ORG_ID)
    assert.equal(org['priceRange'], '$$$$')
    assert.equal(org['openingHours'], 'Mo-Su 00:00-23:59')
    assert.equal(phoneDigits(String(org['telephone'])), '19703156111')
    const contact = org['contactPoint'] as { [key: string]: Json }
    assert.equal(phoneDigits(String(contact['telephone'])), '19703156111')
    assert.equal(phoneDigits(JSON.stringify(org)).includes('9704563666'), false)
    const address = org['address'] as { [key: string]: Json }
    assert.deepEqual(Object.keys(address).sort(), ['@type', 'addressCountry', 'addressLocality', 'addressRegion', 'postalCode'])
    assertNoStreet(aal, 'AAL')
  })

  it('drops towns that have no service-area page', () => {
    const names: string[] = []
    const org = aal as { [key: string]: Json }
    for (const area of org['areaServed'] as { [key: string]: Json }[]) {
      names.push(String(area['name']))
    }
    for (const dropped of ['Buena Vista', 'Montrose', 'Gunnison']) {
      assert.equal(names.includes(dropped), false, dropped)
    }
    for (const kept of ['Aspen', 'Snowmass Village', 'Basalt', 'Carbondale', 'Glenwood Springs', 'Rifle', 'Eagle', 'Vail', 'Gypsum', 'Grand Junction', 'Denver']) {
      assert.equal(names.includes(kept), true, kept)
    }
  })

  it('defines #organization once on the homepage and about page', () => {
    const home = assertOneDefinitionPerId(aalHome, 'AAL home')
    assert.equal(home.get(AAL_ORG_ID), 1)
    assert.equal(home.get(AAL_WEBSITE_ID), 1)
    const about = assertOneDefinitionPerId([...aalHome, aalAbout], 'AAL about')
    assert.equal(about.get(AAL_ORG_ID), 1)
    assert.equal(about.get('https://aspenalpenglowlimousine.com/about#aboutpage'), 1)
    assert.equal(JSON.stringify(aalAbout).includes('priceRange'), false)
    assert.equal(JSON.stringify(aalAbout).includes('#business'), false)
  })
})

describe('RVA organization JSON-LD', () => {
  it('uses TravelAgency with 7am–8pm hours and no visitor-center type', () => {
    const org = rva as { [key: string]: Json }
    assert.deepEqual(org['@type'], ['TravelAgency', 'LocalBusiness'])
    assert.equal(org['additionalType'], 'https://schema.org/SportsActivityLocation')
    assert.equal(org['@id'], RVA_ORG_ID)
    assert.equal(org['openingHours'], 'Mo-Su 07:00-20:00')
    assert.equal(JSON.stringify(org).includes('TouristInformationCenter'), false)
    assert.equal(JSON.stringify(org).includes('00:00'), false)
    assert.equal(JSON.stringify(org).includes('23:59'), false)
    const hours = org['openingHoursSpecification'] as { [key: string]: Json }[]
    assert.equal(hours.length, 1)
    assert.equal(hours[0]['opens'], '07:00')
    assert.equal(hours[0]['closes'], '20:00')
    const contact = org['contactPoint'] as { [key: string]: Json }
    const available = contact['hoursAvailable'] as { [key: string]: Json }
    assert.equal(available['opens'], '07:00')
    assert.equal(available['closes'], '20:00')
    assert.equal(phoneDigits(String(org['telephone'])), '19704563666')
    assert.equal(org['email'], 'kit@richvalleyadventures.com')
    const address = org['address'] as { [key: string]: Json }
    assert.equal('streetAddress' in address, false)
    assertNoStreet(rva, 'RVA')
  })

  it('defines #organization once on the homepage', () => {
    const defs = assertOneDefinitionPerId(rvaHome, 'RVA home')
    assert.equal(defs.get(RVA_ORG_ID), 1)
    assert.equal(defs.get(RVA_WEBSITE_ID), 1)
  })
})

describe('homepage wiring', () => {
  it('layouts and the about page share the organization id without a second business entity', () => {
    const aalLayout = readFileSync(new URL('../app/alpenglow/layout.tsx', import.meta.url), 'utf8')
    const rvaLayout = readFileSync(new URL('../app/rva/layout.tsx', import.meta.url), 'utf8')
    const about = readFileSync(new URL('../app/alpenglow/about/page.tsx', import.meta.url), 'utf8')
    const moduleSource = readFileSync(new URL('../lib/schema/home-jsonld.ts', import.meta.url), 'utf8')
    assert.match(aalLayout, /aalHomeJsonLdBlocks/)
    assert.match(rvaLayout, /rvaHomeJsonLdBlocks/)
    assert.equal(aalLayout.includes('#business'), false)
    assert.equal(rvaLayout.includes('#business'), false)
    assert.equal(rvaLayout.includes('TouristInformationCenter'), false)
    assert.equal(about.includes('LocalBusiness'), false)
    assert.equal(about.includes('#business'), false)
    assert.equal(about.includes("priceRange: '$$$'"), false)
    assert.match(about, /aalAboutJsonLd/)
    assert.match(moduleSource, /publisher: \{ '@id': AAL_ORG_ID \}/)
    assert.match(moduleSource, /publisher: \{ '@id': RVA_ORG_ID \}/)
    assert.match(moduleSource, /provider: \{ '@id': AAL_ORG_ID \}/)
    assert.match(moduleSource, /mainEntity: \{ '@id': AAL_ORG_ID \}/)
  })
})

function scriptsFromHtml(html: string): Json[] {
  const blocks: Json[] = []
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
  for (const match of html.matchAll(re)) {
    blocks.push(JSON.parse(match[1]) as Json)
  }
  return blocks
}

describe('rendered JSON-LD', () => {
  const origin = process.env.JSONLD_ORIGIN
  const run = origin ? it : it.skip

  run('AAL and RVA homepages and the AAL about page each define an organization id once', async () => {
    function fetchHtml(host: string, path: string): Promise<string> {
      const url = new URL(origin)
      return new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port,
            path,
            method: 'GET',
            headers: { host },
          },
          (res) => {
            const chunks: Buffer[] = []
            res.on('data', (chunk: Buffer) => chunks.push(chunk))
            res.on('end', () => {
              assert.equal(res.statusCode, 200, `${host} ${path} -> ${res.statusCode} ${res.headers.location ?? ''}`)
              resolve(Buffer.concat(chunks).toString('utf8'))
            })
          },
        )
        req.on('error', reject)
        req.end()
      })
    }

    // `next start` on localhost rewrites a spoofed public Host back through /rva.
    // These are the internal routes the production hosts rewrite to.
    const localHost = new URL(origin).host
    const aalHomeHtml = await fetchHtml(localHost, '/alpenglow?site=alpenglow')
    const aalAboutHtml = await fetchHtml(localHost, '/alpenglow/about?site=alpenglow')
    const rvaHomeHtml = await fetchHtml(localHost, '/rva')

    for (const [label, html, orgId] of [
      ['AAL home', aalHomeHtml, AAL_ORG_ID],
      ['AAL about', aalAboutHtml, AAL_ORG_ID],
      ['RVA home', rvaHomeHtml, RVA_ORG_ID],
    ] as const) {
      const blocks = scriptsFromHtml(html)
      assert.ok(blocks.length > 0, `${label} has JSON-LD`)
      for (const block of blocks) assertNoStreet(block, label)
      const defs = assertOneDefinitionPerId(blocks, label)
      assert.equal(defs.get(orgId), 1, label)
      assert.equal(html.includes('#business'), false, label)
      assert.equal(html.includes(FORBIDDEN_STREET), false, label)
    }

    const rvaBlocks = JSON.stringify(scriptsFromHtml(rvaHomeHtml))
    const aalBlocks = JSON.stringify(scriptsFromHtml(aalHomeHtml))
    assert.equal(aalBlocks.includes('TouristInformationCenter'), false)
    assert.equal(rvaBlocks.includes('TouristInformationCenter'), false)
    assert.match(rvaBlocks, /TravelAgency/)
    assert.match(rvaBlocks, /07:00/)
    assert.equal(rvaBlocks.includes('00:00'), false)
    assert.equal(rvaBlocks.includes('23:59'), false)
    assert.match(aalBlocks, /LimousineService/)
    assert.match(aalBlocks, /\+1-970-315-6111/)
    assert.equal(JSON.stringify(scriptsFromHtml(aalAboutHtml)).includes('"priceRange":"$$$"'), false)
    const aboutDefs = entityDefinitions(scriptsFromHtml(aalAboutHtml))
    const businessDefs = [...aboutDefs.keys()].filter((id) => id.endsWith('#organization') || id.endsWith('#business'))
    assert.deepEqual(businessDefs, [AAL_ORG_ID])
  })
})
