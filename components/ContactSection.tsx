export default function ContactSection() {
  return (
    <section id="contact" className="bg-stone-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-stone-900">
            Plan Your Colorado Experience
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            Ready for an adventure or need a ride? Our concierge team is available 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Rich Valley contact */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <div className="text-3xl mb-3">🏔</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Rich Valley Adventures</h3>
            <p className="text-stone-600 text-sm mb-4">Book your outdoor experience</p>
            <div className="space-y-2 text-stone-700">
              <p>📞 <a href="tel:+19705550100" className="hover:text-amber-600">(970) 555-0100</a></p>
              <p>📧 <a href="mailto:adventures@richvalley.com" className="hover:text-amber-600">adventures@richvalley.com</a></p>
              <p>📍 Basalt, CO 81621</p>
            </div>
          </div>

          {/* Alpenglow contact */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-8">
            <div className="text-3xl mb-3">🚐</div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">Aspen Alpenglow Limousine</h3>
            <p className="text-stone-600 text-sm mb-4">Reserve your vehicle</p>
            <div className="space-y-2 text-stone-700">
              <p>📞 <a href="tel:+19705550200" className="hover:text-sky-600">(970) 555-0200</a></p>
              <p>📧 <a href="mailto:rides@alpenglowlimo.com" className="hover:text-sky-600">rides@alpenglowlimo.com</a></p>
              <p>📍 Aspen, CO 81611</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
          <h3 className="text-2xl font-bold text-stone-900 mb-8">Send Us a Message</h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
              <input
                type="text"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
              <input
                type="text"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="(555) 000-0000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">I&apos;m interested in</label>
              <select className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400">
                <option value="">Select a service...</option>
                <option>Rich Valley Adventures — Skiing / Snowboarding</option>
                <option>Rich Valley Adventures — Hiking / Trekking</option>
                <option>Rich Valley Adventures — Fly Fishing</option>
                <option>Rich Valley Adventures — Mountain Biking</option>
                <option>Rich Valley Adventures — Glamping</option>
                <option>Aspen Alpenglow — Airport Transfer</option>
                <option>Aspen Alpenglow — Ski Resort Shuttle</option>
                <option>Aspen Alpenglow — Corporate / Event</option>
                <option>Both Adventure + Transportation Package</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                placeholder="Tell us about your trip, dates, group size, and any special requests..."
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold py-4 rounded-xl text-lg transition-colors"
              >
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
