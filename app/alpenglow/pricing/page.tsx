import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pricing | Aspen Alpenglow Limousine — All-Inclusive Transportation Rates',
  description: 'Transparent, all-inclusive pricing for private car service in Aspen. Airport transfers from ASE, EGE, DEN. Local Roaring Fork Valley routes. No hidden fees.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/alpenglow/pricing' },
  openGraph: {
    title: 'Aspen Alpenglow Limousine Pricing — All-Inclusive Rates',
    description: 'Private car service from $100. Airport transfers, local routes, hourly charter. No hidden service charges.',
  },
}

const POLICIES = [
  'Chartered services: 4-hour minimum',
  'All reservations: 24-hour cancellation policy',
  'Events: 7-day cancellation policy',
  'First 15 minutes of wait time included',
  '30 minutes included for airport arrivals',
  'Winter and summer rates are the same',
  'All reservations must be held with a credit card',
  'All-inclusive pricing — no hidden service charges or gratuity added',
]

const FLEET = [
  { name: '2025 Ford Transit Van', seats: 14, features: ['WiFi', 'XM Radio', 'Starlink', 'Water', 'Myers 6X Ski Rack'] },
  { name: '2026 Chevrolet Suburban', seats: 7, features: ['WiFi', 'Starlink', 'XM Radio', 'Water', 'Yakima Roof Rack', 'Myers 6X Ski Rack'] },
  { name: '2025 Chevrolet Suburban', seats: 7, features: ['WiFi', 'Starlink', 'XM Radio', 'Water', 'Yakima Roof Rack', 'Myers 6X Ski Rack'] },
]

type RouteRow = {
  from: string
  to: string
  distance: string
  driveTime: string
  suvPrice: number
  sprinterPrice: string
  slug: string
}

type HourlyRow = {
  service: string
  suvPrice: number | null
  sprinterPrice: string
  note: string | null
}

function PriceTable({ title, routes }: { title: string; routes: RouteRow[] }) {
  if (routes.length === 0) return null
  return (
    <div className="mb-12">
      <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-alp-gold/30">
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Route</th>
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Distance</th>
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Drive Time</th>
              <th className="text-right py-3 px-4 font-semibold text-alp-navy">SUV (7 pass.)</th>
              <th className="text-right py-3 px-4 font-semibold text-alp-navy">Sprinter (14 pass.)</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.slug} className="border-b border-alp-pearl hover:bg-alp-pearl/50 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-medium text-alp-navy">{r.from}</span>
                  <span className="text-alp-navy/40 mx-2">&rarr;</span>
                  <span className="font-medium text-alp-navy">{r.to}</span>
                </td>
                <td className="py-3 px-4 text-alp-navy/60">{r.distance}</td>
                <td className="py-3 px-4 text-alp-navy/60">{r.driveTime}</td>
                <td className="py-3 px-4 text-right font-semibold text-alp-gold">${r.suvPrice.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-alp-navy/50 text-xs">{r.sprinterPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()

  const { data: rows } = await supabase
    .from('pricing_routes')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const allRoutes = rows || []

  // Group by category
  const grouped: Record<string, typeof allRoutes> = {}
  for (const r of allRoutes) {
    const cat = r.category || 'other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(r)
  }

  // Map DB rows to route shape
  const mapRoute = (r: (typeof allRoutes)[0]): RouteRow => ({
    from: r.origin,
    to: r.destination,
    distance: r.distance,
    driveTime: r.drive_time,
    suvPrice: r.suv_price,
    sprinterPrice: r.price_note || 'Contact for quote',
    slug: r.route_name,
  })

  // Map DB rows to hourly shape
  const mapHourly = (r: (typeof allRoutes)[0]): HourlyRow => ({
    service: r.route_name,
    suvPrice: r.suv_price,
    sprinterPrice: r.price_note || 'Contact for quote',
    note: r.drive_time,
  })

  const AIRPORT_INBOUND = (grouped['airport-inbound'] || []).map(mapRoute)
  const AIRPORT_OUTBOUND = (grouped['airport-outbound'] || []).map(mapRoute)
  const LOCAL_ROUTES = (grouped['local'] || []).map(mapRoute)
  const LONG_DISTANCE = (grouped['long-distance'] || []).map(mapRoute)
  const HOURLY_SERVICES = (grouped['hourly'] || []).map(mapHourly)

  const hasRoutes = allRoutes.length > 0

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero */}
      <div className="bg-alp-navy pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-alp-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">Transparent Pricing</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">All-Inclusive Rates</h1>
          <p className="text-white/60 max-w-2xl mx-auto">No hidden fees, no service charges, no gratuity added. The price you see is the price you pay.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {!hasRoutes && (
          <div className="text-center py-12 text-alp-navy/50 mb-12">
            <p className="text-lg">Pricing information is being updated. Please call for current rates.</p>
          </div>
        )}

        <PriceTable title="Airport to Aspen/Snowmass" routes={AIRPORT_INBOUND} />
        <PriceTable title="Aspen to Airport" routes={AIRPORT_OUTBOUND} />
        <PriceTable title="Local / Roaring Fork Valley" routes={LOCAL_ROUTES} />
        <PriceTable title="Long-Distance / Resort-to-Resort" routes={LONG_DISTANCE} />

        {/* Hourly & Special Services */}
        {HOURLY_SERVICES.length > 0 && (
          <div className="mb-12">
            <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">Hourly Charter &amp; In-Town</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-alp-gold/30">
                    <th className="text-left py-3 px-4 font-semibold text-alp-navy">Service</th>
                    <th className="text-right py-3 px-4 font-semibold text-alp-navy">SUV</th>
                    <th className="text-right py-3 px-4 font-semibold text-alp-navy">Sprinter</th>
                  </tr>
                </thead>
                <tbody>
                  {HOURLY_SERVICES.map((s) => (
                    <tr key={s.service} className="border-b border-alp-pearl hover:bg-alp-pearl/50">
                      <td className="py-3 px-4 font-medium text-alp-navy">{s.service}</td>
                      <td className="py-3 px-4 text-right font-semibold text-alp-gold">
                        {s.suvPrice ? `$${s.suvPrice}${s.note || ''}` : '\u2014'}
                      </td>
                      <td className="py-3 px-4 text-right text-alp-navy/50 text-xs">{s.sprinterPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fleet */}
        <div className="mb-12 bg-alp-pearl rounded-xl p-8">
          <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">Our Fleet</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FLEET.map((v) => (
              <div key={v.name} className="bg-white rounded-lg p-5">
                <h3 className="font-semibold text-alp-navy mb-2">{v.name}</h3>
                <p className="text-sm text-alp-navy/60 mb-3">{v.seats} passengers</p>
                <div className="flex flex-wrap gap-1">
                  {v.features.map((f) => (
                    <span key={f} className="text-xs bg-alp-gold/10 text-alp-gold px-2 py-0.5 rounded">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="mb-12">
          <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">Booking Policies</h2>
          <ul className="space-y-2">
            {POLICIES.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-alp-navy/70">
                <span className="text-alp-gold mt-0.5">{'\u2713'}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center bg-alp-navy rounded-xl p-10">
          <h2 className="font-playfair text-2xl text-white mb-3">Ready to Book?</h2>
          <p className="text-white/60 mb-6">Call or text to reserve your ride.</p>
          <a href="tel:+19704563666" className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors">
            Call 970-456-3666
          </a>
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Aspen Alpenglow Limousine — Private Car Service',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Aspen Alpenglow Limousine',
          telephone: '+19704563666',
          address: { '@type': 'PostalAddress', addressLocality: 'Aspen', addressRegion: 'CO', addressCountry: 'US' },
        },
        areaServed: ['Aspen', 'Snowmass', 'Basalt', 'Carbondale', 'Glenwood Springs', 'Vail', 'Denver'],
        offers: AIRPORT_INBOUND.slice(0, 5).map(r => ({
          '@type': 'Offer',
          name: `${r.from} to ${r.to}`,
          price: r.suvPrice,
          priceCurrency: 'USD',
          description: `Private SUV transfer, ${r.driveTime} drive`,
        })),
      })}} />
    </div>
  )
}
