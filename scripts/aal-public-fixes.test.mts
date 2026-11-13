import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import {
  AAL_OPENING_HOURS,
  AAL_OPENING_HOURS_SPEC,
  aalPhoneLabel,
  aalPhoneTel,
  correctAalFaqItem,
  correctAalPublicText,
} from '../lib/aal-public-copy.ts'
import { alpenglowData } from '../lib/site-data.ts'

const require = createRequire(import.meta.url)

describe('AAL /book redirect', () => {
  it('301s /book and /book/ to /reservations on AAL hosts only', async () => {
    const nextConfig = require('../next.config.js')
    const redirects = await nextConfig.redirects()
    const book = redirects.filter(
      (rule: { source?: string }) => rule.source === '/book' || rule.source === '/book/',
    )
    assert.equal(book.length, 4)
    for (const rule of book) {
      assert.equal(rule.destination, 'https://aspenalpenglowlimousine.com/reservations')
      assert.equal(rule.statusCode, 301)
      const host = rule.has?.[0]?.value
      assert.ok(host === 'aspenalpenglowlimousine.com' || host === 'www.aspenalpenglowlimousine.com')
    }
    const rvaBook = book.filter((rule: { has?: { value?: string }[] }) =>
      /richvalleyadventures/.test(rule.has?.[0]?.value || ''),
    )
    assert.equal(rvaBook.length, 0)
  })
})

describe('AAL FAQ bookingss typo', () => {
  const sourceQuestion =
    'Can Rich Valley Adventures accommodate last-minute bookings during airport closures?'
  const sourceAnswer =
    "Yes, we've operated since 2012 and specialize in flexible scheduling. Call 970-315-6111 for same-day outdoor adventures when your travel plans change unexpectedly."

  it('rewrites the closure FAQ without leaving bookingss, including FAQPage JSON-LD text', () => {
    const item = correctAalFaqItem(sourceQuestion, sourceAnswer)
    assert.ok(item)
    assert.equal(item.q, 'Can Aspen Alpenglow Limousine accommodate last-minute bookings?')
    assert.match(item.a, /970-315-6111/)
    assert.doesNotMatch(`${item.q} ${item.a}`, /bookingss/)
    assert.doesNotMatch(`${item.q} ${item.a}`, /456-3666|4563666/)

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        },
      ],
    })
    assert.match(jsonLd, /last-minute bookings/)
    assert.doesNotMatch(jsonLd, /bookingss/)
  })

  it('corrects a stored bookingss typo in public copy', () => {
    assert.equal(correctAalPublicText('last-minute bookingss today'), 'last-minute bookings today')
  })
})

describe('AAL opening hours', () => {
  it('is 24/7 for every day', () => {
    assert.equal(AAL_OPENING_HOURS, 'Mo-Su 00:00-23:59')
    assert.deepEqual(AAL_OPENING_HOURS_SPEC.dayOfWeek, [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ])
    assert.equal(AAL_OPENING_HOURS_SPEC.opens, '00:00')
    assert.equal(AAL_OPENING_HOURS_SPEC.closes, '23:59')
  })

  it('does not leave 07:00–20:00 on the AAL layout schema', () => {
    const layout = readFileSync(new URL('../app/alpenglow/layout.tsx', import.meta.url), 'utf8')
    assert.match(layout, /openingHours: AAL_OPENING_HOURS/)
    assert.match(layout, /hoursAvailable: AAL_OPENING_HOURS_SPEC/)
    assert.doesNotMatch(layout, /07:00/)
    assert.doesNotMatch(layout, /20:00/)
  })
})

describe('AAL phone', () => {
  it('uses (970) 315-6111 and rejects the Rich Valley Adventures number', () => {
    assert.equal(alpenglowData.phone, '970-315-6111')
    assert.equal(alpenglowData.phoneHref, 'tel:+19703156111')
    assert.equal(aalPhoneLabel('970-315-6111'), '970-315-6111')
    assert.equal(aalPhoneLabel('970-456-3666'), '(970) 315-6111')
    assert.equal(aalPhoneLabel('(970) 456-3666'), '(970) 315-6111')
    assert.equal(aalPhoneTel('970-456-3666'), 'tel:+19703156111')
    assert.equal(aalPhoneTel('970-315-6111'), 'tel:+19703156111')
    assert.equal(correctAalPublicText('Call 970-456-3666'), 'Call 970-315-6111')
    assert.equal(correctAalPublicText('tel:+19704563666'), 'tel:+19703156111')
    assert.equal(correctAalPublicText('Call (970) 456-3666 today'), 'Call (970) 315-6111 today')
  })

  it('keeps the Rich Valley Adventures number out of the AAL llms.txt block', () => {
    const src = readFileSync(new URL('../app/llms.txt/route.ts', import.meta.url), 'utf8')
    const aalStart = src.indexOf('const aalText')
    const aalEnd = src.indexOf('const text = isAlpenglow')
    assert.ok(aalStart > 0 && aalEnd > aalStart)
    const aalBlock = src.slice(aalStart, aalEnd)
    assert.match(aalBlock, /970-315-6111/)
    assert.doesNotMatch(aalBlock, /456-3666|4563666/)
  })
})
