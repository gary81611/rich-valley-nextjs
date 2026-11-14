/**
 * Published AAL airport rates.
 * Same merge the /pricing page uses: CMS `pricing_routes` rows, then the
 * confirmed airport rates. The home booking card reads this module only.
 */

import { aalTransitPrice } from '@/lib/aal-public-copy'

export type AalPricingRoute = {
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

const TRANSIT_NOTE = ''

export function publishedVanPrice(note: string | null | undefined): string {
  const value = (note || '').trim()
  if (/^\$[\d,]+$/.test(value)) return value
  return ''
}

function transitNoteFor(blob: string): string {
  return aalTransitPrice(blob) || TRANSIT_NOTE
}

function routeBlob(row: AalPricingRoute): string {
  return `${row.route_name} ${row.origin} ${row.destination}`.toLowerCase()
}

function isAseAirport(text: string): boolean {
  return /\base\b|pitkin/.test(text) && !/kapa|centennial/.test(text)
}

function isAseArrival(row: AalPricingRoute): boolean {
  const text = routeBlob(row)
  if (!isAseAirport(text)) return false
  const name = (row.route_name || '').toLowerCase()
  if (name.startsWith('aspen to') || name.startsWith('aspen -')) return false
  const dest = (row.destination || '').toLowerCase()
  return dest.includes('aspen') || dest.includes('snowmass') || /\bto aspen\b|\bto snowmass\b/.test(name)
}

function isAseDeparture(row: AalPricingRoute): boolean {
  const text = routeBlob(row)
  if (!isAseAirport(text)) return false
  const name = (row.route_name || '').toLowerCase()
  const origin = (row.origin || '').toLowerCase()
  return name.startsWith('aspen to') || name.startsWith('aspen -') || (origin.includes('aspen') && !isAseAirport(origin))
}

/** Confirmed owner rates / routes — merged on top of CMS rows so the public page matches the questionnaire. */
export function applyConfirmedPricingRoutes(rows: AalPricingRoute[]): AalPricingRoute[] {
  const list = rows.map((r) => {
    const row = { ...r }
    if (row.price_note) {
      row.price_note = row.price_note.replace(/Sprinter/gi, 'Ford Transit Passenger Van')
    }
    return row
  })

  const patches: Record<string, Partial<Pick<AalPricingRoute, 'distance' | 'drive_time' | 'suv_price' | 'price_note' | 'route_name'>>> = {
    'Aspen to Woody Creek': { suv_price: 150 },
    'Aspen to Crested Butte': { distance: '~100 mi', drive_time: '2.5 hr', suv_price: 1475 },
    'Aspen to Telluride': { distance: '~200 mi', drive_time: '4.5 hr' },
    'Aspen to Beaver Creek': { distance: '~105 mi', drive_time: '2 hr', suv_price: 800 },
    'Aspen to Breckenridge': { distance: '~150 mi', drive_time: '3 hr', suv_price: 900 },
    'Hourly Charter (Limo Coach/Sprinter)': { route_name: 'Hourly Charter (Ford Transit Passenger Van)' },
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

  const fromAspenKey = (row: AalPricingRoute): 'eagle' | 'denver' | 'gj' | 'rifle' | null => {
    const origin = (row.origin || '').toLowerCase()
    const name = (row.route_name || '').toLowerCase()
    const fromAspen = origin.includes('aspen') || name.startsWith('aspen to') || name.startsWith('aspen -')
    if (!fromAspen) return null
    return pairKey(`${row.route_name} ${row.destination}`.toLowerCase())
  }

  const toAspenKey = (row: AalPricingRoute): 'eagle' | 'denver' | 'gj' | 'rifle' | null => {
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
      r.price_note = transitNoteFor(`${r.route_name} ${r.origin} ${r.destination}`)
      seenFrom.add(outKey)
    }
    const inKey = toAspenKey(r)
    if (inKey) {
      r.suv_price = pairRate[inKey]
      r.price_note = transitNoteFor(`${r.route_name} ${r.origin} ${r.destination}`)
      seenTo.add(inKey)
    }
  }

  for (const r of list) {
    if (!String(r.category || '').startsWith('airport')) continue
    const blob = `${r.route_name} ${r.origin} ${r.destination}`
    const key = pairKey(blob.toLowerCase())
    if (key !== 'eagle' && key !== 'rifle' && key !== 'denver') continue
    r.suv_price = pairRate[key]
    r.price_note = transitNoteFor(blob)
    const intoAspen = (r.destination || '').toLowerCase().includes('aspen') || /\bto aspen\b/i.test(r.route_name)
    const fromAspen = (r.origin || '').toLowerCase().includes('aspen') || /^aspen to/i.test(r.route_name)
    if (fromAspen) seenFrom.add(key)
    if (intoAspen) seenTo.add(key)
  }

  const missingOneWay: Record<'eagle' | 'denver' | 'gj' | 'rifle', AalPricingRoute> = {
    eagle: {
      route_name: 'Aspen to EGE',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'EGE (Eagle)',
      distance: '~70 mi',
      drive_time: '1.5 hr',
      suv_price: 720,
      price_note: '$1,200',
      display_order: 11,
    },
    denver: {
      route_name: 'Aspen to DEN',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'DEN (Denver)',
      distance: '~220 mi',
      drive_time: '4 hr',
      suv_price: 1375,
      price_note: '$1,600',
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
      price_note: '$1,200',
      display_order: 14,
    },
  }
  for (const key of Object.keys(missingOneWay) as Array<keyof typeof missingOneWay>) {
    if (!seenFrom.has(key)) list.push(missingOneWay[key])
  }

  const missingInbound: Record<'eagle' | 'denver' | 'gj' | 'rifle', AalPricingRoute> = {
    eagle: {
      route_name: 'EGE to Aspen',
      category: 'airport-inbound',
      origin: 'EGE (Eagle)',
      destination: 'Aspen',
      distance: '~70 mi',
      drive_time: '1.5 hr',
      suv_price: 720,
      price_note: '$1,200',
      display_order: 3,
    },
    denver: {
      route_name: 'DEN to Aspen',
      category: 'airport-inbound',
      origin: 'DEN (Denver)',
      destination: 'Aspen',
      distance: '~220 mi',
      drive_time: '4 hr',
      suv_price: 1375,
      price_note: '$1,600',
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
      price_note: '$1,200',
      display_order: 6,
    },
  }
  for (const key of Object.keys(missingInbound) as Array<keyof typeof missingInbound>) {
    if (!seenTo.has(key)) list.push(missingInbound[key])
  }

  if (!list.some(isAseArrival)) {
    list.push({
      route_name: 'ASE Airport to Aspen',
      category: 'airport-inbound',
      origin: 'ASE Airport',
      destination: 'Aspen',
      distance: '~5 mi',
      drive_time: '10 min',
      suv_price: 210,
      price_note: TRANSIT_NOTE,
      display_order: 1,
    })
  }
  if (!list.some(isAseDeparture)) {
    list.push({
      route_name: 'Aspen to ASE Airport',
      category: 'airport-outbound',
      origin: 'Aspen',
      destination: 'ASE Airport',
      distance: '~5 mi',
      drive_time: '10 min',
      suv_price: 150,
      price_note: TRANSIT_NOTE,
      display_order: 10,
    })
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

export async function loadAalPublishedRoutes(): Promise<AalPricingRoute[]> {
  let rows: AalPricingRoute[] = []
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url && url.startsWith('http')) {
    try {
      const { createServerSupabaseClient } = await import('@/lib/supabase-server')
      const supabase = await createServerSupabaseClient()
      const { data } = await supabase
        .from('pricing_routes')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      rows = (data || []) as AalPricingRoute[]
    } catch {
      rows = []
    }
  }
  return applyConfirmedPricingRoutes(rows)
}

export type HomeAirportId = 'ase' | 'ege' | 'den' | 'ril'

export type HomeRouteCard = {
  id: 'ase' | 'ege' | 'den'
  code: string
  name: string
  meta: string
  suv: string
  transit: string
  href: string
  cta: string
}

export type HomeFares = {
  airports: Record<HomeAirportId, { suv: string; transit: string }>
  routes: HomeRouteCard[]
  alsoNote: string
  suburbanFrom: string
  transitFrom: string
}

type AirportKind = HomeAirportId | 'gj' | 'kapa'

function airportKind(row: AalPricingRoute): AirportKind | null {
  const blob = routeBlob(row)
  if (/kapa|centennial/.test(blob)) return 'kapa'
  if (/\brifle\b|\bkril\b|\bril\b/.test(blob)) return 'ril'
  if (/grand junction|\bgjt\b/.test(blob)) return 'gj'
  if (/\bdenver\b|\bden\b/.test(blob)) return 'den'
  if (/\beagle\b|\bege\b/.test(blob) && !/vail|beaver/.test(blob)) return 'ege'
  if (isAseAirport(blob)) return 'ase'
  return null
}

function isArrival(row: AalPricingRoute): boolean {
  const name = (row.route_name || '').toLowerCase()
  if (name.startsWith('aspen to') || name.startsWith('aspen -')) return false
  const dest = (row.destination || '').toLowerCase()
  return dest.includes('aspen') || dest.includes('snowmass') || /\bto aspen\b|\bto snowmass\b/.test(name)
}

function money(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`
}

function blankMetric(value: string): boolean {
  return !value || /^[—–\-.\s]+$/.test(value)
}

function arrivalMeta(row: AalPricingRoute | undefined): string {
  if (!row) return ''
  const dist = (row.distance || '').trim()
  const drive = (row.drive_time || '').trim()
  const parts: string[] = []
  if (!blankMetric(dist)) parts.push(`About ${dist.replace(/^~\s*/, '')}`)
  if (!blankMetric(drive)) parts.push(drive)
  if (parts.length === 0) return ''
  return `${parts.join(' · ')} to Aspen`
}

function arrivalRow(routes: AalPricingRoute[], kind: AirportKind): AalPricingRoute | undefined {
  const matches = routes.filter((row) => airportKind(row) === kind && isArrival(row))
  return (
    matches.find((row) => {
      const dest = (row.destination || '').toLowerCase()
      return dest.includes('aspen') && !dest.includes('snowmass')
    }) || matches[0]
  )
}

function farePair(row: AalPricingRoute | undefined): { suv: string; transit: string } {
  if (!row) return { suv: 'Quote', transit: 'Quote' }
  return {
    suv: money(row.suv_price),
    transit: publishedVanPrice(row.price_note) || 'Quote',
  }
}

/** View model for the home booking card and route cards. Prices come from published routes. */
export function buildHomeFares(routes: AalPricingRoute[]): HomeFares {
  const ase = arrivalRow(routes, 'ase')
  const ege = arrivalRow(routes, 'ege')
  const den = arrivalRow(routes, 'den')
  const ril = arrivalRow(routes, 'ril')
  const gj = arrivalRow(routes, 'gj')
  const kapa = arrivalRow(routes, 'kapa')
  const airports = {
    ase: farePair(ase),
    ege: farePair(ege),
    den: farePair(den),
    ril: farePair(ril),
  }
  const cards: Array<Omit<HomeRouteCard, 'suv' | 'transit' | 'meta'> & { row: AalPricingRoute | undefined }> = [
    {
      id: 'ase',
      code: 'ASE',
      name: 'Aspen/Pitkin County Airport',
      href: '/airport-transfers',
      cta: 'ASE transfers',
      row: ase,
    },
    {
      id: 'ege',
      code: 'EGE',
      name: 'Eagle County Airport, Gypsum',
      href: '/airport-transfers/eagle-ege-to-aspen',
      cta: 'Eagle to Aspen',
      row: ege,
    },
    {
      id: 'den',
      code: 'DEN',
      name: 'Denver International Airport',
      href: '/airport-transfers/denver-den-to-aspen',
      cta: 'Denver to Aspen',
      row: den,
    },
  ]
  const transitFrom = airports.ege.transit !== 'Quote' ? airports.ege.transit : airports.ril.transit
  return {
    airports,
    routes: cards.map(({ row, ...card }) => ({
      ...card,
      meta: arrivalMeta(row),
      suv: farePair(row).suv,
      transit: farePair(row).transit,
    })),
    alsoNote: `Also Rifle (${farePair(ril).suv}), Grand Junction (${farePair(gj).suv}) and Centennial (${farePair(kapa).suv}). Holiday pricing may change seasonally.`,
    suburbanFrom: `From ${airports.ase.suv} · ASE`,
    transitFrom: `From ${transitFrom} · EGE`,
  }
}
