import type { Metadata } from 'next'
import ALPNav from '@/components/alpenglow/ALPNav'
import ALPFooter from '@/components/alpenglow/ALPFooter'

const ALP_URL = 'https://aspenalpenglowlimousine.com'
const ALP_OG_IMAGE = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80'

export const metadata: Metadata = {
  title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
  description: 'Premium private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Airport transfers, hourly charter, corporate travel, wedding transportation. Available 24/7 since 2012.',
  keywords: 'Aspen limo service, Aspen airport transfer, luxury car service Aspen Colorado, private chauffeur Aspen, wedding limo Aspen, Eagle airport to Aspen transportation, Aspen Pitkin County Airport car service, Aspen Snowmass limousine',
  alternates: {
    canonical: ALP_URL,
  },
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
        url: ALP_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Luxury private SUV and limousine service in Aspen, Colorado — Aspen Alpenglow Limousine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
    description: 'Distinguished private car and limousine service throughout Aspen and the Roaring Fork Valley. Available 24/7 since 2012.',
    images: [ALP_OG_IMAGE],
  },
  verification: {
    google: 'REPLACE_WITH_AAL_GSC_VERIFICATION_CODE',
  },
  other: {
    'geo.region': 'US-CO',
    'geo.placename': 'Aspen, Colorado',
    'geo.position': '39.1911;-106.8175',
    'ICBM': '39.1911, -106.8175',
  },
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
  image: ALP_OG_IMAGE,
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '',
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
    },
    {
      '@type': 'Airport',
      name: 'Denver International Airport',
      iataCode: 'DEN',
    },
  ],
  sameAs: [
    'https://www.facebook.com/aspenalpenglow',
    'https://www.instagram.com/aspenalpenglow',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
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
            'Private luxury airport transfers to and from Aspen/Pitkin County Airport (ASE) and Eagle County Regional Airport (EGE). Flight tracking, meet-and-greet, and luggage assistance included.',
        },
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
            'Executive transportation for corporate clients in Aspen, Colorado. Roadshow travel, conference transfers, and executive point-to-point service throughout Colorado.',
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
      'Late-model Chevrolet Suburban with WiFi (Starlink), XM Radio, Yakima roof rack, and Myers ski rack. The fleet includes two Suburbans. Used for airport transfers, private charters, and executive travel in Aspen, Colorado.',
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
    name: 'Ford Transit Van — 14 Passenger Group Transportation',
    description:
      'Late-model Ford Transit Van with WiFi (Starlink), XM Radio, and Myers ski rack. Seats up to 14 passengers. Ideal for group airport transfers, wedding parties, and corporate events in Aspen and the Roaring Fork Valley.',
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
    additionalProperty: { '@type': 'PropertyValue', name: 'Passenger Capacity', value: 14 },
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a limo from Aspen to Denver airport cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A private luxury car transfer from Aspen, Colorado to Denver International Airport (DEN) with Aspen Alpenglow Limousine is approximately 3.5 to 4 hours each way. Pricing varies based on vehicle, time of day, and group size. Contact us at 970-456-3666 for a custom quote. We serve the Denver, Eagle (EGE), and Aspen (ASE) airports.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer airport pickup at Aspen/Pitkin County Airport?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Aspen Alpenglow Limousine provides meet-and-greet airport pickup service at Aspen/Pitkin County Airport (ASE). We track your flight in real time and adjust pickup time for early arrivals or delays. Our chauffeurs assist with luggage and ensure a seamless transition to your destination in Aspen or anywhere in the Roaring Fork Valley.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best way to get from Eagle/Vail airport to Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most comfortable way to travel from Eagle County Regional Airport (EGE) to Aspen is by private car service. Eagle airport is approximately 70 miles from Aspen via I-70 and Highway 82 — about 1.5 to 2 hours depending on traffic and road conditions. Aspen Alpenglow Limousine provides direct, door-to-door luxury transfers from Eagle airport to any destination in Aspen or the Roaring Fork Valley.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far in advance should I book a limousine in Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We recommend booking at least 48–72 hours in advance for standard transfers. For wedding transportation, corporate events, or peak ski season (December–March) and summer high season (July–August), booking 2–4 weeks in advance is advisable. Last-minute bookings are occasionally possible — call 970-456-3666 to check availability.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer wedding transportation in Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Aspen Alpenglow Limousine specializes in wedding transportation throughout Aspen and Snowmass, Colorado. We provide bridal party transfers, venue-to-venue logistics, and guest shuttle coordination. Our Chevrolet Suburbans and Ford Transit Van are available for weddings. We work closely with wedding planners and venues to ensure a seamless, elegant experience on your special day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Aspen Alpenglow Limousine available 24 hours a day?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Aspen Alpenglow Limousine operates 24 hours a day, 7 days a week, 365 days a year. This includes early-morning flights out of Aspen airport, late-night arrivals, and overnight transfers to Denver. Call 970-456-3666 at any hour for assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you transport groups to ski resorts from Aspen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Aspen Alpenglow Limousine provides private group transportation to and from Aspen Mountain, Aspen Highlands, Buttermilk, Snowmass ski resort, and other destinations throughout the Roaring Fork Valley. Our Ford Transit Van seats up to 14 passengers and is perfect for ski groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What vehicles does Aspen Alpenglow Limousine use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aspen Alpenglow Limousine operates three late-model vehicles: two Chevrolet Suburbans (up to 7 passengers each) and a Ford Transit Van (up to 14 passengers). All vehicles feature WiFi (Starlink), XM Radio, complimentary water, and ski racks. All vehicles are late-model, meticulously maintained, and professionally chauffeured.',
      },
    },
  ],
}

export default function AlpenglowLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lirp.cdn-website.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ALPNav />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <ALPFooter />
      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex h-14">
          <a href="tel:+19704563666" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-alp-navy-deep border-r border-gray-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call Now
          </a>
          <a href="/alpenglow/contact" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-alp-gold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Check Availability
          </a>
        </div>
      </div>
    </>
  )
}
