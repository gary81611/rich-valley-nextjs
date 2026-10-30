/** Confirmed season windows from client questionnaire — keyed by adventure title keywords. */
export function seasonForWinterAdventure(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('snowshoe')) return 'December 15 – February 25'
  if (t.includes('snowmobile') || t.includes('snowbike')) return 'December 15 – March 31 (approximate)'
  return ''
}
