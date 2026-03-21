import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rich Valley Adventures & Aspen Alpenglow Limousine',
  description: 'Premium adventure experiences and luxury transportation in Aspen & the Roaring Fork Valley.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter">{children}</body>
    </html>
  )
}
