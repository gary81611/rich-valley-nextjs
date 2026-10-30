/**
 * Kit-unconfirmed winter offerings. Used to hide Supabase-backed copy until he confirms.
 * Does not mutate the database. Filters drop whole items only (rows, FAQs, list items,
 * or whole sentences) — no phrase surgery inside a sentence.
 */

export function isUnconfirmedWinterClaim(text: string): boolean {
  const t = text.toLowerCase()
  if (/ice[\s-]*fish/.test(t)) return true
  if (/cross[\s-]*country/.test(t)) return true
  if (t.includes('nordic')) return true
  return false
}

/** Winter-page listing titles: unconfirmed claims + winter chauffeur + hunting offerings. */
export function isUnconfirmedWinterListingTitle(title: string): boolean {
  const t = title.toLowerCase()
  if (isUnconfirmedWinterClaim(t)) return true
  if (t.includes('chauffeur')) return true
  if (/\bhunt/.test(t)) return true
  if (t.includes('mule deer')) return true
  if (/\belk\b/.test(t) && t.includes('hunt')) return true
  if (t.includes('waterfowl')) return true
  if (t.includes('cast') && t.includes('blast')) return true
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
      // Winter-framed chauffeur tours (year-round scenic stays on other pages)
      const lower = part.toLowerCase()
      if (lower.includes('winter') && lower.includes('chauffeur')) return false
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
    const lower = blob.toLowerCase()
    if (lower.includes('winter') && lower.includes('chauffeur')) return false
    return true
  })
}

export function scrubUnconfirmedWinterList(items: string[]): string[] {
  return items.filter((item) => !isUnconfirmedWinterClaim(item))
}
