export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="mb-3">
              <span className="text-amber-400 font-bold text-lg">Rich Valley Adventures</span>
            </div>
            <p className="text-sm leading-relaxed">
              Colorado&apos;s premier outdoor adventure outfitter serving the Roaring Fork Valley since 2009.
            </p>
          </div>
          <div>
            <div className="mb-3">
              <span className="text-sky-300 font-bold text-lg">Aspen Alpenglow Limousine</span>
            </div>
            <p className="text-sm leading-relaxed">
              Luxury ground transportation throughout the Aspen/Snowmass area and all major Colorado airports.
            </p>
          </div>
          <div>
            <div className="mb-3 text-white font-semibold">Quick Links</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#adventures" className="hover:text-amber-400 transition-colors">Adventures</a></li>
              <li><a href="#limousine" className="hover:text-sky-300 transition-colors">Limousine Services</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact & Book</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Rich Valley Adventures & Aspen Alpenglow Limousine. All rights reserved.</p>
          <p>Basalt & Aspen, Colorado · (970) 555-0100</p>
        </div>
      </div>
    </footer>
  );
}
