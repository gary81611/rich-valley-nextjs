import type { Metadata } from 'next'
import RVANav from '@/components/rva/RVANav'
import RVAFooter from '@/components/rva/RVAFooter'
import { rvaHomeJsonLdBlocks } from '@/lib/schema/home-jsonld'
import './rva-type.css'

const RVA_URL = 'https://www.richvalleyadventures.com'
/** On-site logo, 441×212. Replaces the old Unsplash photo used as the OG and logo fallback. */
const RVA_LOGO = `${RVA_URL}/images/logos/rva-logo.png`
const RVA_LOGO_WIDTH = 441
const RVA_LOGO_HEIGHT = 212

export const metadata: Metadata = {
  metadataBase: new URL(RVA_URL),
  icons: { icon: '/images/logos/rva-logo.png' },
  title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
  description:
    'Rich Valley Adventures offers expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen, Colorado. Small groups, all gear included. Book your Roaring Fork Valley adventure today.',
  keywords: 'Aspen guided adventures, fly fishing Aspen Colorado, paddle boarding Roaring Fork River, mountain biking Aspen, outdoor guide Aspen Colorado, guided hiking Aspen, adventure tours Roaring Fork Valley, Aspen outdoor activities',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    description:
      'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen and the Roaring Fork Valley. Small groups, all gear included.',
    type: 'website',
    locale: 'en_US',
    url: RVA_URL,
    siteName: 'Rich Valley Adventures',
    images: [
      {
        url: RVA_LOGO,
        width: RVA_LOGO_WIDTH,
        height: RVA_LOGO_HEIGHT,
        alt: 'Rich Valley Adventures logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    description:
      'Expert-guided fly fishing, hiking, mountain biking, and elevated camping in Aspen and the Roaring Fork Valley.',
    images: [RVA_LOGO],
  },
  verification: {
    google: '-q1tnKm96Tll0PlWAdnV5kSJHd-doPIrpc7BWnHb53o',
  },
  other: {
    'geo.region': 'US-CO',
    'geo.placename': 'Aspen, Colorado',
    'geo.position': '39.1911;-106.8175',
    'ICBM': '39.1911, -106.8175',
  },
}

export default function RVALayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://lirp.cdn-website.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      {rvaHomeJsonLdBlocks.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <RVANav />
      <div className="rva-site">
        {children}
      </div>
      <RVAFooter />
      {/* Sticky bar below 1024. Header phone is hidden until lg, so this is the phone CTA. */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex min-h-14">
          <a href="tel:+19704563666" className="flex-1 flex items-center justify-center gap-2 min-h-11 px-2 text-[15px] font-semibold text-rva-forest-dark border-r border-gray-200 whitespace-nowrap">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call
          </a>
          <a href="/contact" className="flex-1 flex items-center justify-center gap-2 min-h-11 px-2 text-[15px] font-semibold text-white bg-rva-copper-700 whitespace-nowrap">
            Check availability
          </a>
        </div>
      </div>
    </>
  )
}
