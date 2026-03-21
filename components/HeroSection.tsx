export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Gradient background simulating mountain/alpine scenery */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-800 to-sky-950" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-stone-900/80 to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <span>🏔</span>
          <span>Roaring Fork Valley, Colorado</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Adventure Awaits.{" "}
          <span className="text-amber-400">Arrive in Style.</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Two iconic Colorado brands under one roof — world-class outdoor adventures
          with{" "}
          <span className="text-amber-400 font-semibold">Rich Valley Adventures</span>{" "}
          and luxury transportation with{" "}
          <span className="text-sky-300 font-semibold">Aspen Alpenglow Limousine</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#adventures"
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Explore Adventures
          </a>
          <a
            href="#limousine"
            className="border-2 border-sky-400 text-sky-300 hover:bg-sky-400 hover:text-stone-900 font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105"
          >
            Book a Ride
          </a>
        </div>
      </div>

      {/* Decorative mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 200L240 80L480 160L720 20L960 120L1200 60L1440 140V200H0Z"
            fill="rgba(28,25,23,0.9)"
          />
          <path
            d="M0 200L180 120L360 180L540 60L720 140L900 40L1080 100L1260 50L1440 160V200H0Z"
            fill="rgb(28,25,23)"
          />
        </svg>
      </div>
    </section>
  );
}
