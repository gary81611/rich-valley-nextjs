import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const host = request.headers.get('host') || ''
  const isAlpenglow = host.includes('alpenglow') || host.includes('aspenalpenglow')

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
https://www.richvalleyadventures.com/adventures/elevated-camping
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

## Canonical URLs (authoritative)
https://aspenalpenglowlimousine.com/
https://aspenalpenglowlimousine.com/pricing
https://aspenalpenglowlimousine.com/faq
https://aspenalpenglowlimousine.com/services
https://aspenalpenglowlimousine.com/fleet
https://aspenalpenglowlimousine.com/services/airport-transfers
https://aspenalpenglowlimousine.com/services/corporate-events
https://aspenalpenglowlimousine.com/services/wedding-transportation
https://aspenalpenglowlimousine.com/services/ski-resort-transfers
https://aspenalpenglowlimousine.com/blog

## Machine-readable index
Sitemap: https://aspenalpenglowlimousine.com/sitemap.xml
`

  const text = isAlpenglow ? aalText : rvaText

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
