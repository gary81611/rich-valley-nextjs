import { scrubUnconfirmedWinterList } from '@/lib/rva-unconfirmed-winter'

/**
 * Kit-confirmed offerings (kit-answers.md):
 * in-house: fishing, hiking, rafting, camping;
 * partners: horseback, ATV, snowmobile;
 * also: snowshoeing; $750 scenic and wildlife tour.
 * Labels outside this set are dropped at render (no DB writes).
 */
const KIT_CONFIRMED_ACTIVITY = [
  /^fly fishing\b/i,
  /^guided hiking\b/i,
  /^hiking\b/i,
  /^trail hiking\b/i,
  /^snowshoeing\b/i,
  /^float trips?\b/i,
  /^private water access\b/i,
  /^lake fishing\b/i,
  /^horseback\b/i,
  /^atv\b/i,
  /^snowmobile\b/i,
  /^scenic (and|&) wildlife\b/i,
  /^rafting\b/i,
  /^scenic river rafting\b/i,
  /^elevated camping\b/i,
  /^camping\b/i,
]

function isKitConfirmedActivity(label: string): boolean {
  const t = label.trim()
  return KIT_CONFIRMED_ACTIVITY.some((re) => re.test(t))
}

/** Render-side activity list + touristType (no DB writes). */
export function publicLocationActivities(
  slug: string,
  activities: string[] | null | undefined
): string[] {
  let items = scrubUnconfirmedWinterList(activities || []).filter(isKitConfirmedActivity)
  // Marble: Kit-confirmed fishing only on this page for now
  if (slug === 'marble-redstone') {
    items = items.filter((a) => /^fly fishing\b/i.test(a.trim()))
  }
  return items
}

/** Render-side tagline override (no DB writes). */
export function publicLocationTagline(
  slug: string,
  tagline: string | null | undefined
): string {
  if (slug === 'vail') return 'Fly fishing and hiking near Vail'
  return tagline || ''
}

/** Drop whole sentences that still say Chauffeur Guided (pending Kit). */
export function scrubChauffeurGuidedText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .split(/(?<=\.)(\s+)/)
    .filter((part) => {
      if (/^\s+$/.test(part) || !part.trim()) return true
      return !/chauffeur guided/i.test(part)
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
