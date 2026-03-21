import { MetadataRoute } from 'next'

const RVA_URL = 'https://richvalleyadventures.com'
const ALP_URL = 'https://aspenalpenglow.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    // Rich Valley Adventures
    {
      url: RVA_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${RVA_URL}/#adventures`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${RVA_URL}/#about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${RVA_URL}/#gallery`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${RVA_URL}/#faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${RVA_URL}/#contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Aspen Alpenglow Limousine
    {
      url: ALP_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${ALP_URL}/#services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${ALP_URL}/#fleet`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${ALP_URL}/#service-areas`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${ALP_URL}/#faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${ALP_URL}/#contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Shared pages
    {
      url: `${RVA_URL}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${RVA_URL}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
