import type { SupabaseClient } from '@supabase/supabase-js'
import type { CmsPage } from './pages'

type PageSeed = Omit<CmsPage, 'id' | 'created_at' | 'updated_at'>

// ─── RVA PAGE CONTENT ────────────────────────────────────────────────────────

const rvaPages: PageSeed[] = [
  {
    site_id: 'rva',
    slug: 'fly-fishing',
    title: 'Guided Fly Fishing in Aspen & the Roaring Fork Valley',
    meta_title: 'Guided Fly Fishing Aspen CO | Roaring Fork River | Rich Valley Adventures',
    meta_description: 'Expert-guided fly fishing trips on the Roaring Fork River, Frying Pan River, and Crystal River near Aspen, CO. All skill levels welcome. Equipment provided. Book today.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Fly Fishing in Aspen & the Roaring Fork Valley',
      hero_subtitle: 'Cast on Colorado\'s Gold Medal Waters with Expert Local Guides',
      intro: `The Roaring Fork Valley is one of the most storied fly fishing destinations in the American West. From the crystalline riffles of the upper Roaring Fork River above Aspen to the legendary tailwater of the Frying Pan River below Ruedi Reservoir, these Gold Medal-designated waters hold trophy-class wild brown and rainbow trout year-round.\n\nRich Valley Adventures has been guiding anglers on these rivers since 2012. Our guides grew up fishing these drainages and know every productive run, seam, and riffle across seasons. Whether you\'re picking up a fly rod for the first time or you\'re a seasoned angler chasing your personal best, we tailor every trip to your experience level and goals.\n\nWe offer half-day and full-day guided wading trips from May through October. All gear is provided — premium fly rods, reels, waders, wading boots, and a full fly selection matched to current hatch conditions. Our catch-and-release philosophy protects these waters for generations of anglers to come.`,
      h2_sections: [
        {
          title: 'The Roaring Fork River — Gold Medal Fly Fishing Near Aspen',
          content: `The Roaring Fork River flows 70 miles from its headwaters near Independence Pass through Aspen, Basalt, and Carbondale before joining the Colorado River at Glenwood Springs. The stretch through and below Aspen is designated Gold Medal water by Colorado Parks & Wildlife — a designation reserved for waters that consistently produce large wild trout in exceptional numbers.\n\nBrown trout averaging 14–18 inches are common, with fish over 20 inches taken regularly by our guides. Hatches of PMDs, caddis, green drakes, and Trico spinners make dry fly fishing thrilling from June through September. In the spring and fall, streamers and nymphs produce aggressive strikes from the river\'s biggest fish.`,
        },
        {
          title: 'The Frying Pan River — Colorado\'s Premier Tailwater Fishery',
          content: `Just 15 miles from Basalt, the Frying Pan River below Ruedi Reservoir is widely considered one of the top tailwater fisheries in North America. The cold, nutrient-rich water released from the dam creates an almost year-round midge hatch and supports an extraordinary density of large wild trout — browns and rainbows averaging 16–22 inches.\n\nThe Frying Pan demands technical precision: long leaders, small flies, and delicate presentations. Our guides excel at teaching the nuances of tailwater nymphing and the art of fishing size-22 midge clusters to selective risers. This river rewards patience and skill — and the payoff is the fish of a lifetime.`,
        },
        {
          title: 'What\'s Included in Your Guided Fly Fishing Trip',
          content: `Every guided trip includes all fishing equipment (fly rods, reels, lines, waders, boots, and flies), a Colorado fishing license fee credit, streamside lunch on full-day trips, professional photography of your catches, and transportation to and from the river if needed. We keep groups small — a maximum of four anglers per guide — to ensure personalized instruction and the best possible water access. Trips depart from Aspen or Basalt depending on the day\'s river conditions.`,
        },
      ],
      features: [
        { title: 'All Equipment Provided', description: 'Premium Sage rods, Scientific Anglers lines, Simms waders and boots, and a full fly selection matched to current hatches.' },
        { title: 'All Skill Levels Welcome', description: 'From first-cast beginners to trophy hunters — we match your guide and itinerary to your experience.' },
        { title: 'Small Groups (Max 4)', description: 'Intimate guide-to-angler ratios mean more instruction, better water, and a more personal experience.' },
        { title: 'Half-Day & Full-Day Options', description: 'Choose a 4-hour morning or afternoon session, or go all-in with a full-day trip including riverside lunch.' },
        { title: 'Catch & Release', description: 'We practice strict catch-and-release to protect these wild fisheries and the next generation of anglers.' },
        { title: 'Guided Photography', description: 'We capture the moment so you can focus on the fight. Share-worthy shots of every big fish.' },
      ],
      faqs: [
        { question: 'Do I need a Colorado fishing license?', answer: 'Yes — Colorado requires a valid fishing license for anglers 16 and older. We can arrange licenses in advance and credit the fee toward your trip, or you can purchase one online at cpw.state.co.us before your trip.' },
        { question: 'What time of year is best for fly fishing near Aspen?', answer: 'The Roaring Fork Valley offers excellent fishing year-round. June through September is peak dry fly season with multiple hatches daily. October and November are prime for large browns in the fall spawn. The Frying Pan tailwater fishes well even in winter due to the stable, cold water temperatures from Ruedi Reservoir.' },
        { question: 'Can beginners go fly fishing with you?', answer: 'Absolutely. Beginners are welcome and we love introducing new anglers to the sport. Our guides are patient, enthusiastic teachers. Many of our most rewarding trips are with anglers casting a fly rod for the very first time.' },
        { question: 'How far in advance should I book?', answer: 'We recommend booking 2–4 weeks in advance for summer dates, especially June through August when demand is highest. Spring and fall dates are more available but still fill up. Contact us as early as possible to secure your preferred date.' },
        { question: 'What should I wear and bring?', answer: 'Dress in layers — Aspen mornings can be cool even in summer. Bring sunscreen, sunglasses with UV protection (essential for spotting fish), a hat, and snacks for the day. We provide all fishing gear and waders. Wear clothes you don\'t mind getting wet.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book Your Guided Fly Fishing Trip',
    },
  },
  {
    site_id: 'rva',
    slug: 'mountain-biking',
    title: 'Guided Mountain Biking in Aspen, Colorado',
    meta_title: 'Guided Mountain Biking Aspen CO | Trail Tours | Rich Valley Adventures',
    meta_description: 'Explore Aspen\'s best mountain bike trails with expert local guides. The 401 Trail, Hunter Creek, Smuggler Mountain, and more. All levels welcome. Equipment available.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Mountain Biking in Aspen, Colorado',
      hero_subtitle: 'Ride Aspen\'s World-Class Trails with Local Experts',
      intro: `Aspen sits at the center of one of the most celebrated mountain biking destinations in Colorado. With over 300 miles of singletrack and doubletrack within an hour of downtown, the Roaring Fork Valley draws riders from around the world seeking everything from mellow valley-bottom cruises to technical high-alpine epics.\n\nRich Valley Adventures offers guided mountain biking experiences tailored to your fitness level, technical ability, and the time you have available. Our guides know every trail in the valley — from the iconic 401 Trail above Crested Butte Pass to the fast, flowy descents of the Snowmass Trail Network and the hidden gems that only locals know.\n\nWe offer guided half-day and full-day rides from June through October, when Aspen\'s high-altitude trails are clear of snow and wildflowers are in full bloom. Whether you\'re a beginner looking to build confidence on terrain or an expert rider chasing the biggest days, we\'ll build your perfect Aspen mountain bike experience.`,
      h2_sections: [
        {
          title: 'Aspen\'s Signature Mountain Bike Trails',
          content: `The 401 Trail near Crested Butte is consistently ranked among the top mountain bike trails in the United States. This 10-mile singletrack loop combines a lung-busting climb through aspen groves and wildflower meadows with one of the most exhilarating descents in the Rockies — sweeping views of the Elk Mountains included.\n\nCloser to town, Hunter Creek Trail offers a challenging climb with panoramic views of the Roaring Fork Valley before linking into the ridge trails above Aspen. Smuggler Mountain Road is a classic Aspen climb for conditioning riders, while the Snowmass Trail Network provides a full progression from beginner greens to double-black expert lines.`,
        },
        {
          title: 'Guided Rides for Every Level',
          content: `We structure our guided rides around you. First-time mountain bikers get calm trail introductions with technique coaching — body position, braking, cornering, and descending with confidence. Intermediate riders push into flowing singletrack with technical features. Expert riders get access to the valley\'s most committing lines with guide support to unlock terrain they couldn\'t safely explore alone.\n\nAll rides include a pre-ride safety briefing, trailhead logistics, and real-time coaching throughout. Our guides ride alongside you — not just pointing at a map — so you get the full benefit of their local expertise on every descent and climb.`,
        },
      ],
      features: [
        { title: 'Local Trail Knowledge', description: 'Our guides have ridden every trail in the valley for years. No guesswork — just the best riding for your level.' },
        { title: 'All Levels Welcome', description: 'From first-time riders to advanced trail shredders, we match the ride to your abilities and goals.' },
        { title: 'Guided Technique Coaching', description: 'Learn cornering, braking, body position, and how to read trail features with hands-on instruction.' },
        { title: 'Half-Day & Full-Day Options', description: 'Morning, afternoon, or all-day guided rides available from late June through early October.' },
        { title: 'Small Groups', description: 'Maximum 6 riders per guide ensures personal attention and a better trail experience for everyone.' },
        { title: 'Seasonal Wildflower Routes', description: 'July rides through Colorado\'s wildflower season are bucket-list experiences — rolling meadows of columbine and Indian paintbrush.' },
      ],
      faqs: [
        { question: 'Do you provide bikes?', answer: 'We can arrange high-quality trail bike rentals from our partner shops in Aspen and Basalt. Let us know your height and riding style when booking and we\'ll have the right bike ready. Full-suspension trail bikes and e-bikes are available.' },
        { question: 'What fitness level do I need?', answer: 'Most Aspen trails involve significant elevation gain — 1,000 to 3,000+ feet depending on the route. We always choose trails appropriate for your fitness level. E-bikes are available for riders who want to focus on the descent experience over the climb.' },
        { question: 'Is mountain biking safe for kids?', answer: 'Yes — with the right trail selection. Aspen has excellent beginner-friendly trails and paved paths perfect for younger riders. We recommend ages 10+ for guided singletrack experiences, and can accommodate family groups with a mix of abilities.' },
        { question: 'What should I wear?', answer: 'A properly fitted helmet is mandatory and provided if needed. Wear padded mountain bike shorts or casual athletic wear. Bring a light layer for the descent — even summer ridgelines can be cool. Gloves, eye protection, and knee pads are recommended for technical terrain.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book Your Guided Mountain Bike Ride',
    },
  },
  {
    site_id: 'rva',
    slug: 'paddle-boarding',
    title: 'Stand Up Paddle Boarding in Aspen, Colorado',
    meta_title: 'Stand Up Paddle Boarding Aspen CO | SUP Tours | Rich Valley Adventures',
    meta_description: 'Stand up paddle boarding on stunning alpine lakes near Aspen, CO. Ruedi Reservoir, Grizzly Lake, and more. Lessons, rentals, and guided SUP tours for all skill levels.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Stand Up Paddle Boarding Near Aspen, Colorado',
      hero_subtitle: 'Explore Alpine Lakes with Mountain Views in Every Direction',
      intro: `Stand up paddle boarding in the Roaring Fork Valley offers something rare: glassy water surrounded by 14,000-foot peaks. Rich Valley Adventures guides SUP experiences on some of the most scenic alpine lakes in Colorado, from the vast calm of Ruedi Reservoir above Basalt to the intimate wilderness setting of Grizzly Lake near Independence Pass.\n\nOur paddle boarding trips are guided, unhurried, and designed for all experience levels. Beginners learn balance, paddling technique, and water safety in calm protected bays before venturing onto open water. Experienced paddlers explore more of the lake, take on light downwind runs, and push their endurance on longer crossings.\n\nAll equipment is provided — premium inflatable and hard SUP boards, adjustable paddles, Coast Guard-approved PFDs, and dry bags for your gear. We handle the logistics so you can focus entirely on the incredible scenery surrounding you.`,
      h2_sections: [
        {
          title: 'Ruedi Reservoir — Aspen\'s Premier SUP Destination',
          content: `Ruedi Reservoir sits at 7,700 feet elevation in the Frying Pan Valley, 15 miles east of Basalt. The 1,000-acre lake is fed by snowmelt from the surrounding White River National Forest and stays calm and glassy on most summer mornings — perfect conditions for paddle boarding.\n\nMorning paddles at Ruedi offer mirror reflections of the surrounding peaks and wildlife sightings that are rare anywhere else: osprey hunting the surface, great blue herons wading the shallows, deer drinking at the shoreline. On calm days, you can see 30 feet to the rocky bottom through the crystal-clear water.`,
        },
        {
          title: 'SUP Lessons for Beginners — Get on the Water Fast',
          content: `Never paddled before? No problem. Our beginner SUP sessions start on the beach with a 20-minute land-based orientation covering board anatomy, proper paddle grip and stroke mechanics, stance, and how to fall safely and get back on. By the time you step on the water, you\'ll have the fundamentals to paddle confidently.\n\nMost complete beginners are paddling independently within 30 minutes. Our instructors stay close throughout the lesson to provide real-time feedback and encouragement. Kids as young as 6 can participate on youth-specific boards with additional flotation support.`,
        },
      ],
      features: [
        { title: 'All Equipment Provided', description: 'Premium hard and inflatable SUP boards, carbon paddles, PFDs, and dry bags. Nothing to bring except sunscreen.' },
        { title: 'Beginner Lessons Available', description: 'Learn-to-SUP sessions get you standing and paddling confidently within the first 30 minutes.' },
        { title: 'Stunning Alpine Scenery', description: 'Glassy high-altitude lakes surrounded by 13,000–14,000 foot peaks — among the most scenic SUP venues in the country.' },
        { title: 'Wildlife Viewing', description: 'Osprey, herons, deer, and occasionally moose frequent Ruedi Reservoir and surrounding lakes.' },
        { title: 'Family Friendly', description: 'Kids as young as 6 welcome. Tandem boards available for parent-child paddling.' },
        { title: 'Morning & Afternoon Sessions', description: 'We schedule sessions for optimal calm-water conditions — typically morning for Ruedi and late afternoon for sheltered coves.' },
      ],
      faqs: [
        { question: 'Do I need prior experience to try paddle boarding?', answer: 'No experience needed at all. Our guided sessions start with a complete beginner orientation. Most people are paddling on their own within the first 30 minutes.' },
        { question: 'Is paddle boarding safe for kids?', answer: 'Yes — paddle boarding is one of the safest water sports. All participants wear Coast Guard-approved life vests. Children as young as 6 can participate, and younger kids can share a board with a parent.' },
        { question: 'How cold is the water?', answer: 'Mountain lake water in Colorado ranges from 55–70°F depending on time of year and elevation. We recommend wearing athletic clothes or a swimsuit you don\'t mind getting wet. Wetsuits are available upon request for early-season outings.' },
        { question: 'What if it\'s windy?', answer: 'Wind is the main variable for SUP. We monitor forecasts closely and may adjust meeting locations to more sheltered coves if wind develops. Safety is always the priority — we\'ll reschedule if conditions aren\'t right.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book a SUP Tour or Lesson',
    },
  },
  {
    site_id: 'rva',
    slug: 'hiking',
    title: 'Guided Hiking Tours in Aspen & Maroon Bells',
    meta_title: 'Guided Hiking Tours Aspen CO | Maroon Bells Hikes | Rich Valley Adventures',
    meta_description: 'Guided hiking tours in Aspen, Colorado. Maroon Bells, Cathedral Lake, Crater Lake, Conundrum Hot Springs, and more. Expert local guides for all fitness levels.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Hiking Tours in Aspen & Maroon Bells',
      hero_subtitle: 'Discover Colorado\'s Most Iconic Alpine Terrain with Local Experts',
      intro: `Aspen, Colorado sits at the doorstep of some of the most spectacular wilderness hiking in North America. The Elk Mountains surrounding the Roaring Fork Valley include five 14,000-foot peaks, the iconic Maroon Bells — the most photographed mountains in Colorado — and hundreds of miles of trails through wildflower meadows, alpine lakes, and ancient aspen groves.\n\nRich Valley Adventures offers small-group guided hiking tours for all fitness levels and interests. Whether you want a gentle walk through golden aspen groves in the fall, a wildflower ramble to Cathedral Lake in July, or a challenging ascent toward the Elk Mountain high country, our guides build your hike around your goals and abilities.\n\nEvery guided hike includes navigation, safety management, interpretive naturalist commentary about the local ecosystem and history, and the peace of mind that comes from hiking with someone who has done your route dozens of times. We keep groups small — typically 2–8 people — so every hiker gets personal attention and the trail experience they came for.`,
      h2_sections: [
        {
          title: 'Maroon Bells — Aspen\'s Crown Jewel',
          content: `The Maroon Bells Wilderness encompasses 181,000 acres of high alpine terrain just 12 miles from downtown Aspen. The two iconic peaks — Maroon Peak (14,156 ft) and North Maroon Peak (14,014 ft) — rise above Maroon Lake in a scene that has graced more Colorado calendar covers than any other.\n\nOur Maroon Bells guided hikes explore several of the area\'s most spectacular trails: the Crater Lake trail (3.6 miles round trip, suitable for most fitness levels), the Buckskin Pass approach (9 miles round trip, moderate-strenuous), and the West Maroon Pass trail that connects into Gothic and Crested Butte for multi-day epic options. We time our starts to beat the summer crowds and often have the trails nearly to ourselves in the golden morning light.`,
        },
        {
          title: 'Cathedral Lake & Upper Pearl Basin',
          content: `Cathedral Lake sits at 11,866 feet above the Roaring Fork Valley, reached by a 5.5-mile round-trip trail that climbs steeply through spruce-fir forest before opening into one of the most magical high basins in Colorado. The turquoise lake reflects the red and white cliffs of Cathedral Peak and the surrounding summits of the Elk Range.\n\nThe trail to Cathedral Lake ranks among Aspen\'s most rewarding day hikes — challenging enough to feel earned, but accessible to fit hikers of any age. In mid-July, the upper basin is carpeted in Colorado columbine, Indian paintbrush, and glacier lilies. Our guides bring the natural history to life with knowledge about the geology, flora, and wildlife of this exceptional ecosystem.`,
        },
      ],
      features: [
        { title: 'Expert Local Guides', description: 'Our guides have hiked these trails hundreds of times and bring deep knowledge of the local ecosystem, geology, and history.' },
        { title: 'All Fitness Levels', description: 'From gentle valley walks to challenging high-alpine routes — we match the hike to your abilities and aspirations.' },
        { title: 'Small Groups (Max 8)', description: 'Intimate group sizes ensure a personal experience and the flexibility to adjust pace and distance on the fly.' },
        { title: 'Naturalist Commentary', description: 'Learn about wildflower identification, Colorado geology, local wildlife, and Aspen\'s fascinating history.' },
        { title: 'Safety First', description: 'All guides carry first-aid kits, emergency communication devices, and are wilderness first responder certified.' },
        { title: 'Iconic Wildflower Season', description: 'Mid-July through early August brings Colorado\'s famous wildflower bloom — one of the world\'s great natural spectacles.' },
      ],
      faqs: [
        { question: 'What fitness level is required for your guided hikes?', answer: 'We offer hikes across the full spectrum — from easy 2-mile strolls to strenuous 10+ mile alpine routes. We always discuss your fitness level and hiking experience before recommending a route, and our guides set a pace that works for everyone in the group.' },
        { question: 'When is the best time to hike near Aspen?', answer: 'June through September is ideal. July and early August offer peak wildflower displays. September brings the famous golden aspen fall color — one of the great natural events in the Rockies. Snowshoe hikes are available November through March for winter enthusiasts.' },
        { question: 'Do I need hiking boots?', answer: 'Sturdy hiking boots or trail shoes with ankle support are strongly recommended for most routes. Avoid cotton socks — wool or synthetic moisture-wicking socks prevent blisters. Bring extra layers; Aspen\'s high-altitude weather changes quickly.' },
        { question: 'Are altitude effects something to worry about?', answer: 'Aspen sits at 7,908 feet elevation — most hikes reach 10,000–12,000 feet or higher. Altitude affects people differently. We always recommend spending 1–2 days acclimating in Aspen before strenuous hikes, staying hydrated, and eating well. Our guides are trained to recognize altitude illness symptoms.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book a Guided Hiking Tour',
    },
  },
  {
    site_id: 'rva',
    slug: 'snowshoeing',
    title: 'Guided Snowshoeing in Aspen, Colorado',
    meta_title: 'Guided Snowshoeing Aspen CO | Winter Wilderness Tours | Rich Valley Adventures',
    meta_description: 'Explore Aspen\'s winter wilderness on guided snowshoe tours. Ashcroft Ghost Town, Snowmass Creek Trail, and more. All equipment provided. Perfect for all ages and abilities.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Snowshoeing in Aspen, Colorado',
      hero_subtitle: 'Explore the Silent Winter Wilderness of the Elk Mountains',
      intro: `Aspen\'s winter landscape is one of the most beautiful on earth — and snowshoeing offers the most accessible way to experience it. Strap on a pair of modern snowshoes and the entire winter wilderness opens up: pristine spruce forests draped in snow, frozen alpine meadows glittering in the Colorado sun, and the profound silence of the backcountry with only the crunch of your footsteps.\n\nRich Valley Adventures offers guided snowshoeing tours from December through March on Aspen\'s most scenic winter routes. We match the tour to your experience level — whether you\'ve never worn snowshoes before or you\'re looking for a fitness-forward winter adventure. All snowshoes, poles, and safety equipment are provided.\n\nOur guides bring the winter landscape to life with stories of Aspen\'s silver mining history, wildlife tracking knowledge (snowshoeing is superb for finding animal tracks), and the natural history of a Colorado winter ecosystem. These are tours for the intellectually curious as much as the athletically inclined.`,
      h2_sections: [
        {
          title: 'Ashcroft Ghost Town Snowshoe Tour — Aspen\'s Best Winter Experience',
          content: `Ashcroft is one of Colorado\'s most atmospheric ghost towns — a silver mining camp from the 1880s that briefly rivaled Aspen in population before being abandoned when the ore ran out. In winter, Ashcroft sits under a thick blanket of snow in the upper Castle Creek Valley, surrounded by the high peaks of the Elk Mountains.\n\nOur Ashcroft snowshoe tour departs the ghost town\'s preserved 1880s buildings and follows the creek into the backcountry on a 3-5 mile loop. Wildlife tracking is excellent — this drainage hosts a year-round population of moose, elk, coyotes, and fox, all of whom leave their stories in the snow. Hot cocoa at the trailhead ends every tour.`,
        },
        {
          title: 'Snowmass Creek Trail — Powder & Peaks',
          content: `The Snowmass Creek Trail offers access to some of the deepest snow in the valley — the creek drainage funnels snowfall from the 14,000-foot peaks above Snowmass Wilderness and regularly accumulates 200+ inches of snow per season. In December and January, this trail offers spectacular powder snowshoeing through cathedral stands of old-growth Engelmann spruce.\n\nThis tour runs 4-6 miles depending on conditions and group fitness. We include a mid-tour break for warm beverages and wildlife spotting before returning to the trailhead. On clear days, the views north toward the Snowmass Ski Area and Capitol Peak are among the finest in the valley.`,
        },
      ],
      features: [
        { title: 'All Equipment Provided', description: 'Modern MSR snowshoes in all sizes, adjustable poles, and microspikes for icy sections are included in every tour.' },
        { title: 'No Experience Needed', description: 'If you can walk, you can snowshoe. We teach proper technique in the first 5 minutes and you\'re off.' },
        { title: 'Wildlife Tracking', description: 'Winter snow reveals the secret life of the forest. Learn to identify tracks from moose, elk, fox, coyote, and more.' },
        { title: 'Historical Interpretation', description: 'Tour routes include Aspen\'s silver mining ghost town — Ashcroft — with fascinating 1880s frontier history.' },
        { title: 'Hot Cocoa Included', description: 'Every tour ends with warm hot cocoa at the trailhead. A small but perfect way to close a winter adventure.' },
        { title: 'All Ages Welcome', description: 'Snowshoeing is suitable for all ages and fitness levels. Kids as young as 5 can participate on appropriate terrain.' },
      ],
      faqs: [
        { question: 'Do I need any prior experience?', answer: 'None whatsoever. Snowshoeing is the most accessible winter wilderness sport — if you can walk, you can snowshoe. Our guides demonstrate technique before you leave the trailhead and you\'ll be moving confidently within minutes.' },
        { question: 'How cold will it be?', answer: 'Winter temperatures in Aspen typically range from 15–35°F during the day. Dress in warm synthetic or wool layers — base layer, mid layer, and a wind/waterproof outer shell. Avoid cotton. Hand warmers are a nice addition. We provide a full gear list when you book.' },
        { question: 'Are snowshoe tours good for families?', answer: 'Snowshoeing is one of the best winter activities for families. Children as young as 5–6 can manage beginner terrain. We offer a family-specific tour route with gentle grades, wildlife-focused storytelling, and a hot cocoa finish that kids love.' },
        { question: 'What if it\'s snowing during the tour?', answer: 'Light to moderate snowfall makes for the most magical snowshoeing conditions — fresh powder underfoot and snow falling through the trees. We only cancel for severe weather (blizzard conditions, lightning risk). A dusting of new snow during a tour is considered a bonus.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book a Guided Snowshoe Tour',
    },
  },
  {
    site_id: 'rva',
    slug: 'transportation',
    title: 'Private Transportation Services in Aspen, Colorado',
    meta_title: 'Private Transportation Aspen CO | Airport Transfers | Rich Valley Adventures',
    meta_description: 'Private transportation services in Aspen, CO. Airport transfers from ASE and EGE, adventure transportation, Maroon Bells shuttles, and group transport in luxury Escalades.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Private Transportation Services in Aspen, Colorado',
      hero_subtitle: 'Comfortable, Reliable Transport for Every Adventure',
      intro: `Getting around Aspen — and getting to the wilderness trailheads, rivers, and lakes that make this valley special — requires local knowledge and reliable transportation. Rich Valley Adventures provides private transportation services that connect you seamlessly to every adventure we offer, and to the broader Roaring Fork Valley.\n\nOur primary transport vehicle is a luxury Cadillac Escalade — spacious, comfortable, and capable of handling Aspen\'s mountain roads in any season. Whether you need an airport pickup from Aspen/Pitkin County Airport or Eagle County Regional Airport, a shuttle to the Maroon Bells Wilderness trailhead, or transport between adventures across the valley, we provide professional door-to-door service.\n\nTransportation can be booked as a standalone service or bundled with any guided adventure. Bundle bookings receive discounted transport pricing.`,
      h2_sections: [
        {
          title: 'Airport Transfers — Aspen & Eagle County Airports',
          content: `Aspen/Pitkin County Airport (ASE) is one of the most scenic and operationally demanding airports in the United States, sitting at 7,820 feet elevation with challenging approach and departure procedures. Flights operate on limited schedules and weather cancellations are common — which makes reliable ground transportation from someone who knows local conditions essential.\n\nWe offer private transfers from ASE directly to your Aspen hotel, rental property, or residence. For guests flying into Eagle County Regional Airport (EGE) in Glenwood Springs — approximately 70 miles from Aspen — we provide comfortable inter-valley transfers that make the most of the spectacular drive through Glenwood Canyon and up the Roaring Fork Valley.`,
        },
        {
          title: 'Maroon Bells Shuttle & Adventure Transport',
          content: `During summer, the road to Maroon Lake is restricted to shuttle buses after 8am — but private transportation for active recreation access is permitted with proper coordination. We navigate the permit system so you arrive at the trailhead when you want, not when the bus schedule allows.\n\nFor fly fishing trips on the Frying Pan or Crystal River, mountain biking shuttles to distant trailheads, or paddle board equipment transport to Ruedi Reservoir — our Escalade handles the logistics while you relax and enjoy the scenery. All adventure bookings include complimentary local transport within a 15-mile radius of Aspen.`,
        },
      ],
      features: [
        { title: 'Luxury Cadillac Escalade', description: 'Spacious, climate-controlled, and capable on mountain roads in any season. Fits up to 6 passengers with adventure gear.' },
        { title: 'Airport Pickups & Drop-offs', description: 'ASE and EGE airport transfers with real-time flight monitoring — we\'re there when you land, every time.' },
        { title: 'Adventure Shuttles', description: 'Trailhead drops, fishing river access, SUP gear transport — we handle the logistics so you don\'t have to.' },
        { title: 'Valley-Wide Coverage', description: 'Aspen, Snowmass Village, Basalt, Carbondale, and beyond — we know every road in the Roaring Fork Valley.' },
        { title: 'Bundled with Adventures', description: 'Book transport with any guided adventure for a seamless, all-inclusive experience at a discounted combined rate.' },
        { title: 'Professional & Punctual', description: 'We treat your schedule with the same respect we bring to every part of your experience with us.' },
      ],
      faqs: [
        { question: 'Can you pick me up from my hotel in Aspen?', answer: 'Yes — all transportation services include door-to-door hotel, condo, or private residence pickup anywhere in Aspen and Snowmass Village. Extended pickup zones to Basalt, Carbondale, or other valley towns available for an additional fee.' },
        { question: 'How far is Aspen Airport from downtown?', answer: 'Aspen/Pitkin County Airport (ASE) is approximately 3 miles from downtown Aspen — a 10-minute drive. Eagle County Airport (EGE) near Glenwood Springs is approximately 70 miles and a 90-minute drive via Highway 82.' },
        { question: 'Can the Escalade carry ski or outdoor equipment?', answer: 'Yes — the Escalade has generous cargo capacity for ski bags, snowboards, fly fishing gear, bikes (with roof or hitch rack available), and paddle boards. Let us know your gear requirements when booking.' },
        { question: 'Do you track flight arrivals?', answer: 'Yes. For airport pickups, we monitor your flight status in real time and adjust our arrival accordingly for delays or early arrivals. You\'ll never wait for a ride at the curb.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book Private Transportation',
    },
  },
  {
    site_id: 'rva',
    slug: 'about',
    title: 'About Rich Valley Adventures',
    meta_title: 'About Rich Valley Adventures | Guided Outdoor Experiences in Aspen, CO',
    meta_description: 'Rich Valley Adventures has been guiding outdoor experiences in Aspen, Colorado since 2012. Meet our local expert guides and learn what sets our approach apart.',
    template_type: 'landing',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'About Rich Valley Adventures',
      hero_subtitle: 'Rooted in the Roaring Fork Valley Since 2012',
      sections: [
        {
          type: 'text',
          title: 'Our Story',
          content: `Rich Valley Adventures was founded in Aspen, Colorado in 2012 by a group of passionate local outdoorspeople who wanted to share the extraordinary wilderness of the Roaring Fork Valley with visitors in a deeper, more personal way than the standard tourist experience allows.\n\nOver the past 14 years, we\'ve guided more than 3,000 adventures across all four seasons — fly fishing the Gold Medal waters of the Roaring Fork and Frying Pan Rivers, mountain biking the 401 Trail and Snowmass Network, paddle boarding on Ruedi Reservoir, hiking to Cathedral Lake and the Maroon Bells Wilderness, snowshoeing through Ashcroft and the Castle Creek Valley.\n\nWe are a small, owner-operated company. Every guide on our team is a year-round Aspen resident who lives, works, and recreates in this valley every day. We don\'t rotate seasonal employees — we build long-term relationships with our guides and our guests.`,
        },
        {
          type: 'features',
          title: 'What Makes Us Different',
          items: [
            { title: '14+ Years of Local Experience', description: 'We\'ve been operating since 2012 — long enough to know every nuance of the valley\'s weather, seasons, and conditions.' },
            { title: 'Small Groups Only', description: 'We cap every trip at 4–8 guests depending on the activity. We\'ll never sacrifice the quality of your experience for volume.' },
            { title: 'Year-Round Local Guides', description: 'Our guides live in the Roaring Fork Valley year-round. They\'re not here for the season — they\'re here for life.' },
            { title: 'Safety Certified', description: 'All guides hold Wilderness First Responder or WFA certification, CPR/AED certification, and activity-specific safety training.' },
            { title: 'Leave No Trace', description: 'We practice and teach Leave No Trace principles on every trip. Protecting this landscape is why we do what we do.' },
            { title: '4.9-Star Rated', description: 'Over 200 five-star reviews from guests who came as visitors and left as friends of the valley.' },
          ],
        },
      ],
    },
  },
  {
    site_id: 'rva',
    slug: 'faq',
    title: 'Frequently Asked Questions — Rich Valley Adventures',
    meta_title: 'FAQ | Rich Valley Adventures | Guided Adventures in Aspen, CO',
    meta_description: 'Answers to common questions about guided adventures in Aspen, Colorado — fly fishing, hiking, mountain biking, paddle boarding, snowshoeing, and transportation services.',
    template_type: 'faq',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Frequently Asked Questions',
      intro: 'Everything you need to know about booking and experiencing guided adventures with Rich Valley Adventures in Aspen, Colorado.',
      faqs: [
        { question: 'Where are you located and where do tours depart from?', answer: 'Rich Valley Adventures is based in Aspen, Colorado. Most guided trips depart from meeting points in downtown Aspen, Snowmass Village, or Basalt depending on the activity. We provide exact directions when you book, and offer hotel pickup for most adventures at no extra charge.', category: 'Booking & Logistics' },
        { question: 'How do I book a guided adventure?', answer: 'Call us at (970) 948-7474 or send an inquiry through our contact form. We\'ll discuss your dates, group size, interests, and fitness level to recommend the best experience. Full payment or deposit is required to confirm your booking.', category: 'Booking & Logistics' },
        { question: 'What is your cancellation policy?', answer: 'Cancellations more than 72 hours before your trip receive a full refund. Cancellations within 24–72 hours receive a 50% refund or full credit toward a rescheduled trip. Cancellations within 24 hours are non-refundable. We always reschedule weather cancellations at no charge.', category: 'Booking & Logistics' },
        { question: 'What is the minimum and maximum group size?', answer: 'We accept bookings for individuals, couples, and groups. Maximum group sizes depend on the activity: fly fishing (4 per guide), hiking and snowshoeing (8 per guide), mountain biking (6 per guide), paddle boarding (6 per guide). For larger corporate or private groups, contact us about dedicated private event options.', category: 'Booking & Logistics' },
        { question: 'Do you offer private tours for special events?', answer: 'Yes — we regularly organize private guided adventures for bachelor/bachelorette parties, corporate retreats, family reunions, and birthday celebrations. Private tours can be customized in length, route, and included amenities (charcuterie and wine, photography, custom itineraries). Contact us to discuss your event.', category: 'Booking & Logistics' },
        { question: 'What should I wear and bring?', answer: 'Dress in moisture-wicking synthetic or wool layers — no cotton. A waterproof outer shell is recommended for mountain activities. Sturdy hiking boots or trail shoes are required for hiking and snowshoeing. Sunscreen, sunglasses, and a hat are essential at Aspen\'s altitude. We send a full packing list specific to your activity when you book.', category: 'What to Bring' },
        { question: 'Is a Colorado fishing license required for fly fishing trips?', answer: 'Yes — Colorado requires a fishing license for anglers 16 and older. We can arrange your license in advance and apply the fee to your trip, or you can purchase one online at cpw.state.co.us. One-day and multi-day licenses are available.', category: 'Fly Fishing' },
        { question: 'Are your adventures suitable for people with physical limitations?', answer: 'We do our best to accommodate guests with mobility challenges, chronic conditions, or other physical considerations. Please contact us in advance to discuss your specific situation. Some activities (paddle boarding, gentle valley hikes) are more accessible than others (high-altitude hiking, technical mountain biking).', category: 'Accessibility' },
        { question: 'Do you operate year-round?', answer: 'Yes — Rich Valley Adventures operates across all four seasons. Summer and fall are our busiest periods for hiking, fly fishing, mountain biking, and paddle boarding. Winter brings snowshoeing, winter Escalade tours, and ice fishing on the Frying Pan River. Spring (April–May) offers excellent fly fishing as rivers come into prime condition.', category: 'Booking & Logistics' },
        { question: 'What makes Aspen a special destination for outdoor adventure?', answer: 'Aspen sits at 7,908 feet elevation surrounded by the White River National Forest and the Elk Mountain Range — five 14,000-foot peaks within hiking distance. The valley receives over 300 inches of snow annually, creating world-class winter recreation. Summers feature crystal-clear rivers, 300+ miles of trail, and a wildflower display that rivals anything in North America. The combination of spectacular terrain, diverse ecosystems, and reasonable access makes Aspen one of the finest year-round adventure destinations in the United States.', category: 'About the Area' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Still have questions? Call us.',
    },
  },
  {
    site_id: 'rva',
    slug: 'areas/aspen',
    title: 'Adventures in Aspen, Colorado',
    meta_title: 'Outdoor Adventures in Aspen CO | Guided Experiences | Rich Valley Adventures',
    meta_description: 'Explore the best guided outdoor adventures in Aspen, Colorado. Fly fishing, hiking, mountain biking, paddle boarding, and snowshoeing with local expert guides.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Outdoor Adventures in Aspen, Colorado',
      area_description: 'Aspen, Colorado',
      intro: `Aspen, Colorado sits at 7,908 feet elevation in the Roaring Fork Valley, surrounded by the White River National Forest and five 14,000-foot peaks of the Elk Mountain Range. It is one of the finest outdoor recreation destinations in North America — and Rich Valley Adventures has been guiding locals and visitors through its extraordinary wilderness since 2012.\n\nFrom the Gold Medal fly fishing waters of the Roaring Fork River to the wildflower meadows below the Maroon Bells, Aspen\'s outdoor experiences are world-class in every season. We offer guided adventures across six core activities, all departing from downtown Aspen or nearby trailheads accessible in under 30 minutes from your hotel.`,
      services_available: ['Guided Fly Fishing', 'Mountain Biking Tours', 'Stand Up Paddle Boarding', 'Guided Hiking', 'Snowshoeing', 'Private Transportation'],
      local_tips: [
        { title: 'Best Time to Visit', description: 'June–October for summer adventures; December–March for winter experiences. September\'s golden aspen fall color is a bucket-list spectacle.' },
        { title: 'Altitude Acclimatization', description: 'Aspen sits at 7,908 feet. Spend 1–2 days in town before strenuous activity. Stay hydrated and avoid alcohol on your first night.' },
        { title: 'Getting Around', description: 'Downtown Aspen is walkable. The Roaring Fork Transportation Authority (RFTA) bus serves Aspen, Snowmass, and the valley. We offer pickup for all adventure departures.' },
        { title: 'Maroon Bells Access', description: 'The Maroon Bells road is restricted to shuttle buses in summer (8am–5pm). Book with us for coordinated private access to the trailhead.' },
      ],
      faqs: [
        { question: 'What is the best outdoor activity in Aspen for beginners?', answer: 'Paddle boarding on Ruedi Reservoir and guided hiking in the Maroon Bells are both excellent for first-timers. Fly fishing is also very accessible with one of our beginner-friendly guide sessions.' },
        { question: 'Is Aspen good for adventure activities in winter?', answer: 'Absolutely. Aspen\'s winter is spectacular — snowshoeing, Nordic skiing, ice fishing, and Escalade backcountry tours offer incredible experiences from December through March.' },
        { question: 'How do I get to Aspen?', answer: 'Aspen/Pitkin County Airport (ASE) has direct flights from Denver, Dallas, Los Angeles, Chicago, and New York seasonally. Eagle County Airport (EGE) and Denver International Airport (DEN) serve as alternative gateways with ground transportation available.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book an Aspen Adventure',
    },
  },
  {
    site_id: 'rva',
    slug: 'areas/snowmass',
    title: 'Adventures in Snowmass Village, Colorado',
    meta_title: 'Outdoor Adventures Snowmass Village CO | Rich Valley Adventures',
    meta_description: 'Guided outdoor adventures in Snowmass Village, Colorado. Mountain biking, hiking, fly fishing, and more with local expert guides from Rich Valley Adventures.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Guided Adventures in Snowmass Village, Colorado',
      area_description: 'Snowmass Village, Colorado',
      intro: `Snowmass Village sits 8 miles from Aspen at 8,208 feet elevation, connected to the city by the free Roaring Fork Transportation Authority shuttle. While Snowmass is best known for its ski resort — consistently ranked among the top three ski areas in Colorado — it offers extraordinary year-round outdoor recreation that most visitors never discover.\n\nThe Snowmass Trail Network alone offers 50+ miles of world-class mountain biking singletrack. The Snowmass Creek Trail penetrates deep into the Snowmass Wilderness, reaching the flanks of Capitol Peak (14,130 ft) and Snowmass Mountain (14,092 ft). In winter, Snowmass\'s consistent deep powder snowpack makes it prime snowshoeing terrain.`,
      services_available: ['Mountain Biking Tours', 'Guided Hiking', 'Snowshoeing', 'Fly Fishing (nearby)', 'Private Transportation'],
      local_tips: [
        { title: 'Snowmass Trail System', description: 'The Snowmass Bike Park and trail network is one of the finest in Colorado — over 50 miles ranging from beginner-friendly to expert black diamond.' },
        { title: 'Capitol Peak Access', description: 'Capitol Peak (14,130 ft) is considered one of the most technically challenging 14ers in Colorado. Day hikes approach the peak through the Snowmass Wilderness.' },
        { title: 'Free Transit', description: 'The RFTA bus runs every 15 minutes between Snowmass Village and Aspen — free, fast, and convenient. Most of our adventure pickups include Snowmass hotel stops.' },
        { title: 'Snowmass Creek Trail', description: 'One of the best wilderness day hikes in the valley, reaching deep into the Snowmass Wilderness with incredible views of 14,000-foot peaks.' },
      ],
      faqs: [
        { question: 'Are your adventures available for Snowmass Village guests?', answer: 'Yes — we offer hotel and condo pickup throughout Snowmass Village for all guided adventures at no extra charge. Snowmass guests have easy access to the full range of Rich Valley Adventures experiences.' },
        { question: 'What mountain biking is available near Snowmass?', answer: 'The Snowmass Trail Network is one of the finest bike trail systems in Colorado. Our guided rides from Snowmass range from beginner-friendly flow trails to technical expert singletrack — there\'s terrain for every ability level.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book from Snowmass Village',
    },
  },
  {
    site_id: 'rva',
    slug: 'areas/basalt',
    title: 'Adventures in Basalt & the Frying Pan River Valley',
    meta_title: 'Outdoor Adventures Basalt CO | Frying Pan River Fishing | Rich Valley Adventures',
    meta_description: 'Guided outdoor adventures in Basalt, Colorado and the Frying Pan River Valley. World-class tailwater fly fishing, Ruedi Reservoir SUP, and more.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Adventures in Basalt & the Frying Pan Valley',
      area_description: 'Basalt, Colorado & Frying Pan River',
      intro: `Basalt, Colorado sits at the confluence of the Roaring Fork and Frying Pan Rivers, 18 miles downvalley from Aspen at 6,611 feet elevation. It is the gateway to some of the finest outdoor recreation in the Rocky Mountains — most notably, the legendary tailwater fishery of the Frying Pan River and the spectacular alpine setting of Ruedi Reservoir.\n\nRich Valley Adventures operates extensively in the Basalt area, particularly for fly fishing on the Frying Pan River and paddle boarding on Ruedi Reservoir. The Frying Pan is widely considered one of the top 5 tailwater fisheries in North America — a distinction earned by its extraordinary density of large wild brown and rainbow trout.`,
      services_available: ['Fly Fishing — Frying Pan River', 'Fly Fishing — Roaring Fork River', 'Stand Up Paddle Boarding — Ruedi Reservoir', 'Mountain Biking', 'Guided Hiking'],
      local_tips: [
        { title: 'The Frying Pan River', description: 'The 14-mile tailwater below Ruedi Reservoir is Gold Medal-designated water with the highest density of large trout per mile of any river in Colorado.' },
        { title: 'Ruedi Reservoir', description: 'A 1,000-acre alpine reservoir at 7,700 feet elevation — glassy mornings, mountain views, and incredible wildlife viewing make it the best SUP destination in the valley.' },
        { title: 'Best Time for Frying Pan Fishing', description: 'The Frying Pan is a year-round fishery, but March–May and September–November offer the best combination of fish activity and uncrowded conditions.' },
        { title: 'Basalt Town Center', description: 'Basalt\'s revitalized downtown has excellent coffee, restaurants, and gear shops. It\'s a perfect pre-adventure fuel stop.' },
      ],
      faqs: [
        { question: 'Is the Frying Pan River better than the Roaring Fork for fly fishing?', answer: 'They\'re different fisheries. The Frying Pan is a tailwater with more consistent conditions year-round and higher densities of large fish, but it demands more technical presentation. The Roaring Fork offers more variety and is often better for beginners. Our guides help you choose based on your experience and goals.' },
        { question: 'Can you pick me up from Basalt for fly fishing trips?', answer: 'Yes — we offer pickup from Basalt hotels and properties for Frying Pan trips. Basalt-based guests have the advantage of being closest to this world-class fishery.' },
      ],
      cta_phone: '(970) 948-7474',
      cta_text: 'Book in the Basalt Area',
    },
  },
]

// ─── AAL PAGE CONTENT ─────────────────────────────────────────────────────────

const aalPages: PageSeed[] = [
  {
    site_id: 'alpenglow',
    slug: 'airport-transfers',
    title: 'Aspen Airport Luxury Transfers',
    meta_title: 'Aspen Airport Transfers | ASE & EGE Limo Service | Aspen Alpenglow Limousine',
    meta_description: 'Private luxury airport transfers to and from Aspen (ASE), Eagle County (EGE), and Denver (DEN) airports. Professional chauffeurs, flight tracking, luxury fleet. Book 24/7.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Luxury Airport Transfers to & from Aspen',
      hero_subtitle: 'Professional Private Car Service from ASE, EGE & DEN Airports',
      intro: `Aspen Alpenglow Limousine provides the Roaring Fork Valley\'s most reliable private airport transfer service. We meet every client at the gate, monitor flights in real time, and deliver you to your destination — hotel, private residence, or ski chalet — with seamless, white-glove precision.\n\nWe serve three gateway airports: Aspen/Pitkin County Airport (ASE) — just 3 miles from downtown Aspen; Eagle County Regional Airport (EGE) in Glenwood Springs, 70 miles east of Aspen; and Denver International Airport (DEN), the primary hub for all major carriers serving the Rocky Mountain region.\n\nOur luxury fleet includes the Cadillac Escalade ESV (up to 6 passengers) and the Mercedes-Benz Sprinter Executive Van (up to 14 passengers) — both equipped with leather seating, climate control, complimentary bottled water, and generous cargo capacity for ski bags, golf clubs, and luggage.`,
      h2_sections: [
        {
          title: 'Aspen Airport (ASE) — Private Arrival & Departure Service',
          content: `Aspen/Pitkin County Airport operates under unique challenges that demand a knowledgeable, experienced ground transportation partner. The high-altitude airport (7,820 ft) is served by limited airlines with tight scheduling windows, and weather-related delays and cancellations are common — especially in winter.\n\nAspen Alpenglow monitors your flight status from wheels-up and adjusts pickup timing accordingly. Our drivers are at the arrivals area before you touch down — not circling the lot or sitting in the cell phone waiting area. For departures, we ensure you arrive with time to clear the Aspen airport\'s security and make your flight, even in congested peak-season traffic. No stress. No rushing. Just professional, reliable service every time.`,
        },
        {
          title: 'Eagle County Airport (EGE) — The Gateway for More Flight Options',
          content: `Eagle County Regional Airport, located in Glenwood Springs approximately 70 miles from Aspen, serves as an alternative gateway with more airline options and typically more schedule reliability than ASE. Many Aspen guests prefer EGE for its better flight connections from major hubs like Dallas, Houston, Chicago, and Atlanta.\n\nOur EGE-to-Aspen private transfer follows the spectacular Glenwood Canyon and Highway 82 corridor — a 75-90 minute scenic drive through one of the most dramatic landscapes in Colorado. We can coordinate multi-stop pickups for groups arriving on different flights, and provide the same meet-and-greet service as our ASE transfers.`,
        },
        {
          title: 'Denver International Airport (DEN) — Direct Private Transfers',
          content: `Denver International Airport is 200 miles from Aspen — a 3.5 to 4-hour drive through the Rocky Mountains via I-70 and Highway 82. For clients who prefer driving to flying, or when weather closes mountain airports, our DEN transfer service provides the most comfortable and efficient way to complete the journey.\n\nThe DEN-to-Aspen route traverses some of the most stunning mountain scenery in North America — the Continental Divide, Vail Pass, Glenwood Canyon, and the Roaring Fork Valley approach into Aspen. In our Escalade or Sprinter, the drive becomes a luxury part of the Aspen experience rather than a logistical hurdle.`,
        },
      ],
      features: [
        { title: 'Real-Time Flight Tracking', description: 'We monitor your flight from departure to touchdown and adjust pickup timing for all delays, early arrivals, or gate changes.' },
        { title: 'Meet & Greet at Arrivals', description: 'Your driver meets you at the arrivals hall with a name sign — no searching for a car, no apps to navigate.' },
        { title: 'Luxury Fleet', description: 'Cadillac Escalade ESV (6 pax) and Mercedes Sprinter Executive Van (14 pax) — both with leather seating and ample luggage space.' },
        { title: 'Ski Bag & Luggage Capacity', description: 'Both vehicles accommodate ski bags, snowboards, golf clubs, and oversized luggage without additional fees.' },
        { title: '24/7 Availability', description: 'We operate around the clock — for early morning departures, late-night arrivals, and everything in between.' },
        { title: 'Complimentary Amenities', description: 'Bottled water, phone chargers, and local knowledge about Aspen\'s best dining, activities, and hidden gems.' },
      ],
      faqs: [
        { question: 'How far in advance should I book an airport transfer?', answer: 'We recommend booking at least 48–72 hours in advance to guarantee availability, especially during peak ski season (December–March) and summer (July–August). Last-minute bookings are sometimes available — call us directly at (970) 925-8000 to check.' },
        { question: 'Do you charge extra for flight delays?', answer: 'No — flight delays are never charged extra. We monitor your flight and adjust our schedule accordingly. You only pay for the agreed transfer rate, regardless of how long your flight is delayed.' },
        { question: 'Can you accommodate large groups?', answer: 'Yes — our Mercedes Sprinter Executive Van accommodates up to 14 passengers with luggage. For very large groups, we can coordinate multiple vehicles arriving simultaneously. Corporate and group bookings receive priority scheduling.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, corporate accounts with net-30 billing, and bank transfers for large bookings. Payment is collected at time of booking or upon arrival depending on your account type.' },
        { question: 'Can you arrange a return transfer during our stay?', answer: 'Absolutely — round-trip and multi-leg transfers can be booked together. We maintain your itinerary and proactively confirm return pickups 24 hours before departure.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Your Airport Transfer',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'wedding-transportation',
    title: 'Wedding Transportation in Aspen, Colorado',
    meta_title: 'Wedding Limo Service Aspen CO | Bridal Transportation | Aspen Alpenglow',
    meta_description: 'Luxury wedding transportation in Aspen, Colorado. Bridal party transfers, venue shuttles, and wedding day coordination with the Roaring Fork Valley\'s premier limo service.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Wedding Transportation in Aspen, Colorado',
      hero_subtitle: 'Seamless Luxury Transport for Your Perfect Mountain Wedding',
      intro: `An Aspen wedding deserves transportation that is as exceptional as the venue and the view. Aspen Alpenglow Limousine has been the trusted ground transportation partner for Aspen-area weddings since 2012, providing seamless logistics so the wedding party, guests, and couple arrive exactly where they need to be — on time, in style, and without a moment of stress.\n\nWe work with the Roaring Fork Valley\'s most celebrated wedding venues: The Meadows at Snowmass, Little Nell Hotel, Hotel Jerome, Aspen Mountain Club, Pine Creek Cookhouse in Ashcroft, and private ranch properties throughout the valley. Our event coordination team maps out every transfer — from the morning prep locations to the ceremony, reception, and final hotel drop-offs — creating a seamless transportation timeline that integrates perfectly with your overall wedding day schedule.\n\nOur luxury fleet includes the Cadillac Escalade ESV for intimate bridal party transport and the Mercedes Sprinter Executive Van for guest shuttles, ensuring every member of your wedding party arrives in comfort and elegance.`,
      h2_sections: [
        {
          title: 'Bridal Party Transportation — From Getting Ready to the Altar',
          content: `The wedding day timeline is delicate. From hair and makeup at the hotel to pre-ceremony photos at iconic Aspen locations, from the ceremony venue to the cocktail hour and reception — every leg of the day requires careful coordination.\n\nAspen Alpenglow provides dedicated bridal party vehicles with a professional driver who follows your timeline precisely, communicates in real time with your wedding coordinator, and anticipates every transfer need before it arises. We stock vehicles with champagne, sparkling water, snacks, and a bridal emergency kit (safety pins, stain remover, extra bobby pins) to ensure the party stays camera-ready throughout the day.`,
        },
        {
          title: 'Guest Shuttle Service — Hotel to Venue and Back',
          content: `Many Aspen wedding venues are on mountain roads or private properties not easily accessible by personal vehicle, and guest parking at scenic venues is typically limited. Our guest shuttle service solves both challenges elegantly — round-trip shuttles from designated hotel pickup points to your ceremony and reception venue, on a schedule coordinated with your wedding timeline.\n\nFor guests arriving from out of town, we can also arrange airport-to-hotel transfers from ASE, EGE, or DEN, creating a fully coordinated arrival experience from the moment your guests land. Multi-day guest transport packages are available for destination weddings with weekend-long programming.`,
        },
      ],
      features: [
        { title: 'Dedicated Wedding Coordinator', description: 'A dedicated Alpenglow transportation coordinator works with your wedding planner to create a seamless timeline from ceremony to sendoff.' },
        { title: 'Champagne & Décor', description: 'Vehicles can be stocked with champagne, floral arrangements, and custom signage to complement your wedding aesthetic.' },
        { title: 'Bridal Emergency Kit', description: 'Every bridal vehicle includes an emergency kit with safety pins, stain remover, fashion tape, and essentials for the unexpected.' },
        { title: 'Guest Shuttle Coordination', description: 'Multiple vehicle hotel-to-venue shuttles on a rolling schedule to keep guests moving comfortably throughout the event.' },
        { title: 'Venue Knowledge', description: 'We know every Aspen-area wedding venue — access roads, parking logistics, load zones, and timing nuances that other drivers don\'t.' },
        { title: 'Weekend-Long Packages', description: 'Rehearsal dinner shuttles, morning-after brunch transfers, and multi-day guest transportation packages for full destination weddings.' },
      ],
      faqs: [
        { question: 'How far in advance should I book wedding transportation?', answer: 'Wedding transportation should be booked as early as possible — ideally when you confirm your venue, which is often 12–18 months before the wedding date. Summer and peak ski season weekends book up quickly. We cannot guarantee availability for last-minute wedding bookings.' },
        { question: 'Do you work with our wedding planner?', answer: 'Yes — we actively collaborate with wedding planners and coordinators. We request a copy of the wedding day timeline 2–3 weeks before the event and maintain real-time communication with your coordinator throughout the day.' },
        { question: 'Can you accommodate guests with mobility needs?', answer: 'We can accommodate guests with mobility challenges in our Sprinter van, which allows for easier entry than typical sedans. Please notify us in advance if any members of your party require specific accommodations.' },
        { question: 'What happens if the wedding runs late?', answer: 'Flexibility is built into every wedding transportation contract. We understand weddings don\'t always follow the schedule exactly. Our drivers are always on standby to adjust and will wait as long as needed within the agreed service window.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Wedding Transportation',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'corporate-events',
    title: 'Corporate Event Transportation in Aspen',
    meta_title: 'Corporate Transportation Aspen CO | Executive Limo Service | Aspen Alpenglow',
    meta_description: 'Professional corporate transportation in Aspen, Colorado. Executive airport transfers, team event shuttles, board meeting transport, and corporate retreat logistics.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Corporate Event Transportation in Aspen',
      hero_subtitle: 'Executive Ground Transportation for Business Events & Retreats',
      intro: `Aspen hosts some of the most prestigious corporate retreats, executive conferences, and business events in the world — from the Aspen Institute Forums to private equity and technology summits that draw C-suite leaders from across the globe. Transporting executives and corporate groups through Aspen\'s mountain terrain requires a ground transportation partner who operates with the same professionalism and attention to detail as the events themselves.\n\nAspen Alpenglow Limousine has been the Roaring Fork Valley\'s trusted corporate transportation provider since 2012. We coordinate executive airport transfers, group event shuttles, multi-day conference logistics, and inter-resort transportation with the discretion and precision that professional corporate travel demands.\n\nWe offer corporate account billing with net-30 terms, dedicated event coordinators, and a vehicle fleet capable of serving groups from 2 to 50+ passengers through coordinated multi-vehicle scheduling.`,
      h2_sections: [
        {
          title: 'Executive Airport Transfers — Discreet, Punctual, Professional',
          content: `For executives arriving at ASE, EGE, or DEN, first impressions begin at the arrivals curb. Our executive transfers feature professional, appropriately attired drivers, real-time flight monitoring, meet-and-greet at arrivals, and vehicles that are always clean, current, and well-stocked.\n\nWe maintain strict confidentiality for all executive clients and can accommodate NDAs for high-profile guests. Our drivers are discreet professionals who understand that productivity and privacy during transit are priorities — we facilitate, not interrupt, working travel.`,
        },
        {
          title: 'Group Event Shuttles & Conference Logistics',
          content: `Aspen conferences and corporate retreats often involve complex multi-venue, multi-day transportation logistics: hotel pickups across three properties, coordinated arrivals at conference venues, restaurant dinner transfers, and post-event returns at varied times.\n\nAspen Alpenglow builds detailed transportation schedules for multi-day corporate events, assigns dedicated drivers to specific groups, and maintains real-time communication with event coordinators throughout. Our Sprinter van fleet can be configured as rolling conference space — leather seating, climate control, quiet cabin for confidential conversations during transfer.`,
        },
      ],
      features: [
        { title: 'Corporate Account Billing', description: 'Net-30 billing terms available for corporate accounts. Monthly invoicing and detailed ride reports for expense management.' },
        { title: 'Dedicated Event Coordinator', description: 'A single point of contact manages all transportation logistics for your event, from pre-arrival planning through final departure.' },
        { title: 'Executive Fleet', description: 'Cadillac Escalade ESV and Mercedes Sprinter — both configured for executive comfort with leather seating, charging stations, and privacy.' },
        { title: 'Scalable for Large Groups', description: 'Multiple coordinated vehicles for groups of 20–100+ participants with rolling schedule management.' },
        { title: 'Confidential & Discreet', description: 'All drivers are trained in executive discretion. NDAs available for high-profile clients and sensitive events.' },
        { title: 'All Mountain Venues', description: 'We know every corporate venue in the valley — Aspen Institute, Hotel Jerome, The St. Regis, Snowmass Club — including access logistics and timing nuances.' },
      ],
      faqs: [
        { question: 'Can you handle airport arrivals and departures for groups of 20+ people?', answer: 'Yes — we coordinate multi-vehicle fleet deployments for large group arrivals and departures, with staggered scheduling to match varied flight times. Our event coordinator provides real-time status updates throughout the pickup window.' },
        { question: 'Do you offer corporate account pricing?', answer: 'Yes — corporate clients with regular Aspen travel can establish accounts with negotiated rates, net-30 billing, and dedicated service priority. Contact us to discuss your company\'s volume and establish an account.' },
        { question: 'Can drivers facilitate discretion for high-profile executives?', answer: 'Absolutely. Our drivers are trained professionals who understand the importance of confidentiality, minimal conversation unless invited, and professional appearance standards. NDAs are available upon request.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Inquire About Corporate Accounts',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'ski-resort-transfers',
    title: 'Ski Resort Transfer Service in Aspen',
    meta_title: 'Ski Resort Transfers Aspen CO | Private Limo to Slopes | Aspen Alpenglow',
    meta_description: 'Private ski resort transfers to Aspen Mountain, Aspen Highlands, Buttermilk, and Snowmass. Luxury door-to-slope service with ski bag handling and early morning availability.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Private Ski Resort Transfer Service in Aspen',
      hero_subtitle: 'Door-to-Slope Luxury Service at All Four Aspen Snowmass Mountains',
      intro: `The Aspen Snowmass ski resort is actually four distinct mountains — Aspen Mountain, Aspen Highlands, Buttermilk, and Snowmass — spread across 8 miles of the Roaring Fork Valley. Navigating between your lodging and the mountain you want to ski each day shouldn\'t add stress to your vacation. That\'s where Aspen Alpenglow comes in.\n\nWe offer private door-to-slope transfer service to all four Aspen Snowmass mountains, with early morning availability to make first chair, equipment loading handled by our drivers, and real-time return pickup coordination so you\'re never waiting at the base in your ski boots.\n\nOur luxury Escalade and Sprinter fleet accommodate full ski groups with all equipment — ski bags, snowboards, helmets, and boot bags — without the crowding and inconvenience of shared shuttles.`,
      h2_sections: [
        {
          title: 'All Four Aspen Snowmass Mountains',
          content: `Aspen Mountain (Ajax) — the iconic in-town mountain accessible directly from downtown Aspen — offers primarily intermediate and advanced terrain with spectacular 360-degree views from the summit. Aspen Highlands is the locals\' mountain, featuring the legendary Highland Bowl hike-to terrain and the steepest sustained vertical in the valley.\n\nButtermilk is Aspen\'s beginner and freestyle mountain, home to the X-Games halfpipe and the best progression terrain in the area. Snowmass, 8 miles from Aspen, is the largest of the four mountains and the best choice for families and groups with varied ability levels.\n\nOur drivers know all four mountains intimately — drop zones, base lodge locations, parking logistics, and the fastest routing from any property in the valley.`,
        },
        {
          title: 'First Chair to Last Run — Full Day Mountain Transport',
          content: `Serious skiers know that the best snow is at first lift. Our early morning service launches as early as 7:00am to get you to the gondola base for first tracks before the grooming has been skied out.\n\nWe also offer end-of-day pickup service coordinated to your actual finishing time — not a fixed schedule. Text your driver when you\'re ready to come down and the vehicle is there by the time you\'ve stowed your gear. Après-ski restaurant transfers, mountain lunch pick-and-drop, and multi-mountain same-day transfers are all available for skiers who want maximum flexibility.`,
        },
      ],
      features: [
        { title: 'All Four Mountains', description: 'Aspen Mountain, Highlands, Buttermilk, and Snowmass — we know every base lodge and optimal drop point at each mountain.' },
        { title: 'Ski Bag & Boot Bag Handling', description: 'Drivers load and unload all ski equipment. No wrestling with bags in a parking lot — ski right to the door.' },
        { title: 'Early Morning First Chair', description: 'Pickup as early as 7:00am to catch first gondola and first tracks on fresh grooming.' },
        { title: 'On-Demand Return Pickup', description: 'Text when you\'re done skiing — your driver arrives within minutes rather than following a fixed shuttle schedule.' },
        { title: 'Heated Vehicles', description: 'Climb into a warm, comfortable vehicle after a cold day on the mountain. Climate-controlled luxury for the ride home.' },
        { title: 'Multi-Mountain Days', description: 'Move between mountains during the day — our flexible service handles mid-day transfers between Snowmass and Aspen mountains.' },
      ],
      faqs: [
        { question: 'Is your ski transfer service better than the free RFTA ski bus?', answer: 'The free RFTA ski bus is a great public option. Private transfer offers significant advantages: door-to-door service (no walk to a bus stop), departure on your schedule (not the bus schedule), privacy with your group, and ski equipment handling without the bus crowd.' },
        { question: 'Can you transport a family of 6 with all our ski gear?', answer: 'Yes — our Cadillac Escalade comfortably seats 6 passengers with ample rear cargo for ski bags, boot bags, and helmets. Larger groups can book the Sprinter van for up to 14 passengers with additional luggage space.' },
        { question: 'What time is the earliest pickup for first chair?', answer: 'We offer pickup as early as 7:00am for first chair access. The Aspen Mountain gondola typically opens at 9:00am, Snowmass at 8:30am. We\'ll coordinate timing to get you to the lift line early with time to get your equipment sorted.' },
        { question: 'Can we change which mountain we want to ski during the day?', answer: 'Yes — multi-mountain transfers are available and can be arranged with your driver throughout the day. Additional transfer charges apply for same-day mountain changes, which we quote transparently before confirming.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Ski Resort Transfer',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'night-out',
    title: 'Night Out Limo Service in Aspen',
    meta_title: 'Night Out Limo Service Aspen CO | Safe Designated Driver | Aspen Alpenglow',
    meta_description: 'Aspen night out limo service. Safe, stylish designated driver service for restaurants, bars, and clubs. Hourly charter or fixed-route packages for Aspen nightlife.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Night Out Limo Service in Aspen',
      hero_subtitle: 'Experience Aspen\'s World-Class Dining & Nightlife in Style',
      intro: `Aspen\'s dining and nightlife scene is extraordinary — Michelin-caliber restaurants, legendary bars like the J-Bar at Hotel Jerome, après-ski at the Ajax Tavern, and private club experiences that rival any major city. Experiencing it properly means having a professional driver so your group can fully relax and enjoy the evening without anyone worrying about driving on mountain roads after dark.\n\nAspen Alpenglow Limousine offers hourly charter service and fixed-route dinner packages for evening entertainment throughout the Roaring Fork Valley. Whether it\'s a progressive dinner across three Aspen restaurants, a bar crawl through the historic downtown, or a late-night pickup after the clubs close, our drivers are punctual, discreet, and always professional.\n\nOur vehicles accommodate groups of 2–14 passengers, making Alpenglow the right choice for everything from a romantic anniversary dinner to a full bachelor party night out.`,
      h2_sections: [
        {
          title: 'Aspen Restaurant Transfers — From Hotel to Table and Back',
          content: `Aspen\'s top restaurants — Matsuhisa, Cache Cache, Pyramid Bistro, White House Tavern, element 47 at The Little Nell — require planning and reservations weeks in advance during peak season. Your transportation should match the caliber of the evening.\n\nOur restaurant transfer service picks you up from your hotel or residence at a time coordinated with your reservation, handles any stops between courses at different venues, and ensures you return safely and comfortably regardless of how celebratory the evening becomes. We store your return contact number and are always a single text away from pickup.`,
        },
        {
          title: 'Bar & Nightclub Service — Safe Fun in the Mountains',
          content: `Aspen\'s bar and nightclub scene concentrated along Galena Street, Hopkins Avenue, and downtown makes for excellent walkability — but the drive home to Snowmass, the West End, or a property up Castle Creek Road is another matter.\n\nOur nightlife charter service provides flexible, on-call transportation throughout the evening. Book us by the hour (2-hour minimum) for full-evening coverage, or arrange a fixed midnight pickup. We monitor your messages and are always within 10 minutes of wherever you are in the Aspen core.`,
        },
      ],
      features: [
        { title: 'Designated Driver Service', description: 'Professional, sober, insured drivers so your entire group can enjoy the evening worry-free.' },
        { title: 'Hourly Charter Options', description: '2-hour minimum hourly charter for full flexibility throughout the night.' },
        { title: 'Restaurant Package Deals', description: 'Fixed-rate dinner packages for couples and groups — hotel pickup, dinner transport, and midnight return.' },
        { title: 'Late Night Availability', description: 'Available until 2:00am and beyond for Aspen\'s late-night venues.' },
        { title: 'Multi-Stop Flexibility', description: 'Move freely between restaurants, bars, and events throughout the evening — we follow your itinerary.' },
        { title: 'Group Sizes 2–14', description: 'Escalade for intimate groups, Sprinter for larger parties. Both equipped for a stylish night out.' },
      ],
      faqs: [
        { question: 'How do I arrange a pickup during the evening if plans change?', answer: 'For hourly charter bookings, your driver is on standby and available with a single text or call. We provide your driver\'s direct number at the start of the evening. Response time is typically under 5 minutes within the Aspen core.' },
        { question: 'What is the minimum booking for a night out?', answer: 'Our evening charter minimum is 2 hours. Most dinner and nightlife bookings run 3–5 hours. We offer fixed-rate dinner packages for couples (hotel pickup to restaurant and return) that are often more economical for simple two-stop evenings.' },
        { question: 'Can you accommodate a bachelorette or bachelor party?', answer: 'Absolutely — we regularly serve bachelorette parties, bachelor parties, and birthday groups. The Sprinter van accommodates up to 14 in the party. We can arrange champagne service, custom decorations, and a Spotify playlist for the ride. Contact us about party packages.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Your Night Out',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'wine-tours',
    title: 'Wine & Brewery Tours in the Aspen Valley',
    meta_title: 'Wine Tours Aspen CO | Brewery Tours | Marble Distilling | Aspen Alpenglow',
    meta_description: 'Guided wine and brewery tours in the Aspen Valley. Marble Distilling, Colorado wineries, and custom tour packages with a professional designated driver. Book today.',
    template_type: 'service',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Wine & Brewery Tours in the Aspen Valley',
      hero_subtitle: 'Explore Colorado\'s Craft Spirits, Wine & Beer with a Professional Designated Driver',
      intro: `Colorado has become one of America\'s most vibrant craft beverage destinations — and the Roaring Fork Valley sits at the heart of it. From the legendary marble halls of Marble Distilling Co. in Marble, Colorado to the craft breweries in Basalt and Carbondale and the award-winning winemakers of the Palisade wine country along the Grand Valley, there\'s a world of Colorado craft beverage to discover.\n\nAspen Alpenglow Limousine offers custom wine, craft beer, and spirits tour packages that handle everything — transportation, timing, and coordination with the distilleries and wineries — so your group can taste freely and safely. Our professional designated driver means everyone can pour with confidence.\n\nWe build tours around your interests: a half-day Roaring Fork Valley craft spirits tour, a full-day Grand Valley wine country expedition to Palisade, or a custom multi-stop combination. Minimum booking of 4 hours; groups of 2–14 welcome.`,
      h2_sections: [
        {
          title: 'Marble Distilling Co. — Colorado\'s Legendary Craft Spirits',
          content: `Marble Distilling Co. in Marble, Colorado sits 30 miles south of Aspen at the foot of the Elk Mountains, drawing its water from the same pristine source that made Marble\'s famous quarried stone. The distillery produces award-winning bourbon, gin, vodka, and the iconic Marble Colorado Whiskey — all crafted with the same precision and passion that defines this mountain community.\n\nOur Marble Distilling tour includes a private vehicle transfer from Aspen, a guided distillery tour with tasting, and a scenic return through the Crystal River Valley. This is one of the most beautiful drives in Colorado — and one of the best craft spirits experiences in the Mountain West.`,
        },
        {
          title: 'Palisade Wine Country — Colorado\'s Premier Wine Region',
          content: `Palisade, Colorado is the heart of Colorado wine country — 50+ wineries and vineyards clustered in the Grand Valley east of Grand Junction, producing acclaimed Bordeaux varietals, Rhône blends, and sparkling wines that have won national recognition.\n\nOur full-day Palisade wine tour departs Aspen in the morning for the 2-hour drive over the Rockies into the Grand Valley. We customize your itinerary around your wine preferences — selecting from Palisade\'s best estates for private tastings. The return trip over the mountains at sunset is a spectacular conclusion to a world-class day.`,
        },
      ],
      features: [
        { title: 'Professional Designated Driver', description: 'Taste freely and safely — our professional driver handles all transportation so your group can enjoy every pour.' },
        { title: 'Custom Tour Design', description: 'We build your tour around your interests — spirits, wine, beer, or a combination — selecting the best venues for your preferences.' },
        { title: 'Marble Distilling Packages', description: 'Signature Aspen Valley craft spirits tours featuring Colorado\'s most celebrated mountain distillery.' },
        { title: 'Palisade Wine Country Day Trips', description: 'Full-day Grand Valley wine country expeditions with 3–4 winery visits and a scenic mountain return.' },
        { title: 'Roaring Fork Brewery Tours', description: 'Local craft brewery tours featuring Marble Brewing, Colorado\'s finest in the heart of the valley.' },
        { title: 'Charcuterie & Provisions', description: 'Pre-order a charcuterie board for the vehicle — perfect for the return from a full day of tasting.' },
      ],
      faqs: [
        { question: 'How long are the wine and brewery tours?', answer: 'Tour durations depend on destinations. Roaring Fork Valley brewery and spirits tours run 3–5 hours. Palisade wine country full-day tours are typically 8–9 hours including driving time. We build a custom itinerary based on your schedule and interests.' },
        { question: 'Can we arrange a private tasting at a winery?', answer: 'Yes — for Palisade wine country tours, we can arrange private tasting experiences at select wineries with advance notice. Private tastings provide more depth and personalization than standard walk-in pours and are especially worthwhile for wine enthusiasts.' },
        { question: 'What is the minimum group size?', answer: 'Wine and brewery tours are available for groups of 2 and up. Larger groups of 6–14 are well-served by our Sprinter van and often find the per-person cost quite reasonable when split across the group.' },
        { question: 'Can you combine a wine tour with other activities?', answer: 'Absolutely — combining a morning outdoor adventure (hiking, snowshoeing) with an afternoon wine or brewery tour is a popular Aspen day package. We coordinate the full day seamlessly.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book a Wine or Brewery Tour',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'about',
    title: 'About Aspen Alpenglow Limousine',
    meta_title: 'About Aspen Alpenglow Limousine | Luxury Car Service Aspen, CO',
    meta_description: 'Aspen Alpenglow Limousine has been providing luxury private car and limousine service in Aspen, Colorado since 2012. Meet our team and learn about our commitment to excellence.',
    template_type: 'landing',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'About Aspen Alpenglow Limousine',
      hero_subtitle: 'Aspen\'s Premier Private Car & Limousine Service Since 2012',
      sections: [
        {
          type: 'text',
          title: 'Our Story',
          content: `Aspen Alpenglow Limousine was founded in 2012 by a team of Aspen transportation professionals who recognized that the Roaring Fork Valley\'s luxury traveler deserved a ground transportation service to match the caliber of Aspen\'s world-class hotels, restaurants, and experiences.\n\nOver 14 years of operation, we\'ve become the trusted transportation partner for Aspen\'s most discerning travelers — Fortune 500 executives, international celebrities, Aspen Institute fellows, and families returning year after year because they know their transportation needs are handled with absolute reliability and discretion.\n\nWe are a small, owner-operated company. Every vehicle in our fleet is maintained to the highest standard. Every driver is professionally trained, background-checked, and represents the Alpenglow standard of excellence on every trip.`,
        },
        {
          type: 'features',
          title: 'The Alpenglow Standard',
          items: [
            { title: '14+ Years of Excellence', description: 'Operating in Aspen since 2012 — we know this valley, these roads, and these airports better than anyone.' },
            { title: 'Professional Chauffeurs', description: 'All drivers are background-checked, insured, trained in defensive mountain driving, and committed to absolute discretion.' },
            { title: 'Luxury Fleet', description: 'Cadillac Escalade ESV and Mercedes Sprinter — immaculately maintained, equipped for every season.' },
            { title: '24/7 Operations', description: 'Early morning airport runs, late-night event returns, and everything in between — we operate when you need us.' },
            { title: 'Confidentiality', description: 'We treat every client with the discretion their privacy deserves. NDAs available for high-profile clients.' },
            { title: '4.9-Star Rated', description: 'Over 150 five-star reviews from guests who trust us with their most important transportation needs.' },
          ],
        },
      ],
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'faq',
    title: 'Frequently Asked Questions — Aspen Alpenglow Limousine',
    meta_title: 'FAQ | Aspen Alpenglow Limousine | Luxury Transportation Aspen, CO',
    meta_description: 'Answers to common questions about luxury limousine and private car service in Aspen, Colorado — airport transfers, pricing, booking, fleet, and more.',
    template_type: 'faq',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Frequently Asked Questions',
      intro: 'Everything you need to know about booking private luxury transportation in Aspen, Colorado with Aspen Alpenglow Limousine.',
      faqs: [
        { question: 'How do I book a ride with Aspen Alpenglow Limousine?', answer: 'Call us at (970) 925-8000 or use our online booking form. For airport transfers, provide your flight number, arrival time, and pickup location. For event and charter bookings, we recommend calling to discuss your specific needs and receive an accurate quote.', category: 'Booking' },
        { question: 'What vehicles do you operate?', answer: 'Our fleet includes the Cadillac Escalade ESV (seats up to 6 passengers with luggage) and the Mercedes-Benz Sprinter Executive Van (seats up to 14 passengers with luggage). Both vehicles are equipped with leather seating, climate control, phone charging, and complimentary water. Both are maintained to the highest standards and replaced regularly to ensure reliability.', category: 'Fleet' },
        { question: 'How far in advance should I book?', answer: 'We recommend booking at least 48 hours in advance for airport transfers and at least 1 week for event, wedding, and tour bookings. During peak ski season (December–March) and summer (July–August), advance booking of 1–2 weeks is strongly recommended as availability is limited.', category: 'Booking' },
        { question: 'Do you charge for waiting due to flight delays?', answer: 'No — we monitor all flights in real time and never charge for delays caused by airlines. Our drivers adjust their pickup time based on your actual landing time. You pay the agreed transfer rate, period.', category: 'Airport Transfers' },
        { question: 'What airports do you serve?', answer: 'We serve Aspen/Pitkin County Airport (ASE), Eagle County Regional Airport (EGE) in Glenwood Springs, and Denver International Airport (DEN). We can also arrange transfers from/to Grand Junction Regional Airport (GJT) upon request.', category: 'Airport Transfers' },
        { question: 'What is your service area?', answer: 'We primarily serve the Roaring Fork Valley — Aspen, Snowmass Village, Basalt, Carbondale, and Glenwood Springs. We also provide long-distance transfers to Eagle/Vail, Denver, and other Colorado destinations. Contact us for out-of-area quotes.', category: 'Service Area' },
        { question: 'Can I bring ski equipment and luggage?', answer: 'Yes — both the Escalade and Sprinter have substantial cargo capacity for ski bags, snowboards, golf clubs, and standard luggage. Please mention equipment quantities when booking so we assign the right vehicle. Additional roof or hitch cargo options are available for particularly large loads.', category: 'Luggage & Equipment' },
        { question: 'Do you offer corporate accounts?', answer: 'Yes — we offer corporate accounts with negotiated rates, net-30 billing, and dedicated account management. Corporate clients include Aspen Institute event attendees, private equity firms with regular Aspen travel, and luxury hospitality properties. Contact us to discuss establishing an account.', category: 'Corporate' },
        { question: 'What is your cancellation policy?', answer: 'Standard transfers: Free cancellation up to 24 hours before pickup. 50% charge for cancellations within 24 hours. Full charge for no-shows. Event and charter bookings: deposit is non-refundable within 7 days of the event. We always work to accommodate reschedules when given advance notice.', category: 'Booking' },
        { question: 'Are your drivers licensed and insured?', answer: 'Yes — all Aspen Alpenglow drivers hold valid Colorado commercial driver\'s licenses, undergo thorough background checks, carry commercial liability insurance, and are trained in mountain driving techniques. We maintain all required municipal, state, and federal transportation permits for Aspen and Pitkin County.', category: 'About' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Have more questions? Call us.',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'areas/aspen',
    title: 'Luxury Transportation in Aspen, Colorado',
    meta_title: 'Luxury Transportation Aspen CO | Private Car Service | Aspen Alpenglow',
    meta_description: 'Premium private car and limousine service throughout Aspen, Colorado. Airport transfers, ski resort shuttles, restaurant transport, and event logistics. Available 24/7.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Luxury Transportation in Aspen, Colorado',
      area_description: 'Aspen, Colorado',
      intro: `Aspen, Colorado is one of the world\'s great luxury travel destinations — and getting around it deserves transportation that matches the caliber of the experience. Aspen Alpenglow Limousine provides private car and limousine service throughout Aspen with the professionalism, discretion, and attention to detail that Aspen\'s most discerning visitors expect.\n\nFrom the private lodges of the West End to the ski-in/ski-out properties on Aspen Mountain, from Hotel Jerome and The Little Nell to the private ranches of the Roaring Fork Valley, we know Aspen intimately — every street, every service entrance, every nuance of the town\'s unique layout and culture.`,
      services_available: ['Airport Transfers (ASE, EGE, DEN)', 'Ski Resort Shuttles', 'Restaurant & Nightlife Transport', 'Wedding Transportation', 'Corporate Event Logistics', 'Wine & Brewery Tours'],
      local_tips: [
        { title: 'Peak Season Booking', description: 'December through March and July–August are peak demand periods. Book transportation at least 1 week in advance during these windows.' },
        { title: 'Aspen Airport Quirks', description: 'ASE is a challenging mountain airport with frequent weather holds. Always have a ground transportation plan in place — our flight monitoring handles delays automatically.' },
        { title: 'Mountain Road Navigation', description: 'Many Aspen properties are on steep, narrow roads that require experience to navigate safely in winter. Our drivers handle these conditions daily.' },
        { title: 'Discretion in a Small Town', description: 'Aspen is a small community where privacy matters. Our drivers are trained in professional discretion and understand the importance of confidentiality for high-profile guests.' },
      ],
      faqs: [
        { question: 'Do you cover all neighborhoods in Aspen?', answer: 'Yes — we serve all Aspen neighborhoods including downtown, the West End, Red Mountain, Starwood, Maroon Creek, and Castle Creek. No additional charge for access to residential areas.' },
        { question: 'Can you arrange standing daily transportation during our stay?', answer: 'Yes — we offer daily transportation arrangements for guests staying multiple nights, with consistent morning pickup times, evening transfers, and a dedicated driver who knows your preferences. This is popular with ski groups and extended-stay corporate visitors.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Aspen Transportation',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'areas/snowmass',
    title: 'Limo Service to Snowmass Village, Colorado',
    meta_title: 'Limo Service Snowmass Village CO | Private Transfer | Aspen Alpenglow',
    meta_description: 'Private luxury transportation to and from Snowmass Village, Colorado. Hotel transfers, ski resort shuttles, and Snowmass-to-Aspen transport. Book 24/7.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Luxury Limo Service to Snowmass Village',
      area_description: 'Snowmass Village, Colorado',
      intro: `Snowmass Village, Colorado sits 8 miles from downtown Aspen at 8,208 feet elevation, connected by the free RFTA ski bus but far better served by private transportation for guests who value comfort, convenience, and reliability over a crowded shuttle schedule.\n\nAspen Alpenglow Limousine provides luxury private car and limo service to and from Snowmass Village for all transportation needs — airport arrivals from ASE and EGE, ski resort shuttles to Snowmass Mountain\'s world-class terrain, transfers to Aspen for dining and nightlife, and event transportation throughout the valley.`,
      services_available: ['Airport Transfers to Snowmass', 'Snowmass Ski Mountain Shuttles', 'Snowmass-to-Aspen Transfers', 'Restaurant & Event Transport', 'Hotel-to-Hotel Coordination'],
      local_tips: [
        { title: 'The Snowmass Advantage', description: 'Snowmass guests who book private transport can reach Aspen restaurants and nightlife easily — no worrying about the last bus time.' },
        { title: 'Snowmass Ski Mountain', description: 'Snowmass is the largest of Aspen Snowmass\'s four mountains — 3,332 acres with terrain for every level and the valley\'s deepest vertical.' },
        { title: 'Mall vs. Base Village', description: 'Snowmass has two distinct areas — the Upper Village Mall and the new Base Village. Our drivers know both precisely and will confirm your exact drop point.' },
      ],
      faqs: [
        { question: 'How far is Snowmass Village from Aspen?', answer: 'Snowmass Village is approximately 8 miles from downtown Aspen along Brush Creek Road — typically a 15-20 minute drive. Our Snowmass-to-Aspen transfer is priced as a short-hop service at competitive rates.' },
        { question: 'Do you pick up from all Snowmass hotels and lodges?', answer: 'Yes — we serve all Snowmass Village properties including The Snowmass Club, Viceroy Snowmass, Westin Snowmass, Stonebridge Inn, and private condominiums throughout the village.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Snowmass Transportation',
    },
  },
  {
    site_id: 'alpenglow',
    slug: 'areas/vail',
    title: 'Aspen to Vail Transportation — Private Transfers',
    meta_title: 'Aspen to Vail Transportation | Private Transfer | Aspen Alpenglow Limousine',
    meta_description: 'Private luxury transfers between Aspen and Vail, Colorado. Comfortable, scenic 2.5-hour mountain drive in our Escalade or Sprinter. Book inter-resort transfers today.',
    template_type: 'location',
    status: 'published',
    published_at: new Date().toISOString(),
    og_image: null,
    schema_markup: null,
    content: {
      hero_title: 'Aspen to Vail Private Transportation',
      area_description: 'Vail, Colorado & Eagle County',
      intro: `The Aspen-to-Vail corridor is one of the most traveled routes in Colorado ski country — two world-class resort destinations separated by 80 miles of spectacular mountain highway. Many Colorado ski enthusiasts combine stays at both resorts, and inter-resort transfers are a common requirement.\n\nAspen Alpenglow Limousine provides comfortable, reliable private transfers between Aspen and Vail/Eagle County. The 2.5–3 hour drive traverses Glenwood Canyon (one of the most dramatic gorge drives in America) and I-70 through the heart of the Colorado Rockies. In our Escalade or Sprinter, the journey is as enjoyable as the destination.`,
      services_available: ['Aspen to Vail Direct Transfer', 'Vail to Aspen Return Transfer', 'Eagle County Airport (EGE) Transfers', 'Beaver Creek Transfers', 'Multi-Resort Itinerary Coordination'],
      local_tips: [
        { title: 'I-70 Mountain Conditions', description: 'The Aspen-Vail route uses Glenwood Canyon and I-70, which can close during severe winter storms. We monitor road conditions and communicate proactively for all scheduled transfers.' },
        { title: 'Eagle County Airport', description: 'EGE is located in Glenwood Springs, midway between Aspen and Vail — convenient for guests flying into the valley who want to split a ski trip between both resorts.' },
        { title: 'Beaver Creek Access', description: 'Beaver Creek resort is 10 miles east of Vail — we provide direct Aspen-to-Beaver-Creek transfers as part of our Vail corridor service.' },
        { title: 'Best Time for the Drive', description: 'Glenwood Canyon closes periodically in winter for rockfall and avalanche control. We recommend scheduling afternoon transfers to avoid morning closures and rush hour congestion on I-70.' },
      ],
      faqs: [
        { question: 'How long does the Aspen to Vail transfer take?', answer: 'The Aspen-to-Vail transfer takes approximately 2.5–3 hours under normal conditions via Glenwood Canyon and I-70. During peak ski traffic on I-70 (Friday afternoons, Sunday afternoons) the drive can take 3.5–4 hours. We recommend scheduling accordingly.' },
        { question: 'Can you do a one-way Aspen to Vail transfer?', answer: 'Yes — one-way transfers are available in both directions. Many clients fly into Eagle County (EGE) for their Vail portion and arrange transfer to Aspen for the second portion of their Colorado ski trip.' },
        { question: 'Is Glenwood Canyon safe to drive in winter?', answer: 'Glenwood Canyon can close during severe winter weather events. We always have contingency routing via alternate passes and monitor CDOT road conditions throughout the day of your transfer. We\'ll proactively contact you if conditions affect timing.' },
      ],
      cta_phone: '(970) 925-8000',
      cta_text: 'Book Aspen–Vail Transfer',
    },
  },
]

export const allSeedPages: PageSeed[] = [...rvaPages, ...aalPages]

export async function seedPages(supabase: SupabaseClient): Promise<string[]> {
  const results: string[] = []

  const { count } = await supabase
    .from('pages')
    .select('id', { count: 'exact', head: true })

  if (count && count > 0) {
    results.push(`Pages: skipped (${count} already exist)`)
    return results
  }

  const { error, data } = await supabase
    .from('pages')
    .insert(allSeedPages)
    .select('id')

  if (error) {
    console.error('seedPages error:', error)
    results.push(`Pages: ERROR — ${error.message}`)
  } else {
    results.push(`Pages: ${data?.length || allSeedPages.length} inserted`)
  }

  // Seed navigation
  const { count: navCount } = await supabase
    .from('navigation')
    .select('id', { count: 'exact', head: true })

  if (!navCount || navCount === 0) {
    const rvaNav = [
      { site_id: 'rva', label: 'Adventures', href: '/adventures', position: 0, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Fly Fishing', href: '/fly-fishing', position: 1, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Mountain Biking', href: '/mountain-biking', position: 2, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Hiking', href: '/hiking', position: 3, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Paddle Boarding', href: '/paddle-boarding', position: 4, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Snowshoeing', href: '/snowshoeing', position: 5, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Gallery', href: '/gallery', position: 6, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Blog', href: '/blog', position: 7, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'About', href: '/about', position: 8, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'FAQ', href: '/faq', position: 9, parent_id: null, is_visible: true },
      { site_id: 'rva', label: 'Contact', href: '/contact', position: 10, parent_id: null, is_visible: true },
    ]
    const aalNav = [
      { site_id: 'alpenglow', label: 'Services', href: '/services', position: 0, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Airport Transfers', href: '/airport-transfers', position: 1, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Ski Resort Transfers', href: '/ski-resort-transfers', position: 2, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Wedding Transportation', href: '/wedding-transportation', position: 3, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Corporate Events', href: '/corporate-events', position: 4, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Night Out', href: '/night-out', position: 5, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Wine Tours', href: '/wine-tours', position: 6, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Fleet', href: '/fleet', position: 7, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Blog', href: '/blog', position: 8, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'About', href: '/about', position: 9, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'FAQ', href: '/faq', position: 10, parent_id: null, is_visible: true },
      { site_id: 'alpenglow', label: 'Contact', href: '/contact', position: 11, parent_id: null, is_visible: true },
    ]

    const { error: navErr } = await supabase.from('navigation').insert([...rvaNav, ...aalNav])
    if (navErr) {
      results.push(`Navigation: ERROR — ${navErr.message}`)
    } else {
      results.push(`Navigation: ${rvaNav.length + aalNav.length} items inserted`)
    }
  } else {
    results.push(`Navigation: skipped (${navCount} already exist)`)
  }

  return results
}
