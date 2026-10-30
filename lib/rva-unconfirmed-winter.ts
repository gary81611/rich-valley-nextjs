/**
 * Kit-unconfirmed winter offerings. Used to hide Supabase-backed copy until he confirms.
 * Does not mutate the database. Filters drop whole items only (rows, FAQs, list items,
 * or whole sentences) — no phrase surgery inside a sentence.
 *
 * Kit-confirmed winter set: in-house fishing/hiking/rafting/camping (seasonal), partner
 * horseback/ATV/snowmobile, plus confirmed priced items (e.g. snowshoe $500).
 * Electric snowbikes are not confirmed — strip at render (see publicWinterSnowmobile*).
 */

/** winter_adventures row: title still "Snowmobile & Electric Snowbike Tours" in DB. */
const SNOWMOBILE_WINTER_ID = '99be4363-81bf-4c36-9242-a4de45a172ac'

function isUnconfirmedHuntingOffer(t: string): boolean {
  if (t.includes('mule deer')) return true
  if (t.includes('waterfowl')) return true
  // Offer/activity "hunting" — not "hunting the shoreline", "hunting for the car", Hunter Creek
  if (/\bhunting\b/.test(t) && !/hunting (the|for)\b/.test(t)) return true
  if (/\belk\b/.test(t) && /\bhunt/.test(t)) return true
  return false
}

export function isSnowbikeMention(text: string): boolean {
  const t = text.toLowerCase()
  return /snow[\s-]*bike|e-?snowbike/.test(t)
}

export function isUnconfirmedWinterClaim(text: string): boolean {
  const t = text.toLowerCase()
  if (/ice[\s-]*fish/.test(t)) return true
  if (/cross[\s-]*country/.test(t)) return true
  if (t.includes('nordic')) return true
  if (isUnconfirmedHuntingOffer(t)) return true
  if (t.includes('sporting clay')) return true
  if (t.includes('shotgun') && t.includes('clinic')) return true
  if (t.includes('cast') && t.includes('blast')) return true
  // Electric/Fat Tire Guided Biking Tour — not the partner snowmobile row
  if (t.includes('fat tire')) return true
  if (t.includes('electric') && /bik(e|ing)\b/.test(t) && !isSnowbikeMention(t) && !t.includes('snowmobile')) {
    return true
  }
  if (t.includes('winter') && t.includes('chauffeur')) return true
  return false
}

/** Winter-page listing titles: unconfirmed claims + winter chauffeur card. */
export function isUnconfirmedWinterListingTitle(title: string): boolean {
  const t = title.toLowerCase()
  if (isUnconfirmedWinterClaim(t)) return true
  // Winter_adventures row is chauffeur-only (year-round scenic stays on other pages)
  if (t.includes('chauffeur')) return true
  return false
}

/** Drop whole sentences that mention snowbikes (keep snowmobile-only sentences). */
export function scrubSnowbikeText(text: string): string {
  return text
    .split(/(?<=\.)(\s+)/)
    .filter((part) => {
      if (/^\s+$/.test(part)) return true
      if (!part.trim()) return true
      if (isSnowbikeMention(part)) return false
      return true
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** Drop whole sentences that still advertise unconfirmed winter offerings. */
export function scrubUnconfirmedWinterText(text: string): string {
  const withoutClaims = text
    .split(/(?<=\.)(\s+)/)
    .filter((part) => {
      if (/^\s+$/.test(part)) return true
      if (!part.trim()) return true
      if (isUnconfirmedWinterClaim(part)) return false
      return true
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return scrubSnowbikeText(withoutClaims)
}

export function scrubUnconfirmedWinterFaqs<T extends { question: string; answer: string }>(
  faqs: T[]
): T[] {
  // Whole-FAQ drop when Q or A carries an unconfirmed claim (no partial rewrite).
  return faqs.filter((faq) => {
    const blob = `${faq.question} ${faq.answer}`
    if (isUnconfirmedWinterClaim(blob)) return false
    if (isSnowbikeMention(blob)) return false
    return true
  })
}

export function scrubSnowbikeList(items: string[]): string[] {
  return items.filter((item) => !isSnowbikeMention(item))
}

export function scrubUnconfirmedWinterList(items: string[]): string[] {
  return scrubSnowbikeList(items.filter((item) => !isUnconfirmedWinterClaim(item)))
}

/** Render-time override for the winter_adventures snowmobile row (DB still has snowbike wording). */
export function publicWinterSnowmobileTitle(row: { id?: string | null; title: string }): string {
  if (row.id === SNOWMOBILE_WINTER_ID || (/snowmobile/i.test(row.title) && isSnowbikeMention(row.title))) {
    return 'Snowmobile Tours'
  }
  return row.title
}

export function publicWinterSnowmobileDescription(row: {
  id?: string | null
  title: string
  description?: string | null
}): string {
  if (row.id === SNOWMOBILE_WINTER_ID || (/snowmobile/i.test(row.title) && isSnowbikeMention(row.title))) {
    return 'Explore backcountry terrain on snowmobiles.'
  }
  return (row.description || '').trim()
}
