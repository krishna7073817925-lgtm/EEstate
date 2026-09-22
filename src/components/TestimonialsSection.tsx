import React from 'react';
import { Star, ArrowRight, Quote, Sparkles, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      quote: 'EEstates Agency curated an exceptional off-market villa in Beverly Hills for our family. The viewing concierge and closing advisory were flawless from day one.',
      name: 'Sarah & David Johnson',
      location: 'Beverly Hills, CA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      property: 'Modern Architectural Villa',
      rating: 5
    },
    {
      id: 'rev-2',
      quote: 'Listing our waterfront property was remarkably straightforward. We booked multiple qualified private viewings within 48 hours and closed above asking price.',
      name: 'Michael Carter',
      location: 'Miami, FL',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      property: 'Miami Oceanfront Residence',
      rating: 5
    },
    {
      id: 'rev-3',
      quote: 'The level of professionalism, verified legal documentation, and responsiveness is unmatched. They made securing our luxury Manhattan penthouse a true pleasure.',
      name: 'Emily Davis & Mark Vance',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      property: 'Skyline Penthouse Residence',
      rating: 5
    }
  ];

  return (
    <section id="services-section" className="py-20 sm:py-28 bg-[#FBFBFA] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0B3B2C] text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Client Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-xl">
              Discover why discerning buyers, sellers, and investors trust EEstates for their landmark properties.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#0B3B2C] flex items-center gap-1.5">
              <span>Overall Client Rating:</span>
              <span className="flex items-center text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                4.9 / 5.0
              </span>
            </span>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm hover:shadow-xl hover:shadow-stone-300/30 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                {/* Top Stars & Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-stone-300 group-hover:text-[#0B3B2C]/40 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic">
                  "{rev.quote}"
                </p>

                {/* Property Tag */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-[11px] font-semibold text-stone-600">
                    <CheckCircle2 className="w-3 h-3 text-[#0B3B2C]" />
                    <span>{rev.property}</span>
                  </span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-stone-100 mt-6">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-100"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900 leading-snug">
                    {rev.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {rev.location}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
