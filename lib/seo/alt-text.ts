type BrandName = 'Rich Valley Adventures' | 'Aspen Alpenglow Limousine'

interface AltInput {
  subject: string
  brand: BrandName
  location?: string
  context?: string
}

export function seoAlt({ subject, brand, location, context }: AltInput): string {
  const pieces = [subject.trim()]
  if (location?.trim()) pieces.push(location.trim())
  if (context?.trim()) pieces.push(context.trim())
  pieces.push(brand)
  return pieces.join(' — ')
}
