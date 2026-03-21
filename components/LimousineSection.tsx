const vehicles = [
  {
    icon: "🚐",
    name: "Executive SUV",
    capacity: "1–6 passengers",
    features: ["Leather seating", "WiFi", "Complimentary beverages", "Phone charging"],
  },
  {
    icon: "🚌",
    name: "Luxury Sprinter Van",
    capacity: "7–14 passengers",
    features: ["Premium interior", "Climate control", "Entertainment system", "Luggage space"],
  },
  {
    icon: "🚗",
    name: "Stretch Limousine",
    capacity: "Up to 10 passengers",
    features: ["Bar service", "LED lighting", "Privacy partition", "Premium sound"],
  },
];

const services = [
  { icon: "✈️", label: "Airport Transfers", sub: "Aspen, Eagle/Vail, Denver" },
  { icon: "⛷️", label: "Ski Resort Shuttles", sub: "All Aspen-area mountains" },
  { icon: "🥂", label: "Corporate & Events", sub: "Meetings, galas, weddings" },
  { icon: "🌄", label: "Scenic Valley Tours", sub: "Roaring Fork Valley" },
  { icon: "🏔", label: "Backcountry Access", sub: "Remote trailhead drop-offs" },
  { icon: "🎭", label: "Concert & Venue Runs", sub: "Belly Up, Wheeler Opera House" },
];

export default function LimousineSection() {
  return (
    <section id="limousine" className="bg-stone-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-widest">
            Aspen Alpenglow Limousine
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-white">
            Luxury Transportation, <span className="text-sky-300">Reimagined</span>
          </h2>
          <p className="mt-4 text-lg text-stone-300 max-w-2xl mx-auto">
            Arrive to every destination in comfort and style. Our fleet of premium vehicles
            and professional chauffeurs serve Aspen, the Roaring Fork Valley, and beyond.
          </p>
        </div>

        {/* Vehicle Fleet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="bg-stone-800 border border-stone-700 rounded-2xl p-8 hover:border-sky-500/50 transition-all hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                {v.name}
              </h3>
              <p className="text-sky-400 text-sm font-medium mb-4">{v.capacity}</p>
              <ul className="space-y-2">
                {v.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-stone-400 text-sm">
                    <span className="text-sky-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="bg-stone-800/50 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">We Go Where You Need</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.label} className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-white font-semibold">{s.label}</p>
                  <p className="text-stone-400 text-sm">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block border-2 border-sky-400 text-sky-300 hover:bg-sky-400 hover:text-stone-900 font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105"
          >
            Reserve a Vehicle
          </a>
        </div>
      </div>
    </section>
  );
}
