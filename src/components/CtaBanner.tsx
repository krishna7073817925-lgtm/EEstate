import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  onContactClick: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onContactClick }) => {
  return (
    <section id="contact-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-[#0B3B2C] text-white p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="relative z-10 max-w-xl text-center md:text-left space-y-2">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
              Get in touch with our team today and take the first step towards your new home.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="relative z-10 shrink-0">
            <button
              id="cta-contact-us-btn"
              onClick={onContactClick}
              className="px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-white text-[#0B3B2C] hover:bg-stone-100 transition-all shadow-lg flex items-center gap-2 group hover:scale-105 active:scale-95"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
