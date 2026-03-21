const adventures = [
  {
    icon: "🎿",
    title: "Guided Skiing & Snowboarding",
    description:
      "Expert guides lead you through Aspen's legendary terrain — from beginner slopes to expert backcountry lines on Ajax, Highlands, Buttermilk, and Snowmass.",
    tag: "Winter",
  },
  {
    icon: "🏔",
    title: "Mountain Hiking & Trekking",
    description:
      "Explore the Elk Mountains with seasoned local guides. Half-day, full-day, and multi-day treks tailored to all fitness levels.",
    tag: "Summer",
  },
  {
    icon: "🪂",
    title: "Paragliding & Aerial Tours",
    description:
      "Soar above the Roaring Fork Valley with certified tandem paragliding and aerial tours offering breathtaking panoramic views.",
    tag: "Summer",
  },
  {
    icon: "🎣",
    title: "Fly Fishing Excursions",
    description:
      "Wade the world-famous Roaring Fork and Fryingpan Rivers with professional guides. All skill levels welcome.",
    tag: "Summer / Fall",
  },
  {
    icon: "🚵",
    title: "Mountain Biking",
    description:
      "Guided rides on Aspen's legendary trail network. From flowy cross-country to technical enduro descents.",
    tag: "Summer",
  },
  {
    icon: "🏕",
    title: "Luxury Glamping & Camping",
    description:
      "Curated overnight wilderness experiences with premium gear, gourmet camp meals, and expert naturalist guides.",
    tag: "Year-Round",
  },
];

export default function ServicesSection() {
  return (
    <section id="adventures" className="bg-stone-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">Rich Valley Adventures</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-stone-900">
            Colorado&apos;s Premier Adventure Outfitter
          </h2>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto">
            From first tracks at sunrise to evening campfire stories under the stars — we craft unforgettable Colorado experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adv) => (
            <div
              key={adv.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className="text-4xl mb-4">{adv.icon}</div>
              <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3">
                {adv.tag}
              </span>
              <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-amber-600 transition-colors">
                {adv.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">{adv.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-md"
          >
            Book an Adventure
          </a>
        </div>
      </div>
    </section>
  );
}
