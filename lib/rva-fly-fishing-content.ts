import type { ServiceContent } from '@/lib/pages'

export const flyFishingPageTitle = 'Guided Fly Fishing in Aspen & the Roaring Fork Valley'

export const KIDS_FAMILY_FISHING =
  'Kids ages 3 and up can fish. Waders are available for all children 3 and up, and adult sizes go up to size 15 feet. Kids on the full-day float are $175. At the Spring Creek Ranch private ranch and picnic, kids are $250 each (ages 3+). Guests and grandparents with limited mobility can be hosted at the ranch ponds.'

export const YEAR_ROUND_FISHING =
  'Guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady.'

/** Append the alpine-springs fact where copy still frames fishing as a summer-only season. */
export function withYearRoundFishingNote(text: string): string {
  if (!text || !/fish/i.test(text) || /alpine springs/i.test(text)) return text
  const limited =
    /may through october/i.test(text) ||
    /best time of year to fly fish/i.test(text) ||
    /july through september is generally the best window/i.test(text) ||
    /during fishing season/i.test(text)
  if (!limited) return text
  if (/fall offers outstanding streamer fishing for large brown trout\./.test(text)) {
    return text.replace(
      /fall offers outstanding streamer fishing for large brown trout\./,
      `fall offers outstanding streamer fishing for large brown trout. ${YEAR_ROUND_FISHING}`,
    )
  }
  if (/from May through October/.test(text)) {
    return text.replace(/from May through October/, `from May through October. ${YEAR_ROUND_FISHING}`)
  }
  if (/during fishing season\./.test(text)) {
    return text.replace(/during fishing season\./, `during fishing season. ${YEAR_ROUND_FISHING}`)
  }
  return `${text} ${YEAR_ROUND_FISHING}`
}

export const flyFishingServiceContent: ServiceContent = {
  hero_title: flyFishingPageTitle,
  hero_subtitle: "Cast on Colorado's Gold Medal Waters with Expert Local Guides",
  intro: `The Roaring Fork Valley is one of the most storied fly fishing destinations in the American West. We guide the Roaring Fork River, Frying Pan River, Colorado River near Glenwood Springs, the Gunnison River on float trips, and exclusive private water — including pond and alpine spring settings, high mountain lakes, and the Old Town Basalt Private Ranch on the Roaring Fork — for anglers who want uncrowded water and a tailored experience.

Rich Valley Adventures has been guiding these waters since 2012. Our guides grew up fishing these drainages and know every productive run, seam, and riffle across seasons. Whether you're picking up a fly rod for the first time or you're a seasoned angler chasing your personal best, we tailor every trip to your experience level and goals.

We offer half-day and full-day guided trips from May through October on our wading fisheries, full-day float trips on the Roaring Fork or Colorado River, and dedicated float trips on the Gunnison with our in-house boat captain. Guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady. All gear is provided — premium fly rods, reels, waders, wading boots, and a full fly selection matched to current hatch conditions. Our catch-and-release philosophy protects these waters for generations of anglers to come.`,
  h2_sections: [
    {
      title: 'Kids & Family Fishing',
      content: KIDS_FAMILY_FISHING,
    },
    {
      title: 'The Roaring Fork River — Gold Medal Fly Fishing Near Aspen',
      content: `The Roaring Fork River flows 70 miles from its headwaters near Independence Pass through Aspen, Basalt, and Carbondale before joining the Colorado River at Glenwood Springs. The stretch through and below Aspen is designated Gold Medal water by Colorado Parks & Wildlife — a designation reserved for waters that consistently produce large wild trout in exceptional numbers.

Brown trout averaging 14–18 inches are common, with fish over 20 inches taken regularly by our guides. Hatches of PMDs, caddis, green drakes, and Trico spinners make dry fly fishing thrilling from June through September. In the spring and fall, streamers and nymphs produce aggressive strikes from the river's biggest fish.`,
    },
    {
      title: "The Frying Pan River — Colorado's Premier Tailwater Fishery",
      content: `Just 15 miles from Basalt, the Frying Pan River below Ruedi Reservoir is widely considered one of the top tailwater fisheries in North America. The cold, nutrient-rich water released from the dam creates an almost year-round midge hatch and supports an extraordinary density of large wild trout — browns and rainbows averaging 16–22 inches.

The Frying Pan demands technical precision: long leaders, small flies, and delicate presentations. Our guides excel at teaching the nuances of tailwater nymphing and the art of fishing size-22 midge clusters to selective risers. This river rewards patience and skill — and the payoff is the fish of a lifetime.`,
    },
    {
      title: 'Full-Day Float Trip',
      content: `Full-day float trip: from $1,400 for 2 people (1 boat, 1 captain). Additional adults $375 each, kids $175. Covers an 8–12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation are included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up.`,
    },
    {
      title: 'Private Ranch and Picnic — Spring Creek Ranch, Carbondale',
      content: `Private ranch and picnic package at Spring Creek Ranch, Carbondale CO: from $800 per adult, $250 per child (ages 3+). Includes ponds, creeks and a private section of the Roaring Fork River, with rainbow, brown, native cutthroat and brook trout from 12 to 30 inches.`,
    },
    {
      title: 'Gunnison River — Big Water, Trophy Trout',
      content: `The Gunnison is one of North America's most renowned trophy-trout fisheries — big water, big canyon walls, and wild fish that see far less angling pressure than the Roaring Fork corridor on a busy weekend. From Aspen, expect roughly two and a half hours of driving to the float sections we run; this is a full-day commitment, and it is worth it when you want a dramatically different experience from intimate wade fishing on the Fork or Frying Pan.

Float trips are the right tool here: volume, gradient, and depth favor a drift boat and a practiced oarsman who keeps the craft quiet and aligned for long, clean presentations. Alex Macintyre is Rich Valley Adventures' boat captain for Gunnison River operations, managing logistics, safety, and boat positioning so you can focus on reading water and making the shot count. The scenery alone is unforgettable — black-rock gorges, soaring rimrock, and the sense of scale that only big Western river corridors deliver. If you have already fished the valley's wade fisheries and want a true "destination" day on the water, the Gunnison belongs on your list.`,
    },
    {
      title: 'Private Water Access — Exclusive Fishing Experiences',
      content: `Private water is how we deliver solitude, higher success rates for beginners and families, and access the public simply cannot replicate on its own. Options include a private pond fed by an alpine spring — ideal for kids, first-time anglers, and groups of up to twenty when you want guaranteed shots at cooperative fish without competing for elbow room along a public bank.

We also offer exclusive river access on the Old Town Basalt Private Ranch on the Roaring Fork: a rare stretch where our guests fish water that is not open to casual walk-in traffic. For guests seeking alpine stillwater, we can arrange hike-in days at high mountain lakes where cutthroats and brookies live in postcard settings far from trailhead crowds. The through-line is simple: fewer people, less noise, more time with your guide, and a day shaped around outcomes you can feel — whether that is a child's first fish on a fly rod or a quiet, uncrowded afternoon on moving water.`,
    },
  ],
  features: [
    {
      title: 'Kids & Family Fishing',
      description: KIDS_FAMILY_FISHING,
    },
    {
      title: 'Rivers & waters we fish',
      description:
        'Roaring Fork River, Frying Pan River, Colorado River (near Glenwood Springs), Gunnison River float trips, Spring Creek Ranch in Carbondale, and other private water — including pond, alpine spring, ranch water, and high mountain lakes.',
    },
    {
      title: 'All Equipment Provided',
      description:
        'Premium Sage rods, Scientific Anglers lines, Simms waders and boots, and a full fly selection matched to current hatches.',
    },
    {
      title: 'All Skill Levels Welcome',
      description:
        'From first-cast beginners to trophy hunters — we match your guide and itinerary to your experience.',
    },
    {
      title: 'Half-Day & Full-Day Options',
      description:
        'Choose a 4-hour morning or afternoon session, or go all-in with a full-day trip including riverside lunch where applicable.',
    },
    {
      title: 'Licenses, lunch & logistics',
      description:
        'A Colorado Parks and Wildlife fishing license is required for ages 16 and up. Full-day float trips include lunch, gear, and luxury door-to-door transportation. Wading trips include streamside lunch on full days and transportation coordinated with Aspen Alpenglow Limousine when needed.',
    },
    {
      title: 'Catch & Release',
      description:
        'We practice strict catch-and-release to protect these wild fisheries and the next generation of anglers.',
    },
  ],
  faqs: [
    {
      question: 'Can kids fish?',
      answer: KIDS_FAMILY_FISHING,
    },
    {
      question: 'Do I need a Colorado fishing license?',
      answer:
        'A Colorado Parks and Wildlife fishing license is required for ages 16 and up.',
    },
    {
      question: 'What time of year is best for fly fishing near Aspen?',
      answer:
        'The Roaring Fork Valley offers excellent fishing year-round. June through September is peak dry fly season with multiple hatches daily. October and November are prime for large browns in the fall spawn. The Frying Pan tailwater fishes well even in winter due to the stable, cold water temperatures from Ruedi Reservoir. Guides have places to fish year-round, including alpine springs where spring-fed water keeps the temperature steady.',
    },
    {
      question: 'Can beginners go fly fishing with you?',
      answer:
        "Absolutely. Beginners are welcome and we love introducing new anglers to the sport. Our guides are patient, enthusiastic teachers. Many of our most rewarding trips are with anglers casting a fly rod for the very first time.",
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'Book at least 2 days in advance. A 50% deposit is due at booking. Cancellations within 72 hours are billed in full. For summer dates, especially June through August, booking further ahead is wise because those days fill up.',
    },
    {
      question: 'Do you offer corporate packages?',
      answer:
        'Corporate packages are for groups of 50 or more: a custom mix of fishing and hiking.',
    },
    {
      question: 'What should I wear and bring?',
      answer:
        "Dress in layers — Aspen mornings can be cool even in summer. Bring sunscreen, sunglasses with UV protection (essential for spotting fish), a hat, and snacks for the day. We provide all fishing gear and waders. Wear clothes you don't mind getting wet.",
    },
  ],
  cta_phone: '(970) 456-3666',
  cta_text: 'Book Your Guided Fly Fishing Trip',
}
