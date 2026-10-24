/** Confirmed AAL rate and FAQ corrections. Render-time only; does not write to the database. */

import { aalDisplayTitle } from '@/lib/aal-display-title'

export const AAL_ONE_WAY_RATES =
  'One-way rates each way: Denver $1,375, Grand Junction $950, Rifle $720. Eagle one-way is quoted on request. Holiday pricing may change seasonally.'

export const AAL_EAGLE_BOTH_WAYS =
  'Eagle one-way rates are confirmed when you request a quote. Holiday pricing may change seasonally.'

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
  t = t.replace(/\bup to 6 passengers\b/gi, 'up to 7 passengers')
  t = t.replace(/\bseats 6 passengers\b/gi, 'seats 7 passengers')
  t = t.replace(/\bseats up to 6 passengers\b/gi, 'seats up to 7 passengers')
  t = t.replace(/\baccommodate 6 passengers\b/gi, 'accommodate 7 passengers')
  t = t.replace(/\bUp to 6 Passengers\b/g, 'Up to 7 Passengers')
  t = t.replace(/\bUp to 14 Passengers\b/g, 'Up to 13 Passengers')
  t = t.replace(/\b14 passenger\b/gi, '13 passenger')
  return t
}

const AAL_VEHICLE_REPLACEMENTS: [RegExp, string][] = [
  [/(?<![\w/.-])Mercedes-Benz Sprinter Executive Vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter Executive Van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Mercedes Sprinter Executive Vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes Sprinter Executive Van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Cadillac Escalade ESV(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Cadillac Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Cadillac Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Executive Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Executive Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Luxury Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Luxury Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Luxury Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Luxury Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Luxury Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Luxury Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Mercedes-Benz Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes-Benz Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Mercedes Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Mercedes Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Mercedes Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Sprinter-style vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Sprinter-style van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Sprinter vans(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Sprinter van(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
  [/(?<![\w/.-])Sprinter options(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van options'],
  [/(?<![\w/.-])Escalades(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUVs'],
  [/(?<![\w/.-])Escalade(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'SUV'],
  [/(?<![\w/.-])Sprinters(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger vans'],
  [/(?<![\w/.-])Sprinter(?![\w/-])(?!\.(?:png|jpe?g|webp|svg|gif))/gi, 'Ford Transit passenger van'],
]

const AAL_DENVER_PRICE_SENTENCE =
  'Our Aspen to Denver International Airport transfer is $1,375 each way in a private SUV. A Ford Transit passenger van is available for larger groups. Holiday pricing may change seasonally.'

/** Fleet names, passenger counts, the published Denver one-way rate, and the ski canonical path. */
export function correctAalPublicText(text: string): string {
  if (!text) return text
  let t = correctAalFleetText(text)
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
  t = t.replace(/\bluxury sedans\b/gi, 'private SUVs')
  t = t.replace(
    /Cloud Nine Alpine Bistro at the top of Aspen Mountain/gi,
    'Cloud Nine Alpine Bistro on Aspen Highlands',
  )
  t = t.replace(/Aspen Highland's/g, 'Aspen Highlands')
  t = t.replaceAll('/services/ski-resort-transfers', '/ski-resort-transfers')
  t = t.replace(/After 14 years of shuttling/g, 'Since 2012, driving')
  t = t.replace(/\b14\+\s+years\b/gi, 'since 2012')
  t = t.replace(/\bover 14 years\b/gi, 'since 2012')
  t = t.replace(/Aspen's most trusted luxury car service/gi, 'a private car service built on local drivers and on-time pickups')
  t = t.replace(/Aspen’s most trusted luxury car service/gi, 'a private car service built on local drivers and on-time pickups')
  // Eagle $120 and $720 are both unpublished until Kit confirms one rate. Rifle $720 stays.
  t = t.replace(/One-way Aspen to Eagle is \$720\. Eagle to Aspen is \$720\./gi, AAL_EAGLE_BOTH_WAYS)
  t = t.replace(/Eagle \(EGE\) to Aspen or Snowmass is \$720 one way\. Aspen to Eagle is \$720\./gi, AAL_EAGLE_BOTH_WAYS)
  t = t.replace(/\bEagle \(EGE\) — \$720 each way\b/g, 'Eagle (EGE) — request a quote')
  t = t.replace(/\bEagle \(EGE\) \$720\b/g, 'Eagle (EGE), quoted on request')
  t = t.replace(/\bEagle \$720\b/g, 'Eagle, quoted on request')
  t = t.replace(/\$120([^.\n]{0,40}\bEagle\b)/gi, 'a quote$1')
  t = t.replace(/(\bEagle\b[^.\n]{0,40})\$120\b/gi, '$1a quote')
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
      .replace(/the difference that 12 years of local expertise makes/gi, 'the difference that local expertise since 2012 makes')
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
    url: link.url.replaceAll('/services/ski-resort-transfers', '/ski-resort-transfers'),
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

/** Live site_settings stats still say 14+ and 4.9 until the round 14 migration runs. */
export function normalizeAalStat(stat: { value: string; label: string }): { value: string; label: string } {
  const value = String(stat.value ?? '')
  const label = String(stat.label ?? '')
  const blob = `${value} ${label}`.toLowerCase()
  if (value === '14+' || /14\+\s*years/.test(blob) || (blob.includes('14+') && blob.includes('year'))) {
    return { value: 'Since 2012', label: 'Serving Aspen' }
  }
  if (value === '4.9' || blob.includes('4.9') || blob.includes('client rating')) {
    return { value: '5.0', label: 'on Google (5 reviews)' }
  }
  return { value, label }
}
