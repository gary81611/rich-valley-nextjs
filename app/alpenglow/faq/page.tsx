import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ | Aspen Alpenglow Limousine — Transportation Questions Answered',
  description: 'Frequently asked questions about Aspen transportation, airport transfers, car service pricing, and getting to Aspen from Denver, Eagle, and Grand Junction airports.',
  alternates: { canonical: 'https://aspenalpenglowlimousine.com/alpenglow/faq' },
}

const FAQS = [
  {
    q: 'How long is the drive from Denver airport to Aspen?',
    a: 'About 4 hours and 220 miles. The route takes I-70 West through the Eisenhower Tunnel, past Vail and Glenwood Springs, then south on Highway 82 through the Roaring Fork Valley. In winter, Independence Pass is closed so you\'ll go through Glenwood Canyon. Aspen Alpenglow Limousine provides comfortable SUV or Sprinter transport with WiFi and Starlink so you can work or relax during the drive. Denver to Aspen transfer: $1,475.',
  },
  {
    q: 'What is the closest airport to Aspen?',
    a: 'ASE (Aspen/Pitkin County Airport) is just 4 miles from downtown Aspen — about a 10-minute drive. EGE (Eagle County Regional) is approximately 70 miles away (1.5 hours). DIA (Denver International) is about 220 miles away (4 hours). ASE has aircraft size restrictions, so EGE is often a good alternative, especially in winter when it has fewer weather delays.',
  },
  {
    q: 'How much does a private car from Aspen airport cost?',
    a: 'Aspen Alpenglow Limousine charges $210 for an SUV transfer from ASE Airport to Aspen or Snowmass. All pricing is all-inclusive — no hidden service charges or gratuity added on top. Contact us for Sprinter van pricing for larger groups.',
  },
  {
    q: 'Is it safe to drive to Aspen in winter?',
    a: 'Yes, with the right vehicle and experience. AWD/4WD with snow tires is strongly recommended. Aspen Alpenglow Limousine operates AWD vehicles with snow tires and experienced mountain drivers who know the passes and canyon roads in all conditions.',
  },
  {
    q: 'Do I need a 4x4 to get to Aspen?',
    a: 'In winter, AWD/4WD with snow tires is strongly recommended, especially through Glenwood Canyon. Independence Pass (Highway 82) is closed from late fall through late spring. Our entire fleet is AWD-equipped with snow tires.',
  },
  {
    q: 'Can I get a car service at 3am for early flights?',
    a: 'Yes. Aspen Alpenglow Limousine offers early morning pickups for all flight departures. Book in advance to guarantee your pickup time.',
  },
  {
    q: 'What is the difference between ASE and EGE airports?',
    a: 'ASE (Aspen/Pitkin County) is 4 miles from downtown Aspen — the shortest transfer at just 10 minutes. EGE (Eagle County Regional) is about 70 miles away (1.5-hour drive) but often has cheaper flights and fewer weather delays. ASE has size restrictions on aircraft. EGE is a good alternative especially in winter. Our SUV transfer from EGE to Aspen is $720.',
  },
  {
    q: 'Do you provide car seats for children?',
    a: 'Yes. We provide car seats upon request at no additional charge. Please mention when booking so we can have the appropriate seat ready for your arrival.',
  },
  {
    q: 'How far is Rifle airport from Aspen?',
    a: 'Rifle (RIL/Atlantic Aviation) is approximately 65 miles from Aspen, about a 1.25-hour drive. It\'s a smaller regional airport used primarily for private aviation. Our SUV transfer from Rifle to Aspen is $720.',
  },
  {
    q: 'Is Grand Junction airport a good alternative to fly into for Aspen?',
    a: 'GJT (Grand Junction Regional Airport) is about 130 miles from Aspen, approximately a 2.5-hour drive. It can be a good alternative when ASE and EGE flights are expensive or fully booked. The airport has a larger runway that accommodates more aircraft types. Our SUV transfer from GJT to Aspen is $850.',
  },
  {
    q: 'What\'s the best way to get from Denver to Aspen?',
    a: 'Three main options: fly directly to ASE (quickest — about 1 hour), fly to EGE then drive 1.5 hours, or drive/be driven from DIA (about 4 hours). Aspen Alpenglow Limousine offers comfortable DIA-to-Aspen transfers at $1,475 with WiFi, Starlink, and water in a luxury SUV.',
  },
  {
    q: 'Do you offer ski mountain shuttles?',
    a: 'Yes. We provide shuttle service to all four Aspen ski mountains: Aspen Mountain, Snowmass, Buttermilk, and Highlands. Each trip is $150 per ride in our luxury SUV.',
  },
  {
    q: 'Can you provide transportation for weddings and events?',
    a: 'Absolutely. We serve all major Aspen and Snowmass venues including T Lazy 7 Ranch, The Little Nell, Hotel Jerome, St. Regis, and many more. We offer both SUV and 14-passenger Sprinter van options. Events have a 7-day cancellation policy.',
  },
  {
    q: 'Is there an hourly charter option?',
    a: 'Yes. Our SUV hourly charter rate is $150/hour and our Sprinter/Limo Coach is $240/hour. There is a 4-hour minimum for chartered services.',
  },
  {
    q: 'What vehicles do you have?',
    a: 'Our fleet includes a 2025 Ford Transit Van (14 passengers), and two Chevrolet Suburbans (2025 and 2026, 7 passengers each). All vehicles are equipped with WiFi, Starlink, XM satellite radio, complimentary water, and ski/luggage racks.',
  },
  {
    q: 'What can I do while visiting Aspen?',
    a: 'Our sister company Rich Valley Adventures offers world-class guided fly fishing, hiking, hunting, snowshoeing, mountain biking, and Chauffeur Guided Tours and Excursions throughout the Roaring Fork Valley. Visit richvalleyadventures.com to explore activities. All adventure transportation is provided by Aspen Alpenglow Limousine.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="bg-alp-navy pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-alp-gold text-sm font-semibold uppercase tracking-[0.2em] mb-3">Questions &amp; Answers</p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white font-light mb-4">Frequently Asked Questions</h1>
          <p className="text-white/60">Everything you need to know about Aspen transportation</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group mb-4 border border-alp-pearl rounded-lg">
            <summary className="flex items-center justify-between p-5 cursor-pointer text-alp-navy font-medium hover:bg-alp-pearl/50 transition-colors rounded-lg">
              <span className="pr-4">{faq.q}</span>
              <svg className="w-5 h-5 text-alp-gold flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="px-5 pb-5 text-sm text-alp-navy/70 leading-relaxed">{faq.a}</p>
          </details>
        ))}

        <div className="mt-12 text-center bg-alp-pearl rounded-xl p-8">
          <h2 className="font-playfair text-xl text-alp-navy mb-3">Still have questions?</h2>
          <p className="text-sm text-alp-navy/60 mb-5">Call or text us anytime.</p>
          <a href="tel:+19704563666" className="inline-block bg-alp-gold hover:bg-alp-gold-light text-alp-navy-deep px-8 py-3 rounded-full font-semibold transition-colors">
            970-456-3666
          </a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      })}} />
    </div>
  )
}
