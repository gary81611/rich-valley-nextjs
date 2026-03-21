import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rich Valley Adventures & Aspen Alpenglow Limousine',
  description: 'Privacy policy for Rich Valley Adventures and Aspen Alpenglow Limousine. How we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-playfair text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: March 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="text-slate-700 leading-relaxed">We collect information you provide when booking services, subscribing to our newsletter, or contacting us. This may include your name, email address, phone number, travel dates, and service preferences. We do not collect sensitive personal information such as Social Security numbers or financial account details through our website.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed">We use your information to process reservations, provide requested services, send booking confirmations, communicate about your upcoming trips or transportation, and send promotional offers if you have opted in to our newsletter. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">3. Cookies and Analytics</h2>
            <p className="text-slate-700 leading-relaxed">Our website may use cookies and similar technologies to improve your browsing experience, analyze site traffic, and understand usage patterns. You can disable cookies through your browser settings, though some site features may not function properly without them.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">4. Data Security</h2>
            <p className="text-slate-700 leading-relaxed">We implement industry-standard security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure server infrastructure, and access controls. However, no method of electronic transmission or storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">5. Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed">We use third-party services for hosting, analytics, and payment processing. These services have their own privacy policies governing how they handle your data. We only work with reputable providers who maintain appropriate data protection standards.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">6. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed">You have the right to access, correct, or delete your personal information at any time. To unsubscribe from our newsletter, click the unsubscribe link in any email or contact us directly. To request deletion of your data, email or call us at 970-456-3666.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">7. Children&apos;s Privacy</h2>
            <p className="text-slate-700 leading-relaxed">Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">8. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-semibold text-slate-900 mb-3">9. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">For questions about this privacy policy or your personal data, contact us at 970-456-3666 or visit us in Aspen, Colorado.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <a href="/" className="text-slate-600 hover:text-slate-900 text-sm font-medium">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}
