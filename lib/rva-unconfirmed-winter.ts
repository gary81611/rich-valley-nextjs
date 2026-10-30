/**
 * Kit-unconfirmed winter offerings. Used to hide Supabase-backed copy until he confirms.
 * Does not mutate the database.
 */

export function isUnconfirmedWinterClaim(text: string): boolean {
  const t = text.toLowerCase()
  if (/ice[\s-]*fish/.test(t)) return true
  if (/cross[\s-]*country/.test(t)) return true
  if (t.includes('nor' + 'dic')) return true
  return false
}

/** Winter-page listing titles only — also drops winter chauffeur cards (year-round scenic stays elsewhere). */
export function isUnconfirmedWinterListingTitle(title: string): boolean {
  const t = title.toLowerCase()
  if (isUnconfirmedWinterClaim(t)) return true
  if (t.includes('chauffeur')) return true
  return false
}

/** Remove unconfirmed winter phrases; keep snowshoeing and other confirmed copy. */
export function scrubUnconfirmedWinterText(text: string): string {
  let s = text

  // Drop whole list-item clauses that name unconfirmed offerings
  s = s.replace(/,?\s*winter\s+Chauffeur\s+Guided\s+Tours?/gi, '')
  s = s.replace(/,?\s*and\s+ice[\s-]*fish(?:ing)?(?:\s+on\s+the\s+[^.,;]+)?/gi, '')
  s = s.replace(/,?\s*ice[\s-]*fish(?:ing)?(?:\s+on\s+the\s+[^.,;]+)?/gi, '')
  s = s.replace(/,?\s*cross[\s-]*country(?:\s+skiing)?/gi, '')
  s = s.replace(new RegExp(',?\\s*(?:and\\s+)?' + 'nor' + 'dic(?:\\s+skiing)?', 'gi'), '')
  // Winter FAQ list that mixed snowshoeing with chauffeur: collapse to snowshoeing offers…
  s = s.replace(
    /snowshoeing\s*,\s*and\s+Chauffeur Guided Tours and Excursions offer/gi,
    'snowshoeing offers'
  )
  s = s.replace(
    /snowshoeing\s*,\s*Chauffeur Guided Tours and Excursions offer/gi,
    'snowshoeing offers'
  )
  // "guided ice fishing trips" leftovers after ice-fish phrase already removed
  s = s.replace(/In winter,\s*we offer guided\s+trips\./gi, '')
  s = s.replace(/we offer guided\s+trips\./gi, '')

  // Drop any remaining sentence that still carries a claim
  s = s
    .split(/(?<=\.)(\s+)/)
    .filter((part, idx, arr) => {
      if (/^\s+$/.test(part)) return true
      return !isUnconfirmedWinterClaim(part)
    })
    .join('')

  s = s.replace(/,\s*,+/g, ',')
  s = s.replace(/,\s*and\s*\./g, '.')
  s = s.replace(/,\s*\./g, '.')
  s = s.replace(/—\s*,/g, '—')
  s = s.replace(/\s{2,}/g, ' ')
  s = s.replace(/\s+([,.;])/g, '$1')
  s = s.replace(/\(\s*\)/g, '')
  return s.trim()
}

export function scrubUnconfirmedWinterFaqs<T extends { question: string; answer: string }>(
  faqs: T[]
): T[] {
  return faqs
    .map((faq) => ({ ...faq, answer: scrubUnconfirmedWinterText(faq.answer) }))
    .filter((faq) => {
      const a = faq.answer.trim()
      if (!a) return false
      if (isUnconfirmedWinterClaim(faq.question)) return false
      if (isUnconfirmedWinterClaim(a)) return false
      return true
    })
}

export function scrubUnconfirmedWinterList(items: string[]): string[] {
  return items.filter((item) => !isUnconfirmedWinterClaim(item))
}
