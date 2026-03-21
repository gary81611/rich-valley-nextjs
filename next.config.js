/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lirp.cdn-website.com', pathname: '/312dda6a/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
module.exports = nextConfig
