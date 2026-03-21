"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-900/95 backdrop-blur-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-lg leading-tight">
              Rich Valley <span className="text-white font-light">+</span>
            </span>
            <span className="text-sky-300 font-semibold text-sm leading-tight">
              Aspen Alpenglow
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#adventures" className="hover:text-amber-400 transition-colors">Adventures</a>
            <a href="#limousine" className="hover:text-sky-300 transition-colors">Limousine</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">About</a>
            <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-4 py-2 rounded-full font-semibold transition-colors">
              Book Now
            </a>
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-stone-800 px-4 pb-4 flex flex-col gap-4 text-sm font-medium">
          <a href="#adventures" className="hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>Adventures</a>
          <a href="#limousine" className="hover:text-sky-300 transition-colors" onClick={() => setMenuOpen(false)}>Limousine</a>
          <a href="#about" className="hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#contact" className="bg-amber-500 text-stone-900 px-4 py-2 rounded-full font-semibold text-center" onClick={() => setMenuOpen(false)}>Book Now</a>
        </div>
      )}
    </nav>
  );
}
