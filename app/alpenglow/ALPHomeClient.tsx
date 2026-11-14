'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import InquiryForm from '@/components/shared/InquiryForm'
import { alpenglowData } from '@/lib/site-data'
import { createClient } from '@/lib/supabase'
import {
  AAL_EAGLE_BOTH_WAYS,
  AAL_ONE_WAY_RATES,
  AAL_PUC_LINE,
  AAL_PUC_PERMIT,
  correctAalFaqItem,
  correctAalPublicText,
} from '@/lib/aal-public-copy'
import { AAL_VEHICLES } from '@/lib/aal-vehicles'
import { homeFaqPageJsonLd, selectHomeFaqs } from '@/lib/aal-home-faq'
import type { HomeAirportId, HomeFares } from '@/lib/aal-published-rates'
import './aal-home.css'

const PHONE = alpenglowData.phone
const PHONE_HREF = alpenglowData.phoneHref

const AIRPORTS: { id: HomeAirportId; label: string; code: string }[] = [
  { id: 'ase', label: 'Aspen', code: 'ASE' },
  { id: 'ege', label: 'Eagle', code: 'EGE' },
  { id: 'den', label: 'Denver', code: 'DEN' },
  { id: 'ril', label: 'Rifle', code: 'RIL' },
]

const VEHICLES = [
  { id: 'suv' as const, label: 'Suburban', cap: 'Up to 7' },
  { id: 'transit' as const, label: 'Ford Transit', cap: 'Up to 13' },
]

const NAV = [
  { href: '/airport-transfers', label: 'Airport Transfers' },
  { href: '/fleet', label: 'Fleet' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/weddings', label: 'Weddings & Events' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/about', label: 'About' },
]

const AIRPORT_HOME_FAQS: { q: string; a: string }[] = [
  {
    q: 'How much is a car service from Denver to Aspen?',
    a: 'A private Suburban from Denver Airport (DEN) to Aspen is $1,375 one way. The 13-passenger Ford Transit is $1,600. Holiday pricing may change seasonally.',
  },
  {
    q: 'How much is Eagle Airport to Aspen?',
    a: AAL_EAGLE_BOTH_WAYS,
  },
  {
    q: 'Do you offer shared rides?',
    a: 'No shared rides are offered.',
  },
  {
    q: 'What is your PUC permit?',
    a: AAL_PUC_LINE,
  },
]

const REVIEWS = [
  {
    name: 'Michael D.',
    quote:
      'The vehicles are always nice & clean, and the drivers are very friendly and professional. Highly recommend to anyone looking for first class transportation in Aspen!',
  },
  {
    name: 'Lance Y.',
    quote:
      'Always feel safe with Aspen Alpenglow Limo service, have been driven by this company for many years. Very professional and courteous.',
  },
]

const INCLUDED = [
  {
    title: '30 minutes at the airport',
    body: 'Thirty minutes of wait time are included on airport arrivals, and fifteen minutes on other pickups.',
  },
  {
    title: 'Flight diversions handled',
    body: 'Diverted to Denver or Grand Junction? Give us 2 hours\u2019 notice, with no Aspen cancellation penalty.',
  },
  {
    title: 'The price you see',
    body: 'All-inclusive pricing, with no hidden service charges and no gratuity added.',
  },
  {
    title: 'Private FBO service',
    body: 'Eagle, Rifle, Grand Junction, Buena Vista, Montrose and Gunnison.',
  },
  {
    title: 'Hourly charters',
    body: 'Dinners, events and full days in the valley, with a 4-hour minimum.',
  },
  {
    title: 'Corporate accounts',
    body: 'Charge accounts are billed monthly.',
  },
]

const EVENTS = [
  {
    href: '/weddings',
    eyebrow: 'Celebrations',
    title: 'Weddings',
    body: 'Private SUVs and the Ford Transit for the wedding weekend.',
  },
  {
    href: '/events/x-games-aspen-transportation',
    eyebrow: 'January',
    title: 'X Games Aspen 2027',
    body: 'Private car for X Games week.',
  },
  {
    href: '/events/new-years-eve-aspen',
    eyebrow: 'December',
    title: 'New Year\u2019s Eve',
    body: 'Private car for New Year\u2019s Eve in Aspen.',
  },
  {
    href: '/seasonal/holiday-private-car-aspen',
    eyebrow: 'Season',
    title: 'Holiday private car',
    body: 'Private car for holiday arrivals.',
  },
]

const HERO_ALT = 'Aspen trees and the Maroon Bells reflected in a lake in the Roaring Fork Valley'

function correctAalCopy(question: string, answer: string): string {
  const blob = `${question} ${answer}`.toLowerCase()
  if (/1,475|1475/.test(answer) && blob.includes('denver')) return AAL_ONE_WAY_RATES
  if (blob.includes('net-30') || blob.includes('net 30')) return 'Corporate charge accounts are billed monthly.'
  if (blob.includes('cancellation') && (/50%|7-day|7 day|full refund/.test(answer))) {
    return "Flight diversions to Denver or Grand Junction are handled with 2 hours' notice and no Aspen cancellation penalty. General cancellations need 24 hours' notice."
  }
  return correctAalPublicText(answer)
}

export default function AlpenglowHomeClient({ fares }: { fares: HomeFares }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [airport, setAirport] = useState<HomeAirportId>('ege')
  const [vehicle, setVehicle] = useState<'suv' | 'transit'>('suv')
  const [faqs, setFaqs] = useState(AIRPORT_HOME_FAQS)
  const fare = fares.airports[airport][vehicle]
  const suburban = AAL_VEHICLES.find((item) => item.id === 'suburban')
  const transit = AAL_VEHICLES.find((item) => item.id === 'transit')

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('faqs')
          .select('*')
          .eq('is_active', true)
          .eq('site_key', 'alpenglow')
          .order('display_order')
        if (!data) return
        const mapped = data
          .filter((item: { question: string; answer: string }) => item.question && item.answer)
          .flatMap((item: { question: string; answer: string }) => {
            const fixed = correctAalFaqItem(item.question, correctAalCopy(item.question, item.answer))
            return fixed ? [fixed] : []
          })
        const have = new Set(mapped.map((item) => item.q.toLowerCase()))
        const extras = AIRPORT_HOME_FAQS.filter((item) => !have.has(item.q.toLowerCase()))
        setFaqs(selectHomeFaqs([...extras, ...mapped]))
      } catch {
        setFaqs(selectHomeFaqs(AIRPORT_HOME_FAQS))
      }
    }
    fetchFaqs()
  }, [])

  const visibleFaqs = selectHomeFaqs(faqs)
  const faqSchema = homeFaqPageJsonLd(visibleFaqs)

  return (
    <div className="aal-home">
      <div className="aal-util">
        <div className="aal-wrap">
          <span>
            Available 24/7 <span className="hide">&nbsp;·&nbsp; CO PUC permit {AAL_PUC_PERMIT}</span>
          </span>
          <span>
            <span className="hide">Reservations &nbsp;</span>
            <a href={PHONE_HREF}>
              <b>{PHONE}</b>
            </a>
          </span>
        </div>
      </div>

      <header className="aal-hero">
        <Image
          src="/images/about/pexels-outdoor.png"
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="aal-hero-img"
        />
        <div className="aal-hero-shade" />
        <nav className="aal-hero-nav" aria-label="Main navigation">
          <div className="aal-wrap">
            <Link href="/" className="aal-mark" aria-label="Aspen Alpenglow Limousine, home">
              <span className="n">Aspen Alpenglow</span>
              <span className="s">Limousine · Since 2012</span>
            </Link>
            <div className="aal-nav-links">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="aal-nav-right">
              <a className="aal-nav-phone" href={PHONE_HREF}>
                {PHONE}
              </a>
              <button
                type="button"
                className="aal-menu-btn"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                Menu
              </button>
              <Link href="/reservations" className="aal-btn aal-btn-glow">
                Book
              </Link>
            </div>
          </div>
          <div className={menuOpen ? 'aal-menu-panel is-open' : 'aal-menu-panel'}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </div>
        </nav>

        <div className="aal-wrap aal-hero-grid">
          <div>
            <p className="eyebrow">Aspen · Snowmass · Roaring Fork Valley</p>
            <h1 className="alp-speak-hero">
              Private car service for Aspen, <em>since 2012.</em>
            </h1>
            <p className="lede alp-speak-intro">
              Private Chevrolet Suburban and Ford Transit transfers from Aspen (ASE), Eagle (EGE) and Denver (DEN). Published rates, all-inclusive. No shared rides.
            </p>
            <p className="aal-callrow">
              Arriving tonight? Call <a href={PHONE_HREF}>{PHONE}</a>. We answer 24/7.
            </p>
          </div>

          <form className="aal-book" aria-label="Reserve a transfer" onSubmit={(event) => event.preventDefault()}>
            <h2>Reserve a transfer</h2>
            <p className="sub">Published one-way rate, before you book.</p>
            <p className="aal-lbl">Arriving at</p>
            <div className="aal-seg" role="group" aria-label="Arriving at">
              {AIRPORTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={airport === item.id}
                  onClick={() => setAirport(item.id)}
                >
                  {item.label}
                  <small>{item.code}</small>
                </button>
              ))}
            </div>
            <p className="aal-lbl">Vehicle</p>
            <div className="aal-seg aal-seg-2" role="group" aria-label="Vehicle">
              {VEHICLES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={vehicle === item.id}
                  onClick={() => setVehicle(item.id)}
                >
                  {item.label}
                  <small>{item.cap}</small>
                </button>
              ))}
            </div>
            <div className="aal-fields">
              <label className="aal-field">
                <b>Date</b>
                <input type="date" name="date" aria-label="Date" />
              </label>
              <label className="aal-field">
                <b>Flight</b>
                <input type="text" name="flight" placeholder="Optional" aria-label="Flight" autoComplete="off" />
              </label>
            </div>
            <div className="aal-fare">
              <span className="p" aria-live="polite">
                {fare}
              </span>
              <span className="t">
                One way to Aspen or Snowmass
                <br />
                No service charge or gratuity added
              </span>
            </div>
            <Link href="/reservations" className="aal-btn aal-btn-navy">
              Continue to booking
            </Link>
            <p className="aal-fine">
              Groups, hourly and custom trips: <Link href="#quote">request a quote</Link>.
            </p>
          </form>
        </div>
      </header>

      <section className="aal-trust" aria-label="Service facts">
        <div className="aal-wrap">
          <div className="aal-trust-item">
            <b>Since 2012</b>
            Aspen, Colorado
          </div>
          <div className="aal-trust-item">
            <b>24/7</b>
            Early departures, late arrivals
          </div>
          <div className="aal-trust-item">
            <b>Private only</b>
            No shared rides
          </div>
          <div className="aal-trust-item">
            <b>All-inclusive</b>
            No gratuity or service charge added
          </div>
          <div className="aal-trust-item">
            <b>{AAL_PUC_PERMIT}</b>
            Colorado PUC permit
          </div>
        </div>
      </section>

      <section className="aal-band" id="rates" aria-label="Airport transfers">
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow g">Airport transfers</p>
              <h2>Three gateways. One published price.</h2>
            </div>
            <p className="alp-speak-services-overview">
              We track your flight, meet you on arrival and take you to your hotel, residence or chalet. Rates are per vehicle, one way.
            </p>
          </div>
          <div className="aal-routes">
            {fares.routes.map((route) => (
              <article className="aal-route" key={route.id}>
                <div className="code">{route.code}</div>
                <div className="nm">{route.name}</div>
                {route.meta ? <div className="meta">{route.meta}</div> : null}
                <div className="pr">
                  <span>Suburban</span>
                  <span>{route.suv}</span>
                </div>
                <div className="pr">
                  <span>Ford Transit</span>
                  <span>{route.transit}</span>
                </div>
                <Link className="aal-go" href={route.href}>
                  {route.cta}
                </Link>
              </article>
            ))}
          </div>
          <p className="aal-note">
            {fares.alsoNote} <Link href="/pricing">Full pricing</Link>
          </p>
        </div>
      </section>

      <section className="aal-closure" id="ase-closure-2027" aria-label="Aspen Airport closure 2027">
        <div className="aal-wrap">
          <p className="tag">
            ASE closes
            <br />
            April 4 – Nov 19, 2027
          </p>
          <p>
            Aspen/Pitkin County Airport (ASE) closes Sunday, April 4, 2027 at 11:00 p.m. through Friday, November 19, 2027 at 7:00 p.m. for runway reconstruction.
          </p>
          <Link href="/aspen-airport-closure-2027" className="aal-btn aal-btn-line" style={{ color: 'var(--navy)' }}>
            Alternate airports &amp; rates
          </Link>
        </div>
      </section>

      <section className="aal-band aal-fleet" aria-label="The fleet">
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow g">The fleet</p>
              <h2>Two Suburbans and a Ford Transit, ready for the mountains.</h2>
            </div>
            <p>Every vehicle carries Starlink, ski racks and roof cargo space. Child seats are free.</p>
          </div>
          <div className="aal-vgrid">
            {suburban ? (
              <article className="aal-vehicle">
                <h3>{suburban.name}</h3>
                <p className="cap">{suburban.capacityLabel}</p>
                <ul className="aal-chips">
                  {suburban.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
                <div className="aal-vfoot">
                  <span>{fares.suburbanFrom}</span>
                  <Link className="aal-go" href="/reservations" style={{ marginTop: 0 }}>
                    Book the Suburban
                  </Link>
                </div>
              </article>
            ) : null}
            {transit ? (
              <article className="aal-vehicle">
                <h3>{transit.name}</h3>
                <p className="cap">{transit.capacityLabel}</p>
                <ul className="aal-chips">
                  {transit.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
                <div className="aal-vfoot">
                  <span>{fares.transitFrom}</span>
                  <Link className="aal-go" href="/reservations" style={{ marginTop: 0 }}>
                    Book the Transit
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="aal-band" aria-label="Included on every ride">
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow g">Included on every ride</p>
              <h2>What you can count on.</h2>
            </div>
          </div>
          <div className="aal-inc">
            {INCLUDED.map((item) => (
              <div key={item.title}>
                <b>{item.title}</b>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aal-band aal-rev" aria-label="Guest reviews">
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow" style={{ color: 'var(--glow2)' }}>
                From our guests
              </p>
              <h2>Google reviews</h2>
            </div>
          </div>
          <div className="aal-rgrid">
            {REVIEWS.map((review) => (
              <figure key={review.name}>
                <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
                <cite>
                  {review.name} · Google review
                </cite>
              </figure>
            ))}
          </div>
          <p className="gl">
            <a href={alpenglowData.googleReviewUrl} target="_blank" rel="noopener noreferrer">
              Read all reviews on Google
            </a>
          </p>
        </div>
      </section>

      <section className="aal-band" aria-label="Weddings and events">
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow g">Beyond the transfer</p>
              <h2>Weddings, weekends and Aspen&apos;s big nights.</h2>
            </div>
            <p>Private SUVs and the Ford Transit for guests, wedding parties and event weeks. No shared rides.</p>
          </div>
          <div className="aal-egrid">
            {EVENTS.map((event) => (
              <Link key={event.href} href={event.href} className="aal-ev">
                <p className="eyebrow">{event.eyebrow}</p>
                <h3>{event.title}</h3>
                <p>{event.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="aal-band aal-faq" id="faq" aria-label="Frequently asked questions about Aspen Alpenglow Limousine">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <div className="aal-wrap">
          <div className="aal-head">
            <div>
              <p className="eyebrow g">Common Questions</p>
              <h2>Frequently Asked Questions</h2>
            </div>
            <p>Everything you need to know before booking your luxury transfer.</p>
          </div>
          {visibleFaqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
          <p className="aal-note">
            <Link href="/faq">All questions</Link>
          </p>
        </div>
      </section>

      <section className="aal-band aal-quote" id="quote">
        <div className="aal-wrap aal-quote-grid">
          <div className="aal-quote-copy">
            <p className="eyebrow g">Groups &amp; custom trips</p>
            <h2>Request a quote</h2>
            <p className="aal-quote-lead">
              <Link href={alpenglowData.onlineReservationsPath}>Book online</Link> for standard trips, or request a quote below and we&apos;ll respond with availability and pricing.
            </p>
            <p className="aal-note">
              <a href={PHONE_HREF}>{PHONE}</a>
              <span> · </span>
              <span>{AAL_PUC_LINE}</span>
            </p>
          </div>
          <div className="aal-quote-card">
            <InquiryForm brand="alpenglow" />
          </div>
        </div>
      </section>

      <section className="aal-cta" aria-label="Book a transfer">
        <Image
          src="/images/about/pexels-outdoor.png"
          alt=""
          fill
          sizes="100vw"
          className="aal-cta-img"
        />
        <div className="aal-cta-shade" />
        <div className="aal-wrap">
          <p className="eyebrow">Reserve your journey</p>
          <h2>Your car, waiting when you land.</h2>
          <p>Book a standard transfer online, or request a quote for groups, hourly and custom trips.</p>
          <div className="aal-cta-btns">
            <Link href="/reservations" className="aal-btn aal-btn-glow">
              Book online
            </Link>
            <a href={PHONE_HREF} className="aal-btn aal-btn-line">
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      <footer className="aal-footer">
        <div className="aal-wrap">
          <div className="aal-footer-grid">
            <div>
              <Link href="/" className="aal-mark">
                <span className="n">Aspen Alpenglow</span>
                <span className="s">Limousine · Since 2012</span>
              </Link>
              <p className="blurb">
                Private car and limousine service throughout Aspen, Snowmass and the Roaring Fork Valley. Available 24/7.
              </p>
              <p className="phone">
                <a href={PHONE_HREF}>{PHONE}</a>
              </p>
              <p>CO PUC permit {AAL_PUC_PERMIT}</p>
            </div>
            <div>
              <h2>Services</h2>
              <ul>
                <li><Link href="/airport-transfers">Airport Transfers</Link></li>
                <li><Link href="/airport-transfers/eagle-ege-to-aspen">Eagle (EGE)</Link></li>
                <li><Link href="/airport-transfers/denver-den-to-aspen">Denver (DEN)</Link></li>
                <li><Link href="/weddings">Weddings</Link></li>
                <li><Link href="/corporate">Corporate</Link></li>
                <li><Link href="/ski-resort-transfers">Ski Resort Transfers</Link></li>
                <li><Link href="/events/x-games-aspen-transportation">X Games Aspen 2027</Link></li>
                <li><Link href="/seasonal/holiday-private-car-aspen">Holiday Private Car</Link></li>
                <li><Link href="/events/new-years-eve-aspen">New Year&apos;s Eve</Link></li>
                <li><Link href="/aspen-airport-closure-2027">ASE Closure 2027</Link></li>
                <li className="aal-footer-extra">
                  <Link href="/wine-tours">Wine Tours</Link>
                  {' · '}
                  <Link href="/night-out">Night Out</Link>
                  {' · '}
                  <Link href="/services/hourly-charter">Hourly charters</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>Plan</h2>
              <ul>
                <li><Link href="/fleet">Fleet</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/service-areas">Service Areas</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/blog">Blog &amp; Guides</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2>Service areas</h2>
              <ul>
                <li>
                  <Link href="/service-areas/aspen">Aspen</Link>
                  {' · '}
                  <Link href="/service-areas/snowmass-village">Snowmass Village</Link>
                </li>
                <li>
                  <Link href="/service-areas/basalt">Basalt</Link>
                  {' · '}
                  <Link href="/service-areas/carbondale">Carbondale</Link>
                </li>
                <li>
                  <Link href="/service-areas/glenwood-springs">Glenwood Springs</Link>
                  {' · '}
                  <Link href="/service-areas/rifle">Rifle</Link>
                  {' · '}
                  <Link href="/service-areas/grand-junction">Grand Junction</Link>
                </li>
                <li>
                  <Link href="/service-areas/eagle-vail">Eagle / Vail</Link>
                  {' · '}
                  <Link href="/service-areas/denver">Denver</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="aal-legal">
            <span>
              © {new Date().getFullYear()} Aspen Alpenglow Limousine · Sister company:{' '}
              <a href={alpenglowData.partnerSite.url}>{alpenglowData.partnerSite.name}</a>
            </span>
            <span>
              <a href={alpenglowData.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                Review us on Google
              </a>
              {' · '}
              <Link href="/terms">Terms</Link>
              {' · '}
              <Link href="/privacy">Privacy</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
