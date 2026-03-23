import type { Metadata } from 'next'

const ALP_URL = 'https://aspenalpenglowlimosine.com'
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
        alt: 'Luxury Escalade limousine service in Aspen, Colorado — Aspen Alpenglow Limousine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspen Alpenglow Limousine | Luxury Transportation in Aspen, CO',
    description: 'Distinguished private car and limousine service throughout Aspen and the Roaring Fork Valley. Available 24/7 since 2012.',
    images: [ALP_OG_IMAGE],
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
  '@type': ['LocalBusiness', 'TaxiService'],
  '@id': `${ALP_URL}/#business`,
  name: 'Aspen Alpenglow Limousine',
  description:
    'Aspen Alpenglow Limousine has provided distinguished private car and limousine service in Aspen, Colorado since 2012. They offer airport transfers, hourly charter, corporate travel, wedding transportation, and private group tours throughout the Roaring Fork Valley. The fleet includes a luxury Escalade (6 passengers) and a luxury Sprinter van (14 passengers). Service is available 24 hours a day, 7 days a week.',
  url: ALP_URL,
  telephone: '+19704563666',
  priceRange: '$$$',
  image: ALP_OG_IMAGE,
  foundingDate: '2012',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Aspen',
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
    '@type': 'Vehicle',
    name: 'Executive Cadillac Escalade — 6 Passenger',
    description:
      'Luxury Cadillac Escalade with premium leather interior, climate control, entertainment system, and complimentary amenities. Seats up to 6 passengers. Used for airport transfers, private charters, and executive travel in Aspen, Colorado.',
    vehicleConfiguration: 'SUV Limousine',
    seatingCapacity: 6,
    color: 'Black',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: 'Luxury Mercedes Sprinter Van — 14 Passenger',
    description:
      'Luxury Mercedes Sprinter van with premium seating, ambient lighting, and entertainment. Seats up to 14 passengers. Ideal for group airport transfers, wedding parties, and corporate events in Aspen and the Roaring Fork Valley.',
    vehicleConfiguration: 'Luxury Van',
    seatingCapacity: 14,
    color: 'Black',
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
        text: 'Yes. Aspen Alpenglow Limousine specializes in wedding transportation throughout Aspen and Snowmass, Colorado. We provide bridal party transfers, venue-to-venue logistics, and guest shuttle coordination. Both our Escalade and Sprinter van are available for weddings. We work closely with wedding planners and venues to ensure a seamless, elegant experience on your special day.',
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
        text: 'Absolutely. Aspen Alpenglow Limousine provides private group transportation to and from Aspen Mountain, Aspen Highlands, Buttermilk, Snowmass ski resort, and other destinations throughout the Roaring Fork Valley. Our Luxury Sprinter van seats up to 14 passengers and is perfect for ski groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'What vehicles does Aspen Alpenglow Limousine use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Aspen Alpenglow Limousine operates two premium vehicles: a black Executive Cadillac Escalade (up to 6 passengers) and a black Luxury Mercedes Sprinter van (up to 14 passengers). Both vehicles feature premium leather interiors, climate control, and complimentary amenities. All vehicles are late-model, meticulously maintained, and professionally chauffeured.',
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
      {children}
    </>
  )
}
