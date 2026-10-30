/** Kit McLendon's photos, Oct 29, 2026. Compressed WebP. Most are winter outings. */

export type KitPhoto = {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export const RVA_KIT_PHOTOS: KitPhoto[] = [
  {
    src: '/images/rva/kit/drift-boat-launch.webp',
    alt: 'A drift boat being launched from a trailer into a Colorado river, with a pickup truck on the icy bank',
    caption: 'Float trip launch. Fishing is guided in-house.',
    width: 1600,
    height: 1200,
  },
  {
    src: '/images/rva/kit/snowmobile-aspen-grove.webp',
    alt: 'A snowmobile on a snowy road through aspen and pine trees, with a rocky snow-covered peak behind',
    caption: 'Winter day in the high country. Snowmobile trips go through a partner local outfitter.',
    width: 1400,
    height: 1866,
  },
  {
    src: '/images/rva/kit/snowmobiles-meadow-peaks.webp',
    alt: 'Snowmobiles crossing a snowy meadow below rocky peaks',
    caption: 'Snowmobile outing arranged with a partner local outfitter.',
    width: 1600,
    height: 2134,
  },
  {
    src: '/images/rva/kit/snowmobiles-ranch-road.webp',
    alt: 'A person standing between a red snowmobile and a white snowmobile on a snowy ranch road',
    caption: 'Snowmobiles on a ranch road. These trips go through a partner local outfitter.',
    width: 1600,
    height: 1200,
  },
  {
    src: '/images/rva/kit/snowmobile-rider-snowfall.webp',
    alt: 'A rider seated on a snowmobile while snow falls in a pine forest',
    caption: 'Snowmobile ride in falling snow, arranged with a partner local outfitter.',
    width: 1400,
    height: 1050,
  },
  {
    src: '/images/rva/kit/tracked-utv-guests.webp',
    alt: 'Two people standing beside a tracked UTV and a tracked SUV in deep snow',
    caption: 'Tracked UTV outing arranged with a partner local outfitter.',
    width: 1400,
    height: 1050,
  },
  {
    src: '/images/rva/kit/pink-streamer-fly-closeup.webp',
    alt: "Close-up of a pink and white streamer fly in a guide's hand",
    caption: 'Hand-tied streamer fly',
    width: 1440,
    height: 1080,
  },
]

export const RVA_FLOAT_PHOTO = RVA_KIT_PHOTOS[0]
/** Landscape frame so the existing wide hero crop keeps the rider and both snowmobiles. */
export const RVA_WINTER_HERO_PHOTO = RVA_KIT_PHOTOS[3]

/** Fly-fishing page hero only. Not in gallery. */
export const RVA_FLY_FISHING_HERO_PHOTO: KitPhoto = {
  src: '/images/rva/kit/roaring-fork-fly-fishing-brown-trout.webp',
  alt: 'Angler holding a large brown trout on the Roaring Fork River',
  caption: 'Brown trout on the Roaring Fork',
  width: 1920,
  height: 1440,
}

/** About page trip/group image only. Not in gallery. */
export const RVA_ABOUT_GROUP_FLOAT_PHOTO: KitPhoto = {
  src: '/images/rva/kit/group-river-float-rafts.webp',
  alt: 'Rich Valley Adventures guides and guests on a group river float with rafts',
  caption: 'Group river float',
  width: 1440,
  height: 1080,
}
