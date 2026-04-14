export type SeoSiteKey = 'rva' | 'alpenglow'

const SITE_ORIGIN: Record<SeoSiteKey, string> = {
  rva: 'https://www.richvalleyadventures.com',
  alpenglow: 'https://aspenalpenglowlimousine.com',
}

export function siteOrigin(site: SeoSiteKey): string {
  return SITE_ORIGIN[site]
}
