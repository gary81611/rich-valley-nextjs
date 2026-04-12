import type { Metadata } from 'next'
import AlpenglowHomeClient from './ALPHomeClient'

const ALP_URL = 'https://aspenalpenglowlimousine.com'

export const metadata: Metadata = {
  alternates: {
    canonical: ALP_URL,
  },
}

export default function AlpenglowPage() {
  return <AlpenglowHomeClient />
}
