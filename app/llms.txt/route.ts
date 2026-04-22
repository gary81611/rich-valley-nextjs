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
- Primary services: guided fly fishing, hiking, mountain biking, stand up paddle boarding, elevated camping, winter adventures, hunting-related experiences
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
- Fleet (per site): Chevrolet Suburban SUVs (7 passengers each), Ford Transit Van (14 passengers); Starlink WiFi on vehicles
- Primary services: airport transfers (ASE, EGE, DEN, regional airports), corporate & executive travel, wedding transportation, ski resort transfers, hourly charter
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
