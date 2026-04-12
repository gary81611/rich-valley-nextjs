/**
 * Stock rows for `destinations` (Alpenglow / shared listing). Used by CLI seed and admin sync.
 *
 * Images: Unsplash (https://unsplash.com/license) — hotlinked CDN URLs, w=1600 for cards.
 */
export const STOCK_ALPENGLOW_DESTINATIONS = [
  {
    name: 'Independence Pass',
    slug: 'independence-pass',
    description:
      'High-alpine Highway 82 over the Continental Divide — wildflower meadows, Weller Lake and Lost Man trailheads, pullouts with Elk Range views, and easy staging for a picnic or short hike without worrying about parking or seasonal closures. We coordinate pickup times around weather and your pace.',
    image_url:
      'https://images.unsplash.com/photo-1653688107875-38c6dfe0e59b?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 1,
    is_active: true,
  },
  {
    name: 'The Grottos',
    slug: 'the-grottos',
    description:
      'A family-friendly stop minutes up Independence Pass — short trails, waterfalls, and the famous ice cave formations in winter. Ideal when you want fresh air and photos without a full backcountry commitment; we drop you at the trail area and return on your schedule.',
    image_url:
      'https://images.unsplash.com/photo-1650981839048-baf6b04f68c3?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 2,
    is_active: true,
  },
  {
    name: 'Maroon Bells & Crater Lake',
    slug: 'maroon-bells-crater-lake',
    description:
      'Colorado’s most photographed peaks and the shuttle reservation logistics handled for you. We align with your Maroon Lake or Crater Lake trail timing, group size, and gear so you spend energy on the trail — not on parking, shuttles, or late-day exits.',
    image_url:
      'https://images.unsplash.com/photo-1705869340469-cfc9a77ba3de?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 3,
    is_active: true,
  },
  {
    name: '25 popular Aspen-area hikes',
    slug: 'aspen-area-hiking-trails',
    description: `Guests often book private rides straight to busy trailheads across Aspen, Snowmass, and Independence Pass. These are 25 of the most-requested routes — mileage and difficulty vary; we help you plan realistic timing and vehicle choice.

1. Maroon Lake Scenic Trail
2. Crater Lake Trail
3. Buckskin Pass
4. West Maroon Pass
5. Conundrum Hot Springs Trail
6. Cathedral Lake Trail
7. American Lake Trail
8. Linkins Lake Trail
9. Lost Man Lake Loop
10. The Grottos & ice cave area
11. Hunter Creek Trail
12. Smuggler Mountain Road
13. Ute Trail (Aspen Mountain)
14. Government Trail (Aspen–Snowmass)
15. Tom Blake Trail (Snowmass)
16. Ditch Trail & Sky Mountain Park
17. Rio Grande Trail (Aspen corridor)
18. Weller Lake Trail
19. Capitol Creek Trail
20. Copper Lake Trail (East Maroon)
21. Sunnyside Trail (East Aspen)
22. Rim Trail South (Snowmass)
23. Bear Den Trail (Snowmass)
24. Taylor Pass / Pearl Pass access (summer)
25. Pine Creek Cookhouse area trails`,
    image_url:
      'https://images.unsplash.com/photo-1666064849406-132d2e83ab2f?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 4,
    is_active: true,
  },
  {
    name: 'Redstone & Marble',
    slug: 'redstone-marble',
    description:
      'Historic coke ovens and castle-like Redstone village, then Marble and the Yule Marble quarry district — one of the prettiest day drives from the Roaring Fork. Perfect for photography, riverside walks along the Crystal River, and lunch in a quiet mountain town before a relaxed ride home.',
    image_url:
      'https://images.unsplash.com/photo-1553406488-baa24daf9b75?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 5,
    is_active: true,
  },
  {
    name: 'Crystal Mill & upper Crystal River',
    slug: 'crystal-mill',
    description:
      'The iconic Crystal Mill and the upper Crystal River valley (often combined with Marble or a guided jeep day). We get you to the right staging points for your plan — whether you are meeting a tour, walking in from the road, or building a full photo itinerary.',
    image_url:
      'https://images.unsplash.com/photo-1705869340798-2814ef07055d?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 6,
    is_active: true,
  },
  {
    name: 'Ashcroft Ghost Town & Castle Creek',
    slug: 'ashcroft-castle-creek',
    description:
      'Paved Castle Creek Road to the restored mining ghost town, wildflower hikes, and access toward the Pine Creek Cookhouse or Cathedral trailheads. A classic half-day or full-day out of Aspen with minimal highway time.',
    image_url:
      'https://images.unsplash.com/photo-1667316676777-d36a8a4839e6?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 7,
    is_active: true,
  },
  {
    name: 'Glenwood Springs & Hanging Lake',
    slug: 'glenwood-hanging-lake',
    description:
      'World’s largest hot springs pool, Iron Mountain Tram, downtown dining, and — with permits — Hanging Lake from Glenwood Canyon. We handle the longer Roaring Fork run so your group can swim, hike, or both and still roll back to Aspen without a tired driver at the wheel.',
    image_url:
      'https://images.unsplash.com/photo-1663376585914-5108280cf0ba?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 8,
    is_active: true,
  },
  {
    name: 'Twin Lakes & Independence Pass loop',
    slug: 'twin-lakes-leadville',
    description:
      'Combine the east side of Independence Pass with Colorado’s largest glacial lakes and small-town Leadville for a full high-country loop. Great when you want big-sky scenery, a lakeside stop, and historic Main Street without charting the route yourself.',
    image_url:
      'https://images.unsplash.com/photo-1539566346497-9b3860c9edcb?w=1600&q=80&auto=format&fit=crop',
    site_key: 'alpenglow',
    display_order: 9,
    is_active: true,
  },
] as const
