/**
 * Seed rows for Aspen Alpenglow Limousine `service_areas` (site_key = alpenglow).
 * Run: `npx tsx scripts/seed-aal-service-areas.ts` with service role env vars.
 */
export type AalFaqPair = { question: string; answer: string }

export type AalServiceAreaSeedRow = {
  name: string
  slug: string
  description: string
  long_description: string
  key_destinations: string[]
  display_order: number
  site_key: 'alpenglow'
  is_active: boolean
  meta_title: string
  meta_description: string
  faq_schema: AalFaqPair[]
}

export const AAL_SERVICE_AREAS_SEED: AalServiceAreaSeedRow[] = [
  {
    name: 'Aspen',
    slug: 'aspen',
    display_order: 1,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Aspen Limo & Private Car Service | Airport ASE | Aspen Alpenglow',
    meta_description:
      'Private car and SUV service in Aspen, Colorado—ASE airport transfers, hotels, hourly charter. All-inclusive rates, 24/7. WiFi-equipped Suburbans & Transit van.',
    description:
      'Door-to-door luxury transportation across Aspen and Aspen/Pitkin County Airport (ASE)—ideal for ski weeks, events, and night-out plans.',
    long_description: `Aspen Alpenglow Limousine is headquartered in the Roaring Fork Valley and provides discreet, all-inclusive private car service throughout Aspen and the immediate town core. Whether you are stepping off a flight at ASE, checking in at a downtown hotel, or heading to a performance or dinner reservation, your chauffeur handles luggage, routing, and winter road conditions while you relax.

We specialize in predictable, flat-rate airport transfers, responsive hourly charter, and coordinated multi-stop itineraries for families and corporate groups. Every ride includes complimentary amenities, professional chauffeurs, and the same 24/7 availability Aspen visitors expect during peak holiday weeks.

From the Aspen core to Red Mountain, Starwood, and West Aspen addresses, we plan timing around local traffic patterns and event calendars so you are never guessing when your vehicle will arrive.`,
    key_destinations: [
      'Aspen/Pitkin County Airport (ASE)',
      'Downtown Aspen & Cooper Avenue',
      'The Little Nell & Limelight Aspen',
      'Hotel Jerome & St. Regis Aspen',
      'Aspen Mountain Gondola / Ajax',
      'Benedict Music Tent / Aspen Music Festival',
      'Wheeler Opera House',
      'Aspen Art Museum',
    ],
    faq_schema: [
      {
        question: 'Do you pick up at Aspen/Pitkin County Airport (ASE)?',
        answer:
          'Yes. We offer meet-and-greet ASE pickups with flight tracking, luggage assistance, and thirty minutes of complimentary wait time on arrivals. Rates are all-inclusive with no added service charge or gratuity.',
      },
      {
        question: 'Can we book hourly service in Aspen instead of point-to-point?',
        answer:
          'Yes. Chartered hourly service is available with a four-hour minimum and is ideal for shopping, dining, multi-stop evenings, and flexible mountain-town schedules.',
      },
      {
        question: 'What vehicles serve Aspen?',
        answer:
          'Our fleet includes two late-model Chevrolet Suburbans (up to seven passengers each) and a Ford Transit Van (up to fourteen passengers), all with WiFi, XM Radio, complimentary water, and ski/luggage racks as equipped.',
      },
    ],
  },
  {
    name: 'Snowmass Village',
    slug: 'snowmass-village',
    display_order: 2,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Snowmass Village Car Service | Private Transfers | Aspen Alpenglow',
    meta_description:
      'Luxury SUV and van service to Snowmass Village, CO—Aspen airport transfers, Base Village, ski condos, weddings. All-inclusive pricing. Call 970-456-3666.',
    description:
      'Reliable private transportation to Snowmass Village from ASE, Aspen, and regional airports—perfect for ski trips, weddings, and family groups.',
    long_description: `Snowmass Village sits minutes west of Aspen and deserves the same polished arrival experience as downtown. Aspen Alpenglow Limousine provides private Chevrolet Suburban and Ford Transit Van service to Base Village, Snowmass Mall, luxury residences, and rental communities throughout the upper valley.

We coordinate timing around ski-school drop-offs, wedding weekends, and multi-generational travel. Drivers know seasonal traffic on Brush Creek Road and Snowmass Creek Divide alternatives, helping you avoid unnecessary delays during peak winter Saturdays and holiday festivals.

Service is available 24 hours a day for early-morning powder days, late après-ski returns, and everything in between.`,
    key_destinations: [
      'Snowmass Base Village',
      'Snowmass Mall & Treehouse Kids Adventure Center',
      'Viceroy Snowmass & Wildwood Snowmass',
      'Snowmass Club & golf communities',
      'Two Creeks & residential enclaves',
    ],
    faq_schema: [
      {
        question: 'How long does it take to drive from Aspen to Snowmass Village?',
        answer:
          'Most trips between Aspen and Snowmass Village take about fifteen to twenty minutes depending on weather, traffic on Brush Creek Road, and your exact pickup or drop-off address.',
      },
      {
        question: 'Can you transport ski gear and large groups in Snowmass?',
        answer:
          'Yes. Suburbans include ski racks and generous cargo space; the Ford Transit Van carries up to fourteen passengers for larger families and corporate retreats.',
      },
      {
        question: 'Are Snowmass transfers all-inclusive?',
        answer:
          'Yes. Published rates are fully all-inclusive—no hidden service charges or automatic gratuity added on top.',
      },
    ],
  },
  {
    name: 'Basalt',
    slug: 'basalt',
    display_order: 3,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Basalt & Midvalley Car Service | Aspen Alpenglow Limousine',
    meta_description:
      'Private car service in Basalt and the midvalley—Willits, El Jebel, and Roaring Fork corridor. Airport runs to ASE, DEN, and EGE. 24/7 booking.',
    description:
      'Comfortable SUV and van transportation for Basalt, Willits, and the midvalley—commutes, airport connections, and event shuttles.',
    long_description: `Basalt anchors the midvalley lifestyle corridor between Aspen and Glenwood Springs. Aspen Alpenglow Limousine serves downtown Basalt, Willits Town Center, El Jebel, and surrounding neighborhoods with the same premium fleet standards we maintain for Aspen clients.

Whether you are closing a real-estate showing, commuting to ASE for an early departure, or coordinating dinner service between Basalt and Aspen, we build itineraries that respect Roaring Fork Valley drive times and seasonal weather windows.

All rides include professional chauffeurs, complimentary amenities, and transparent all-inclusive pricing.`,
    key_destinations: [
      'Willits Town Center',
      'Downtown Basalt & Midland Avenue',
      'Crown Mountain Park events',
      'El Jebel & Blue Lake',
      'Frying Pan Valley access points',
    ],
    faq_schema: [
      {
        question: 'Do you serve Willits and newer Basalt developments?',
        answer:
          'Yes. We regularly pick up and drop off in Willits, El Jebel, and established Basalt neighborhoods—just provide the exact address or business name when booking.',
      },
      {
        question: 'Can we book Basalt to Denver International Airport (DEN)?',
        answer:
          'Yes. Long-distance transfers between the midvalley and DEN are available with flat, all-inclusive SUV pricing and experienced mountain-road chauffeurs.',
      },
      {
        question: 'Is Basalt service available late at night?',
        answer:
          'Yes. We operate twenty-four hours a day, seven days a week, including early ASE departures and late-night returns.',
      },
    ],
  },
  {
    name: 'Carbondale',
    slug: 'carbondale',
    display_order: 4,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Carbondale Private Car Service | Roaring Fork Valley | Alpenglow',
    meta_description:
      'Luxury transportation in Carbondale, CO—Aspen and airport transfers, Crystal River events, corporate travel. Suburbans & 14-passenger van. All-inclusive.',
    description:
      'Private SUV and van service for Carbondale, the Crystal River Valley, and connections to Aspen, Glenwood, and Colorado airports.',
    long_description: `Carbondale blends ranch heritage with a vibrant arts and food scene. Aspen Alpenglow Limousine supports residents and visitors with discreet door-to-door service for airport runs, wedding weekends at local venues, and corporate retreats along the Crystal River corridor.

We understand the extra mileage from Carbondale to Aspen during festivals and powder mornings, and we quote clearly so groups can budget accurately. Every itinerary factors in Roaring Fork Valley weather, construction seasons, and event traffic.

Expect the same polished communication, flight monitoring on airport jobs, and all-inclusive pricing you receive in Aspen proper.`,
    key_destinations: [
      'Downtown Carbondale & Main Street',
      'Third Street Center & arts venues',
      'Crystal River access points',
      'Mt. Sopris area residences',
      'Neighborhoods along Highway 133',
    ],
    faq_schema: [
      {
        question: 'How far is Carbondale from Aspen by car?',
        answer:
          'Typical drive times are about thirty-five to forty-five minutes between Carbondale and Aspen depending on weather, traffic, and your exact addresses.',
      },
      {
        question: 'Do you offer Carbondale to Eagle County Airport (EGE) transfers?',
        answer:
          'Yes. We provide private service between Carbondale and EGE with experienced chauffeurs who monitor road conditions along I-70 and the Glenwood Canyon corridor when applicable.',
      },
      {
        question: 'Can we split stops between Carbondale and multiple valley towns?',
        answer:
          'Yes. Hourly charter or customized routing is available—share your full itinerary when booking so we can allocate the right vehicle and timing.',
      },
    ],
  },
  {
    name: 'Glenwood Springs',
    slug: 'glenwood-springs',
    display_order: 5,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Glenwood Springs Limo Service | Aspen Transfers | Aspen Alpenglow',
    meta_description:
      'Private car service in Glenwood Springs—hot springs, hotels, EGE connections, and Aspen transfers. All-inclusive SUV & van rates. Available 24/7.',
    description:
      'Luxury transportation for Glenwood Springs visitors and locals—hot springs resorts, downtown hotels, and efficient links to Aspen and Eagle Airport.',
    long_description: `Glenwood Springs is the gateway where the Roaring Fork River meets the Colorado River. Aspen Alpenglow Limousine provides elevated private car service for guests staying at the historic hot springs resorts, boutique downtown hotels, and residential neighborhoods along the valley floor.

We frequently coordinate pickups after Amtrak arrivals, Sunlight Mountain ski days, and Iron Mountain Hot Springs evenings. Chauffeurs understand Glenwood Canyon closures and alternate routing when winter weather impacts I-70.

Whether you need a direct transfer to Aspen or a multi-stop day that pairs Glenwood dining with Roaring Fork Valley activities, we deliver consistent, all-inclusive service.`,
    key_destinations: [
      'Glenwood Hot Springs Resort & Spa of the Rockies',
      'Hotel Colorado & Hotel Denver',
      'Iron Mountain Hot Springs',
      'Downtown Glenwood dining district',
      'Glenwood Meadows retail',
    ],
    faq_schema: [
      {
        question: 'Can you drive from Glenwood Springs to Aspen?',
        answer:
          'Yes. Glenwood Springs to Aspen typically takes forty-five to sixty minutes depending on weather and traffic along Highway 82.',
      },
      {
        question: 'Do you provide service to Eagle County Regional Airport (EGE) from Glenwood?',
        answer:
          'Yes. Many clients use private SUV service between Glenwood Springs and EGE for ski-season flights—we monitor flight status and adjust pickup times accordingly.',
      },
      {
        question: 'Are hot springs resort pickups included in flat rates?',
        answer:
          'Rates are quoted based on your exact pickup and drop-off addresses. Share resort names and arrival details when booking so we can confirm all-inclusive pricing.',
      },
    ],
  },
  {
    name: 'Eagle / Vail',
    slug: 'eagle-vail',
    display_order: 6,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Vail & Eagle County Car Service | EGE Airport | Aspen Alpenglow',
    meta_description:
      'Private transfers between Aspen and Vail, Beaver Creek, and Eagle County Airport (EGE). Luxury Suburbans & 14-pass van. All-inclusive mountain pricing.',
    description:
      'Long-distance private car service connecting the Roaring Fork Valley with Vail, Beaver Creek, and Eagle County Regional Airport (EGE).',
    long_description: `Aspen Alpenglow Limousine operates experienced mountain-road chauffeurs for the high-demand corridor between Aspen and the Vail Valley. We serve Eagle County Regional Airport (EGE), Vail Village, Lionshead, Avon, and Beaver Creek with Chevrolet Suburbans and our fourteen-passenger Ford Transit Van.

These transfers cross high mountain passes and can be affected by snow, wind, and I-70 incidents. We build padding into itineraries, monitor CDOT alerts, and communicate proactively if timing needs to shift.

Ideal for split-resort ski weeks, corporate incentives, and wedding parties moving between Aspen and Vail venues.`,
    key_destinations: [
      'Eagle County Regional Airport (EGE)',
      'Vail Village & Lionshead',
      'Beaver Creek Resort & Bachelor Gulch',
      'Avon transit center area',
    ],
    faq_schema: [
      {
        question: 'How long is the drive between Aspen and Vail?',
        answer:
          'Most Aspen–Vail private transfers take about two hours under normal conditions, but winter weather or I-70 delays can extend travel time. We monitor conditions and advise if earlier departures are prudent.',
      },
      {
        question: 'Do you offer EGE airport pickups?',
        answer:
          'Yes. We provide meet-and-greet service at Eagle County Regional Airport with luggage assistance and flight tracking.',
      },
      {
        question: 'Can larger groups travel between Aspen and Vail in one vehicle?',
        answer:
          'Groups up to fourteen passengers can ride in our Ford Transit Van; smaller parties typically choose dual Suburbans for extra luggage capacity.',
      },
    ],
  },
  {
    name: 'Denver',
    slug: 'denver',
    display_order: 7,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Denver to Aspen Private Car | DEN Airport Transfers | Alpenglow',
    meta_description:
      'Flat-rate, all-inclusive private SUV service between Denver International Airport (DEN) and Aspen. ~3.5–4 hr drive. WiFi-equipped Suburbans. Book 970-456-3666.',
    description:
      'Flat, all-inclusive private car service between Denver International Airport (DEN) and Aspen—ideal after long-haul flights and ski-season arrivals.',
    long_description: `The Denver International Airport to Aspen corridor is one of our most requested routes. Aspen Alpenglow Limousine provides door-to-door Chevrolet Suburban service with experienced chauffeurs who know when to traverse I-70, how Glenwood Canyon weather impacts timing, and where to stage fuel or comfort stops for families.

We monitor inbound flights, assist with luggage at DEN arrivals, and include generous wait-time policies so you are not rushed after baggage claim. Rates are fully all-inclusive—no surprise service charges or automatic gratuity.

Denver metro and Centennial Airport (KAPA) pickups can also be arranged for private aviation and corporate travelers—share tail numbers or FBO details when booking.`,
    key_destinations: [
      'Denver International Airport (DEN)',
      'Downtown Denver hotels & convention center',
      'Cherry Creek & Cherry Hills Village',
      'Centennial Airport (KAPA) / private aviation',
    ],
    faq_schema: [
      {
        question: 'How much does a private car from Denver Airport to Aspen cost?',
        answer:
          'Our Aspen to Denver International Airport transfer is quoted at a flat, all-inclusive SUV rate—contact us for the current published price, Sprinter options, and multi-vehicle needs.',
      },
      {
        question: 'How long does DEN to Aspen take?',
        answer:
          'Most transfers take approximately three and a half to four hours depending on weather, traffic through Glenwood Canyon, and your exact Aspen address.',
      },
      {
        question: 'Do you offer private aviation pickups in Denver?',
        answer:
          'Yes. Provide your FBO, tail number, and ETA—we coordinate ramp-side or terminal pickups at Centennial (KAPA) and other metro airports as arranged.',
      },
    ],
  },
  {
    name: 'Rifle',
    slug: 'rifle',
    display_order: 8,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Rifle KRIL Airport Car Service | Aspen Transfers | Aspen Alpenglow',
    meta_description:
      'Private SUV service to Rifle Garfield County Airport (KRIL) and the I-70 corridor—Aspen connections, energy-sector travel, all-inclusive rates.',
    description:
      'Private transportation for Rifle Garfield County Airport (KRIL), western Garfield County, and efficient links to Aspen and the Roaring Fork Valley.',
    long_description: `Rifle Garfield County Airport (KRIL) serves corporate, energy-sector, and recreational travelers along the Western Slope. Aspen Alpenglow Limousine provides long-distance private SUV and van service between KRIL, Rifle businesses, and Aspen when clients need predictable mountain-road expertise.

We plan for I-70 variability, canyon closures, and late-night arrivals. Chauffeurs arrive with clear signage, assist with luggage, and maintain the same amenity standards as our Aspen-based rides.

Share tail numbers, crew manifests, or production schedules when booking so we can coordinate timing with airport operations.`,
    key_destinations: [
      'Rifle Garfield County Airport (KRIL)',
      'Downtown Rifle & I-70 corridor businesses',
      'Garfield County industrial & energy campuses',
    ],
    faq_schema: [
      {
        question: 'Do you pick up at KRIL (Rifle) airport?',
        answer:
          'Yes. We provide private meet-and-greet service at Rifle Garfield County Airport with flight tracking when tail numbers or airline details are provided.',
      },
      {
        question: 'How long is the drive from Rifle to Aspen?',
        answer:
          'Travel time varies with I-70 and Glenwood Canyon conditions; most private transfers take roughly two to two and a half hours under normal weather.',
      },
      {
        question: 'Is pricing all-inclusive for Rifle transfers?',
        answer:
          'Yes. We quote flat, all-inclusive SUV rates unless you request a Sprinter or multiple vehicles—no hidden service fees.',
      },
    ],
  },
  {
    name: 'Grand Junction',
    slug: 'grand-junction',
    display_order: 9,
    site_key: 'alpenglow',
    is_active: true,
    meta_title: 'Grand Junction GJT to Aspen Private Car | Aspen Alpenglow',
    meta_description:
      'Private car service from Grand Junction Regional Airport (GJT) to Aspen and Snowmass—diversion support, wine country, all-inclusive SUV & van rates.',
    description:
      'Long-distance private transportation from Grand Junction Regional Airport (GJT), downtown Grand Junction, and Colorado wine country to Aspen.',
    long_description: `Grand Junction Regional Airport (GJT) is a key alternate when mountain weather affects ASE or when travelers explore Colorado’s wine country before heading to Aspen. Aspen Alpenglow Limousine provides private Chevrolet Suburban and Ford Transit Van service for the roughly two-and-a-half-hour mountain transition into the Roaring Fork Valley.

We support airline diversions, multi-day itineraries that start in Palisade or Grand Junction, and corporate groups needing predictable, all-inclusive pricing. Chauffeurs monitor road conditions over the Grand Mesa and along Highway 82, adjusting departure times when warranted.

Tell us if you are connecting from a commercial diversion, private aircraft, or a wine-country tour so we can coordinate seamless handoffs.`,
    key_destinations: [
      'Grand Junction Regional Airport (GJT)',
      'Downtown Grand Junction & Colorado Mesa University area',
      'Palisade & Grand Valley wine country',
      'I-70 business corridor staging points',
    ],
    faq_schema: [
      {
        question: 'Do you offer Grand Junction airport pickups when flights divert from Aspen?',
        answer:
          'Yes. Provide airline updates or dispatch contacts—we monitor arrival changes and can meet you at GJT with signage, luggage help, and direct service to Aspen or Snowmass.',
      },
      {
        question: 'How long does it take to drive from Grand Junction to Aspen?',
        answer:
          'Most transfers take about two and a half hours depending on weather over the Grand Mesa and traffic on Highway 82 near Glenwood Springs.',
      },
      {
        question: 'Can you combine Grand Junction wine-country touring with Aspen drop-off?',
        answer:
          'Yes. Hourly charter and custom routing are available—share your tasting schedule and Aspen arrival deadline so we can plan the right vehicle and timing.',
      },
    ],
  },
]
