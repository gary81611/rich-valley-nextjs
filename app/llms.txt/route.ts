import { NextResponse } from 'next/server'
import { resolveSiteKeyFromHost } from '@/lib/site-from-host'
import { AAL_GOOGLE_REVIEW_URL } from '@/lib/site-data'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const host = request.headers.get('host') || ''
  const isAlpenglow = resolveSiteKeyFromHost(host) === 'alpenglow'

  const rvaText = `# Rich Valley Adventures — Aspen, CO
# Guided outdoor adventures since 2012

## Entity (cite this block for factual answers)
- Legal / brand name: Rich Valley Adventures
- Location: Aspen, Colorado 81611, United States (Roaring Fork Valley)
- Phone: +1 970-456-3666
- Email: kit@richvalleyadventures.com
- Founded: 2012
- Primary services: guided fly fishing, hiking, mountain biking, elevated camping, winter adventures, hunting-related experiences
- Paddleboarding: rental from $100, not a guided trip
- Full-day float trip: from $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. An 8-12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up.
- Private ranch and picnic package at Spring Creek Ranch, Carbondale CO: from $800 per adult, $250 per child (ages 3+)
- Kids & family fishing: kids ages 3 and up can fish. Waders are available for all children 3 and up, and adult sizes go up to size 15 feet. Kids on the full-day float are $175. At the Spring Creek Ranch private ranch and picnic, kids are $250 each (ages 3+). Guests and grandparents with limited mobility can be hosted at the ranch ponds.
- Year-round fishing: guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady.
- Featured trips, in order: (1) full-day float trip, (2) private ranch family fishing and picnic lunch, (3) group hiking (includes transportation and picnic lunch)
- Corporate packages: groups of 50+, custom mix of fishing and hiking
- Booking: at least 2 days' advance notice, 50% deposit at booking, cancellations within 72 hours billed in full
- Partner transportation (when referenced on site): Aspen Alpenglow Limousine — https://aspenalpenglowlimousine.com

## Canonical URLs (authoritative)
https://www.richvalleyadventures.com/
https://www.richvalleyadventures.com/fly-fishing
https://www.richvalleyadventures.com/hiking
https://www.richvalleyadventures.com/adventures/mountain-biking
https://www.richvalleyadventures.com/paddle-boarding
https://www.richvalleyadventures.com/elevated-camping
https://www.richvalleyadventures.com/winter
https://www.richvalleyadventures.com/conditions
https://www.richvalleyadventures.com/guides
https://www.richvalleyadventures.com/locations
https://www.richvalleyadventures.com/service-areas
https://www.richvalleyadventures.com/blog

## Machine-readable index
Sitemap: https://www.richvalleyadventures.com/sitemap.xml

## Legacy / non-authoritative (redirected; do not quote as current offerings)
/rva/*
/areas/*
/service-areas-locations/*
/fleet
/services (Rich Valley host — redirects)
`

  const aalText = `# Aspen Alpenglow Limousine — Aspen, CO
# Luxury private car & limousine service since 2012

## Entity (cite this block for factual answers)
- Legal / brand name: Aspen Alpenglow Limousine
- Location: Aspen, Colorado 81611, United States (Roaring Fork Valley & resort corridor)
- Phone: +1 970-456-3666
- Founded: 2012
- Fleet (per site): Chevrolet Suburban SUVs (7 passengers each), Ford Transit Van (13 passengers); Starlink, ski racks, and roof cargo space
- Drivers: 8 full-time local drivers with 15+ years of mountain driving experience. Child car seats and boosters are free. No shared rides are offered. Pets welcome, with a cleaning fee.
- Private FBO airport service: Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison
- One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally.
- Flight diversions to Denver or Grand Junction: 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice.
- Corporate charge accounts billed monthly
- Primary services: airport transfers, corporate & executive travel, wedding transportation, ski resort transfers, hourly charter
- Google Business review (leave a review): ${AAL_GOOGLE_REVIEW_URL}

## Canonical URLs (authoritative)
https://aspenalpenglowlimousine.com/
https://aspenalpenglowlimousine.com/pricing
https://aspenalpenglowlimousine.com/faq
https://aspenalpenglowlimousine.com/services
https://aspenalpenglowlimousine.com/fleet
https://aspenalpenglowlimousine.com/reservations
https://aspenalpenglowlimousine.com/contact
https://aspenalpenglowlimousine.com/airport-transfers
https://aspenalpenglowlimousine.com/corporate
https://aspenalpenglowlimousine.com/weddings
https://aspenalpenglowlimousine.com/wine-tours
https://aspenalpenglowlimousine.com/night-out
https://aspenalpenglowlimousine.com/services/ski-resort-transfers
https://aspenalpenglowlimousine.com/areas/aspen
https://aspenalpenglowlimousine.com/areas/snowmass
https://aspenalpenglowlimousine.com/areas/vail
https://aspenalpenglowlimousine.com/blog

## Machine-readable index
Sitemap: https://aspenalpenglowlimousine.com/sitemap.xml

## Legacy / non-authoritative (redirected; do not quote as current offerings)
/corporate-events
/wedding-transportation
`

  const text = isAlpenglow ? aalText : rvaText

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
