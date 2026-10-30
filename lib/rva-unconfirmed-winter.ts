/**
 * Kit-unconfirmed winter offerings. Used to hide Supabase-backed copy until he confirms.
 * Does not mutate the database. Filters drop whole items only (rows, FAQs, list items,
 * or whole sentences) — no phrase surgery inside a sentence.
 *
 * Kit-confirmed winter set: in-house fishing/hiking/rafting/camping (seasonal), partner
 * horseback/ATV/snowmobile, plus confirmed priced items (e.g. snowshoe $500).
 */

function isUnconfirmedHuntingOffer(t: string): boolean {
  if (t.includes('mule deer')) return true
  if (t.includes('waterfowl')) return true
  // Offer/activity "hunting" — not "hunting the shoreline", "hunting for the car", Hunter Creek
  if (/\bhunting\b/.test(t) && !/hunting (the|for)\b/.test(t)) return true
  if (/\belk\b/.test(t) && /\bhunt/.test(t)) return true
  return false
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
  // Electric/Fat Tire Guided Biking Tour — not partner snowmobile/snowbike
  if (t.includes('fat tire')) return true
  if (t.includes('electric') && /bik(e|ing)\b/.test(t) && !t.includes('snowbike')) return true
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

/** Drop whole sentences that still advertise unconfirmed winter offerings. */
export function scrubUnconfirmedWinterText(text: string): string {
  return text
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
}

export function scrubUnconfirmedWinterFaqs<T extends { question: string; answer: string }>(
  faqs: T[]
): T[] {
  // Whole-FAQ drop when Q or A carries an unconfirmed claim (no partial rewrite).
  return faqs.filter((faq) => {
    const blob = `${faq.question} ${faq.answer}`
    if (isUnconfirmedWinterClaim(blob)) return false
    return true
  })
}

export function scrubUnconfirmedWinterList(items: string[]): string[] {
  return items.filter((item) => !isUnconfirmedWinterClaim(item))
}
