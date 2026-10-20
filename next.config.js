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
      { source: '/adventures/fly-fishing', destination: '/fly-fishing', permanent: true, has: h },
      { source: '/adventures/hiking', destination: '/hiking', permanent: true, has: h },
      { source: '/adventures/hunting', destination: '/hunting', permanent: true, has: h },
      { source: '/adventures/winter-adventures', destination: '/winter', permanent: true, has: h },
      { source: '/adventures/glamping', destination: '/elevated-camping', permanent: true, has: h },
      { source: '/mountain-biking', destination: '/adventures/mountain-biking', permanent: true, has: h },
      // Legacy indexed patterns → canonical /service-areas/[slug]
      { source: '/areas/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
      // `/service-areas-locations/*` → single-hop 301 to final URLs in middleware (avoid /service-areas/*-co chains).
      { source: '/service-areas/aspen-co', destination: '/service-areas/aspen', permanent: true, has: h },
      { source: '/service-areas/basalt-co', destination: '/service-areas/basalt', permanent: true, has: h },
      { source: '/service-areas/snowmass-village-co', destination: '/service-areas/snowmass-village', permanent: true, has: h },
      { source: '/service-areas/carbondale-co', destination: '/service-areas/carbondale', permanent: true, has: h },
      // Missing city pages route to the service areas index.
      { source: '/service-areas/rifle-co', destination: '/service-areas', permanent: true, has: h },
      { source: '/service-areas/denver-co', destination: '/service-areas', permanent: true, has: h },
      // Legacy blog slug consolidated to current canonical post.
      {
        source: '/blog/best-fly-fishing-guide-aspen-rich-valley-adventures',
        destination: '/blog/fly-fishing-aspen-roaring-fork-valley',
        permanent: true,
        has: h,
      },
      {
        source: '/fleet',
        destination: 'https://aspenalpenglowlimousine.com/fleet',
        permanent: true,
        has: h,
      },
      // `/booking`, `/fleet-v3`, `/adventure-booking`, `/outdoor-adventures`, `/contact-us`, `/privacy-policy`:
      // single-hop 301 in middleware (runs before rewrite; avoids chains).
      // Legacy CMS / old marketing URLs (GSC 404 cleanup)
      { source: '/home', destination: '/', permanent: true, has: h },
      { source: '/home/', destination: '/', permanent: true, has: h },
    )
    // statusCode 301: permanent:true is a 308. These aliases must be a true 301.
    const paddleAliases = [
      '/adventures/paddle-boarding',
      '/adventures/paddle-boarding/',
      '/adventures/paddle-board-rentals',
      '/adventures/paddle-board-rentals/',
      '/paddle-board-rentals',
      '/paddle-board-rentals/',
      '/paddleboard-rentals',
      '/paddleboard-rentals/',
      '/paddle-boarding-tours',
      '/paddle-boarding-tours/',
      '/paddleboard-tours',
      '/paddleboard-tours/',
    ]
    for (const source of paddleAliases) {
      list.push({ source, destination: '/paddle-boarding', statusCode: 301, has: h })
    }
  }
  return list
}

/** Canonical CMS landing for airport content; `/services/airport-transfers` duplicates the same topic. */
function aalRedirects() {
  const list = []
  for (const host of aalHosts) {
    const h = [{ type: 'host', value: host }]
    list.push(
      {
        source: '/services/airport-transfers',
        destination: '/airport-transfers',
        permanent: true,
        has: h,
      },
      {
        source: '/wedding-transportation',
        destination: '/weddings',
        permanent: true,
        has: h,
      },
      {
        source: '/corporate-events',
        destination: '/corporate',
        permanent: true,
        has: h,
      },
    )
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

/** Canonical host for AAL: redirect www -> apex permanently. */
function aalWwwToApex() {
  return {
    source: '/:path*',
    destination: 'https://aspenalpenglowlimousine.com/:path*',
    permanent: true,
    has: [{ type: 'host', value: 'www.aspenalpenglowlimousine.com' }],
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
  // Next's built-in "/:path+/" rule is a 308 that runs before these redirects.
  // Skipping it lets the paddle alias 301s (and middleware) see the trailing slash in one hop.
  // Other trailing slashes still 301 in middleware.ts.
  skipTrailingSlashRedirect: true,
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: imageRemotePatterns,
  },
  async redirects() {
    return [rvaApexToWww(), aalWwwToApex(), ...rvaRedirects(), ...aalRedirects()]
  },
  async rewrites() {
    return {
      // beforeFiles runs before filesystem routes so /sitemap.xml and /robots.txt hit the API routes.
      // (There is no app/sitemap.ts; sitemap is generated in app/api/sitemap/route.ts.)
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/api/sitemap' },
        { source: '/robots.txt', destination: '/api/robots' },
      ],
    }
  },
}
module.exports = nextConfig
