'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const [measurementId, setMeasurementId] = useState<string | null>(null)

  useEffect(() => {
    // Don't load on admin paths
    if (pathname?.startsWith('/admin')) return

    const hostname = window.location.hostname
    if (hostname.includes('richvalleyadventures.com')) {
      setMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_RVA ?? null)
    } else if (hostname.includes('alpenglowlimousine.com')) {
      setMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_AAL ?? null)
    }
  }, [pathname])

  // Track route changes
  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag) return
    window.gtag('config', measurementId, { page_path: pathname })
  }, [pathname, measurementId])

  if (!measurementId || pathname?.startsWith('/admin')) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  )
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}
