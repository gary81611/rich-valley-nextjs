/**
 * Visible heading vs the SEO title. Prices, "/ AAL", and ride-share suffixes
 * stay out of H1s. The document title can keep the longer string.
 */
export function aalDisplayTitle(raw: string): string {
  if (!raw) return raw
  const parts = raw.split(/\s+[|/]\s+/)
  const kept: string[] = []
  parts.forEach((part, index) => {
    const stuffed =
      /\$\s?\d/.test(part) ||
      /\ball-in\b/i.test(part) ||
      /^\s*AAL\s*$/i.test(part) ||
      /\buber\b/i.test(part) ||
      /\blyft\b/i.test(part) ||
      /buttermilk jan/i.test(part)
    if (index > 0 && stuffed) return
    kept.push(part)
  })
  let title = kept.join(' | ').replace(/\s*[|/]\s*AAL\s*$/i, '').trim()
  title = title.replace(/\b(uber|lyft)\b/gi, '').replace(/\s{2,}/g, ' ').replace(/\s+[|/]\s*$/g, '').trim()
  return title || raw.trim()
}

export function aalTitlePrice(raw: string): string | null {
  const match = raw.match(/\$[\d,]+/)
  return match ? match[0] : null
}
