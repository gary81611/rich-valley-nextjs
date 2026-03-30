import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: [
      'https://richvalleyadventures.com/sitemap.xml',
      'https://aspenalpenglow.com/sitemap.xml',
    ],
  }
}
