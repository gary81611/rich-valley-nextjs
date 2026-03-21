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
            <p className="text-slate-700 leading-relaxed">All bookings are subject to availability. A reservation is confirmed once you receive written confirmation via email or text. We recommend booking 48–72 hours in advance for standard services. Peak seasons (December–March for ski season, July–August for summer) may require 2–4 weeks advance notice.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">3. Cancellation Policy</h2>
            <p className="text-slate-700 leading-relaxed">Cancellations made 24 hours or more before the scheduled service will receive a full refund. Cancellations within 24 hours are subject to a cancellation fee of up to 50% of the service cost. No-shows will be charged the full service amount. Weather-related cancellations for outdoor adventures will be rescheduled or refunded at no charge.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">4. Adventure Services — Rich Valley Adventures</h2>
            <p className="text-slate-700 leading-relaxed">Participants must follow all safety instructions provided by guides. All necessary equipment is provided and must be returned in good condition. Participants acknowledge the inherent risks associated with outdoor activities including but not limited to fly fishing, mountain biking, paddle boarding, hiking, horseback riding, and camping. Participants under 18 must have a parent or guardian present or provide signed consent.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">5. Transportation Services — Aspen Alpenglow Limousine</h2>
            <p className="text-slate-700 leading-relaxed">Transportation services include professional chauffeur, vehicle, and standard amenities. Flight tracking is provided for airport transfers; complimentary wait time of up to 30 minutes is included for airport pickups. Additional stops, extended hours, or route changes are subject to additional charges. Passengers must comply with all Colorado motor vehicle laws.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">6. Liability</h2>
            <p className="text-slate-700 leading-relaxed">Both Rich Valley Adventures and Aspen Alpenglow Limousine carry comprehensive commercial insurance. Liability is limited to the cost of the service provided. We are not responsible for personal property left in vehicles or at activity locations. Force majeure events (severe weather, road closures, natural disasters) may result in service modifications or cancellations without liability.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">7. Payment</h2>
            <p className="text-slate-700 leading-relaxed">We accept all major credit cards, cash, and approved corporate billing. Gratuities are not included and are at the client&apos;s discretion. Pricing is subject to change without notice; however, confirmed reservations will be honored at the quoted rate.</p>
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
