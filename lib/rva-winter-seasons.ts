/** Confirmed season windows from client questionnaire — keyed by adventure title keywords. */
export function seasonForWinterAdventure(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('elk') || t.includes('mule deer')) return 'September 1 – December 10'
  if (t.includes('waterfowl')) return 'October 1 – January 15'
  if (t.includes('ice fishing')) return 'December 15 – February 25'
  if (t.includes('snowshoe')) return 'December 15 – February 25'
  if (t.includes('cross-country')) return 'December 15 – February 25 (approximate)'
  if (t.includes('fat tire') || (t.includes('electric') && t.includes('bik'))) return 'November 1 – May 31'
  if (t.includes('sporting clay') || (t.includes('shotgun') && t.includes('clinic'))) return 'November 1 – May 31'
  if (t.includes('chauffeur')) return 'Year-round'
  if (t.includes('cast') && t.includes('blast')) return 'October 1 – January 15'
  if (t.includes('snowmobile') || t.includes('snowbike')) return 'December 15 – March 31 (approximate)'
  return ''
}
