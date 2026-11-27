import aalOrganizationSchema from './aal-organization.json'
import rvaOrganizationSchema from './rva-organization.json'

/** Canonical organization ids. One entity per brand. The old `#business` id is retired. */
export const AAL_URL = 'https://aspenalpenglowlimousine.com'
export const RVA_URL = 'https://www.richvalleyadventures.com'
export const AAL_ORG_ID = `${AAL_URL}/#organization`
export const RVA_ORG_ID = `${RVA_URL}/#organization`

const FORBIDDEN_STREET = '212 Woody Creek Plaza'

function assertOrganization(schema: { '@id': string }, expectedId: string, label: string) {
  if (schema['@id'] !== expectedId) {
    throw new Error(`${label} @id must be ${expectedId}`)
  }
  const serialized = JSON.stringify(schema)
  if (serialized.includes(FORBIDDEN_STREET) || serialized.includes('"streetAddress"')) {
    throw new Error(`${label} must not include a street address`)
  }
}

assertOrganization(aalOrganizationSchema, AAL_ORG_ID, 'AAL')
assertOrganization(rvaOrganizationSchema, RVA_ORG_ID, 'RVA')

export { aalOrganizationSchema, rvaOrganizationSchema }

export const aalWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${AAL_URL}/#website`,
  url: AAL_URL,
  name: 'Aspen Alpenglow Limousine',
  inLanguage: 'en-US',
  description:
    'Distinguished private car and limousine service in Aspen, Colorado — airport transfers, weddings, corporate travel, ski resort shuttles.',
  publisher: { '@id': AAL_ORG_ID },
}

export const rvaWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${RVA_URL}/#website`,
  url: RVA_URL,
  name: 'Rich Valley Adventures',
  inLanguage: 'en-US',
  description:
    'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen, Colorado and the Roaring Fork Valley. Paddleboarding is a rental from $100.',
  publisher: { '@id': RVA_ORG_ID },
}

/** Fleet services on the AAL homepage. Providers point at the one organization. */
const aalVehicleSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Chevrolet Suburban — 7 Passenger Luxury SUV',
    description:
      'Late-model Chevrolet Suburban with WiFi (Starlink), XM Radio, Yakima roof rack, and Myers ski rack. The fleet includes two Suburbans, each seating 7. Child car seats and boosters are free. No shared rides are offered. Used for airport transfers, private charters, and executive travel in Aspen, Colorado.',
    serviceType: 'Luxury Limousine & Private Car Service',
    provider: { '@id': AAL_ORG_ID },
    areaServed: [
      { '@type': 'City', name: 'Aspen', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Snowmass Village', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Glenwood Springs', containedIn: 'Colorado, USA' },
    ],
    additionalProperty: { '@type': 'PropertyValue', name: 'Passenger Capacity', value: 7 },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Ford Transit Passenger Van — 13 Passenger Group Transportation',
    description:
      'Late-model Ford Transit Passenger Van with WiFi (Starlink), XM Radio, and Myers ski rack. Seats up to 13 passengers. Child car seats and boosters are free. No shared rides are offered. Ideal for group airport transfers, wedding parties, and corporate events in Aspen and the Roaring Fork Valley.',
    serviceType: 'Luxury Group Transportation & Van Service',
    provider: { '@id': AAL_ORG_ID },
    areaServed: [
      { '@type': 'City', name: 'Aspen', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Snowmass Village', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Glenwood Springs', containedIn: 'Colorado, USA' },
    ],
    additionalProperty: { '@type': 'PropertyValue', name: 'Passenger Capacity', value: 13 },
  },
]

/** JSON-LD blocks shared by every AAL page, including the homepage. */
export const aalHomeJsonLdBlocks = [aalWebsiteSchema, aalOrganizationSchema, ...aalVehicleSchemas]

/** JSON-LD blocks shared by every RVA page, including the homepage. */
export const rvaHomeJsonLdBlocks = [rvaWebsiteSchema, rvaOrganizationSchema]

/**
 * About page graph. The organization itself is emitted once by the layout.
 * This graph only references that `@id`, so price range and hours cannot diverge.
 */
export const aalAboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${AAL_URL}/about#aboutpage`,
      url: `${AAL_URL}/about`,
      name: 'About Aspen Alpenglow Limousine',
      description:
        'Luxury private transportation in Aspen and the Roaring Fork Valley since 2012 — airport transfers, events, ski shuttles, and corporate travel.',
      isPartOf: { '@id': `${AAL_URL}/#website` },
      mainEntity: { '@id': AAL_ORG_ID },
    },
  ],
}
