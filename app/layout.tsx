import './globals.css'
import type { Metadata } from 'next'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Rich Valley Adventures & Aspen Alpenglow Limousine',
  description: 'Premium adventure experiences and luxury transportation in Aspen & the Roaring Fork Valley.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-inter">
        <GoogleAnalytics />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
          Skip to content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
