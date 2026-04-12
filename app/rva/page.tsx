import type { Metadata } from 'next'
import RVAHomeClient from './RVAHomeClient'

const RVA_URL = 'https://www.richvalleyadventures.com'

export const metadata: Metadata = {
  alternates: {
    canonical: RVA_URL,
  },
}

export default function RVAPage() {
  return <RVAHomeClient />
}
