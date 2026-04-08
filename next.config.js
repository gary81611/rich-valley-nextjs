/** @type {import('next').NextConfig} */
const rvaHosts = ['www.richvalleyadventures.com', 'richvalleyadventures.com']

function rvaRedirects() {
  const list = []
  for (const host of rvaHosts) {
    const h = [{ type: 'host', value: host }]
    list.push(
      // Duplicate adventure URLs (canonical: /adventures/[slug])
      { source: '/elevated-camping', destination: '/adventures/elevated-camping', permanent: true, has: h },
      { source: '/mountain-biking', destination: '/adventures/mountain-biking', permanent: true, has: h },
      // Legacy indexed patterns → canonical /service-areas/[slug]
      { source: '/areas/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
      { source: '/service-areas-locations/:path*', destination: '/service-areas/:path*', permanent: true, has: h },
      { source: '/service-areas/aspen-co', destination: '/service-areas/aspen', permanent: true, has: h },
      { source: '/service-areas/basalt-co', destination: '/service-areas/basalt', permanent: true, has: h },
      { source: '/service-areas/snowmass-village-co', destination: '/service-areas/snowmass-village', permanent: true, has: h },
      { source: '/service-areas/carbondale-co', destination: '/service-areas/carbondale', permanent: true, has: h },
      { source: '/service-areas/denver-co', destination: '/service-areas/denver', permanent: true, has: h },
      {
        source: '/fleet',
        destination: 'https://aspenalpenglowlimousine.com/alpenglow/fleet',
        permanent: true,
        has: h,
      },
      { source: '/services', destination: '/', permanent: true, has: h },
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

const nextConfig = {
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lirp.cdn-website.com' },
    ],
  },
  async redirects() {
    return [...rvaRedirects()]
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
