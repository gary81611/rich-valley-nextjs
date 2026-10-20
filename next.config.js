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
      { source: '/adventures/winter-adventures', destination: '/winter', permanent: true, has: h },
      { source: '/adventures/glamping', destination: '/elevated-camping', permanent: true, has: h },
      { source: '/mountain-biking', destination: '/adventures/mountain-biking', permanent: true, has: h },
      // Legacy indexed patterns → canonical /service-areas/[slug]
      { source: '/areas/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
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
    // statusCode 301, both slash forms. permanent:true would be a 308.
    const singleHop = [
      ['/adventures/paddleboarding', '/paddle-boarding'],
      ['/paddleboarding', '/paddle-boarding'],
      ['/adventures/paddleboard-tour', '/paddle-boarding'],
      ['/paddleboard-tour', '/paddle-boarding'],
      ['/adventures/sup', '/paddle-boarding'],
      ['/sup', '/paddle-boarding'],
      ['/adventures/stand-up-paddle-boarding', '/paddle-boarding'],
      ['/stand-up-paddle-boarding', '/paddle-boarding'],
      ['/adventures/stand-up-paddleboard', '/paddle-boarding'],
      ['/stand-up-paddleboard', '/paddle-boarding'],
      ['/adventures/paddleboard', '/paddle-boarding'],
      ['/paddleboard', '/paddle-boarding'],
      ['/adventures/float-trip', '/fly-fishing'],
      ['/float-trip', '/fly-fishing'],
      ['/adventures/full-day-float-trip', '/fly-fishing'],
      ['/full-day-float-trip', '/fly-fishing'],
      ['/adventures/group-hiking', '/hiking'],
      ['/group-hiking', '/hiking'],
      ['/glamping', '/elevated-camping'],
      ['/adventures/private-ranch-family-fishing-and-picnic-lunch', '/private-ranch-fishing'],
      ['/private-ranch-family-fishing-and-picnic-lunch', '/private-ranch-fishing'],
      ['/adventures/private-ranch-fishing', '/private-ranch-fishing'],
      ['/adventures/trail-hiking', '/hiking'],
      ['/trail-hiking', '/hiking'],
      ['/scenic-escalade-tours', '/adventures/scenic-escalade-tours'],
      ['/horseback-riding', '/adventures/horseback-riding'],
      ['/hunting', '/winter'],
      ['/adventures/hunting', '/winter'],
      ['/blog/summer-activities-aspen-families', '/blog/family-fly-fishing-trips-aspen-rich-valley-adventures'],
    ]
    // Old limo URLs. Each AAL destination returned 200. statusCode 301, both slash forms, RVA host only.
    const limoToAal = [
      ['/service-areas/aspen-co', 'https://aspenalpenglowlimousine.com/service-areas/aspen'],
      ['/service-areas/basalt-co', 'https://aspenalpenglowlimousine.com/service-areas/basalt'],
      ['/service-areas/snowmass-village-co', 'https://aspenalpenglowlimousine.com/service-areas/snowmass-village'],
      ['/service-areas/carbondale-co', 'https://aspenalpenglowlimousine.com/service-areas/carbondale'],
      ['/service-areas/rifle-co', 'https://aspenalpenglowlimousine.com/service-areas/rifle'],
      ['/service-areas/denver-co', 'https://aspenalpenglowlimousine.com/service-areas/denver'],
      ['/service-areas-locations/aspen-co', 'https://aspenalpenglowlimousine.com/service-areas/aspen'],
      ['/service-areas-locations/basalt-co', 'https://aspenalpenglowlimousine.com/service-areas/basalt'],
      ['/service-areas-locations/snowmass-village-co', 'https://aspenalpenglowlimousine.com/service-areas/snowmass-village'],
      ['/service-areas-locations/carbondale-co', 'https://aspenalpenglowlimousine.com/service-areas/carbondale'],
      ['/service-areas-locations/rifle-co', 'https://aspenalpenglowlimousine.com/service-areas/rifle'],
      ['/service-areas-locations/denver-co', 'https://aspenalpenglowlimousine.com/service-areas/denver'],
    ]
    for (const [source, destination] of singleHop) {
      list.push({ source, destination, statusCode: 301, has: h })
      list.push({ source: `${source}/`, destination, statusCode: 301, has: h })
    }
    for (const [source, destination] of limoToAal) {
      list.push({ source, destination, statusCode: 301, has: h })
      list.push({ source: `${source}/`, destination, statusCode: 301, has: h })
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
    // statusCode 301. permanent:true would be a 308. Both slash forms, AAL hosts only.
    list.push(
      { source: '/services/ski-resort-transfers', destination: '/ski-resort-transfers', statusCode: 301, has: h },
      { source: '/services/ski-resort-transfers/', destination: '/ski-resort-transfers', statusCode: 301, has: h },
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
