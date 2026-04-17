import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { alpenglowData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Online Reservations | Aspen Alpenglow Limousine',
  description:
    'Book private car and limousine service in Aspen, Snowmass, and the Roaring Fork Valley. Secure online reservations powered by Limo Anywhere.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/reservations' },
}

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-alp-navy text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <nav className="text-sm text-white/60 mb-8">
          <Link href="/" className="hover:text-alp-gold">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white/90">Reservations</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-serif text-alp-gold mb-4">Online Reservations</h1>
        <p className="text-white/80 mb-8 leading-relaxed">
          Book your ride in a few steps. The booking widget loads below so you can complete your reservation without leaving this site. For general questions or custom itineraries, visit{' '}
          <Link href="/contact" className="text-alp-gold hover:text-alp-gold-light underline">
            Contact
          </Link>
          .
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <a
            href="https://book.mylimobiz.com/v4/richvalley"
            data-ores-widget="website"
            data-ores-alias="richvalley"
            className="inline-flex items-center justify-center rounded-full bg-alp-gold px-6 py-3 text-sm font-semibold text-alp-navy hover:bg-alp-gold-light transition-colors"
          >
            Online Reservations
          </a>
          <p className="mt-4 text-sm text-white/55">
            If the booking form does not appear, try disabling strict content blockers or call{' '}
            <a href={alpenglowData.phoneHref} className="text-alp-gold hover:text-alp-gold-light">
              {alpenglowData.phone}
            </a>
            .
          </p>
        </div>
      </div>
      <Script src="https://book.mylimobiz.com/v4/widgets/widget-loader.js" strategy="afterInteractive" />
    </div>
  )
}
