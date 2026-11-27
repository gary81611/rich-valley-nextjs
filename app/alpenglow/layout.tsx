import type { Metadata } from 'next'
import ALPNav from '@/components/alpenglow/ALPNav'
import ALPFooter from '@/components/alpenglow/ALPFooter'
import { alpenglowData } from '@/lib/site-data'
import { aalHomeJsonLdBlocks } from '@/lib/schema/home-jsonld'
import './aal-type.css'

const ALP_URL = 'https://aspenalpenglowlimousine.com'
const ALP_LOGO = `${ALP_URL}/images/logos/alpenglow-logo.png`
const ALP_LOGO_WIDTH = 1312
const ALP_LOGO_HEIGHT = 650

export const metadata: Metadata = {
  metadataBase: new URL(ALP_URL),
  icons: { icon: '/images/logos/alpenglow-logo.png' },
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

export default function AlpenglowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aal-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lirp.cdn-website.com" crossOrigin="anonymous" />
      {aalHomeJsonLdBlocks.map((schema, i) => (
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
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden shadow-[0_-8px_24px_rgba(0,0,0,0.18)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex h-14">
          <a href="tel:+19703156111" className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-[#f7f3ec]" style={{ backgroundColor: '#0e1a2b' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a href={alpenglowData.onlineReservationsPath} className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white" style={{ backgroundColor: '#c98a6b' }}>
            Book online
          </a>
        </div>
      </div>
    </div>
  )
}
