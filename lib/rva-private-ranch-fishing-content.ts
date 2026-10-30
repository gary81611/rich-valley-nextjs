import type { ServiceContent } from '@/lib/pages'
import { KIDS_FAMILY_FISHING } from '@/lib/rva-fly-fishing-content'

export const privateRanchFishingPath = '/private-ranch-fishing'
export const privateRanchFishingPageTitle = 'Private Ranch Fishing'

const WADERS =
  'Waders and boots up to men\'s size 15.'

const LIMITED_MOBILITY =
  'Guests and grandparents with limited mobility can be hosted at the ranch ponds.'

const PRICE =
  'The private ranch and picnic package is from $800 per adult and $250 per child (ages 3+).'

const BOOKING =
  'Book at least 2 days in advance. A 50% deposit is due at booking. Cancellations within 72 hours are billed in full.'

const LICENSE = 'A Colorado Parks and Wildlife fishing license is required for ages 16 and up.'

const RANCH_ANSWER = [
  'Private ranch fishing is the private ranch and picnic package on a historic private ranch in the Roaring Fork Valley, owned by the same family since the late 1800s.',
  'The ranch has ponds, creeks, and a private section of the Roaring Fork River, with rainbow, brown, native cutthroat, and brook trout from 12 to 30 inches.',
  'The package is from $800 per adult and $250 per child (ages 3+).',
]

export const privateRanchFishingServiceContent: ServiceContent = {
  hero_title: privateRanchFishingPageTitle,
  hero_subtitle: 'Private ranch fly fishing at a private ranch in the Roaring Fork Valley',
  lead: {
    heading: 'What is private ranch fishing?',
    paragraphs: RANCH_ANSWER,
    facts: [
      { label: 'Location', value: 'A private ranch in the Roaring Fork Valley' },
      { label: 'Water', value: 'Ponds, creeks, and a private section of the Roaring Fork River' },
      { label: 'Species', value: 'Rainbow, brown, native cutthroat, and brook trout' },
      { label: 'Size', value: '12–30 inches' },
      { label: 'Pricing', value: 'From $800 per adult, $250 per child (ages 3+)' },
      { label: 'Booking', value: "2 days' notice, 50% deposit, 72-hour cancellation" },
    ],
  },
  intro: `A private ranch in the Roaring Fork Valley is a famous historic ranch owned by the same family since the late 1800s. Rich Valley Adventures offers private ranch fly fishing here: trout fishing on private water, with a picnic.

The ranch has multiple ponds and creeks, plus a private section of the Roaring Fork River. The water holds rainbow, brown, native cutthroat, and brook trout, from 12 to 30 inches.

${PRICE}`,
  features: [
    {
      title: 'Private ranch water',
      description:
        'Private ranch access to the ponds, the creeks, and a private section of the Roaring Fork River.',
    },
    {
      title: 'The picnic',
      description: 'The picnic is part of the private ranch and picnic package.',
    },
    {
      title: 'Waders',
      description: WADERS,
    },
  ],
  h2_sections: [
    {
      title: 'Pricing',
      content: `Private ranch and picnic package at a private ranch in the Roaring Fork Valley: from $800 per adult and $250 per child (ages 3+).`,
    },
    {
      title: 'Kids & Family',
      content: KIDS_FAMILY_FISHING,
    },
    {
      title: 'Limited mobility at the ranch ponds',
      content: LIMITED_MOBILITY,
    },
    {
      title: 'Booking',
      content: `${BOOKING} ${LICENSE}`,
    },
  ],
  faqs: [
    {
      question: 'What is private ranch fishing?',
      answer: RANCH_ANSWER.join(' '),
    },
    {
      question: 'Where is the private ranch?',
      answer:
        'The private ranch is in the Roaring Fork Valley, near Aspen. It is a famous historic ranch owned by the same family since the late 1800s.',
    },
    {
      question: 'What does the private ranch and picnic cost?',
      answer: 'From $800 per adult and $250 per child (ages 3+).',
    },
    {
      question: 'What water is included?',
      answer:
        'Private ranch access to multiple ponds and creeks, plus a private section of the Roaring Fork River.',
    },
    {
      question: 'What trout are in the water?',
      answer: 'Rainbow, brown, native cutthroat, and brook trout, from 12 to 30 inches.',
    },
    {
      question: 'What is included?',
      answer: `Private ranch access to the ponds, creeks, and private Roaring Fork section, the picnic, and waders. ${WADERS}`,
    },
    {
      question: 'Can kids fish?',
      answer: KIDS_FAMILY_FISHING,
    },
    {
      question: 'Can a guest with limited mobility come?',
      answer: LIMITED_MOBILITY,
    },
    {
      question: 'How far ahead do I book, and what is the cancellation rule?',
      answer: BOOKING,
    },
    {
      question: 'Do I need a fishing license?',
      answer: LICENSE,
    },
  ],
  cta_phone: '(970) 456-3666',
  cta_text: 'Book Private Ranch Fishing',
}
