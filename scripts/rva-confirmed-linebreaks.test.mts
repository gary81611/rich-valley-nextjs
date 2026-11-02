import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { scrubUnconfirmedFirstAidText } from '../lib/rva-confirmed.ts'

describe('scrubUnconfirmedFirstAidText', () => {
  it('keeps markdown line breaks when the text never mentions First Aid', () => {
    const input = '## Best Rivers\n\nThe Roaring Fork is great.\n\n- Fryingpan'
    assert.equal(scrubUnconfirmedFirstAidText(input), input)
  })

  it('removes a First Aid sentence and keeps the surrounding markdown blocks', () => {
    const input = [
      '## Why go with a guide?',
      '',
      'Mountain weather changes fast. Guides carry a first-aid kit.',
      '',
      'The river is cold.',
      '',
      '- Waders',
      '- Layers',
    ].join('\n')

    assert.equal(
      scrubUnconfirmedFirstAidText(input),
      [
        '## Why go with a guide?',
        '',
        'Mountain weather changes fast.',
        '',
        'The river is cold.',
        '',
        '- Waders',
        '- Layers',
      ].join('\n'),
    )
  })

  it('still drops First Aid and first-aid sentences in a single paragraph', () => {
    const input = 'Book a guide. We provide First Aid certification. Call us.'
    assert.equal(scrubUnconfirmedFirstAidText(input), 'Book a guide. Call us.')
  })
})
