import type { ServiceContent } from './pages'

/**
 * Default CMS content for RVA `/hiking` (guided hiking). Imported by `lib/seed-pages.ts`.
 * Production sites with an existing `pages` row should merge via Admin → CMS Pages → hiking.
 */
export const rvaHikingPageContent: ServiceContent = {
  hero_title: 'Guided Hiking Tours in Aspen & Maroon Bells',
  hero_subtitle: 'Local guides, small groups, and the Elk Mountains’ best-known trails',
  intro: `Aspen sits at the edge of the Maroon Bells–Snowmass Wilderness and the Elk Range — five 14ers, classic lake hikes, and valley trails that fill up fast at trailheads. Rich Valley Adventures matches your group to realistic mileage and elevation gain, handles navigation and safety, and shares natural and human history along the way.\n\nWe guide small groups (typically 2–8) from gentle riparian walks to strenuous high-alpine days. Your guide plans around weather, shuttle and permit rules where they apply, and how you’re feeling at altitude — so you enjoy the trail instead of guessing from a screenshot on your phone.`,
  popular_hikes: [
    {
      name: 'Maroon Lake Scenic Trail',
      description:
        'Paved and gravel path along the shore of Maroon Lake with framed views of the Bells — the classic “postcard” hike. Ideal for photography, first day at altitude, or pairing with a shorter guided day.',
      mileage: '~1.0 mi round trip',
      duration: '30–60 minutes',
    },
    {
      name: 'Crater Lake Trail',
      description:
        'The standard extension from Maroon Lake into the upper basin — steady climb through aspen and spruce to a dramatic lake below the peaks. Crowds thin slightly past the lake overlook.',
      mileage: '~3.6 mi round trip',
      duration: '2–4 hours',
    },
    {
      name: 'Buckskin Pass (from Maroon Lake)',
      description:
        'A serious Elk Range day: long mileage and big elevation to a high pass with sweeping views. For fit, acclimated hikers; weather and afternoon lightning are real considerations.',
      mileage: '~10 mi round trip',
      duration: '6–10 hours',
    },
    {
      name: 'West Maroon Pass',
      description:
        'Bucket-list traverse toward Crested Butte for strong hikers; often planned as a one-way with shuttle logistics. Exposure to weather and fatigue — your guide plans conservatively.',
      mileage: '10+ mi one-way',
      duration: 'Full day (+ shuttle)',
    },
    {
      name: 'Conundrum Hot Springs Trail',
      description:
        'Long, strenuous valley approach to one of Colorado’s best-known soaking spots; many parties treat it as an overnight. Permits, camping rules, and Leave No Trace are essential — we help you interpret regulations and pace.',
      mileage: '~17 mi round trip',
      duration: '12–16+ hours or overnight',
    },
    {
      name: 'Cathedral Lake Trail',
      description:
        'Steep, popular climb to a turquoise alpine lake beneath Cathedral Peak — wildflowers and big vertical in a compact package. One of Aspen’s most rewarding “classic” day hikes.',
      mileage: '~5.6 mi round trip',
      duration: '3–5 hours',
    },
    {
      name: 'American Lake Trail',
      description:
        'Forest and meadow walking into a pretty high lake basin below American Peak. Quieter than Maroon Lake on many days; still a solid half-day of elevation.',
      mileage: '~6.2 mi round trip',
      duration: '3–5 hours',
    },
    {
      name: 'Linkins Lake Trail',
      description:
        'Longer approach off Independence Pass into an alpine lake setting — big views and a true mountain feel. Best for hikers comfortable with distance and changing weather.',
      mileage: '~8 mi round trip',
      duration: '4–6 hours',
    },
    {
      name: 'Lost Man Lake Loop',
      description:
        'High-country loop off Independence Pass linking lakes and open tundra — outstanding wildflowers in season. Short side trips possible; loop stays mostly above treeline.',
      mileage: '~8.5 mi loop',
      duration: '3–5 hours',
    },
    {
      name: 'The Grottos & ice cave area',
      description:
        'Short family-friendly paths, waterfalls, and seasonal ice formations near the Independence Pass road — great with kids or as a low-key nature walk between bigger days.',
      mileage: '~0.5–1.0 mi',
      duration: '30–60 minutes',
    },
    {
      name: 'Hunter Creek Trail',
      description:
        'Valley-side climb from Aspen into aspen groves and open slopes — flexible turn-around points for custom pacing. Popular with locals for fitness and fall color.',
      mileage: '5–9 mi (out-and-back)',
      duration: '2–5 hours',
    },
    {
      name: 'Smuggler Mountain Road & overlooks',
      description:
        'Historic mining road switchbacking above town — strong workout with panoramic views of Aspen and the Elk Range. Length varies by turnaround.',
      mileage: '2–5 mi round trip',
      duration: '1–3 hours',
    },
    {
      name: 'Ute Trail (Aspen Mountain)',
      description:
        'Steep, direct climb from town toward the Aspen Mountain ridge — a lung-buster at altitude with big payoff views. Often combined with gondola options seasonally.',
      mileage: '~2–3 mi one way',
      duration: '2–3 hours',
    },
    {
      name: 'Government Trail',
      description:
        'Classic connector between Aspen and Snowmass through aspen forest and open glades — point-to-point logistics matter; we help with timing and pickup.',
      mileage: '~4.5 mi one way',
      duration: 'Half day (with shuttle)',
    },
    {
      name: 'Tom Blake Trail (Snowmass)',
      description:
        'Rolling forest and meadow travel in the Snowmass zone — strong intermediate option with optional links to longer networks.',
      mileage: '~6 mi round trip',
      duration: '3–4 hours',
    },
    {
      name: 'Ditch Trail & Sky Mountain Park',
      description:
        'Multi-use singletrack and doubletrack with flexible distances — great when you want flowy miles and views without a single long summit push.',
      mileage: '4–12 mi (route-dependent)',
      duration: '2–5 hours',
    },
    {
      name: 'Rio Grande Trail (Aspen corridor)',
      description:
        'Flat, non-motorized rail-trail along the Roaring Fork — ideal for recovery days, birding, and easy miles. Mileage is whatever segment you choose.',
      mileage: 'Segment-based',
      duration: '1–6+ hours',
    },
    {
      name: 'Weller Lake Trail',
      description:
        'Short, scenic hop near Independence Pass — quick alpine fix when you want lake views without a major commitment.',
      mileage: '~2.0 mi round trip',
      duration: '1–2 hours',
    },
    {
      name: 'Capitol Creek Trail',
      description:
        'Approach into the Capitol Peak amphitheater — long, serious mileage and exposure possible for advanced groups; most itineraries are custom.',
      mileage: '8–16+ mi (varies)',
      duration: 'Full day+',
    },
    {
      name: 'Copper Lake Trail (East Maroon)',
      description:
        'Remote-feeling East Maroon drainage with big distance and solitude relative to Maroon Lake — for very fit hikers only.',
      mileage: '~13+ mi round trip',
      duration: '10–14 hours',
    },
    {
      name: 'Sunnyside Trail (East Aspen)',
      description:
        'Sunny, rolling traverse above the east side of town — great views of Aspen Mountain and the valley; moderate effort.',
      mileage: '~3 mi round trip',
      duration: '1.5–2.5 hours',
    },
    {
      name: 'Rim Trail South (Snowmass)',
      description:
        'Open slopes and big-sky walking on Snowmass’s high shoulder — wildflowers and long sightlines in summer.',
      mileage: '3–5 mi round trip',
      duration: '2–4 hours',
    },
    {
      name: 'Bear Den Trail (Snowmass)',
      description:
        'Shorter forested loop or out-and-back options suitable for families or a mellow half-day at moderate elevation.',
      mileage: '2–3 mi round trip',
      duration: '1–2 hours',
    },
    {
      name: 'Taylor Pass / Pearl Pass corridor',
      description:
        'Summer 4WD road access to high basins with optional short hikes from the road — weather and road condition dependent; we plan vehicle staging carefully.',
      mileage: 'Road + optional 1–4 mi hikes',
      duration: 'Half–full day',
    },
    {
      name: 'Pine Creek Cookhouse area',
      description:
        'Forest walk or seasonal wagon road toward the historic cookhouse setting beneath the Bells — mileage depends on service season and whether you hike the full road.',
      mileage: '~2.5 mi one way (typical walk)',
      duration: '1–3 hours',
    },
  ],
  h2_sections: [
    {
      title: 'Maroon Bells — permits, shuttles, and timing',
      content: `The Maroon Bells Scenic Area is the busiest trailhead in Colorado — reservations and shuttle rules apply in peak season. We help you interpret the permit system, choose realistic start times, and avoid the classic mistake of underestimating altitude and afternoon thunderstorms.\n\nFrom the easy stroll at Maroon Lake to Crater Lake and beyond, your guide sets a sustainable pace, carries safety essentials, and adjusts the plan if smoke, lightning, or group energy calls for a shorter day.`,
    },
    {
      title: 'Independence Pass & the high divide',
      content: `Highway 82 over Independence Pass opens a different menu of hikes: short lake walks, tundra loops like Lost Man, and link-ups toward bigger basins. Weather moves fast above treeline — we watch the sky, carry layers, and turn around when the risk outweighs the view.\n\nThe Grottos and other short stops along the pass make excellent half-day combinations with a longer hike or a scenic driving day.`,
    },
  ],
  features: [
    {
      title: 'Expert local guides',
      description:
        'Our guides know these drainages in every season — where to park, when to start, and how to read the weather above treeline.',
    },
    {
      title: 'All fitness levels',
      description:
        'Easy valley miles to strenuous alpine link-ups — we recommend honestly and build in extra time for altitude.',
    },
    {
      title: 'Small groups (max 8)',
      description:
        'Personal pacing, better safety ratios, and room to change the plan when someone needs a slower day.',
    },
    {
      title: 'Naturalist storytelling',
      description:
        'Wildflowers, geology, wildlife behavior, and mining history — context that turns a walk into a richer experience.',
    },
    {
      title: 'Safety first',
      description:
        'Guides carry first-aid kits, emergency communication, and training in wilderness first response.',
    },
    {
      title: 'Seasonal highlights',
      description:
        'Wildflower peak in July–August, golden aspens in September, and quieter trails in late spring and early fall when conditions allow.',
    },
  ],
  faqs: [
    {
      question: 'What fitness level is required for your guided hikes?',
      answer:
        'We offer hikes from easy 1–2 mile walks to strenuous 10+ mile alpine days. Before your trip we discuss elevation gain, mileage, and your recent hiking history, then recommend routes that match the weakest link in the group — we can always add an optional push for stronger hikers when the terrain allows.',
    },
    {
      question: 'When is the best time to hike near Aspen?',
      answer:
        'Late June through September is the main hiking window for high country; July and August bring wildflowers and afternoon thunderstorms. September offers cooler air and aspen color. Some lower-elevation trails are pleasant in late spring and early fall depending on mud and snow melt.',
    },
    {
      question: 'Do I need hiking boots?',
      answer:
        'Sturdy hiking boots or trail shoes with good tread are best for rocky, steep Elk Range trails. Break footwear in before your trip. Avoid brand-new boots on a long day.',
    },
    {
      question: 'Are altitude effects something to worry about?',
      answer:
        'Aspen sits near 8,000 feet and many hikes top 10,000–12,000 feet. Headache, nausea, and unusual fatigue can be altitude-related. We recommend easy days first, plenty of water, and honest communication with your guide. We turn around or shorten routes when symptoms warrant it.',
    },
    {
      question: 'What should I bring on a hike?',
      answer:
        'Daypack with 2–3 liters of water (more on hot or long days), salty snacks and lunch, rain jacket, warm mid-layer, sun hat, sunglasses, sunscreen, lip balm, blister kit, and any personal medications. Cotton clothing is a poor choice — wear moisture-wicking base layers. We send a trip-specific checklist when you book.',
    },
    {
      question: 'How much water and food should I carry?',
      answer:
        'Plan roughly half a liter per hour of hiking in summer at altitude — more if it is hot or exposed. Bring more than you think you need; alpine sun and dry air dehydrate you faster than at sea level. Pack calorie-dense snacks plus a real lunch on anything over three hours.',
    },
    {
      question: 'What about rain, wind, and cold snaps?',
      answer:
        'Mountain weather changes in minutes. Even on a sunny morning, pack a waterproof shell and insulation. Your guide carries group safety gear and will alter the route if lightning, hail, or high wind makes exposed ridges unsafe.',
    },
    {
      question: 'Should I bring trekking poles?',
      answer:
        'Poles reduce knee stress on long downhills and help balance on loose rock. They are optional but recommended for steep trails like Cathedral or Crater Lake. Tell us in advance if you need to borrow a pair — availability varies.',
    },
    {
      question: 'Wildlife and bear safety — what should I know?',
      answer:
        'You may see deer, elk, marmots, and occasionally moose or black bear. Keep distance, never feed animals, and secure food and scented items in your pack. Your guide briefs the group on moose and bear encounter basics and carries bear spray when appropriate for the route.',
    },
    {
      question: 'Do I need a reservation for Maroon Bells?',
      answer:
        'In peak season, personal vehicles are restricted and timed reservations or shuttles apply. Rules change year to year — we confirm the current system when you book and build your meet time around shuttle or permitted access.',
    },
    {
      question: 'Lightning and afternoon storms — how do you handle them?',
      answer:
        'We schedule alpine starts early when possible and avoid high ridges after noon when thunderstorms are forecast. If cells build, we descend to tree line or shorten the hike. Your safety outweighs summits or photo deadlines.',
    },
    {
      question: 'Can you supply any gear?',
      answer:
        'Guests typically bring personal clothing, footwear, and packs. We can often help with trekking poles or suggest local shops for last-minute items. We do not replace broken-in boots — poor footwear ruins more hikes than anything else.',
    },
  ],
  cta_phone: '(970) 456-3666',
  cta_text: 'Book a Guided Hiking Tour',
}
