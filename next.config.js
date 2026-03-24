/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lirp.cdn-website.com' },
    ],
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
