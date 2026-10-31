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
- Licenses: CO Licensed Outfitter OUT.0003060. CO River License 620.
- Guides run fishing, hiking, rafting, and camping in-house. Horseback riding, ATV, and snowmobile trips go through local partner outfitters. Outfitters are not named.
- Primary services: guided fly fishing, hiking, mountain biking, elevated camping, winter adventures, horseback riding, scenic and wildlife tours, scenic river rafting
- Paddleboarding: rental from $100, not a guided trip. Boards can be delivered to you. No delivery hours, areas, or fees are published.
- Horseback riding: $600. Arranged with a local partner outfitter. https://www.richvalleyadventures.com/adventures/horseback-riding
- Half-day scenic and wildlife tour: $750. https://www.richvalleyadventures.com/adventures/scenic-wildlife-tours
- Scenic river rafting with picnic: $1,200. Rafting is guided in-house.
- Half-day hike: $600. https://www.richvalleyadventures.com/hiking
- Half-day snowshoe: $500. Snowshoeing is guided in-house.
- Overnight camping: $1,500. Camping is guided in-house. https://www.richvalleyadventures.com/elevated-camping
- Winter, November through April: https://www.richvalleyadventures.com/winter . Confirmed winter offering: half-day snowshoe ($500). Half-day is 3–4 hours door-to-door with snacks and drinks. Groups are 1–12. All gear is provided. Transportation on winter trips is by Aspen Alpenglow Limousine.
- Snowshoeing season on the winter page: December 15 – February 25.
- Snowshoeing page: https://www.richvalleyadventures.com/snowshoeing . Guided tours December through March. All snowshoes, poles, and safety equipment are provided. Routes include Ashcroft. Suitable for all ages; kids as young as 5 can participate on appropriate terrain.
- Full-day float trip: from $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. An 8-12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up.
- Private ranch and picnic package at Spring Creek Ranch, Carbondale CO: from $800 per adult, $250 per child (ages 3+). Page: https://www.richvalleyadventures.com/private-ranch-fishing
- Kids & family fishing: kids ages 3 and up can fish. Waders are provided for kids 3 and up, and adult waders and boots go up to men's size 15. Guests and grandparents with limited mobility can be hosted at the ranch ponds.
- Year-round fishing: guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady.
- Featured trips, in order: (1) Fly Fishing — half-day and full-day wading trips, and a full-day float from $1,400 for 2 people (1 boat, 1 captain), (2) private ranch family fishing and picnic lunch, (3) Trail Hiking
- Corporate packages: groups of 50+, custom mix of fishing and hiking
- Booking: at least 2 days' advance notice, 50% deposit at booking, cancellations within 72 hours billed in full
- Partner transportation (when referenced on site): Aspen Alpenglow Limousine — https://aspenalpenglowlimousine.com

## Canonical URLs (authoritative)
https://www.richvalleyadventures.com/
https://www.richvalleyadventures.com/fly-fishing
https://www.richvalleyadventures.com/private-ranch-fishing
https://www.richvalleyadventures.com/hiking
https://www.richvalleyadventures.com/adventures/mountain-biking
https://www.richvalleyadventures.com/paddle-boarding
https://www.richvalleyadventures.com/adventures/horseback-riding
https://www.richvalleyadventures.com/adventures/scenic-wildlife-tours
https://www.richvalleyadventures.com/elevated-camping
https://www.richvalleyadventures.com/winter
https://www.richvalleyadventures.com/snowshoeing
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
- Phone: +1 970-315-6111
- Founded: 2012
- Fleet: exactly two Chevrolet Suburbans (7 passengers each) and one Ford Transit Passenger Van (13 passengers). Starlink, ski racks, and roof cargo space
- No public street address. Service areas include Aspen, Snowmass Village, Basalt, Carbondale, Glenwood Springs, Gypsum (Eagle County Airport), Rifle, and Denver
- Eagle County Regional Airport (EGE) is in Gypsum, not Glenwood Springs
- Child car seats and boosters are free. No shared rides are offered. Pets welcome, with a cleaning fee.
- Private FBO airport service: Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison
- One-way SUV rates each way: Eagle and Rifle $720, Denver $1,375, Grand Junction $950. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally.
- ASE airport SUV rates on the pricing page include $210. Centennial Airport (KAPA), Telluride, and Crested Butte are $1,475 on that page.
- Flight diversions to Denver or Grand Junction: 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice.
- Corporate charge accounts billed monthly
- Primary services: airport transfers, corporate & executive travel, wedding transportation, ski resort transfers, hourly charter
- X Games Aspen 2027: January 29–31, 2027 at Buttermilk Mountain. Source: https://www.xgames.com/events/aspen-2027/
- ASE closure: Sunday, April 4, 2027 at 11:00 p.m. through Friday, November 19, 2027 at 7:00 p.m. No commercial or general aviation operations. Existing terminal remains in use after reopening until the new terminal is completed (projected 2029). Source: https://www.aspenairport.com/closure/ (press release May 28, 2026). Check aspenairport.com for updates.
- Cloud Nine Alpine Bistro is on Aspen Highlands.
- Google Business review (leave a review): ${AAL_GOOGLE_REVIEW_URL}
- Colorado PUC permit: LL-04725
- Last updated: 2026-10-30

## Canonical URLs (authoritative)
https://aspenalpenglowlimousine.com/
https://aspenalpenglowlimousine.com/pricing
https://aspenalpenglowlimousine.com/faq
https://aspenalpenglowlimousine.com/services
https://aspenalpenglowlimousine.com/fleet
https://aspenalpenglowlimousine.com/reservations
https://aspenalpenglowlimousine.com/contact
https://aspenalpenglowlimousine.com/airport-transfers
https://aspenalpenglowlimousine.com/airport-transfers/eagle-ege-to-aspen
https://aspenalpenglowlimousine.com/airport-transfers/denver-den-to-aspen
https://aspenalpenglowlimousine.com/airport-transfers/aspen-to-eagle-ege
https://aspenalpenglowlimousine.com/airport-transfers/aspen-to-denver-den
https://aspenalpenglowlimousine.com/aspen-airport-closure-2027
https://aspenalpenglowlimousine.com/corporate
https://aspenalpenglowlimousine.com/weddings
https://aspenalpenglowlimousine.com/wine-tours
https://aspenalpenglowlimousine.com/night-out
https://aspenalpenglowlimousine.com/ski-resort-transfers
https://aspenalpenglowlimousine.com/events/x-games-aspen-transportation
https://aspenalpenglowlimousine.com/events/new-years-eve-aspen
https://aspenalpenglowlimousine.com/seasonal/holiday-private-car-aspen
https://aspenalpenglowlimousine.com/services/hourly-charter
https://aspenalpenglowlimousine.com/service-areas/aspen
https://aspenalpenglowlimousine.com/service-areas/snowmass-village
https://aspenalpenglowlimousine.com/service-areas/eagle-vail
https://aspenalpenglowlimousine.com/service-areas/basalt
https://aspenalpenglowlimousine.com/service-areas/carbondale
https://aspenalpenglowlimousine.com/service-areas/glenwood-springs
https://aspenalpenglowlimousine.com/service-areas/denver
https://aspenalpenglowlimousine.com/service-areas/rifle
https://aspenalpenglowlimousine.com/service-areas/grand-junction
https://aspenalpenglowlimousine.com/blog

## Machine-readable index
Sitemap: https://aspenalpenglowlimousine.com/sitemap.xml

## Legacy / non-authoritative (redirected; do not quote as current offerings)
/corporate-events
/wedding-transportation
/services/ski-resort-transfers
`

  const text = isAlpenglow ? aalText : rvaText

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
