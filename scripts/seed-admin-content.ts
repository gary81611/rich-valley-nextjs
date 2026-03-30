// Seed all admin content tables from existing hardcoded data
// Run: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-admin-content.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedIfEmpty(table: string, rows: Record<string, any>[]) {
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
  if (count && count > 0) {
    console.log(`SKIP ${table}: ${count} rows already exist`)
    return
  }
  const { error } = await supabase.from(table).insert(rows)
  console.log(error ? `ERROR ${table}: ${error.message}` : `OK ${table}: ${rows.length} rows seeded`)
}

async function seed() {
  // Guides
  await seedIfEmpty('guides', [
    { name: 'Kit McLendon', title: 'Lead Fly Fishing Guide', specialties: ['Hatch reports', 'Fly recommendations', 'Water clarity', 'River observations', 'Trail information'], certifications: ['First Aid'], display_order: 1 },
    { name: 'Bart Chandler', title: 'Shooting Guide', specialties: ['Sporting clay instruction', 'Shotgun clinics', 'Safety training'], certifications: ['First Aid'], display_order: 2 },
    { name: 'Bobby Regan', title: 'Kids Fishing Specialist', specialties: ['Youth fly fishing', 'Family adventures', 'Patient instruction'], certifications: ['First Aid'], display_order: 3 },
    { name: 'Alex Macintyre', title: 'Boat Captain', specialties: ['Float trips', 'River navigation', 'Multi-day expeditions'], certifications: ['First Aid'], display_order: 4 },
    { name: 'Jason Fagre', title: 'Chef & Hunting Guide', specialties: ['Field-to-table dining', 'Elk hunting', 'Backcountry cooking'], certifications: ['First Aid'], display_order: 5 },
    { name: 'John Mudrey', title: 'Dry Fly Specialist & Nymphing Connoisseur', specialties: ['Dry fly technique', 'Nymphing mastery', 'Technical water'], certifications: ['First Aid'], display_order: 6 },
  ])

  // Winter Adventures
  await seedIfEmpty('winter_adventures', [
    { title: 'Fall & Winter Guided Hunting (Elk)', description: 'Experience Colorado elk hunting with expert guides.', duration: 'Full Day (6-8 hours)', difficulty: 'Moderate to Challenging', season_start: 'Sept 1', season_end: 'Dec 10', price_from: 250, display_order: 1 },
    { title: 'Mule Deer Hunting', description: 'Guided mule deer hunting in the high country.', duration: 'Full Day (6-8 hours)', difficulty: 'Moderate', season_start: 'Sept 1', season_end: 'Dec 10', price_from: 250, display_order: 2 },
    { title: 'Waterfowl Hunting', description: 'Guided waterfowl hunting along rivers and reservoirs.', duration: 'Half Day (3-4 hours)', difficulty: 'All Levels', season_start: 'Oct 1', season_end: 'Jan 15', price_from: 250, display_order: 3 },
    { title: 'Winter Guided Ice Fishing', description: 'Fish frozen alpine lakes surrounded by snow-covered peaks.', duration: '3-5 Hours', difficulty: 'All Levels', season_start: 'Dec 15', season_end: 'Feb 25', price_from: 250, display_order: 4 },
    { title: 'Winter Guided Snowshoeing', description: 'Trek through snow-covered meadows and frozen aspen groves.', duration: 'Half Day / Full Day', difficulty: 'All Levels', season_start: 'Dec 15', season_end: 'Feb 25', price_from: 250, display_order: 5 },
    { title: 'Cross-Country Skiing', description: 'Glide through quiet winter wilderness on groomed and backcountry trails.', duration: 'Half Day / Full Day', difficulty: 'Beginner to Intermediate', season_start: 'Year-round', season_end: 'snow dependent', price_from: 250, display_order: 6 },
    { title: 'Electric/Fat Tire Guided Biking Tour', description: 'Explore snow-packed trails on fat tire or electric bikes.', duration: 'Half Day (3-4 hours)', difficulty: 'All Levels', season_start: 'Nov 1', season_end: 'May 31', price_from: 250, display_order: 7 },
    { title: 'Sporting Clay Shotgun Shooting Clinic', description: 'Expert instruction at a private sporting clay range.', duration: 'Half Day (3-4 hours)', difficulty: 'All Levels', season_start: 'Nov 1', season_end: 'May 31', price_from: 250, display_order: 8 },
    { title: 'Chauffeur Guided Tours and Excursions', description: 'See the Roaring Fork Valley from a luxury Chevrolet Suburban.', duration: 'Half Day / Full Day', difficulty: 'Easy', season_start: 'Year-round', season_end: '', price_from: 250, display_order: 9 },
    { title: 'Cast and Blast', description: 'River float trip with waterfowl hunting and fly fishing.', duration: 'Full Day (6-8 hours)', difficulty: 'Moderate', season_start: 'Fall', season_end: 'Season', price_from: 250, display_order: 10 },
    { title: 'Snowmobile & Electric Snowbike Tours', description: 'Explore backcountry terrain on snowmobiles or electric snowbikes.', duration: 'Half Day / Full Day', difficulty: 'Moderate', season_start: 'Winter', season_end: 'Season', price_from: 250, display_order: 11 },
  ])

  // Locations
  await seedIfEmpty('locations', [
    { name: 'Aspen', slug: 'aspen', tagline: 'The heart of the Roaring Fork Valley', description: 'Aspen is the base of operations for Rich Valley Adventures.', activities: ['Fly Fishing', 'Guided Hiking', 'Snowshoeing', 'Chauffeur Guided Tours', 'Mountain Biking'], rivers: ['Roaring Fork River', 'Castle Creek', 'Maroon Creek'], drive_time: 'Home base', display_order: 1 },
    { name: 'Basalt', slug: 'basalt', tagline: 'Gateway to the Frying Pan River', description: 'Basalt sits at the confluence of the Frying Pan and Roaring Fork Rivers.', activities: ['Fly Fishing', 'Private Water Access', 'Guided Hiking'], rivers: ['Frying Pan River', 'Roaring Fork River'], drive_time: '~25 min', display_order: 2 },
    { name: 'Carbondale', slug: 'carbondale', tagline: 'Crystal River Valley adventures', description: 'Carbondale offers access to the Crystal River and local trails.', activities: ['Fly Fishing', 'Hiking', 'Mountain Biking'], rivers: ['Crystal River', 'Roaring Fork River'], drive_time: '~35 min', display_order: 3 },
    { name: 'Glenwood Springs', slug: 'glenwood-springs', tagline: 'Colorado River gateway', description: 'Glenwood Springs sits at the confluence of the Roaring Fork and Colorado Rivers.', activities: ['Fly Fishing', 'Float Trips', 'Hiking'], rivers: ['Colorado River', 'Roaring Fork River'], drive_time: '~50 min', display_order: 4 },
    { name: 'Snowmass', slug: 'snowmass', tagline: 'Mountain adventures for families', description: 'Snowmass Village offers family-friendly adventures.', activities: ['Family Adventures', 'Guided Hiking', 'Snowshoeing'], rivers: ['Snowmass Creek', 'Brush Creek'], drive_time: '~15 min', display_order: 5 },
    { name: 'Marble & Redstone', slug: 'marble-redstone', tagline: 'Historic beauty, pristine waters', description: 'The Crystal River Valley between Carbondale and Marble.', activities: ['Fly Fishing', 'Chauffeur Guided Tours', 'Photography'], rivers: ['Crystal River'], drive_time: '~1 hr', display_order: 6 },
    { name: 'Vail', slug: 'vail', tagline: 'Expanded adventure options', description: 'Vail and the Eagle River Valley offer additional opportunities.', activities: ['Fly Fishing', 'Guided Hiking'], rivers: ['Eagle River', 'Gore Creek'], drive_time: '~2 hr', display_order: 7 },
    { name: 'Telluride', slug: 'telluride', tagline: 'Remote mountain adventure packages', description: 'Telluride offers remote mountain adventures.', activities: ['Multi-Day Adventures', 'Fly Fishing'], rivers: ['San Miguel River'], drive_time: '~4 hr', display_order: 8 },
    { name: 'Buena Vista & Salida', slug: 'buena-vista-salida', tagline: 'Arkansas River high-altitude adventures', description: 'The Arkansas River headwaters offer outstanding fishing.', activities: ['Fly Fishing', 'Guided Hiking'], rivers: ['Arkansas River'], drive_time: '~2.5 hr', display_order: 9 },
    { name: 'Twin Lakes', slug: 'twin-lakes', tagline: 'High mountain lake fishing', description: 'Twin Lakes sits at 9,200 feet at the base of Colorado\'s highest peaks.', activities: ['Lake Fishing', 'Ice Fishing', 'Hiking'], rivers: ['Twin Lakes', 'Lake Creek'], drive_time: '~1.5 hr (summer)', display_order: 10 },
  ])

  // USGS Stations
  await seedIfEmpty('usgs_stations', [
    { station_id: '09073300', name: 'Roaring Fork above Difficult Creek (Aspen)', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 1 },
    { station_id: '09073400', name: 'Roaring Fork near Aspen', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 2 },
    { station_id: '09076300', name: 'Roaring Fork below Maroon Creek (Aspen)', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 3 },
    { station_id: '09081000', name: 'Roaring Fork near Emma (Basalt)', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 4 },
    { station_id: '09085000', name: 'Roaring Fork at Glenwood Springs', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 5 },
    { station_id: '09075400', name: 'Frying Pan River near Ruedi', low_threshold: 100, good_threshold: 400, high_threshold: 800, display_order: 6 },
  ])

  // Pricing Routes (AAL)
  const pricingRows = [
    { category: 'airport-inbound', route_name: 'ASE Airport to Aspen', origin: 'ASE Airport', destination: 'Aspen', distance: '~5 mi', drive_time: '10 min', suv_price: 210, display_order: 1 },
    { category: 'airport-inbound', route_name: 'ASE Airport to Snowmass', origin: 'ASE Airport', destination: 'Snowmass', distance: '~10 mi', drive_time: '20 min', suv_price: 210, display_order: 2 },
    { category: 'airport-inbound', route_name: 'EGE to Aspen', origin: 'EGE (Eagle)', destination: 'Aspen', distance: '~70 mi', drive_time: '1.5 hr', suv_price: 720, display_order: 3 },
    { category: 'airport-inbound', route_name: 'DEN to Aspen', origin: 'DEN (Denver)', destination: 'Aspen', distance: '~220 mi', drive_time: '4 hr', suv_price: 1475, display_order: 4 },
    { category: 'airport-outbound', route_name: 'Aspen to ASE Airport', origin: 'Aspen', destination: 'ASE Airport', distance: '~5 mi', drive_time: '10 min', suv_price: 150, display_order: 10 },
    { category: 'airport-outbound', route_name: 'Aspen to EGE', origin: 'Aspen', destination: 'EGE (Eagle)', distance: '~70 mi', drive_time: '1.5 hr', suv_price: 720, display_order: 11 },
    { category: 'airport-outbound', route_name: 'Aspen to DEN', origin: 'Aspen', destination: 'DEN (Denver)', distance: '~220 mi', drive_time: '4 hr', suv_price: 1475, display_order: 12 },
    { category: 'local', route_name: 'Aspen to Snowmass', origin: 'Aspen', destination: 'Snowmass Village', distance: '~8 mi', drive_time: '15 min', suv_price: 150, display_order: 20 },
    { category: 'local', route_name: 'Aspen to Woody Creek', origin: 'Aspen', destination: 'Woody Creek', distance: '~5 mi', drive_time: '10 min', suv_price: 125, display_order: 21 },
    { category: 'local', route_name: 'Aspen to Basalt', origin: 'Aspen', destination: 'Basalt', distance: '~18 mi', drive_time: '25 min', suv_price: 235, display_order: 22 },
    { category: 'local', route_name: 'Aspen to Carbondale', origin: 'Aspen', destination: 'Carbondale', distance: '~30 mi', drive_time: '35 min', suv_price: 250, display_order: 23 },
    { category: 'local', route_name: 'Aspen to Glenwood Springs', origin: 'Aspen', destination: 'Glenwood Springs', distance: '~42 mi', drive_time: '50 min', suv_price: 270, display_order: 24 },
    { category: 'long-distance', route_name: 'Aspen to Vail', origin: 'Aspen', destination: 'Vail', distance: '~100 mi', drive_time: '2 hr', suv_price: 850, display_order: 30 },
    { category: 'long-distance', route_name: 'Aspen to Telluride', origin: 'Aspen', destination: 'Telluride', distance: '~180 mi', drive_time: '4 hr', suv_price: 1475, display_order: 31 },
  ]
  await seedIfEmpty('pricing_routes', pricingRows)

  // Pricing Policies
  await seedIfEmpty('pricing_policies', [
    { title: 'Chartered services: 4-hour minimum', display_order: 1 },
    { title: 'All reservations: 24-hour cancellation policy', display_order: 2 },
    { title: 'Events: 7-day cancellation policy', display_order: 3 },
    { title: 'First 15 minutes of wait time included', display_order: 4 },
    { title: '30 minutes included for airport arrivals', display_order: 5 },
    { title: 'Winter and summer rates are the same', display_order: 6 },
    { title: 'All reservations must be held with a credit card', display_order: 7 },
    { title: 'All-inclusive pricing — no hidden service charges or gratuity added', display_order: 8 },
  ])

  console.log('\nDone! Run the migration SQL first if you see errors.')
}

seed().catch(console.error)
