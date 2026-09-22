import React from 'react';
import { Phone, Mail, MapPin, Sparkles, Code } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setFilters } = useProperty();

  return (
    <footer className="bg-[#07241B] text-white pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0B3B2C] flex items-center justify-center font-bold">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white block leading-none">
                  EEstates
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mt-0.5">
                  Agency
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed">
              Your Trusted Real Estate Partner. Delivering premium residences, modern apartments, and prime plots with personalized attention.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Developed by Krishna</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              {['Home', 'Properties', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      if (item === 'Home') setActiveTab('home');
                      else if (item === 'Properties') setActiveTab('properties');
                      else {
                        const el = document.getElementById(`${item.toLowerCase()}-section`);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-200">
              Property Types
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              {[
                { name: 'Houses & Villas', cat: 'House' },
                { name: 'Luxury Apartments', cat: 'Apartment' },
                { name: 'Building Plots / Land', cat: 'Plot' },
                { name: 'All Featured', cat: 'All' },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveTab('properties');
                      setFilters(prev => ({ ...prev, category: item.cat as any }));
                      document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-4 space-y-3" id="footer-contact">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-200">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+917073817925" className="hover:text-white transition-colors">
                  +91 70738 17925
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:krishnaagr047@gmail.com" className="hover:text-white transition-colors">
                  krishnaagr047@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  568 narayan circle, bharatpur, Rajasthan, 321001
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-300 block mb-2">
                Follow Us
              </span>
              <div className="flex items-center gap-3 text-stone-300">
                {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                  <span
                    key={social}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold hover:bg-white/20 cursor-pointer transition-colors"
                    title={social}
                  >
                    {social[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p>© 2026 EEstates Agency. All rights reserved.</p>
            <span className="text-stone-600">•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              Developed by Krishna
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms & Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
