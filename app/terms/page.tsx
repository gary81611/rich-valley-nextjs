import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Rich Valley Adventures & Aspen Alpenglow Limousine',
  description: 'Terms and conditions for Rich Valley Adventures guided outdoor experiences and Aspen Alpenglow Limousine transportation services in Aspen, Colorado.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-playfair text-4xl font-bold text-slate-900 mb-2">Terms and Conditions</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">1. Overview</h2>
            <p className="text-slate-700 leading-relaxed">These Terms and Conditions govern your use of services provided by Rich Valley Adventures (guided outdoor experiences) and Aspen Alpenglow Limousine (luxury transportation), both operating in Aspen, Colorado. By booking or using our services, you agree to these terms.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">2. Booking and Reservations</h2>
            <p className="text-slate-700 leading-relaxed">All bookings are subject to availability. A reservation is confirmed once you receive written confirmation via email or text. Rich Valley Adventures requires at least 2 days&apos; advance notice, with a 50% deposit at booking. Aspen Alpenglow Limousine general cancellations need 24 hours&apos; notice.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">3. Cancellation Policy</h2>
            <p className="text-slate-700 leading-relaxed">Rich Valley Adventures: cancellations within 72 hours are billed in full. Aspen Alpenglow Limousine: general cancellations need 24 hours&apos; notice. Flight diversions to Denver or Grand Junction are handled with 2 hours&apos; notice and no Aspen cancellation penalty.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">4. Adventure Services — Rich Valley Adventures</h2>
            <p className="text-slate-700 leading-relaxed">Participants must follow all safety instructions provided by guides. A full-day float trip is from $1,400 for 2 people (1 boat, 1 captain). Additional adults are $375 each and kids are $175. It covers an 8–12 mile stretch of the Roaring Fork or Colorado River. Lunch, gear, and luxury door-to-door transportation are included. A Colorado Parks and Wildlife fishing license is required for ages 16 and up. The private ranch and picnic package at Spring Creek Ranch, Carbondale, CO is from $800 per adult and $250 per child (ages 3+). Paddleboarding is a rental from $100, not a guided trip. Corporate packages are for groups of 50 or more: a custom mix of fishing and hiking. Participants acknowledge the inherent risks associated with outdoor activities. Participants under 18 must have a parent or guardian present or provide signed consent.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">5. Transportation Services — Aspen Alpenglow Limousine</h2>
            <p className="text-slate-700 leading-relaxed">Transportation includes a professional chauffeur, the vehicle, and standard amenities. Flight tracking is provided for airport transfers; complimentary wait time of up to 30 minutes is included for airport pickups. 8 full-time local drivers have been driving these mountain roads since 2012. Vehicles have Starlink, ski racks, and roof cargo space. Child car seats and boosters are free. Pets are welcome, with a cleaning fee. Private FBO airport service includes Eagle, Rifle, Grand Junction, Buena Vista, Montrose, and Gunnison. One-way rates each way: Denver $1,375, Grand Junction $950, Rifle $720. Eagle one-way is quoted on request. Holiday pricing may change seasonally. Corporate charge accounts are billed monthly. Additional stops, extended hours, or route changes are subject to additional charges. Passengers must comply with all Colorado motor vehicle laws.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">6. Liability</h2>
            <p className="text-slate-700 leading-relaxed">Both Rich Valley Adventures and Aspen Alpenglow Limousine carry comprehensive commercial insurance. Liability is limited to the cost of the service provided. We are not responsible for personal property left in vehicles or at activity locations. Force majeure events (severe weather, road closures, natural disasters) may result in service modifications or cancellations without liability.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">7. Payment</h2>
            <p className="text-slate-700 leading-relaxed">Rich Valley Adventures collects a 50% deposit at booking. Aspen Alpenglow Limousine corporate charge accounts are billed monthly. We accept all major credit cards and cash. Gratuities are not included and are at the client&apos;s discretion. Holiday pricing may change seasonally; confirmed reservations will be honored at the quoted rate.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">8. Modifications</h2>
            <p className="text-slate-700 leading-relaxed">We reserve the right to modify these terms at any time. Continued use of our services after modifications constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">9. Contact</h2>
            <p className="text-slate-700 leading-relaxed">For questions about these terms, contact us at 970-456-3666 or visit us in Aspen, Colorado.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <a href="/" className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}
