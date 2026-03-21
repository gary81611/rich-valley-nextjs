const stats = [
  { value: "15+", label: "Years in the Valley" },
  { value: "5,000+", label: "Happy Adventurers" },
  { value: "24/7", label: "Concierge Support" },
  { value: "100%", label: "Locally Owned" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
              Born in the Mountains,<br />
              <span className="text-amber-500">Built on Experience</span>
            </h2>
            <p className="mt-6 text-lg text-stone-600 leading-relaxed">
              Rich Valley Adventures was founded by a group of passionate Colorado
              guides and outdoor enthusiasts who wanted to share the raw beauty of
              the Roaring Fork Valley with the world. Over the years, we grew into
              the valley&apos;s most trusted adventure outfitter.
            </p>
            <p className="mt-4 text-lg text-stone-600 leading-relaxed">
              Aspen Alpenglow Limousine was born from a simple idea: guests
              deserving world-class adventures should also arrive to them in style.
              Today, our two brands work in perfect harmony — we&apos;ll pick you up
              from the airport, whisk you to your basecamp, and guide you through
              an experience you&apos;ll never forget.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Leave No Trace Certified</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">WFR / First Aid Guides</span>
              </div>
              <div className="flex items-center gap-2 text-stone-700">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">DOT Certified Chauffeurs</span>
              </div>
            </div>
          </div>

          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-stone-50 rounded-2xl p-8 text-center border border-stone-100"
                >
                  <div className="text-4xl font-bold text-amber-500">{stat.value}</div>
                  <div className="mt-2 text-stone-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-6 bg-stone-900 rounded-2xl p-8 text-white">
              <div className="text-amber-400 text-2xl mb-3">★★★★★</div>
              <p className="text-stone-300 italic leading-relaxed">
                &ldquo;The perfect Aspen experience. Rich Valley took us on an incredible
                backcountry ski tour, and Alpenglow had a warm SUV waiting to take us
                back to the hotel. Seamless, luxurious, unforgettable.&rdquo;
              </p>
              <p className="mt-4 text-sm text-stone-400 font-medium">
                — Sarah M., Chicago · February 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
