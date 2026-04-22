'use client'

import Link from 'next/link'
import InquiryForm from '@/components/shared/InquiryForm'

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-alp-pearl font-inter">
      {/* Breadcrumb */}
      <div className="bg-alp-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-alp-pearl/70">
            <Link href="/" className="hover:text-alp-gold transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-alp-gold">Contact</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-alp-navy-deep text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Book Your <span className="text-alp-gold">Ride</span>
          </h1>
          <p className="text-lg sm:text-xl text-alp-pearl/80 max-w-3xl mx-auto">
            Ready to experience luxury transportation? Fill out the form below or call us directly.
            We are available 24 hours a day, 7 days a week.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Guided Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 border border-alp-pearl-dark">
                <h2 className="font-playfair text-2xl font-bold text-alp-navy mb-8">
                  Request a Booking
                </h2>
                <InquiryForm brand="alpenglow" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-alp-navy-deep rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-bold mb-6">Contact Information</h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-alp-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-alp-pearl/60 mb-1">Phone</p>
                      <a href="tel:+19704563666" className="text-alp-gold font-semibold hover:underline text-lg">
                        970-456-3666
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-alp-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-alp-pearl/60 mb-1">Availability</p>
                      <p className="text-white font-semibold">24/7 — 365 Days a Year</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-alp-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-alp-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-alp-pearl/60 mb-1">Location</p>
                      <p className="text-white font-semibold">Aspen, Colorado</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-8 border border-alp-pearl-dark">
                <h3 className="font-playfair text-lg font-bold text-alp-navy mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/services" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Our Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/weddings" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Wedding Transportation
                    </Link>
                  </li>
                  <li>
                    <Link href="/corporate" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Corporate Transportation
                    </Link>
                  </li>
                  <li>
                    <Link href="/fleet" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Our Fleet
                    </Link>
                  </li>
                  <li>
                    <Link href="/service-areas" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Service Areas
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations" className="flex items-center gap-2 text-alp-slate hover:text-alp-gold transition-colors text-sm py-1">
                      <svg className="w-3 h-3 text-alp-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Destinations
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
