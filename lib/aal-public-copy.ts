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

  return { q: correctAalFleetText(question), a: correctAalFleetText(answer) }
}

/** Passenger counts only. Leaves “14+ years” and unrelated numbers alone. */
export function correctAalFleetText(text: string): string {
  if (!text) return text
  let t = text
  t = t.replace(/\b14-passenger\b/gi, '13-passenger')
  t = t.replace(/\b14-pass\b/gi, '13-pass')
  t = t.replace(/\b14 pass\./g, '13 pass.')
  t = t.replace(/\bfourteen-passenger\b/gi, 'thirteen-passenger')
  t = t.replace(/\bfourteen passengers\b/gi, 'thirteen passengers')
  t = t.replace(/\bup to fourteen\b/gi, 'up to thirteen')
  t = t.replace(/\bseats up to fourteen\b/gi, 'seats up to thirteen')
  t = t.replace(/\bsix to fourteen\b/gi, 'six to thirteen')
  t = t.replace(/\bup to 14 passengers\b/gi, 'up to 13 passengers')
  t = t.replace(/\bup to 14 with\b/gi, 'up to 13 with')
  t = t.replace(/\b14 passengers\b/gi, '13 passengers')
  t = t.replace(/\bseats up to 14\b/gi, 'seats up to 13')
  t = t.replace(/\bup to 14 in the party\b/gi, 'up to 13 in the party')
  t = t.replace(/\b2–14 passengers\b/g, '2–13 passengers')
  t = t.replace(/\b2-14 passengers\b/g, '2-13 passengers')
  t = t.replace(/\bup to 6 passengers\b/gi, 'up to 7 passengers')
  t = t.replace(/\bseats 6 passengers\b/gi, 'seats 7 passengers')
  t = t.replace(/\bseats up to 6 passengers\b/gi, 'seats up to 7 passengers')
  t = t.replace(/\baccommodate 6 passengers\b/gi, 'accommodate 7 passengers')
  t = t.replace(/\bUp to 6 Passengers\b/g, 'Up to 7 Passengers')
  t = t.replace(/\bUp to 14 Passengers\b/g, 'Up to 13 Passengers')
  return t
}

/** SUVs seat 7. The passenger shuttle van seats 13. */
export function correctAalFleetCapacity(name: string, capacity: number): number {
  const n = name.toLowerCase()
  if (/transit|sprinter|van/.test(n)) return 13
  if (/suburban|escalade|suv|tahoe|yukon/.test(n)) return 7
  if (capacity === 14) return 13
  if (capacity === 6) return 7
  return capacity
}
