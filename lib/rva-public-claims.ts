/** Render-time cleanup for RVA marketing claims. Does not change stored rows. */

export type RvaStat = { value: string; label: string }

export function rvaPublicStats(stats: RvaStat[] | null | undefined): RvaStat[] {
  const out: RvaStat[] = []
  for (const stat of stats ?? []) {
    if (!stat?.label || /rating/i.test(stat.label)) continue
    const blob = `${stat.value} ${stat.label}`
    if (/14\s*\+/.test(blob) || /years of experience/i.test(stat.label)) {
      out.push({ value: '2012', label: 'Guiding since' })
      continue
    }
    out.push(stat)
  }
  return out
}

/** Drop "14+ years" phrasing. Leaves ordinary "first time" / first-aid wording alone. */
export function replaceRvaYearClaims(text: string): string {
  return text
    .replace(/\bover 14 years\b/gi, 'since 2012')
    .replace(/\bpast 14 years\b/gi, 'years since 2012')
    .replace(/\b14\+\s*years\b/gi, 'since 2012')
    .replace(/\b14\+\s*Years of (?:Local )?Experience\b/g, 'Guiding since 2012')
}
