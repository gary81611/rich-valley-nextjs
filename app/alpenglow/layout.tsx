import type { Metadata } from 'next'
import ALPNav from '@/components/alpenglow/ALPNav'
import ALPFooter from '@/components/alpenglow/ALPFooter'
import { alpenglowData } from '@/lib/site-data'
import './aal-type.css'

const ALP_URL = 'https://aspenalpenglowlimousine.com'
const ALP_LOGO = `${ALP_URL}/images/logos/alpenglow-logo.png`
const ALP_LOGO_WIDTH = 1312
const ALP_LOGO_HEIGHT = 650

export const metadata: Metadata = {
  metadataBase: new URL(ALP_URL),
  title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
  description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel, wedding transportation. Available 24/7 since 2012.',
  keywords: 'Aspen limo service, Aspen airport transfer, luxury car service Aspen Colorado, private chauffeur Aspen, wedding limo Aspen, Eagle airport to Aspen transportation, Aspen Pitkin County Airport car service, Aspen Snowmass limousine',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
    description: 'Distinguished private car and limousine service throughout Aspen and the Roaring Fork Valley. Airport transfers, weddings, corporate events. Available 24/7 since 2012.',
    type: 'website',
    locale: 'en_US',
    url: ALP_URL,
    siteName: 'Aspen Alpenglow Limousine',
    images: [
      {
        url: ALP_LOGO,
        width: ALP_LOGO_WIDTH,
        height: ALP_LOGO_HEIGHT,
        alt: 'Aspen Alpenglow Limousine logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
    description: 'Distinguished private car and limousine service throughout Aspen and the Roaring Fork Valley. Available 24/7 since 2012.',
    images: [ALP_LOGO],
  },
  verification: {
    google: 'xZU80Fp2QsHL03QMSVl-lqt1m8Mh6ZbY2yl8Gy1iXTc',
  },
  other: {
    'geo.region': 'US-CO',
    'geo.placename': 'Aspen, Colorado',
    'geo.position': '39.1911;-106.8175',
    'ICBM': '39.1911, -106.8175',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${ALP_URL}/#website`,
  url: ALP_URL,
  name: 'Aspen Alpenglow Limousine',
  inLanguage: 'en-US',
  description:
    'Distinguished private car and limousine service in Aspen, Colorado — airport transfers, weddings, corporate travel, ski resort shuttles.',
  publisher: { '@id': `${ALP_URL}/#business` },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'LimousineService'],
  '@id': `${ALP_URL}/#business`,
  name: 'Aspen Alpenglow Limousine',
  description:
    'Distinguished private car and limousine service in Aspen, Colorado. Airport transfers, wedding transportation, corporate travel, and ski resort shuttles. Available 24/7 since 2012.',
  url: ALP_URL,
  telephone: '+19704563666',
  priceRange: '$$$$',
  image: ALP_LOGO,
  logo: {
    '@type': 'ImageObject',
    url: ALP_LOGO,
    width: ALP_LOGO_WIDTH,
    height: ALP_LOGO_HEIGHT,
  },
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Aspen',
    addressRegion: 'CO',
    postalCode: '81611',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.1911,
    longitude: -106.8175,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Aspen', sameAs: 'https://en.wikipedia.org/wiki/Aspen,_Colorado' },
    { '@type': 'City', name: 'Snowmass Village' },
    { '@type': 'City', name: 'Basalt' },
    { '@type': 'City', name: 'Carbondale' },
    { '@type': 'City', name: 'Glenwood Springs' },
    { '@type': 'City', name: 'Gypsum' },
    { '@type': 'City', name: 'Vail' },
    { '@type': 'City', name: 'Denver' },
    {
      '@type': 'Airport',
      name: 'Aspen/Pitkin County Airport',
      iataCode: 'ASE',
    },
    {
      '@type': 'Airport',
      name: 'Eagle County Regional Airport',
      iataCode: 'EGE',
      address: { '@type': 'PostalAddress', addressLocality: 'Gypsum', addressRegion: 'CO', addressCountry: 'US' },
    },
    {
      '@type': 'Airport',
      name: 'Denver International Airport',
      iataCode: 'DEN',
    },
    { '@type': 'Place', name: 'Rifle' },
    { '@type': 'Place', name: 'Grand Junction' },
    { '@type': 'Place', name: 'Buena Vista' },
    { '@type': 'Place', name: 'Montrose' },
    { '@type': 'Place', name: 'Gunnison' },
  ],
  sameAs: [
    'https://www.facebook.com/aspenalpenglow',
    'https://www.instagram.com/aspenalpenglowlimo',
    alpenglowData.googleReviewUrl,
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-970-456-3666',
    contactType: 'Reservations',
    areaServed: 'US',
    availableLanguage: 'English',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '20:00',
    },
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Luxury Transportation Services in Aspen, Colorado',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Airport Transfer — Aspen/Pitkin County Airport & Eagle County Airport',
          description:
            'Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. One-way SUV rates each way: Eagle and Rifle $720, Denver $1,375, Grand Junction $950. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally.',
        },
      },
      {
        '@type': 'Offer',
        name: 'One-way from Denver to Aspen',
        price: '1375',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way from Grand Junction to Aspen',
        price: '950',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way from Rifle to Aspen',
        price: '720',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way SUV from Eagle (Gypsum) to Aspen',
        price: '720',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: '13-passenger Ford Transit from Eagle or Rifle to Aspen',
        price: '1200',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: '13-passenger Ford Transit from Denver to Aspen',
        price: '1600',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way from Aspen to Denver',
        price: '1375',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way from Aspen to Grand Junction',
        price: '950',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'One-way from Aspen to Rifle',
        price: '720',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hourly Private Charter — Aspen, CO',
          description:
            'Flexible hourly charter car service in Aspen and the Roaring Fork Valley. Available for shopping, dining, ski resort transfers, and personalized excursions.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Corporate Travel — Aspen, CO',
          description:
            'Executive transportation for corporate clients in Aspen, Colorado. Corporate charge accounts are billed monthly.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Transportation — Aspen, CO',
          description:
            'Elegant wedding transportation in Aspen and Snowmass, Colorado. Bridal party transfers, venue-to-venue logistics, and guest shuttle service for mountain weddings.',
        },
      },
    ],
  },
}

const vehicleSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Chevrolet Suburban — 7 Passenger Luxury SUV',
    description:
      'Late-model Chevrolet Suburban with WiFi (Starlink), XM Radio, Yakima roof rack, and Myers ski rack. The fleet includes two Suburbans, each seating 7. Child car seats and boosters are free. No shared rides are offered. Used for airport transfers, private charters, and executive travel in Aspen, Colorado.',
    serviceType: 'Luxury Limousine & Private Car Service',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Aspen Alpenglow Limousine',
      telephone: '+19704563666',
      url: ALP_URL,
    },
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
    provider: {
      '@type': 'LocalBusiness',
      name: 'Aspen Alpenglow Limousine',
      telephone: '+19704563666',
      url: ALP_URL,
    },
    areaServed: [
      { '@type': 'City', name: 'Aspen', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Snowmass Village', containedIn: 'Colorado, USA' },
      { '@type': 'City', name: 'Glenwood Springs', containedIn: 'Colorado, USA' },
    ],
    additionalProperty: { '@type': 'PropertyValue', name: 'Passenger Capacity', value: 13 },
  },
]

export default function AlpenglowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aal-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lirp.cdn-website.com" crossOrigin="anonymous" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {vehicleSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ALPNav />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <ALPFooter />
      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex h-14">
          <a href="tel:+19704563666" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-alp-navy border-r border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a href={alpenglowData.onlineReservationsPath} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-alp-navy bg-alp-gold">
            Book online
          </a>
        </div>
      </div>
    </div>
  )
}
