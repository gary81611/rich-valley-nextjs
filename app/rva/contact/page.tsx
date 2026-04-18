import type { Metadata } from 'next'
import Link from 'next/link'
import { PHONE, PHONE_HREF, LOCATION } from '@/lib/site-data'
import InquiryForm from '@/components/shared/InquiryForm'
import { RVA_GLOBAL_PILLAR_BLOG_LINKS } from '@/lib/rva-blog-pillars'

export const metadata: Metadata = {
  title: 'Contact Rich Valley Adventures | Book Your Aspen Adventure',
  description:
    'Contact Rich Valley Adventures to book guided fly fishing, paddle boarding, mountain biking, hiking, and more in Aspen, Colorado. Call 970-456-3666 or fill out our booking form.',
  alternates: {
    canonical: 'https://www.richvalleyadventures.com/contact',
  },
  openGraph: {
    title: 'Contact Rich Valley Adventures | Book Your Aspen Adventure',
    description:
      'Get in touch to plan your guided outdoor adventure in the Roaring Fork Valley. Call 970-456-3666 or use our online form.',
    type: 'website',
    url: 'https://www.richvalleyadventures.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-rva-cream font-inter">
      {/* Breadcrumb */}
      <div className="bg-rva-forest-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/60 hover:text-rva-copper-light transition-colors">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-rva-copper-light">Contact</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <section className="py-20 bg-rva-forest-dark text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-cormorant text-rva-copper-light text-lg tracking-widest uppercase mb-4">
            Get in Touch
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-white/75 text-xl max-w-2xl mx-auto">
            Tell us what you have in mind and we&apos;ll get back to you quickly with availability
            and pricing.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-rva-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                <h2 className="font-playfair text-2xl text-rva-forest font-bold mb-6">
                  Send Us a Message
                </h2>
                <InquiryForm brand="rva" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Phone */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-4">
                  Call Us
                </h3>
                <a
                  href={PHONE_HREF}
                  className="text-rva-copper text-2xl font-bold hover:text-rva-copper-light transition-colors"
                >
                  {PHONE}
                </a>
                <p className="text-gray-500 text-sm mt-2">Available 7 days a week, 7am - 8pm MT</p>
              </div>

              {/* Planning guides */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-4">
                  Planning guides
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Fly fishing, hiking, and family summer ideas in Aspen &amp; the Roaring Fork Valley.
                </p>
                <ul className="space-y-2 text-sm">
                  {RVA_GLOBAL_PILLAR_BLOG_LINKS.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-rva-copper font-medium hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-500 text-xs mt-4">
                  <Link href="/adventures" className="text-rva-copper hover:underline font-medium">
                    Browse adventures
                  </Link>
                  {' · '}
                  <Link href="/service-areas" className="text-rva-copper hover:underline font-medium">
                    Service areas
                  </Link>
                </p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-playfair text-xl text-rva-forest font-semibold mb-4">
                  Location
                </h3>
                <p className="text-gray-700 text-lg">{LOCATION}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Serving Aspen, Snowmass Village, Basalt, Carbondale, and the entire Roaring Fork
                  Valley.
                </p>
              </div>

              {/* Quick Info */}
              <div className="bg-rva-forest rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-semibold mb-4">Good to Know</h3>
                <ul className="space-y-3 text-white/80 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-rva-copper rounded-full mt-2 flex-shrink-0" />
                    All gear and equipment included with every adventure
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-rva-copper rounded-full mt-2 flex-shrink-0" />
                    Small groups of 2-6 guests per guide
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-rva-copper rounded-full mt-2 flex-shrink-0" />
                    No experience necessary for most adventures
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-rva-copper rounded-full mt-2 flex-shrink-0" />
                    Private and group bookings available
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-rva-copper rounded-full mt-2 flex-shrink-0" />
                    We typically respond within 2-4 hours
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
