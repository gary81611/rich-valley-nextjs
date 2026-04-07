/** @type {import('next').NextConfig} */
const rvaHosts = ['www.richvalleyadventures.com', 'richvalleyadventures.com']

function rvaRedirects() {
  const list = []
  for (const host of rvaHosts) {
    const h = [{ type: 'host', value: host }]
    list.push(
      { source: '/service-areas/aspen-co', destination: '/rva/locations/aspen', permanent: true, has: h },
      { source: '/service-areas/basalt-co', destination: '/rva/locations/basalt', permanent: true, has: h },
      { source: '/service-areas/snowmass-village-co', destination: '/rva/locations/snowmass', permanent: true, has: h },
      { source: '/service-areas/carbondale-co', destination: '/rva/locations/carbondale', permanent: true, has: h },
      { source: '/service-areas-locations/carbondale-co', destination: '/rva/locations/carbondale', permanent: true, has: h },
      { source: '/service-areas', destination: '/rva/locations', permanent: true, has: h },
      {
        source: '/fleet',
        destination: 'https://aspenalpenglowlimousine.com/alpenglow/fleet',
        permanent: true,
        has: h,
      },
      { source: '/services', destination: '/rva', permanent: true, has: h },
      { source: '/booking', destination: '/rva/contact', permanent: true, has: h },
    )
  }
  return list
}

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lirp.cdn-website.com' },
    ],
  },
  async redirects() {
    return [
      ...rvaRedirects(),
      // Catch remaining /service-areas/* slugs not listed above (e.g. old CMS paths)
      ...rvaHosts.map((host) => ({
        source: '/service-areas/:path*',
        destination: '/rva/locations',
        permanent: true,
        has: [{ type: 'host', value: host }],
      })),
      ...rvaHosts.map((host) => ({
        source: '/service-areas-locations/:path*',
        destination: '/rva/locations',
        permanent: true,
        has: [{ type: 'host', value: host }],
      })),
    ]
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
