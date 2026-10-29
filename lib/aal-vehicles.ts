/**
 * One AAL vehicle list for home, fleet, about, and pricing.
 * No model years: those were not confirmed.
 * No photos: the repo cutouts are a Cadillac Escalade and a Mercedes Sprinter,
 * not the Chevrolet Suburban or the Ford Transit.
 */

export type AalVehicle = {
  id: string
  name: string
  capacity: number
  capacityLabel: string
  amenities: string[]
}

export const AAL_VEHICLES: AalVehicle[] = [
  {
    id: 'suburban',
    name: 'Chevrolet Suburban',
    capacity: 7,
    capacityLabel: 'Up to 7 passengers',
    amenities: ['Starlink', 'Ski racks', 'Roof cargo space', 'Child seats free'],
  },
  {
    id: 'transit',
    name: 'Ford Transit Passenger Van',
    capacity: 13,
    capacityLabel: 'Up to 13 passengers',
    amenities: ['Starlink', 'Ski racks', 'Roof cargo space', 'Child seats free'],
  },
]

/** Real logo already in the repo. Not a vehicle photo and not Unsplash. */
export const AAL_OG_IMAGE = {
  url: 'https://aspenalpenglowlimousine.com/images/logos/alpenglow-logo.png',
  width: 1312,
  height: 650,
  alt: 'Aspen Alpenglow Limousine logo',
} as const
