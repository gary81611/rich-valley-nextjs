/** @type {import('next').NextConfig} */
const rvaHosts = ['www.richvalleyadventures.com', 'richvalleyadventures.com']
const aalHosts = ['www.aspenalpenglowlimousine.com', 'aspenalpenglowlimousine.com']

function rvaRedirects() {
  const list = []
  for (const host of rvaHosts) {
    const h = [{ type: 'host', value: host }]
    list.push(
      // Elevated camping: rich landing at /elevated-camping (adventure slug URL redirects here)
      { source: '/adventures/elevated-camping', destination: '/elevated-camping', permanent: true, has: h },
      { source: '/mountain-biking', destination: '/adventures/mountain-biking', permanent: true, has: h },
      // Legacy indexed patterns → canonical /service-areas/[slug]
      { source: '/areas/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
      { source: '/service-areas-locations/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
      { source: '/service-areas/aspen-co', destination: '/service-areas/aspen', permanent: true, has: h },
      { source: '/service-areas/basalt-co', destination: '/service-areas/basalt', permanent: true, has: h },
      { source: '/service-areas/snowmass-village-co', destination: '/service-areas/snowmass-village', permanent: true, has: h },
      { source: '/service-areas/carbondale-co', destination: '/service-areas/carbondale', permanent: true, has: h },
      // Missing city pages route to the service areas index.
      { source: '/service-areas/rifle-co', destination: '/service-areas', permanent: true, has: h },
      { source: '/service-areas/denver-co', destination: '/service-areas', permanent: true, has: h },
      {
        source: '/fleet',
        destination: 'https://aspenalpenglowlimousine.com/fleet',
        permanent: true,
        has: h,
      },
      { source: '/fleet-v3', destination: 'https://aspenalpenglowlimousine.com/fleet', permanent: true, has: h },
      { source: '/booking', destination: '/contact', permanent: true, has: h },
      { source: '/booking/', destination: '/contact', permanent: true, has: h },
      // Legacy CMS / old marketing URLs (GSC 404 cleanup)
      { source: '/home', destination: '/', permanent: true, has: h },
      { source: '/home/', destination: '/', permanent: true, has: h },
      { source: '/adventure-booking', destination: '/contact', permanent: true, has: h },
      { source: '/outdoor-adventures', destination: '/adventures', permanent: true, has: h },
      { source: '/contact-us', destination: '/contact', permanent: true, has: h },
      { source: '/privacy-policy', destination: '/privacy', permanent: true, has: h },
    )
  }
  return list
}

/** Canonical CMS landing for airport content; `/services/airport-transfers` duplicates the same topic. */
function aalRedirects() {
  const list = []
  for (const host of aalHosts) {
    const h = [{ type: 'host', value: host }]
    list.push({
      source: '/services/airport-transfers',
      destination: '/airport-transfers',
      permanent: true,
      has: h,
    })
  }
  return list
}

/** Apex → www: single canonical host for RVA (reduces “duplicate / alternate canonical” noise in GSC). */
function rvaApexToWww() {
  return {
    source: '/:path*',
    destination: 'https://www.richvalleyadventures.com/:path*',
    permanent: true,
    has: [{ type: 'host', value: 'richvalleyadventures.com' }],
  }
}

function supabaseProjectHost() {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!u || typeof u !== 'string' || !u.startsWith('http')) return null
  try {
    return new URL(u).hostname
  } catch {
    return null
  }
}

const imageRemotePatterns = [
  { protocol: 'https', hostname: 'images.unsplash.com' },
  { protocol: 'https', hostname: 'lirp.cdn-website.com' },
]
const supabaseHost = supabaseProjectHost()
if (supabaseHost) {
  imageRemotePatterns.push({ protocol: 'https', hostname: supabaseHost })
}

const nextConfig = {
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: imageRemotePatterns,
  },
  async redirects() {
    return [rvaApexToWww(), ...rvaRedirects(), ...aalRedirects()]
  },
  async rewrites() {
    return {
      // beforeFiles runs before filesystem routes (including sitemap.ts / robots.ts)
      // so the request-aware API handlers take precedence over the static metadata files.
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/api/sitemap' },
        { source: '/robots.txt', destination: '/api/robots' },
      ],
    }
  },
}
module.exports = nextConfig
