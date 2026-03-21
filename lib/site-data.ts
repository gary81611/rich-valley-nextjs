export const PHONE = '970-456-3666'
export const PHONE_HREF = 'tel:+19704563666'
export const LOCATION = 'Aspen, Colorado'

export const rvaData = {
  name: 'Rich Valley Adventures',
  tagline: 'Discover the Heart of Aspen',
  description: 'Since 2012, Rich Valley Adventures has been dedicated to protecting and sharing the beauty of Aspen and the Roaring Fork Valley through guided outdoor experiences that create lasting memories.',
  phone: PHONE, phoneHref: PHONE_HREF, location: LOCATION,
  logo: '/images/rva/logo.png',
  stats: [
    { value: '14+', label: 'Years of Experience' },
    { value: '3,000+', label: 'Adventures Led' },
    { value: '4.9', label: 'Average Rating' },
  ],
  adventures: [
    { title: 'Fly Fishing', description: 'Wade into pristine mountain streams with expert guides who know every pool and riffle in the Roaring Fork Valley. All equipment provided.', image: '/images/rva/flyfishing.png', duration: 'Half Day / Full Day', difficulty: 'All Levels' },
    { title: 'Paddle Boarding', description: 'Glide across crystal-clear alpine lakes with stunning mountain backdrops. Perfect for families and first-timers.', image: '/images/rva/paddleboarding.jpg', duration: '2–3 Hours', difficulty: 'Beginner Friendly' },
    { title: 'Mountain Biking', description: 'Explore world-class singletrack and scenic trails through aspen groves and alpine meadows.', image: '/images/rva/mountainbiking.jpg', duration: 'Half Day / Full Day', difficulty: 'All Levels' },
    { title: 'Trail Hiking', description: 'Discover hidden waterfalls, wildflower meadows, and panoramic summit views with guides who bring the ecology and history of the Rockies to life.', image: '/images/rva/hiking.png', duration: '3–6 Hours', difficulty: 'Moderate' },
    { title: 'Scenic Escalade Tours', description: "See Colorado's most iconic landmarks from the comfort of a luxury Escalade. Perfect for those who want the views without the vertical.", image: '/images/rva/scenicdrive.png', duration: 'Half Day / Full Day', difficulty: 'Easy — Ride Along' },
    { title: 'Horseback Riding', description: 'Experience the Rockies the way the first settlers did — on horseback. Gentle trail rides through meadows and aspen forests.', image: '/images/rva/horseback.png', duration: '2–4 Hours', difficulty: 'All Levels' },
    { title: 'Elevated Camping', description: 'Glamping meets wilderness. Premium basecamp with gourmet meals, comfortable sleeping, and guided night-sky viewing.', image: '/images/rva/camping.jpeg', duration: 'Overnight / Multi-Day', difficulty: 'All Levels' },
  ],
  whyChooseUs: [
    { title: 'Local Expertise', description: 'Born and raised in the valley. Our guides know every trail, stream, and hidden gem.' },
    { title: 'All-Inclusive Gear', description: 'Premium equipment included with every adventure. Just show up.' },
    { title: 'Small Groups', description: 'Intimate experiences, not cattle calls. Personalized attention on every trip.' },
    { title: 'Safety First', description: 'Wilderness first-aid certified guides, comprehensive insurance, meticulous protocols.' },
  ],
  testimonials: [
    { quote: "Kit was an outstanding guide. His knowledge and passion for fly fishing made the trip unforgettable. Can't wait to come back next summer!", name: 'Mike Kensington', location: 'Raleigh, NC' },
    { quote: "We've brought our family to Rich Valley three years running. The kids talk about it all year long. It's become our favorite tradition.", name: 'Zola Richards', location: 'Omaha, NE' },
  ],
  gallery: [
    '/images/rva/flyfishing.png', '/images/rva/paddleboarding.jpg', '/images/rva/mountainbiking.jpg',
    '/images/rva/hiking.png', '/images/rva/camping.jpeg', '/images/rva/horseback.png',
  ],
  partnerSite: {
    name: 'Aspen Alpenglow Limousine',
    description: 'Need a ride to the trailhead — or anywhere else? Our sister company offers luxury transportation with the same personal touch.',
    url: 'https://aspenalpenglow.com',
  },
}

export const alpenglowData = {
  name: 'Aspen Alpenglow Limousine',
  tagline: 'Luxury Transportation in the Roaring Fork Valley',
  description: 'Since 2012, Aspen Alpenglow Limousine has provided distinguished private car and limousine service throughout Aspen, Snowmass, and the Roaring Fork Valley. Available 24/7.',
  phone: PHONE, phoneHref: PHONE_HREF, location: LOCATION,
  logo: '/images/alpenglow/logo.png',
  stats: [
    { value: '24/7', label: 'Dispatch Available' },
    { value: '14+', label: 'Years of Service' },
    { value: '4.9', label: 'Client Rating' },
  ],
  services: [
    { title: 'Airport Transfers', description: "Seamless door-to-door service to and from ASE and EGE airports. Real-time flight tracking ensures we're there when you land.", features: ['Flight tracking & meet-and-greet', 'Complimentary wait time', 'Luggage assistance', '24/7 dispatch'], icon: 'Plane' },
    { title: 'Hourly Charter', description: 'Your vehicle, your schedule. Book by the hour for shopping, dining, scenic drives, or any occasion.', features: ['Flexible scheduling', 'Multiple stop itineraries', 'Complimentary refreshments', 'Professional chauffeur'], icon: 'Clock' },
    { title: 'Corporate Travel', description: 'Make the right impression. Reliable, discreet transportation for executives, clients, and teams.', features: ['Corporate account billing', 'Confidential & professional', 'Competitive group rates', 'Licensed & fully insured'], icon: 'Briefcase' },
    { title: 'Wedding Transportation', description: 'Your day deserves perfect logistics. Bridal party shuttles to grand getaway cars.', features: ['Custom itinerary planning', 'Bridal party coordination', 'Decorated vehicles available', 'Package discounts'], icon: 'Heart' },
  ],
  fleet: [
    { name: 'Executive Escalade', image: '/images/alpenglow/escalade.png', passengers: 'Up to 6 Passengers', features: ['Premium leather interior', 'Climate control', 'USB & WiFi', 'Privacy partition available'] },
    { name: 'Luxury Sprinter', image: '/images/alpenglow/sprinter.png', passengers: 'Up to 14 Passengers', features: ['Executive seating', 'Entertainment system', 'Overhead storage', 'Standing headroom'] },
  ],
  serviceAreas: [
    { name: 'Aspen', description: 'Downtown, Aspen Mountain, Aspen Highlands' },
    { name: 'Snowmass Village', description: 'Base Village, Snowmass Ski Area' },
    { name: 'Basalt & El Jebel', description: 'Mid-valley convenience' },
    { name: 'Carbondale', description: 'Crystal Valley, Redstone, Marble' },
    { name: 'Glenwood Springs', description: 'Hot springs, I-70 corridor' },
    { name: 'Eagle / Vail', description: 'EGE airport, Vail Valley connections' },
  ],
  destinations: [
    { name: 'Garden of the Gods', image: '/images/alpenglow/garden-of-the-gods.jpg' },
    { name: 'Denver Botanic Gardens', image: '/images/alpenglow/botanic-gardens.jpg' },
    { name: 'Red Rocks Amphitheatre', image: '/images/alpenglow/red-rocks.jpg' },
    { name: 'Coors Field', image: '/images/alpenglow/coors-field.jpg' },
    { name: 'Pikes Peak', image: '/images/alpenglow/pikes-peak.jpg' },
  ],
  testimonials: [
    { quote: 'Absolutely first-class service. The Escalade was immaculate, and they tracked our delayed flight without us even asking.', name: 'James & Patricia Holden', location: 'Dallas, TX' },
    { quote: 'We hired Alpenglow for our wedding weekend and they were flawless — shuttles ran on time, the bridal car was gorgeous.', name: 'Sarah Mehta', location: 'Denver, CO' },
  ],
  whyChooseUs: [
    { title: 'Flight Tracking', description: 'We monitor your flight in real-time so your ride is waiting, even if plans change.' },
    { title: 'Local Knowledge', description: 'Our drivers live here. They know the fastest routes and the valley inside out.' },
    { title: 'Impeccable Fleet', description: 'Late-model luxury vehicles, professionally detailed before every ride.' },
    { title: 'White-Glove Service', description: 'Meet-and-greet, luggage handling, complimentary refreshments — every detail covered.' },
  ],
  partnerSite: {
    name: 'Rich Valley Adventures',
    description: "Looking for something to do while you're in town? Our sister company offers guided fly fishing, paddle boarding, mountain biking, and more.",
    url: 'https://richvalleyadventures.com',
  },
}

export const photoNotes = {
  rvaHero: { current: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', note: 'REPLACE: Wide-angle shot of the Roaring Fork Valley or Maroon Bells at golden hour.' },
  alpenglowHero: { current: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80', note: 'REPLACE: Night shot of Aspen downtown or luxury vehicle at dusk.' },
  teamPhoto: { current: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80', note: 'REPLACE: Candid photo of the RVA team outdoors.' },
}
