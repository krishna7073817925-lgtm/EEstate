import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Award, Users2, Building } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  return (
    <section id="about-section" className="py-20 sm:py-28 bg-white border-t border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EF] text-[#0B3B2C] text-[11px] font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Redefining Modern Living with{' '}
              <span className="font-serif-luxury italic font-normal text-[#0B3B2C]">
                EEstates Agency
              </span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We are a premier architectural real estate advisory dedicated to curating extraordinary sanctuaries. With decades of collective expertise, a verified legal title network, and a client-first philosophy, we make buying, listing, and renting effortless.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                'Transparent transaction advisory with zero concealed closing fees',
                'Curated prime properties across houses, apartments, and land plots',
                'Licensed estate concierges guiding every viewing, appraisal, and closing',
                'Verified property records and institutional title authenticity'
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0B3B2C] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-700">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="about-learn-more-btn"
                onClick={() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#0B3B2C] hover:bg-[#07241B] text-white transition-all shadow-md shadow-[#0B3B2C]/20 hover:scale-[1.02]"
              >
                <span>Connect with an Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interior Image & Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Interior Living Room Photography */}
            <div className="sm:col-span-8 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-100 group">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury Modern Interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Award-Winning Architectural Portfolio</span>
                    <span className="text-[11px] text-stone-500">Recognized among North America's Top 50 Luxury Brokerages</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Stack */}
            <div className="sm:col-span-4 space-y-6 sm:pl-2">
              {[
                { number: '15+', label: 'Years of Excellence' },
                { number: '$2.8B+', label: 'Real Estate Sold' },
                { number: '1,200+', label: 'Verified Client Reviews' },
                { number: '100%', label: 'Clear Title Guarantee' }
              ].map((stat, i) => (
                <div key={i} className="border-l-3 border-[#0B3B2C] pl-4 py-1">
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
