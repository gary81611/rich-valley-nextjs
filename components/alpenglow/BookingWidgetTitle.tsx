'use client'

import { useEffect } from 'react'

const BOOKING_IFRAME_TITLE = 'Aspen Alpenglow Limousine online booking'

/** The Limo Anywhere loader injects an iframe with no title. Label it when it appears. */
export default function BookingWidgetTitle() {
  useEffect(() => {
    const label = () => {
      document.querySelectorAll('iframe').forEach((iframe) => {
        const src = iframe.getAttribute('src') || ''
        if (!/mylimobiz|limo/i.test(src)) return
        if (iframe.getAttribute('title')) return
        iframe.setAttribute('title', BOOKING_IFRAME_TITLE)
      })
    }

    label()
    const observer = new MutationObserver(label)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src'],
    })
    const timer = window.setInterval(label, 300)
    const stop = window.setTimeout(() => window.clearInterval(timer), 8000)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
      window.clearTimeout(stop)
    }
  }, [])

  return null
}
