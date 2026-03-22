'use client'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[]
  }
}

function getMeasurementId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const hostname = window.location.hostname
  const isAlpenglow = hostname.includes('alpenglow') || hostname.includes('aspenalpenglow')
  return isAlpenglow
    ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_AAL
    : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_RVA
}

function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdmin = pathname.startsWith('/admin')

  // Initialize GA4 script on mount (skipped for admin pages)
  useEffect(() => {
    if (isAdmin) return
    const measurementId = getMeasurementId()
    if (!measurementId || document.getElementById('ga-script')) return

    window.dataLayer = window.dataLayer || []
    // Standard GA4 gtag function — must use `arguments` (not rest params)
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', measurementId)

    const script = document.createElement('script')
    script.id = 'ga-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
  }, [isAdmin])

  // Track page views on route changes
  useEffect(() => {
    if (isAdmin) return
    if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return
    const measurementId = getMeasurementId()
    if (!measurementId) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', measurementId, { page_path: url })
  }, [pathname, searchParams, isAdmin])

  return null
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}
