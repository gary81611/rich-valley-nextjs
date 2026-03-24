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
      'https://www.richvalleyadventures.com/sitemap.xml',
      'https://aspenalpenglowlimousine.com/sitemap.xml',
    ],
  }
}
