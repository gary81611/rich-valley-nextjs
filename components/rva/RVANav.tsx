'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { rvaData } from '@/lib/site-data'
import { RVA_ACTIVITIES, rvaNavIsCurrent } from '@/lib/rva-activities'

const MAIN_LINKS = [
  { label: 'Locations', href: '/locations' },
  { label: 'Conditions', href: '/conditions' },
  { label: 'Our Guides', href: '/guides' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
  { label: 'Blog', href: '/blog' },
]

const linkClass =
  'relative text-sm font-medium tracking-wide text-white/90 hover:text-rva-copper-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-rva-copper-300'

function currentClass(active: boolean) {
  return active ? 'text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-rva-copper-light' : ''
}

export default function RVANav() {
  const pathname = usePathname() || '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adventuresOpen, setAdventuresOpen] = useState(false)
  const [mobileAdventuresOpen, setMobileAdventuresOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const adventuresCurrent = RVA_ACTIVITIES.some((page) => rvaNavIsCurrent(pathname, page.href))

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 border-b border-black/15 bg-rva-forest shadow-lg">
      <div className="max-w-7xl mx-auto flex w-full shrink-0 items-center px-6 py-4">
        <a href="/" className="flex items-center gap-3 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-rva-copper-300" aria-label="Rich Valley Adventures — home">
          <span className="inline-flex items-center justify-center rounded-xl bg-rva-cream px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-2 ring-rva-copper-700/35 md:px-3.5 md:py-2.5">
            <Image
              src={rvaData.logo}
              alt="Rich Valley Adventures logo"
              width={220}
              height={68}
              className="h-12 w-auto object-contain md:h-16 brightness-[1.08] contrast-[1.12] saturate-[1.06]"
              unoptimized
              loading="eager"
            />
          </span>
        </a>
        <a href="tel:+19704563666" aria-label="Call Rich Valley Adventures at 970-456-3666" className="ml-3 hidden lg:inline-flex flex-shrink-0 items-center min-h-12 bg-rva-copper-700 hover:bg-rva-copper-800 text-white px-4 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-rva-copper-300">
          970-456-3666
        </a>
        <div className="hidden lg:flex items-center gap-x-2 xl:gap-x-6 ml-auto">
          <div
            className="relative"
            onMouseEnter={() => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); setAdventuresOpen(true) }}
            onMouseLeave={() => { closeTimerRef.current = setTimeout(() => setAdventuresOpen(false), 250) }}
          >
            <button
              onClick={() => setAdventuresOpen(!adventuresOpen)}
              className={`${linkClass} flex items-center gap-1 min-h-11 ${currentClass(adventuresCurrent)}`}
              aria-expanded={adventuresOpen}
              aria-current={adventuresCurrent ? 'page' : undefined}
            >
              Adventures
              <svg className={`w-3.5 h-3.5 transition-transform ${adventuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {adventuresOpen && (
              <div className="absolute top-full left-0 mt-1 w-60 bg-rva-forest rounded-xl shadow-2xl border border-white/10 py-2 z-50">
                {RVA_ACTIVITIES.map((page) => {
                  const active = rvaNavIsCurrent(pathname, page.href)
                  return (
                    <a
                      key={page.href}
                      href={page.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-11 items-center px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rva-copper-300 ${active ? 'text-white underline decoration-rva-copper-light decoration-2 underline-offset-4' : 'text-white/85 hover:text-rva-copper-light hover:bg-white/5'}`}
                    >
                      {page.label}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          {MAIN_LINKS.map((link) => {
            const active = rvaNavIsCurrent(pathname, link.href)
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`${linkClass} inline-flex items-center min-h-11 ${currentClass(active)}`}
              >
                {link.label}
              </a>
            )
          })}
          <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center min-h-11`}>
            Transportation
          </a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile navigation menu" aria-expanded={mobileMenuOpen} className="lg:hidden ml-auto text-white min-h-11 min-w-11 inline-flex flex-col items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-rva-copper-300">
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[calc(100dvh-var(--rva-header,6.25rem)-3.5rem)] space-y-1 overflow-y-auto overscroll-contain border-t border-white/10 bg-rva-forest px-6 py-4 pb-8">
          <a href="tel:+19704563666" onClick={() => setMobileMenuOpen(false)} className="mb-2 inline-flex min-h-12 items-center rounded-full bg-rva-copper-700 px-4 text-sm font-semibold text-white hover:bg-rva-copper-800">
            970-456-3666
          </a>
          <div>
            <button onClick={() => setMobileAdventuresOpen(!mobileAdventuresOpen)} className="flex items-center justify-between w-full text-white/90 hover:text-rva-copper-light text-sm font-medium min-h-11" aria-expanded={mobileAdventuresOpen}>
              Adventures
              <svg className={`w-3.5 h-3.5 transition-transform ${mobileAdventuresOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {mobileAdventuresOpen && (
              <div className="pl-4 space-y-1 border-l border-white/20 ml-2 mt-1">
                {RVA_ACTIVITIES.map((page) => {
                  const active = rvaNavIsCurrent(pathname, page.href)
                  return (
                    <a
                      key={page.href}
                      href={page.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`block text-sm min-h-11 flex items-center ${active ? 'text-white underline decoration-rva-copper-light' : 'text-white/75 hover:text-rva-copper-light'}`}
                    >
                      {page.label}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          {MAIN_LINKS.map((link) => {
            const active = rvaNavIsCurrent(pathname, link.href)
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center min-h-11 text-sm font-medium ${active ? 'text-white underline decoration-rva-copper-light decoration-2 underline-offset-4' : 'text-white/90 hover:text-rva-copper-light'}`}
              >
                {link.label}
              </a>
            )
          })}
          <a href="https://aspenalpenglowlimousine.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="flex items-center min-h-11 text-white/90 hover:text-rva-copper-light text-sm font-medium">
            Transportation
          </a>
        </div>
      )}
    </nav>
  )
}
