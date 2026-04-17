export const PHONE = '970-456-3666'
export const PHONE_HREF = 'tel:+19704563666'
export const LOCATION = 'Aspen, Colorado'

/** Google Business Profile — Rich Valley Adventures (for schema + review CTA). */
export const RVA_GOOGLE_PLACE_ID = 'ChIJkcn5KdQ7QIcR50T745YsSmg'
export const RVA_GOOGLE_REVIEW_URL = 'https://g.page/r/CedE--OWLEpoEAE/review'
export const RVA_GOOGLE_MAPS_PLACE_URL = `https://www.google.com/maps?place_id=${encodeURIComponent(RVA_GOOGLE_PLACE_ID)}`

export const rvaData = {
  name: 'Rich Valley Adventures',
  tagline: 'Discover the Heart of Aspen',
  description: 'Since 2012, Rich Valley Adventures has been dedicated to protecting and sharing the beauty of Aspen and the Roaring Fork Valley through guided outdoor experiences that create lasting memories.',
  phone: PHONE, phoneHref: PHONE_HREF, location: LOCATION,
  logo: '/images/logos/rva-logo.png',
  email: 'kit@richvalleyadventures.com',
  googlePlaceId: RVA_GOOGLE_PLACE_ID,
  googleMapsPlaceUrl: RVA_GOOGLE_MAPS_PLACE_URL,
  googleReviewUrl: RVA_GOOGLE_REVIEW_URL,
  social: {
    facebook: 'https://www.facebook.com/richvalleyadventures',
    instagram: 'https://www.instagram.com/richvalleyadventures',
  },
  partnerSite: {
    name: 'Aspen Alpenglow Limousine',
    description: 'Need a ride to the trailhead — or anywhere else? Our sister company offers luxury transportation with the same personal touch.',
    url: 'https://aspenalpenglowlimousine.com',
  },
}

export const alpenglowData = {
  name: 'Aspen Alpenglow Limousine',
  tagline: 'Luxury Transportation in the Roaring Fork Valley',
  description: 'Since 2012, Aspen Alpenglow Limousine has provided distinguished private car and limousine service throughout Aspen, Snowmass, and the Roaring Fork Valley. Available 24/7.',
  phone: PHONE, phoneHref: PHONE_HREF, location: LOCATION,
  /** Limo Anywhere embed lives here; primary “book” CTAs should point to this path. */
  onlineReservationsPath: '/reservations',
  logo: '/images/logos/alpenglow-logo.png',
  email: 'kit@richvalleyadventures.com',
  social: {
    facebook: 'https://www.facebook.com/aspenalpenglow',
    instagram: 'https://www.instagram.com/aspenalpenglow',
  },
  partnerSite: {
    name: 'Rich Valley Adventures',
    description: "Looking for something to do while you're in town? Our sister company offers guided fly fishing, paddle boarding, mountain biking, and more.",
    url: 'https://www.richvalleyadventures.com',
  },
}

export const photoNotes = {
  rvaHero: { current: '/images/about/hero.jpg', note: 'Hero image from original site.' },
  alpenglowHero: { current: '/images/about/pexels-outdoor.png', note: 'Hero image for Alpenglow.' },
  teamPhoto: { current: '/images/about/founder-kit.jpeg', note: 'Founder Kit photo.' },
}
