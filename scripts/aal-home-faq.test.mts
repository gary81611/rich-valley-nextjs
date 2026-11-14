import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { HOME_FAQ_LIMIT, homeFaqPageJsonLd, selectHomeFaqs, type HomeFaq } from '../lib/aal-home-faq.ts'

/** The four questions the approved home preview rendered, in that order. */
const PREVIEW_FAQS: HomeFaq[] = [
  {
    q: 'How much is a car service from Denver to Aspen?',
    a: 'A private Suburban from Denver Airport (DEN) to Aspen is $1,375 one way. The 13-passenger Ford Transit is $1,600. Holiday pricing may change seasonally.',
  },
  {
    q: 'How much is Eagle Airport to Aspen?',
    a: 'Eagle (EGE) to Aspen or Snowmass is $720 one way in a private SUV. Aspen to Eagle is $720. The 13-passenger Ford Transit is $1,200 each way. Holiday pricing may change seasonally.',
  },
  { q: 'Do you offer shared rides?', a: 'No shared rides are offered.' },
  { q: 'What is your PUC permit?', a: 'CO PUC permit LL-04725.' },
]

describe('AAL home FAQ limit', () => {
  it('keeps at most four questions and preserves order', () => {
    const cms = Array.from({ length: 19 }, (_, index) => ({
      q: `CMS question ${index + 1}`,
      a: `CMS answer ${index + 1}`,
    }))
    const ordered = [...PREVIEW_FAQS, ...cms]
    const visible = selectHomeFaqs(ordered)
    assert.equal(HOME_FAQ_LIMIT, 4)
    assert.equal(visible.length, 4)
    assert.deepEqual(visible.map((item) => item.q), PREVIEW_FAQS.map((item) => item.q))
    assert.deepEqual(visible, PREVIEW_FAQS)
    assert.equal(selectHomeFaqs(PREVIEW_FAQS.slice(0, 2)).length, 2)
  })

  it('builds one FAQPage whose questions match the visible four', () => {
    const extra = { q: 'A fifth question', a: 'Not on the home page.' }
    const schema = homeFaqPageJsonLd([...PREVIEW_FAQS, extra])
    assert.equal(schema['@type'], 'FAQPage')
    assert.equal(schema.mainEntity.length, 4)
    assert.deepEqual(
      schema.mainEntity.map((item) => ({ q: item.name, a: item.acceptedAnswer.text })),
      PREVIEW_FAQS,
    )
    const json = JSON.stringify(schema)
    assert.equal(json.match(/"@type":"FAQPage"/g)?.length, 1)
    assert.doesNotMatch(json, /A fifth question/)
  })

  it('home renders that same list and links the rest to /faq', () => {
    const source = readFileSync(new URL('../app/alpenglow/ALPHomeClient.tsx', import.meta.url), 'utf8')
    assert.match(source, /const visibleFaqs = selectHomeFaqs\(faqs\)/)
    assert.match(source, /const faqSchema = homeFaqPageJsonLd\(visibleFaqs\)/)
    assert.match(source, /visibleFaqs\.map/)
    assert.match(source, /href="\/faq">All questions/)
    assert.equal(source.match(/FAQPage/g), null)
  })
})
