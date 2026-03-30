// AAL Pricing Data — Source: owner questionnaire (March 2026)
// These are the ONLY correct prices. Do NOT modify without owner confirmation.

export interface RoutePrice {
  slug: string
  from: string
  to: string
  distance: string
  driveTime: string
  suvPrice: number
  sprinterPrice: string // "Contact for quote" for most routes
  category: 'airport-inbound' | 'airport-outbound' | 'local' | 'long-distance' | 'hourly'
  description?: string
}

export const AIRPORT_INBOUND: RoutePrice[] = [
  { slug: 'ase-to-aspen', from: 'ASE Airport', to: 'Aspen', distance: '~5 mi', driveTime: '10 min', suvPrice: 210, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'ase-to-snowmass', from: 'ASE Airport', to: 'Snowmass', distance: '~10 mi', driveTime: '20 min', suvPrice: 210, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'ege-to-aspen', from: 'EGE (Eagle)', to: 'Aspen', distance: '~70 mi', driveTime: '1.5 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'ege-to-snowmass', from: 'EGE (Eagle)', to: 'Snowmass', distance: '~65 mi', driveTime: '1.5 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'ril-to-aspen', from: 'RIL (Rifle)', to: 'Aspen', distance: '~65 mi', driveTime: '1.25 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'ril-to-snowmass', from: 'RIL (Rifle)', to: 'Snowmass', distance: '~60 mi', driveTime: '1.25 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'gjt-to-aspen', from: 'GJT (Grand Junction)', to: 'Aspen', distance: '~130 mi', driveTime: '2.5 hr', suvPrice: 850, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'gjt-to-snowmass', from: 'GJT (Grand Junction)', to: 'Snowmass', distance: '~125 mi', driveTime: '2.5 hr', suvPrice: 850, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'den-to-aspen', from: 'DEN (Denver)', to: 'Aspen', distance: '~220 mi', driveTime: '4 hr', suvPrice: 1475, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
  { slug: 'den-to-snowmass', from: 'DEN (Denver)', to: 'Snowmass', distance: '~215 mi', driveTime: '4 hr', suvPrice: 1475, sprinterPrice: 'Contact for quote', category: 'airport-inbound' },
]

export const AIRPORT_OUTBOUND: RoutePrice[] = [
  { slug: 'aspen-to-ase', from: 'Aspen', to: 'ASE Airport', distance: '~5 mi', driveTime: '10 min', suvPrice: 150, sprinterPrice: 'Contact for quote', category: 'airport-outbound' },
  { slug: 'aspen-to-ege', from: 'Aspen', to: 'EGE (Eagle)', distance: '~70 mi', driveTime: '1.5 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-outbound' },
  { slug: 'aspen-to-ril', from: 'Aspen', to: 'RIL (Rifle)', distance: '~65 mi', driveTime: '1.25 hr', suvPrice: 720, sprinterPrice: 'Contact for quote', category: 'airport-outbound' },
  { slug: 'aspen-to-gjt', from: 'Aspen', to: 'GJT (Grand Junction)', distance: '~130 mi', driveTime: '2.5 hr', suvPrice: 850, sprinterPrice: 'Contact for quote', category: 'airport-outbound' },
  { slug: 'aspen-to-den', from: 'Aspen', to: 'DEN (Denver)', distance: '~220 mi', driveTime: '4 hr', suvPrice: 1475, sprinterPrice: 'Contact for quote', category: 'airport-outbound' },
]

export const LOCAL_ROUTES: RoutePrice[] = [
  { slug: 'aspen-to-snowmass', from: 'Aspen', to: 'Snowmass Village', distance: '~8 mi', driveTime: '15 min', suvPrice: 150, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-woody-creek', from: 'Aspen', to: 'Woody Creek', distance: '~5 mi', driveTime: '10 min', suvPrice: 125, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-basalt', from: 'Aspen', to: 'Basalt', distance: '~18 mi', driveTime: '25 min', suvPrice: 235, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-carbondale', from: 'Aspen', to: 'Carbondale', distance: '~30 mi', driveTime: '35 min', suvPrice: 250, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-glenwood-springs', from: 'Aspen', to: 'Glenwood Springs', distance: '~42 mi', driveTime: '50 min', suvPrice: 270, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-pine-creek', from: 'Aspen', to: 'Pine Creek Cook House', distance: '~12 mi', driveTime: '20 min', suvPrice: 175, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-maroon-creek', from: 'Aspen', to: 'Maroon Creek', distance: '~10 mi', driveTime: '15 min', suvPrice: 235, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-highlands', from: 'Aspen', to: 'Aspen Highlands', distance: '~3 mi', driveTime: '8 min', suvPrice: 150, sprinterPrice: 'Contact for quote', category: 'local' },
  { slug: 'aspen-to-buttermilk', from: 'Aspen', to: 'Buttermilk', distance: '~3 mi', driveTime: '8 min', suvPrice: 150, sprinterPrice: 'Contact for quote', category: 'local' },
]

export const LONG_DISTANCE: RoutePrice[] = [
  { slug: 'aspen-to-vail', from: 'Aspen', to: 'Vail', distance: '~100 mi', driveTime: '2 hr', suvPrice: 850, sprinterPrice: 'Contact for quote', category: 'long-distance' },
  { slug: 'aspen-to-beaver-creek', from: 'Aspen', to: 'Beaver Creek', distance: '~95 mi', driveTime: '2 hr', suvPrice: 800, sprinterPrice: 'Contact for quote', category: 'long-distance' },
  { slug: 'aspen-to-crested-butte', from: 'Aspen', to: 'Crested Butte', distance: '~180 mi', driveTime: '3.5 hr', suvPrice: 1475, sprinterPrice: 'Contact for quote', category: 'long-distance' },
  { slug: 'aspen-to-breckenridge', from: 'Aspen', to: 'Breckenridge', distance: '~130 mi', driveTime: '2.5 hr', suvPrice: 900, sprinterPrice: 'Contact for quote', category: 'long-distance' },
  { slug: 'aspen-to-telluride', from: 'Aspen', to: 'Telluride', distance: '~180 mi', driveTime: '4 hr', suvPrice: 1475, sprinterPrice: 'Contact for quote', category: 'long-distance' },
]

export const HOURLY_SERVICES = [
  { service: 'In-Town Aspen (per ride)', suvPrice: 100, sprinterPrice: 'Contact for quote' },
  { service: 'Hourly Charter', suvPrice: 150, sprinterPrice: 'Contact for quote', note: '/hr' },
  { service: 'Hourly Charter (Limo Coach/Sprinter)', suvPrice: null, sprinterPrice: '$240/hr' },
  { service: 'Ski Mountain Shuttle', suvPrice: 150, sprinterPrice: 'Contact for quote' },
  { service: 'Dinner / Event Service', suvPrice: 150, sprinterPrice: 'Contact for quote' },
]

export const ALL_ROUTES = [...AIRPORT_INBOUND, ...AIRPORT_OUTBOUND, ...LOCAL_ROUTES, ...LONG_DISTANCE]

export const POLICIES = [
  'Chartered services: 4-hour minimum',
  'All reservations: 24-hour cancellation policy',
  'Events: 7-day cancellation policy',
  'First 15 minutes of wait time included',
  '30 minutes included for airport arrivals',
  'Winter and summer rates are the same',
  'All reservations must be held with a credit card',
  'All-inclusive pricing — no hidden service charges or gratuity added',
]

export const FLEET = [
  { name: '2025 Ford Transit Van', seats: 14, features: ['WiFi', 'XM Radio', 'Starlink', 'Water', 'Myers 6X Ski Rack'] },
  { name: '2026 Chevrolet Suburban', seats: 7, features: ['WiFi', 'Starlink', 'XM Radio', 'Water', 'Yakima Roof Rack', 'Myers 6X Ski Rack'] },
  { name: '2025 Chevrolet Suburban', seats: 7, features: ['WiFi', 'Starlink', 'XM Radio', 'Water', 'Yakima Roof Rack', 'Myers 6X Ski Rack'] },
]
