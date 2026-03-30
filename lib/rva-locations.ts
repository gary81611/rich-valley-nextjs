export interface Location {
  slug: string
  name: string
  tagline: string
  description: string
  driveFromAspen: string
  rivers: string[]
  activities: string[]
  highlights: string[]
  faq: { q: string; a: string }[]
}

export const LOCATIONS: Location[] = [
  {
    slug: 'aspen', name: 'Aspen', tagline: 'The heart of the Roaring Fork Valley',
    description: 'Aspen is the base of operations for Rich Valley Adventures. From world-class fly fishing on the Roaring Fork River to guided hiking, snowshoeing, and Chauffeur Guided Tours and Excursions through historic landmarks — Aspen offers adventure year-round.',
    driveFromAspen: 'Home base',
    rivers: ['Roaring Fork River', 'Castle Creek', 'Maroon Creek'],
    activities: ['Fly Fishing', 'Guided Hiking', 'Snowshoeing', 'Chauffeur Guided Tours', 'Mountain Biking', 'Cross-Country Skiing'],
    highlights: ['Gold medal trout water', 'Maroon Bells scenic area', 'Historic downtown', 'Four ski mountains'],
    faq: [
      { q: 'What fly fishing is available in Aspen?', a: 'The Roaring Fork River runs through Aspen offering excellent trout fishing. Rich Valley Adventures provides guided trips with all gear included, starting at $250 per person.' },
      { q: 'What guided hikes are available from Aspen?', a: 'We offer guided hikes ranging from easy valley walks to challenging alpine treks. Half-day (3-4 hours) and full-day (6-8 hours) options available, all gear and transport included.' },
    ],
  },
  {
    slug: 'basalt', name: 'Basalt', tagline: 'Gateway to the Frying Pan River',
    description: 'Basalt sits at the confluence of the Frying Pan and Roaring Fork Rivers — two of Colorado\'s premier fly fishing destinations. The Old Town Basalt Private Ranch on the Roaring Fork offers exclusive private water access through Rich Valley Adventures.',
    driveFromAspen: '~25 min',
    rivers: ['Frying Pan River', 'Roaring Fork River'],
    activities: ['Fly Fishing', 'Private Water Access', 'Guided Hiking', 'Mountain Biking'],
    highlights: ['Old Town Basalt Private Ranch (private water access)', 'Frying Pan River gold medal water', 'Family-friendly fishing'],
    faq: [
      { q: 'What is the Old Town Basalt Private Ranch?', a: 'It\'s exclusive private water access on the Roaring Fork River available only through Rich Valley Adventures. Less fishing pressure means more fish and a premium experience.' },
      { q: 'Is the Frying Pan River good for fly fishing?', a: 'The Frying Pan below Ruedi Reservoir is one of Colorado\'s finest tailwaters — cold, consistent flows produce excellent year-round trout fishing.' },
    ],
  },
  {
    slug: 'carbondale', name: 'Carbondale', tagline: 'Crystal River Valley adventures',
    description: 'Carbondale offers access to the Crystal River, local trails, and seasonal activities. A thriving arts community with a small-town feel, Carbondale is a perfect base for exploring the mid-valley region.',
    driveFromAspen: '~35 min',
    rivers: ['Crystal River', 'Roaring Fork River'],
    activities: ['Fly Fishing', 'Hiking', 'Mountain Biking', 'Seasonal Activities'],
    highlights: ['Crystal River access', 'Marble and Redstone nearby', 'Local arts scene'],
    faq: [{ q: 'Can I fish the Crystal River?', a: 'Yes. The Crystal River offers beautiful scenery and quality trout fishing. Rich Valley Adventures guides know the best access points and techniques for this water.' }],
  },
  {
    slug: 'glenwood-springs', name: 'Glenwood Springs', tagline: 'Colorado River gateway',
    description: 'Glenwood Springs sits at the confluence of the Roaring Fork and Colorado Rivers. Known for hot springs and Glenwood Canyon, it\'s also excellent fishing territory with access to larger water.',
    driveFromAspen: '~50 min',
    rivers: ['Colorado River', 'Roaring Fork River'],
    activities: ['Fly Fishing', 'Float Trips', 'Hiking', 'Chauffeur Guided Tours'],
    highlights: ['Colorado River access', 'Glenwood Canyon', 'Hot springs area'],
    faq: [{ q: 'Can I fish the Colorado River from Glenwood Springs?', a: 'Absolutely. The Colorado River near Glenwood Springs offers excellent trout and bass fishing. Our guides specialize in both wade and float trips on this stretch.' }],
  },
  {
    slug: 'snowmass', name: 'Snowmass', tagline: 'Mountain adventures for families',
    description: 'Snowmass Village offers family-friendly adventures with stunning mountain scenery. From summer hiking to winter snowshoeing, Snowmass is perfect for groups of all ages and ability levels.',
    driveFromAspen: '~15 min',
    rivers: ['Snowmass Creek', 'Brush Creek'],
    activities: ['Family Adventures', 'Guided Hiking', 'Snowshoeing', 'Mountain Biking', 'Ski Mountain Shuttle'],
    highlights: ['Family-friendly terrain', 'Snowmass ski area', 'Summer wildflower hikes'],
    faq: [{ q: 'What family activities are available in Snowmass?', a: 'Rich Valley Adventures offers family hiking, kids fishing with Bobby Regan, snowshoeing, and more. All trips include transport by Aspen Alpenglow Limousine.' }],
  },
  {
    slug: 'marble-redstone', name: 'Marble & Redstone', tagline: 'Historic beauty, pristine waters',
    description: 'The Crystal River Valley between Carbondale and Marble offers some of the most scenic drives and pristine fishing water in Colorado. Historic Redstone and the marble quarries provide a unique backdrop for adventure.',
    driveFromAspen: '~1 hr',
    rivers: ['Crystal River'],
    activities: ['Fly Fishing', 'Chauffeur Guided Tours', 'Photography', 'Historic Tours'],
    highlights: ['Crystal River fishing', 'Historic Redstone Inn', 'Marble quarries', 'Scenic drives'],
    faq: [{ q: 'How do I get to Marble from Aspen?', a: 'Marble is about 1 hour from Aspen via Carbondale. Book a Chauffeur Guided Tour with Rich Valley Adventures for the most comfortable and informative journey, with transport by Aspen Alpenglow Limousine.' }],
  },
  {
    slug: 'vail', name: 'Vail', tagline: 'Expanded adventure options',
    description: 'Vail and the Eagle River Valley offer additional fishing and outdoor adventure opportunities. Rich Valley Adventures provides guided trips with luxury transport by Aspen Alpenglow Limousine.',
    driveFromAspen: '~2 hr',
    rivers: ['Eagle River', 'Gore Creek'],
    activities: ['Fly Fishing', 'Guided Hiking', 'Chauffeur Guided Tours'],
    highlights: ['Eagle River fishing', 'Gore Creek', 'Vail Village'],
    faq: [{ q: 'Do you offer guided trips from Vail?', a: 'Yes. We provide guided adventures from Vail with luxury SUV or Sprinter transport by Aspen Alpenglow Limousine. $850 for transport between Aspen and Vail.' }],
  },
  {
    slug: 'telluride', name: 'Telluride', tagline: 'Remote mountain adventure packages',
    description: 'Telluride offers remote mountain adventures in one of Colorado\'s most stunning settings. Rich Valley Adventures coordinates multi-day adventure packages with luxury transport.',
    driveFromAspen: '~4 hr',
    rivers: ['San Miguel River'],
    activities: ['Multi-Day Adventures', 'Fly Fishing', 'Chauffeur Guided Tours', 'Photography'],
    highlights: ['San Miguel River', 'Box Canyon', 'Remote wilderness', 'Historic mining town'],
    faq: [{ q: 'How do I get from Aspen to Telluride?', a: 'The drive is about 4 hours through beautiful mountain passes. Aspen Alpenglow Limousine offers the transfer for $1,475 in a luxury SUV with WiFi and Starlink.' }],
  },
  {
    slug: 'buena-vista-salida', name: 'Buena Vista & Salida', tagline: 'Arkansas River high-altitude adventures',
    description: 'The Arkansas River headwaters near Buena Vista and Salida offer outstanding fishing and outdoor recreation at altitude. Known for whitewater and wild trout, this region is a premier Colorado destination.',
    driveFromAspen: '~2.5 hr',
    rivers: ['Arkansas River', 'South Platte tributaries'],
    activities: ['Fly Fishing', 'Guided Hiking', 'High-Altitude Adventures'],
    highlights: ['Arkansas River headwaters', 'Collegiate Peaks Wilderness', '14ers nearby'],
    faq: [{ q: 'Is the Arkansas River good for fly fishing?', a: 'The Arkansas River near Buena Vista and Salida offers excellent brown and rainbow trout fishing. Rich Valley Adventures guides have deep knowledge of this water.' }],
  },
  {
    slug: 'twin-lakes', name: 'Twin Lakes', tagline: 'High mountain lake fishing',
    description: 'Twin Lakes sits at 9,200 feet at the base of Colorado\'s highest peaks. These alpine lakes offer unique fishing for lake trout and brook trout in a stunning high-mountain setting.',
    driveFromAspen: '~1.5 hr (summer via Independence Pass)',
    rivers: ['Twin Lakes', 'Lake Creek'],
    activities: ['Lake Fishing', 'Ice Fishing (winter)', 'Hiking', 'Photography'],
    highlights: ['Alpine lake fishing', 'Independence Pass (summer)', 'Mt. Elbert views', 'Brook trout'],
    faq: [{ q: 'Can I fish Twin Lakes?', a: 'Yes. Twin Lakes offers lake trout and brook trout fishing in a spectacular alpine setting. In winter, we offer guided ice fishing trips. All gear and transport included.' }],
  },
]
