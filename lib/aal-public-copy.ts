/** Confirmed AAL rate and FAQ corrections. Render-time only; does not write to the database. */

export const AAL_ONE_WAY_RATES =
  'One-way rates each way: Eagle $720, Denver $1,375, Grand Junction $950, Rifle $720. Holiday pricing may change seasonally.'

export const AAL_EAGLE_BOTH_WAYS = 'One-way Aspen to Eagle is $720. Eagle to Aspen is $720.'

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

  return { q: question, a: answer }
}
