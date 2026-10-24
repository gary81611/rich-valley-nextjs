import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { alpenglowData } from '@/lib/site-data'
import VehicleCard from '@/components/alpenglow/VehicleCard'
import { AAL_OG_IMAGE, AAL_VEHICLES } from '@/lib/aal-vehicles'

type DbPricingRoute = {
  route_name: string
  category: string | null
  origin: string
  destination: string
  distance: string
  drive_time: string
  suv_price: number
  price_note: string | null
  display_order: number | null
}

const TRANSIT_NOTE = 'Contact for Ford Transit Van quote'

/** Confirmed owner rates / routes — merged on top of CMS rows so the public page matches the questionnaire. */
function applyConfirmedPricingRoutes(rows: DbPricingRoute[]): DbPricingRoute[] {
  const list = rows.map((r) => {
    const row = { ...r }
    if (row.price_note) {
      row.price_note = row.price_note.replace(/Sprinter/gi, 'Ford Transit Van')
    }
    return row
  })

  const patches: Record<string, Partial<Pick<DbPricingRoute, 'distance' | 'drive_time' | 'suv_price' | 'price_note' | 'route_name'>>> = {
    'Aspen to Woody Creek': { suv_price: 150 },
    'Aspen to Crested Butte': { distance: '~100 mi', drive_time: '2.5 hr', suv_price: 1475 },
    'Aspen to Telluride': { distance: '~200 mi', drive_time: '4.5 hr' },
    'Aspen to Beaver Creek': { distance: '~105 mi', drive_time: '2 hr', suv_price: 800 },
    'Aspen to Breckenridge': { distance: '~150 mi', drive_time: '3 hr', suv_price: 900 },
    'Hourly Charter (Limo Coach/Sprinter)': { route_name: 'Hourly Charter (Ford Transit Van)' },
  }

  for (const r of list) {
    const p = patches[r.route_name]
    if (p) Object.assign(r, p)
  }

  const pairRate: Record<'eagle' | 'denver' | 'gj' | 'rifle', number> = {
    eagle: 720,
    denver: 1375,
    gj: 950,
    rifle: 720,
  }

  const pairKey = (blob: string): 'eagle' | 'denver' | 'gj' | 'rifle' | null => {
    if (/\bkapa\b|centennial/.test(blob)) return null
    if (/\brifle\b|\bkril\b/.test(blob)) return 'rifle'
    if (/grand junction|\bgjt\b/.test(blob)) return 'gj'
    if (/\bdenver\b|\bden\b/.test(blob)) return 'denver'
    if (/\beagle\b|\bege\b/.test(blob) && !/vail|beaver/.test(blob)) return 'eagle'
    return null
  }

  const fromAspenKey = (row: DbPricingRoute): 'eagle' | 'denver' | 'gj' | 'rifle' | null => {
    const origin = (row.origin || '').toLowerCase()
    const name = (row.route_name || '').toLowerCase()
    const fromAspen = origin.includes('aspen') || name.startsWith('aspen to') || name.startsWith('aspen -')
    if (!fromAspen) return null
    return pairKey(`${row.route_name} ${row.destination}`.toLowerCase())
  }

  const toAspenKey = (row: DbPricingRoute): 'eagle' | 'denver' | 'gj' | 'rifle' | null => {
    const destination = (row.destination || '').toLowerCase()
    const name = (row.route_name || '').toLowerCase()
    if (name.startsWith('aspen to') || name.startsWith('aspen -')) return null
    const intoAspen = destination.includes('aspen') || /\bto aspen\b/.test(name)
    if (!intoAspen) return null
    return pairKey(`${row.route_name} ${row.origin}`.toLowerCase())
  }

  const seenFrom = new Set<'eagle' | 'denver' | 'gj' | 'rifle'>()
  const seenTo = new Set<'eagle' | 'denver' | 'gj' | 'rifle'>()
  for (const r of list) {
    const outKey = fromAspenKey(r)
    if (outKey) {
      r.suv_price = pairRate[outKey]
      seenFrom.add(outKey)
    }
    const inKey = toAspenKey(r)
    if (inKey) {
      r.suv_price = pairRate[inKey]
      seenTo.add(inKey)
    }
  }

  const missingOneWay: Record<'eagle' | 'denver' | 'gj' | 'rifle', DbPricingRoute> = {
    eagle: {
      route_name: 'Aspen to EGE',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'EGE (Eagle)',
      distance: '—',
      drive_time: '—',
      suv_price: 720,
      price_note: TRANSIT_NOTE,
      display_order: 11,
    },
    denver: {
      route_name: 'Aspen to DEN',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'DEN (Denver)',
      distance: '—',
      drive_time: '—',
      suv_price: 1375,
      price_note: TRANSIT_NOTE,
      display_order: 12,
    },
    gj: {
      route_name: 'Aspen to GJT',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'GJT (Grand Junction)',
      distance: '—',
      drive_time: '—',
      suv_price: 950,
      price_note: TRANSIT_NOTE,
      display_order: 13,
    },
    rifle: {
      route_name: 'Aspen to KRIL',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'KRIL (Rifle)',
      distance: '—',
      drive_time: '—',
      suv_price: 720,
      price_note: TRANSIT_NOTE,
      display_order: 14,
    },
  }
  for (const key of Object.keys(missingOneWay) as Array<keyof typeof missingOneWay>) {
    if (!seenFrom.has(key)) list.push(missingOneWay[key])
  }

  const missingInbound: Record<'eagle' | 'denver' | 'gj' | 'rifle', DbPricingRoute> = {
    eagle: {
      route_name: 'EGE to Aspen',
      category: 'airport-inbound',
      origin: 'EGE (Eagle)',
      destination: 'Aspen',
      distance: '—',
      drive_time: '—',
      suv_price: 720,
      price_note: TRANSIT_NOTE,
      display_order: 3,
    },
    denver: {
      route_name: 'DEN to Aspen',
      category: 'airport-inbound',
      origin: 'DEN (Denver)',
      destination: 'Aspen',
      distance: '—',
      drive_time: '—',
      suv_price: 1375,
      price_note: TRANSIT_NOTE,
      display_order: 4,
    },
    gj: {
      route_name: 'GJT to Aspen',
      category: 'airport-inbound',
      origin: 'GJT (Grand Junction)',
      destination: 'Aspen',
      distance: '—',
      drive_time: '—',
      suv_price: 950,
      price_note: TRANSIT_NOTE,
      display_order: 5,
    },
    rifle: {
      route_name: 'KRIL to Aspen',
      category: 'airport-inbound',
      origin: 'KRIL (Rifle)',
      destination: 'Aspen',
      distance: '—',
      drive_time: '—',
      suv_price: 720,
      price_note: TRANSIT_NOTE,
      display_order: 6,
    },
  }
  for (const key of Object.keys(missingInbound) as Array<keyof typeof missingInbound>) {
    if (!seenTo.has(key)) list.push(missingInbound[key])
  }

  const names = new Set(list.map((r) => r.route_name))
  if (!names.has('KAPA to Aspen')) {
    list.push({
      route_name: 'KAPA to Aspen',
      category: 'airport-inbound',
      origin: 'KAPA (Centennial Denver)',
      destination: 'Aspen',
      distance: '~210 mi',
      drive_time: '3.75 hr',
      suv_price: 1475,
      price_note: TRANSIT_NOTE,
      display_order: 998,
    })
  }
  if (!names.has('Aspen to KAPA')) {
    list.push({
      route_name: 'Aspen to KAPA',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'KAPA (Centennial)',
      distance: '~210 mi',
      drive_time: '3.75 hr',
      suv_price: 1475,
      price_note: TRANSIT_NOTE,
      display_order: 999,
    })
  }

  return list.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
}

function applyConfirmedPolicies(titles: string[]): string[] {
  const diversion =
    "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice."
  const rewritten = titles.map((title) => {
    const t = title.toLowerCase()
    if (t.includes('winter and summer')) return 'Holiday pricing may change seasonally.'
    if (t.includes('7-day') || t.includes('24-hour cancellation') || t.includes('24 hour cancellation')) return diversion
    return title
  })
  const extras = [
    'One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally.',
    diversion,
    'Corporate charge accounts are billed monthly.',
  ]
  for (const extra of extras) {
    if (!rewritten.includes(extra)) rewritten.push(extra)
  }
  return rewritten.filter((title, index) => rewritten.indexOf(title) === index)
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aspen Car Service Prices | ASE $210 · Eagle $720 · DEN $1,375',
  description:
    'All-inclusive private SUV rates from Aspen: ASE, Eagle, Denver, Rifle, Grand Junction, Snowmass and valley routes. No service charges or added gratuity.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/pricing' },
  openGraph: {
    title: 'Aspen Car Service Prices | ASE $210 · Eagle $720 · DEN $1,375',
    description:
      'All-inclusive private SUV rates from Aspen: ASE, Eagle, Denver, Rifle, Grand Junction, Snowmass and valley routes. No service charges or added gratuity.',
    url: 'https://aspenalpenglowlimousine.com/pricing',
    type: 'website',
    images: [AAL_OG_IMAGE],
  },
}


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
      <div className="sm:hidden space-y-4">
        {routes.map((r) => (
          <article key={r.slug} className="rounded-2xl border border-alp-pearl-dark p-4">
            <p className="font-semibold text-alp-navy">
              {r.from} <span className="text-alp-navy/40">&rarr;</span> {r.to}
            </p>
            <p className="mt-3 text-lg font-semibold text-alp-gold-700">
              Chevrolet Suburban · ${r.suvPrice.toLocaleString()}
            </p>
            <p className="text-base font-semibold text-alp-navy">Ford Transit passenger van · {r.sprinterPrice}</p>
            <p className="mt-2 text-xs text-alp-navy/60">
              {r.distance} · {r.driveTime}
            </p>
          </article>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-alp-gold/30">
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Route</th>
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Distance</th>
              <th className="text-left py-3 px-4 font-semibold text-alp-navy">Drive Time</th>
              <th className="text-right py-3 px-4 font-semibold text-alp-navy">Chevrolet Suburban (up to 7)</th>
              <th className="text-right py-3 px-4 font-semibold text-alp-navy">Ford Transit passenger van (up to 13)</th>
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
                <td className="py-3 px-4 text-right font-semibold text-alp-gold-700">${r.suvPrice.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-alp-navy text-sm">{r.sprinterPrice}</td>
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

  const [{ data: rows }, { data: policyRows }] = await Promise.all([
    supabase
      .from('pricing_routes')
      .select('*')
      .eq('is_active', true)
      .order('display_order'),
    supabase
      .from('pricing_policies')
      .select('title')
      .eq('is_active', true)
      .order('display_order'),
  ])

  const rawPolicies = policyRows ? policyRows.map((p: { title: string }) => p.title) : []
  const POLICIES = applyConfirmedPolicies(rawPolicies)

  const allRoutes = applyConfirmedPricingRoutes((rows || []) as DbPricingRoute[])

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
    sprinterPrice: (r.price_note || 'Contact for quote').replace(/Sprinter/gi, 'Ford Transit Van'),
    slug: r.route_name,
  })

  // Map DB rows to hourly shape
  const mapHourly = (r: (typeof allRoutes)[0]): HourlyRow => ({
    service: r.route_name,
    suvPrice: r.suv_price,
    sprinterPrice: (r.price_note || 'Contact for quote').replace(/Sprinter/gi, 'Ford Transit Van'),
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
      <div className="aal-hero-compact bg-alp-navy text-white">
        <div className="max-w-5xl mx-auto px-6 text-left w-full">
          <p className="text-alp-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">Transparent Pricing</p>
          <h1 className="font-playfair text-white font-bold mb-4">All-Inclusive Rates</h1>
          <p className="text-white/60 max-w-2xl">No hidden fees, no service charges, no gratuity added. The price you see is the price you pay.</p>
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
        <p className="text-sm text-alp-navy/70 mb-4 max-w-3xl leading-relaxed">
          <strong className="text-alp-navy">Private FBO airport service:</strong> Eagle, Rifle, and Grand Junction,
          plus Buena Vista, Montrose, and Gunnison. Existing partners: EGE — Signature Aviation | KRIL (Rifle) — Atlantic
          Aviation | GJT — West Star Aviation | KAPA — Centennial Airport Denver.
        </p>
        <p className="text-sm text-alp-navy/70 mb-12 max-w-3xl leading-relaxed">
          One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally.
          Flight diversions to Denver or Grand Junction are handled with 2 hours&apos; notice and no Aspen cancellation penalty.
          General cancellations need 24 hours&apos; notice.
        </p>
        <PriceTable title="Local / Roaring Fork Valley" routes={LOCAL_ROUTES} />
        <PriceTable title="Long-Distance / Resort-to-Resort" routes={LONG_DISTANCE} />

        {/* Hourly & Special Services */}
        {HOURLY_SERVICES.length > 0 && (
          <div className="mb-12">
            <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">Hourly Charter &amp; In-Town</h2>
            <div className="sm:hidden space-y-4">
              {HOURLY_SERVICES.map((s) => (
                <article key={s.service} className="rounded-2xl border border-alp-pearl-dark p-4">
                  <p className="font-semibold text-alp-navy">{s.service}</p>
                  <p className="mt-3 text-lg font-semibold text-alp-gold-700">
                    Chevrolet Suburban · {s.suvPrice ? `$${s.suvPrice}${s.note || ''}` : '\u2014'}
                  </p>
                  <p className="text-base font-semibold text-alp-navy">Ford Transit passenger van · {s.sprinterPrice}</p>
                </article>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-alp-gold/30">
                    <th className="text-left py-3 px-4 font-semibold text-alp-navy">Service</th>
                    <th className="text-right py-3 px-4 font-semibold text-alp-navy">Chevrolet Suburban (up to 7)</th>
                    <th className="text-right py-3 px-4 font-semibold text-alp-navy">Ford Transit passenger van (up to 13)</th>
                  </tr>
                </thead>
                <tbody>
                  {HOURLY_SERVICES.map((s) => (
                    <tr key={s.service} className="border-b border-alp-pearl hover:bg-alp-pearl/50">
                      <td className="py-3 px-4 font-medium text-alp-navy">{s.service}</td>
                      <td className="py-3 px-4 text-right font-semibold text-alp-gold-700">
                        {s.suvPrice ? `$${s.suvPrice}${s.note || ''}` : '\u2014'}
                      </td>
                      <td className="py-3 px-4 text-right text-alp-navy text-sm">{s.sprinterPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fleet */}
        <div className="mb-12">
          <h2 className="font-playfair text-2xl font-semibold text-alp-navy mb-6">Our Fleet</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {AAL_VEHICLES.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        {/* Policies */}
        {POLICIES.length > 0 && (
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
        )}

        {/* CTA */}
        <div className="text-center bg-alp-navy rounded-xl p-10">
          <h2 className="font-playfair text-2xl text-white mb-3">Ready to Book?</h2>
          <p className="text-white/60 mb-6">Book online, or call or text to reserve your ride.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href={alpenglowData.onlineReservationsPath}
              className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Book online
            </Link>
            <a href="tel:+19704563666" className="inline-block border-2 border-alp-gold text-alp-gold hover:bg-alp-gold hover:text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors">
              Call 970-456-3666
            </a>
          </div>
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
        offers: [
          ...AIRPORT_OUTBOUND.filter((r) => /eagle|denver|grand junction|rifle|ege|den|gjt|kril/i.test(`${r.from} ${r.to}`)).map((r) => ({
            '@type': 'Offer',
            name: `${r.from} to ${r.to}`,
            price: r.suvPrice,
            priceCurrency: 'USD',
            description: 'One-way private SUV rate from Aspen. Holiday pricing may change seasonally.',
          })),
          ...AIRPORT_INBOUND.slice(0, 5).map(r => ({
            '@type': 'Offer',
            name: `${r.from} to ${r.to}`,
            price: r.suvPrice,
            priceCurrency: 'USD',
            description: `Private SUV transfer, ${r.driveTime} drive`,
          })),
        ],
      })}} />
    </div>
  )
}
