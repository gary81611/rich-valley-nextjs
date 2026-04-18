import Image from 'next/image'
import { alpenglowData } from '@/lib/site-data'

export default function ALPFooter() {
  const phone = alpenglowData.phone
  const phoneHref = alpenglowData.phoneHref

  return (
    <footer className="bg-alp-navy-deep text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Image src={alpenglowData.logo} alt="Aspen Alpenglow Limousine" width={160} height={50} className="h-14 w-auto object-contain mb-4" unoptimized />
            <p className="text-white/65 text-sm leading-relaxed">{alpenglowData.description}</p>
          </div>
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Services</h4>
            <ul className="space-y-2">
              <li><a href="/airport-transfers" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Airport Transfers</a></li>
              <li><a href="/corporate-events" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Corporate Events</a></li>
              <li><a href="/wedding-transportation" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Wedding Transportation</a></li>
              <li><a href="/services/ski-resort-transfers" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Ski Resort Transfers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href={alpenglowData.onlineReservationsPath} className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Book Transportation</a></li>
              <li><a href="/destinations" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Colorado Destinations</a></li>
              <li><a href="/blog" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Blog &amp; Guides</a></li>
              <li><a href="/fleet" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Our Fleet</a></li>
              <li><a href="/service-areas" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Service Areas</a></li>
              <li><a href="/about" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">About</a></li>
              <li><a href="/gallery" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Gallery</a></li>
              <li><a href="/terms" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-white/65 hover:text-alp-gold-light text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-5 text-alp-gold">Contact</h4>
            <div className="space-y-3 text-white/65 text-sm">
              <p>{alpenglowData.location}</p>
              <a href={phoneHref} className="block hover:text-alp-gold-light transition-colors">{phone}</a>
              <a
                href={alpenglowData.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-alp-gold-light transition-colors"
              >
                Review us on Google
              </a>
              <p className="text-white/40 text-xs">Available 24/7</p>
              <div className="pt-3 border-t border-white/10">
                <p className="text-white/40 text-xs mb-2">Sister Company</p>
                <a href={alpenglowData.partnerSite.url} target="_blank" rel="noopener noreferrer" className="text-alp-gold hover:text-alp-gold-light transition-colors">
                  {alpenglowData.partnerSite.name} →
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Aspen Alpenglow Limousine. All rights reserved. | {alpenglowData.location}
            {' '}|{' '}
            <a
              href="https://www.adaptedsolutionsco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-alp-gold-light transition-colors underline-offset-2 hover:underline"
            >
              powered by Adapted Solutions
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href={alpenglowData.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-alp-gold-light transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={alpenglowData.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-alp-gold-light transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
