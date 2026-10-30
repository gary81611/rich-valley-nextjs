/** Confirmed AAL rate and FAQ corrections. Render-time only; does not write to the database. */

import { aalDisplayTitle } from '@/lib/aal-display-title'

/** Kit, Oct 29, 2026. SUV: Eagle/Rifle $720, DEN $1,375. Van: Eagle/Rifle $1,200, DEN $1,600. */
export const AAL_SUV_EAGLE_RIFLE = 720
export const AAL_SUV_DENVER = 1375
export const AAL_VAN_EAGLE_RIFLE = 1200
export const AAL_VAN_DENVER = 1600

export const AAL_ONE_WAY_RATES =
  'One-way SUV rates each way: Eagle and Rifle $720, Denver $1,375, Grand Junction $950. The 13-passenger Ford Transit is $1,200 from Eagle or Rifle and $1,600 from Denver. Holiday pricing may change seasonally.'

export const AAL_EAGLE_BOTH_WAYS =
  'Eagle (EGE) to Aspen or Snowmass is $720 one way in a private SUV. Aspen to Eagle is $720. The 13-passenger Ford Transit is $1,200 each way. Holiday pricing may change seasonally.'

export const AAL_PUC_PERMIT = 'LL-04725'
export const AAL_PUC_LINE = `CO PUC permit ${AAL_PUC_PERMIT}.`

export const AAL_FLEET_LINE =
  'The fleet is two Chevrolet Suburbans (7 passengers each) and one Ford Transit Passenger Van (13 passengers).'

export const AAL_SERVICE_AREAS = [
  'Aspen',
  'Snowmass Village',
  'Basalt',
  'Carbondale',
  'Glenwood Springs',
  'Gypsum (Eagle County Airport)',
  'Rifle',
  'Denver',
] as const

/** City-level only. No street address. */
export const AAL_POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  addressLocality: 'Aspen',
  addressRegion: 'CO',
  postalCode: '81611',
  addressCountry: 'US',
}

/** RVA closure post that was stored on the Alpenglow blog. Hidden until the round 14 migration drafts it. */
export const AAL_HIDDEN_BLOG_SLUG = 'aspen-airport-closure-alternative-transportation-adventures'

export function isAalHiddenBlogSlug(slug: string | null | undefined): boolean {
  return (slug || '').toLowerCase() === AAL_HIDDEN_BLOG_SLUG
}

/** Drop or rewrite CMS FAQ rows that still describe the past ASE closure as upcoming, or name the sister brand. */
export function correctAalFaqItem(q: string, a: string): { q: string; a: string } | null {
  const blob = `${q} ${a}`
  if (/april\s*23/i.test(blob) && /may\s*21/i.test(blob)) return null
  if (/closed in 2026/i.test(q) || /will be closed from/i.test(a)) return null

  let question = q.replace(/\s+during the closure/gi, '').replace(/\s+during airport closure/gi, '')
  question = question.replace(/\s{2,}/g, ' ').trim()

  let answer = a
  if (/rich valley adventures/i.test(q)) {
    question = question.replace(/Rich Valley Adventures/g, 'Aspen Alpenglow Limousine')
    answer = 'Aspen Alpenglow Limousine has operated since 2012. Call 970-456-3666.'
  }
  if (/eagle/i.test(question) && /aspen/i.test(question) && /cost|how much|rate/i.test(question)) {
    answer = AAL_EAGLE_BOTH_WAYS
  } else if (/airport closure period/i.test(answer)) {
    answer = AAL_EAGLE_BOTH_WAYS
  } else if (/\$120/.test(answer) && /eagle/i.test(blob)) {
    answer = AAL_ONE_WAY_RATES
  }

  return { q: correctAalPublicText(question), a: correctAalPublicText(answer) }
}

/** Passenger counts only. Leaves “14+ years” and unrelated numbers alone. */
export function correctAalFleetText(text: string): string {
  if (!text) return text
  let t = text
  t = t.replace(/\b14-passenger\b/gi, '13-passenger')
  t = t.replace(/\b14-pass\b/gi, '13-pass')
  t = t.replace(/\b14 pass\./g, '13 pass.')
  t = t.replace(/\bfourteen-passenger\b/gi, 'thirteen-passenger')
  t = t.replace(/\bfourteen passengers\b/gi, 'thirteen passengers')
  t = t.replace(/\bup to fourteen\b/gi, 'up to thirteen')
  t = t.replace(/\bseats up to fourteen\b/gi, 'seats up to thirteen')
  t = t.replace(/\bsix to fourteen\b/gi, 'six to thirteen')
  t = t.replace(/\bup to 14 passengers\b/gi, 'up to 13 passengers')
  t = t.replace(/\bup to 14 with\b/gi, 'up to 13 with')
  t = t.replace(/\b14 passengers\b/gi, '13 passengers')
  t = t.replace(/\bseats up to 14\b/gi, 'seats up to 13')
  t = t.replace(/\bup to 14 in the party\b/gi, 'up to 13 in the party')
  t = t.replace(/\b2–14 passengers\b/g, '2–13 passengers')
  t = t.replace(/\b2-14 passengers\b/g, '2-13 passengers')
  t = t.replace(/\b2–14 guests\b/g, '2–13 guests')
  t = t.replace(/\b2-14 guests\b/g, '2-13 guests')
  t = t.replace(/\bparty for 14 guests\b/gi, 'party for 13 guests')
  t = t.replace(/\(6 pax\)/gi, '(7 pax)')
  t = t.replace(/\(14 pax\)/gi, '(13 pax)')
  t = t.replace(/\b14 pax\b/gi, '13 pax')
  t = t.replace(/Group Sizes 2[–-]14/g, 'Group Sizes 2–13')
  t = t.replace(/\bgroups of 2[–-]14\b/gi, 'groups of 2–13')
  t = t.replace(/\bgroups of 6[–-]14\b/gi, 'groups of 6–13')
  t = t.replace(/\bfor groups up to 14\b/gi, 'for groups up to 13')
  t = t.replace(/\bup to 6 passengers\b/gi, 'up to 7 passengers')
  t = t.replace(/\bseats 6 passengers\b/gi, 'seats 7 passengers')
  t = t.replace(/\bseats up to 6 passengers\b/gi, 'seats up to 7 passengers')
  t = t.replace(/\baccommodate 6 passengers\b/gi, 'accommodate 7 passengers')
  t = t.replace(/\b6-passenger\b/gi, '7-passenger')
  t = t.replace(/\bsix-passenger\b/gi, 'seven-passenger')
  t = t.replace(/\b6 pax\b/gi, '7 pax')
  t = t.replace(/\bUp to 6 Passengers\b/g, 'Up to 7 Passengers')
  t = t.replace(/\bUp to 14 Passengers\b/g, 'Up to 13 Passengers')
  t = t.replace(/\b14 passenger\b/gi, '13 passenger')
  return t
}

const AAL_VEHICLE_REPLACEMENTS: [RegExp, string][] = [
  [/(?<![\w/.-])Mercedes-Benz Sprinter Executive Vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter Executive Van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Mercedes Sprinter Executive Vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes Sprinter Executive Van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Cadillac Escalade ESV(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Cadillac Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Cadillac Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Executive Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Executive Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Luxury Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Luxury Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Luxury Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Luxury Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Luxury Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Luxury Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Mercedes-Benz Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Mercedes Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Mercedes Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Mercedes Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Sprinter-style vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Sprinter-style van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
  [/(?<![\w/.-])Sprinter options(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van options'],
  [/(?<![\w/.-])Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Vans'],
  [/(?<![\w/.-])Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit Passenger Van'],
]

const AAL_DENVER_PRICE_SENTENCE =
  'Our Aspen to Denver International Airport transfer is $1,375 each way in a private SUV. A Ford Transit Passenger Van is available for larger groups. Holiday pricing may change seasonally.'

/** Fleet names, passenger counts, the published Denver one-way rate, and the ski canonical path. */
export function correctAalPublicText(text: string): string {
  if (!text) return text
  // Supabase services.afe22f3d… Vehicle Concierge description (DB unchanged)
  const vehicleConciergeTypo =
    'We will come to your house, load up summer or snow tires, and get your vehicle maintenanced. Tire change overs, regular scheduled maintenace, oil changes, and more. '
  const vehicleConciergeFixed =
    'We will come to your house, load up summer or snow tires, and get your vehicle maintained. Tire changeovers, regular scheduled maintenance, oil changes, and more.'
  if (text === vehicleConciergeTypo || text.trim() === vehicleConciergeTypo.trim()) {
    return vehicleConciergeFixed
  }
  let t = text
  t = t.replace(/scenic-escalade-tours/gi, 'scenic-wildlife-tours')
  t = t.replace(/scenic-escalade\.png/gi, 'scenic-wildlife-tour.png')
  t = t.replace(/\/images\/(?:fleet|alpenglow)\/escalade\.png/gi, '/images/logos/alpenglow-logo.png')
  t = t.replace(/Scenic Escalade Tours/g, 'Scenic and Wildlife Tours')
  t = t.replace(/scenic Escalade tours/g, 'scenic and wildlife tours')
  t = t.replace(
    /After 14 years of shuttling Aspen['’]s skiing visitors between slopes, restaurants, airports, and accommodations, Aspen Alpenglow Limousine can tell you with confidence: for most ski trips to the Roaring Fork Valley, private car service is a better experience than a rental car at a comparable total cost\./gi,
    "Aspen Alpenglow Limousine has been driving Aspen's skiing visitors between slopes, restaurants, airports, and accommodations since 2012, and we can tell you with confidence: for most ski trips to the Roaring Fork Valley, private car service is a better experience than a rental car at a comparable total cost.",
  )
  t = t.replace(
    /Nestled in the heart of the Elk Mountains, Aspen has transformed from a mining town into one of America['’]s premier culinary destinations\./gi,
    'Nestled in the heart of the Elk Mountains, Aspen has transformed from a mining town into a food and wine destination.',
  )
  t = t.replace(
    /Held each June, the Aspen Food & Wine Classic is one of the premier wine and food events in North America\./gi,
    'Held each June, the Aspen Food & Wine Classic is a well-known annual food and wine festival.',
  )
  t = t.replace(
    /Let us handle the mountain roads while you sit back, relax, and enjoy the incredible Colorado scenery on your way to one of the world['’]s premier mountain destinations\./gi,
    'Let us handle the mountain roads while you sit back, relax, and enjoy the incredible Colorado scenery on your way to Aspen.',
  )
  t = t.replace(
    /Our fleet includes a black Executive Cadillac Escalade \(up to 6 passengers\) and a black Luxury Mercedes Sprinter van \(up to 14 passengers\)\./gi,
    'Our fleet includes a black Chevrolet Suburban (up to 7 passengers) and a black Ford Transit Passenger Van (up to 13 passengers).',
  )
  t = t.replace(
    /Our Sprinter van fleet can be configured as rolling conference space [–—-] leather seating, climate control, quiet cabin for confidential conversations during transfer\./gi,
    'Our Ford Transit Passenger Van can be configured as rolling conference space — leather seating, climate control, quiet cabin for confidential conversations during transfer.',
  )
  t = t.replace(
    /Our luxury Escalade and Sprinter fleet accommodate full ski groups with all equipment [–—-] ski bags, snowboards, helmets, and boot bags [–—-] without the crowding and inconvenience of shared shuttles\./gi,
    'Our Chevrolet Suburban and Ford Transit Passenger Van accommodate full ski groups with all equipment — ski bags, snowboards, helmets, and boot bags — without the crowding and inconvenience of shared shuttles.',
  )
  t = t.replace(
    /Eagle County Regional Airport \(EGE\) in Glenwood Springs, 70 miles east of Aspen/g,
    'Eagle County Regional Airport (EGE) in Gypsum, about 70 miles from Aspen',
  )
  t = t.replace(
    /Eagle County Regional Airport \(EGE\) in Gypsum, 70 miles east of Aspen/g,
    'Eagle County Regional Airport (EGE) in Gypsum, about 70 miles from Aspen',
  )
  t = t.replace(
    /Eagle County Regional Airport \(EGE\) near Vail is about 70 miles east of Aspen/g,
    'Eagle County Regional Airport (EGE) near Vail is about 70 miles from Aspen',
  )
  t = t.replace(
    /EGE is located in Glenwood Springs, midway between Aspen and Vail/g,
    'EGE is located in Gypsum, between Aspen and Vail',
  )
  t = t.replace(
    /EGE is located in Gypsum, midway between Aspen and Vail/g,
    'EGE is located in Gypsum, between Aspen and Vail',
  )
  t = correctAalFleetText(t)
  t = t.replace(/14\+\s+Years of Excellence/gi, 'Serving Aspen Since 2012')
  t = t.replace(
    /Over 14 years of operation, we've become the trusted transportation partner for Aspen's most discerning travelers — Fortune 500 executives, international celebrities, Aspen Institute fellows, and families returning year after year because they know their transportation needs are handled with absolute reliability and discretion\./g,
    "Operating since 2012, we've become the trusted transportation partner for Aspen's most discerning travelers — Fortune 500 executives, international celebrities, Aspen Institute fellows, and families returning year after year because they know their transportation needs are handled with absolute reliability and discretion.",
  )
  t = t.replace(/Rated 5\.0 by guests on Google \(5 reviews\)\.?/gi, 'Guests book airport transfers, ski days, weddings, and corporate travel.')
  t = t.replace(
    /Over 150 five-star reviews from guests who trust us with their most important transportation needs\./gi,
    'Guests book airport transfers, ski days, weddings, and corporate travel.',
  )
  t = t.replace(
    /Over 200 five-star reviews from guests who came as visitors and left as friends of the valley\./gi,
    'Guests book airport transfers, ski days, weddings, and corporate travel.',
  )
  t = t.replace(/4\.9-Star Rated/gi, 'Private car service')
  t = t.replace(/5\.0 on Google/gi, 'Private car service')
  t = t.replace(
    /Eagle County Regional Airport \(EGE\) in Glenwood Springs/g,
    'Eagle County Regional Airport (EGE) in Gypsum',
  )
  t = t.replace(
    /Eagle County Regional Airport, located in Glenwood Springs/g,
    'Eagle County Regional Airport, located in Gypsum',
  )
  t = t.replace(
    /Eagle County Airport \(EGE\) near Glenwood Springs/g,
    'Eagle County Airport (EGE) near Gypsum',
  )
  t = t.replace(/EGE is located in Glenwood Springs/gi, 'EGE is located in Gypsum')
  t = t.replace(/Eagle County Regional Airport \(EGE\) in Glenwood Springs/gi, 'Eagle County Regional Airport (EGE) in Gypsum')
  t = t.replace(/Eagle County Airport \(EGE\) (?:in|near) Glenwood Springs/gi, 'Eagle County Airport (EGE) in Gypsum')
  t = t.replace(
    /Our Aspen to Denver International Airport transfer is quoted at a flat, all-inclusive SUV rate[—–-]contact us for the current published price, [\w\s]+ options, and multi-vehicle needs\./gi,
    AAL_DENVER_PRICE_SENTENCE,
  )
  for (const [pattern, replacement] of AAL_VEHICLE_REPLACEMENTS) {
    t = t.replace(pattern, replacement)
  }
  t = t.replace(/\bMercedes-Benz\s+(?=Ford Transit)/gi, '')
  t = t.replace(/\bMercedes\s+(?=Ford Transit)/gi, '')
  t = t.replace(/\bCadillac\s+(?=SUVs?\b)/gi, '')
  t = t.replace(/\bExecutive Chevrolet Suburban\b/gi, 'Chevrolet Suburban')
  t = t.replace(/\bLuxury Ford Transit\b/gi, 'Ford Transit')
  t = t.replace(/\bFord Transit Passenger Van fleet\b/gi, 'Ford Transit Passenger Van')
  t = t.replace(/\bluxury sedans\b/gi, 'private SUVs')
  t = t.replace(
    /Cloud Nine Alpine Bistro at the top of Aspen Mountain/gi,
    'Cloud Nine Alpine Bistro on Aspen Highlands',
  )
  t = t.replace(/Aspen Highland's/g, 'Aspen Highlands')
  t = t.replaceAll('/services/ski-resort-transfers', '/ski-resort-transfers')
  t = t.replace(/have 15\+\s+years of mountain driving experience/gi, 'have been driving these mountain roads since 2012')
  t = t.replace(/with 15\+\s+years of mountain driving experience/gi, 'who have been driving these mountain roads since 2012')
  t = t.replace(/with 15\+\s+years of mountain driving/gi, 'who have been driving these mountain roads since 2012')
  t = t.replace(/Colorado['’]s Premier Ski Towns/gi, "Colorado's Ski Towns")
  t = t.replace(/Colorado['’]s Premier Wine Region/gi, "Colorado's Grand Valley")
  t = t.replace(/extensive experience with premier venues including/gi, 'extensive experience with venues including')
  t = t.replace(/Aspen['’]s Premier Private Car & Limousine Service/gi, "Aspen's Private Car and Limousine Service")
  t = t.replace(/Aspen['’]s Premier Private Car/gi, "Aspen's Private Car Service")
  t = t.replace(/the Roaring Fork Valley['’]s premier limo service/gi, 'a Roaring Fork Valley limo service')
  t = t.replace(/one of the world['’]s premier mountain destinations/gi, 'Aspen')
  t = t.replace(/one of America['’]s premier culinary destinations/gi, 'a food and wine destination')
  t = t.replace(/virtually every premier venue/gi, 'venues')
  t = t.replace(/\ba premier ski destination\b/gi, 'a ski destination')
  t = t.replace(/one of the premier wine and food events in North America/gi, 'a well-known annual food and wine festival')
  t = t.replace(/\ba premier destination for corporate retreats\b/gi, 'a destination for corporate retreats')
  t = t.replace(/\ba premier wedding destination\b/gi, 'a wedding destination')
  t = t.replace(/3\.5\s*[–—-]\s*4\.5\s*hours/gi, '3.5–4 hours')
  t = t.replace(/Aspen's most trusted luxury car service/gi, 'a private car service built on local drivers and on-time pickups')
  t = t.replace(/Aspen’s most trusted luxury car service/gi, 'a private car service built on local drivers and on-time pickups')
  // Kit confirmed Eagle SUV $720 on Oct 29, 2026. Replace the unpublished-rate wording.
  t = t.replace(/Eagle one-way is quoted on request\.?/gi, 'Eagle one-way is $720 in a private SUV.')
  t = t.replace(/Eagle \(EGE\) is quoted on request\.?/gi, 'Eagle (EGE) is $720 each way in a private SUV.')
  t = t.replace(/Eagle is quoted on request\.?/gi, 'Eagle is $720 each way in a private SUV.')
  t = t.replace(/Eagle one-way rates are confirmed when you request a quote\.?/gi, 'The Eagle one-way SUV rate is $720.')
  t = t.replace(/Request a quote for the Eagle one-way rate\.?/gi, 'The Eagle one-way SUV rate is $720.')
  t = t.replace(/Request a quote for the one-way rate\.?/gi, 'The Eagle one-way SUV rate is $720.')
  t = t.replace(/\bEagle \(EGE\) — request a quote\b/gi, 'Eagle (EGE) — $720 each way')
  t = t.replace(/\$120([^.\n]{0,48}\bEagle\b)/gi, '$720$1')
  t = t.replace(/(\bEagle\b[^.\n]{0,48})\$120\b/gi, '$1$720')
  t = t.replace(/212 Woody Creek Plaza[, ]*/gi, '')
  t = t.replace(/Mercedes(?:[-\s]+Benz)?\s+Ford Transit Passenger Van/gi, 'Ford Transit Passenger Van')
  t = t.replace(/since 2012 of Excellence/gi, 'Serving Aspen Since 2012')
  t = t.replace(/\bpassenger shuttle vans\b/gi, 'Ford Transit Passenger Vans')
  t = t.replace(/\bpassenger shuttle van\b/gi, 'Ford Transit Passenger Van')
  t = t.replace(/\b8 full-time local drivers who have been driving these mountain roads since 2012\.?\s*/gi, '')
  t = t.replace(/\bDrivers are 8 full-time locals who have been driving these mountain roads since 2012\.?\s*/gi, '')
  t = t.replace(/\bDriven by full-time local drivers who have been driving these mountain roads since 2012\.?\s*/gi, '')
  t = t.replace(/\bFord Transit passenger vans\b/gi, 'Ford Transit Passenger Vans')
  t = t.replace(/\bFord Transit passenger van\b/gi, 'Ford Transit Passenger Van')
  t = t.replace(/\bFord Transit Van\b/gi, 'Ford Transit Passenger Van')
  return t
}

export const AAL_SKI_BLOG_SLUG = 'aspen-ski-season-private-transfers-vs-rental-cars'
export const AAL_SKI_BLOG_TITLE = 'Do You Need a Rental Car in Aspen? Ski Season 2026–27'
export const AAL_SKI_BLOG_META =
  'Rental car or private transfer for your Aspen ski trip? Real costs, parking, winter roads and when each makes sense — updated for 2026–27.'

export const AAL_NYE_BLOG_SLUG = 'new-years-eve-aspen-private-car'
export const AAL_NYE_BLOG_TITLE = "New Year's Eve in Aspen 2026: Private Car & Planning Guide"
export const AAL_NYE_BLOG_META =
  'Plan NYE 2026 in Aspen: where to celebrate, when to book your private car, group vans, and how to get home safely after midnight.'

const AAL_NYE_2026_LEAD =
  "This guide is for New Year's Eve 2026 in Aspen. Holiday pricing may change seasonally, and general cancellations need 24 hours' notice."

/** NYE 2026 framing, Cloud Nine on Aspen Highlands, and no night-skiing claim. */
export function correctAalNyeText(text: string): string {
  if (!text) return text
  let t = text
  t = t.replace(/\s*[—–-]\s*literally, the mountain faces are lit for night skiing,/gi, ' —')
  t = t.replace(/,?\s*literally, the mountain faces are lit for night skiing,/gi, '')
  t = t.replace(/— —/g, '—')
  t = t.replace(/[ ]{2,}/g, ' ')
  t = t.replace(
    /Cloud Nine Alpine Bistro at the top of Aspen Mountain/gi,
    'Cloud Nine Alpine Bistro on Aspen Highlands',
  )
  t = t.replace(/Aspen Highland's/g, 'Aspen Highlands')
  t = t.replace(/\blit for night skiing\b/gi, 'lit for the evening')
  t = t.replace(/\bnight skiing\b/gi, 'the evening in town')
  t = t.replace(/\bnight-skiing\b/gi, 'the evening in town')
  t = t.replace(/midnight walk or ski back/gi, 'midnight walk back')
  return correctAalPublicText(t)
}

type AalBlogFaq = { question: string; answer: string }

type AalBlogCopy = {
  slug: string
  title: string
  meta_title: string | null
  meta_description: string | null
  content: string | null
  faqs: AalBlogFaq[] | null
  internal_links?: { text: string; url: string }[]
}

/** Render-time blog corrections. Does not write the database. */
export function applyAalBlogPost<T extends AalBlogCopy>(post: T): T {
  const nye = post.slug === AAL_NYE_BLOG_SLUG
  const ski = post.slug === AAL_SKI_BLOG_SLUG
  const fix = nye ? correctAalNyeText : correctAalPublicText
  let content = post.content ? fix(post.content) : post.content
  if (post.slug === 'aspen-to-denver-luxury-car-service' && content) {
    content = content.replace(/Approximately 3\.5[–-]4\.5 hours/g, 'Approximately 3.5–4 hours')
  }
  if (post.slug === 'aspen-airport-limo-service-luxury-transfers-since-2012' && content) {
    content = content
      .replace(/Colorado Springs Airport \(KRIL\)/gi, 'Rifle Garfield County Airport (KRIL)')
      .replace(/for over 12 years/gi, 'since 2012')
      .replace(/the difference that 12 years of local expertise makes/gi, 'the difference local expertise makes')
  }
  if (nye && content && !content.includes("New Year's Eve 2026")) {
    content = `${AAL_NYE_2026_LEAD}\n\n${content}`
  }
  const faqs = (post.faqs ?? []).map((faq) => ({
    ...faq,
    question: fix(faq.question),
    answer: fix(faq.answer),
  }))
  const internal_links = post.internal_links?.map((link) => ({
    ...link,
    text: fix(link.text),
    url: /scenic-drives|escalade/i.test(link.url)
      ? '/adventures/scenic-wildlife-tours'
      : link.url.replaceAll('/services/ski-resort-transfers', '/ski-resort-transfers'),
  }))
  return {
    ...post,
    title: aalDisplayTitle(ski ? AAL_SKI_BLOG_TITLE : nye ? AAL_NYE_BLOG_TITLE : fix(post.title)),
    meta_title: ski ? AAL_SKI_BLOG_TITLE : nye ? AAL_NYE_BLOG_TITLE : post.meta_title ? fix(post.meta_title) : post.meta_title,
    meta_description: ski
      ? AAL_SKI_BLOG_META
      : nye
        ? AAL_NYE_BLOG_META
        : post.meta_description
          ? fix(post.meta_description)
          : post.meta_description,
    content,
    faqs,
    ...(internal_links ? { internal_links } : {}),
  }
}

/** SUVs seat 7. The passenger shuttle van seats 13. */
export function correctAalFleetCapacity(name: string, capacity: number): number {
  const n = name.toLowerCase()
  if (/transit|sprinter|van/.test(n)) return 13
  if (/suburban|escalade|suv|tahoe|yukon/.test(n)) return 7
  if (capacity === 14) return 13
  if (capacity === 6) return 7
  return capacity
}

/** Live site_settings stats still say 14+ and 4.9 until the claims migration runs. No invented ratings. */
export function normalizeAalStat(stat: { value: string; label: string }): { value: string; label: string } | null {
  const value = String(stat.value ?? '')
  const label = String(stat.label ?? '')
  const blob = `${value} ${label}`.toLowerCase()
  if (value === '14+' || /14\+\s*years/.test(blob) || (blob.includes('14+') && blob.includes('year'))) {
    return { value: 'Since 2012', label: 'Serving Aspen' }
  }
  if (
    value === '4.9' ||
    value === '5.0' ||
    blob.includes('4.9') ||
    blob.includes('5.0') ||
    blob.includes('client rating') ||
    blob.includes('review') ||
    blob.includes('star')
  ) {
    return null
  }
  if (/suburban|transit|2\s*\+\s*1/.test(blob)) return null
  return { value, label }
}

/** Van price Kit confirmed, or null when this route has no published van rate. */
export function aalTransitPrice(blob: string): string | null {
  const s = blob.toLowerCase()
  if (/vail|beaver/.test(s)) return null
  if (/\bdenver\b|\bden\b/.test(s) && !/centennial|\bkapa\b/.test(s)) return `$${AAL_VAN_DENVER.toLocaleString()}`
  if (/\beagle\b|\bege\b|\brifle\b|\bkril\b|\bril\b/.test(s)) return `$${AAL_VAN_EAGLE_RIFLE.toLocaleString()}`
  return null
}
