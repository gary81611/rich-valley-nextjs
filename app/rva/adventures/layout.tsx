import type { Metadata } from 'next'
import { RVA_ADVENTURES } from '@/lib/gsc-page2-copy'

const canonical = 'https://www.richvalleyadventures.com/adventures'

export const metadata: Metadata = {
  title: RVA_ADVENTURES.title,
  description: RVA_ADVENTURES.description,
  alternates: { canonical },
  openGraph: {
    title: RVA_ADVENTURES.title,
    description: RVA_ADVENTURES.description,
    url: canonical,
    siteName: 'Rich Valley Adventures',
    type: 'website',
  },
}

export default function AdventuresLayout({ children }: { children: React.ReactNode }) {
  return children
}
