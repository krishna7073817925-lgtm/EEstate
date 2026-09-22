import React, { useState } from 'react';
import { MapPin, Home, DollarSign, Search, ChevronLeft, ChevronRight, Users, Sparkles, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PropertyCategory, PropertyStatus } from '../types';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    title: 'Modern Architecture Villa',
    location: 'Beverly Hills, CA',
    price: '$2,450,000',
    type: 'Exclusive House'
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    title: 'Contemporary Luxury Residence',
    location: 'Miami, FL',
    price: '$1,890,000',
    type: 'Waterfront Estate'
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    title: 'Skyline Penthouse Residence',
    location: 'New York, NY',
    price: '$890,000',
    type: 'Central Park View'
  }
];

export const HeroSection: React.FC = () => {
  const { filters, setFilters, setActiveTab, filteredProperties } = useProperty();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTabMode, setActiveTabMode] = useState<'Buy' | 'Rent' | 'All'>('Buy');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('properties');
    document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabChange = (tab: 'Buy' | 'Rent' | 'All') => {
    setActiveTabMode(tab);
    if (tab === 'Buy') {
      setFilters(prev => ({ ...prev, status: 'For Sale' }));
    } else if (tab === 'Rent') {
      setFilters(prev => ({ ...prev, status: 'For Rent' }));
    } else {
      setFilters(prev => ({ ...prev, status: 'All' }));
    }
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F5F8F6] via-[#FAFBF9] to-white">
      {/* Subtle architectural ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Premium Typography & Filter Bar */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            
            {/* Elegant Luxury Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                Premier Luxury Agency • Verified Portfolio
              </span>
            </div>

            {/* Main Headline with Serif Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.12]">
              Find Your Dream Sanctuary with{' '}
              <span className="font-serif-luxury italic font-normal text-[#0B3B2C] underline decoration-[#0B3B2C]/20 underline-offset-8">
                EEstates Agency
              </span>
            </h1>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed">
              Curating America's most prestigious architectural houses, luxury apartments, and private residential estates with verified titles and seamless viewing concierge.
            </p>

            {/* Premium Search Filter Card */}
            <div className="pt-2">
              
              {/* Type Switcher Tabs (Buy / Rent / All) */}
              <div className="inline-flex items-center p-1 bg-stone-200/70 rounded-full mb-3 shadow-inner">
                {(['Buy', 'Rent', 'All'] as const).map((tab) => {
                  const isActive = activeTabMode === tab;
                  return (
                    <button
                      key={tab}
                      id={`hero-tab-${tab.toLowerCase()}`}
                      type="button"
                      onClick={() => handleTabChange(tab)}
                      className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0B3B2C] text-white shadow-sm'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tab === 'Buy' ? 'Buy Property' : tab === 'Rent' ? 'Rent Property' : 'All Listings'}
                    </button>
                  );
                })}
              </div>

              {/* Main Search Controls Box */}
              <form 
                onSubmit={handleSearchSubmit}
                id="hero-search-form"
                className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-stone-300/40 border border-stone-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center"
              >
                
                {/* Location Input Field */}
                <div className="flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B3B2C]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Location</span>
                  </div>
                  <input
                    id="hero-location-input"
                    type="text"
                    placeholder="Beverly Hills, Miami, New York..."
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full text-xs sm:text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Property Category Dropdown */}
                <div className="flex-1 px-3 py-2 border-b md:border-b-0 md:border-r border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-0.5">
                    <Home className="w-3.5 h-3.5 text-[#0B3B2C]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Property Type</span>
                  </div>
                  <select
                    id="hero-property-type-select"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="All">All Types (Any)</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Plot">Plot (Land)</option>
                  </select>
                </div>

                {/* Price Bracket Dropdown */}
                <div className="flex-1 px-3 py-2">
                  <div className="flex items-center gap-1.5 text-stone-400 mb-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0B3B2C]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Budget Range</span>
                  </div>
                  <select
                    id="hero-price-range-select"
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="All">Any Price</option>
                    <option value="under-500k">Under $500,000</option>
                    <option value="500k-1m">$500,000 – $1,000,000</option>
                    <option value="1m-2m">$1,000,000 – $2,000,000</option>
                    <option value="over-2m">$2,000,000+</option>
                  </select>
                </div>

                {/* Submit Search Action */}
                <button
                  id="hero-submit-search-btn"
                  type="submit"
                  className="px-6 py-3.5 bg-[#0B3B2C] hover:bg-[#07241B] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0B3B2C]/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>

              </form>
            </div>

            {/* Quick Metrics Trust Bar */}
            <div className="flex items-center gap-6 pt-1 text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B3B2C]" />
                <span className="text-xs font-semibold">100% Certified Deeds</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold">4.9/5 Rating from 1,200+ Clients</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Architecture Slider & Floating Badges */}
          <div className="lg:col-span-6 relative">
            
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Visual Image Card with Rounded Corners */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl shadow-stone-400/25 border-4 border-white">
                <img
                  src={HERO_SLIDES[activeSlide].image}
                  alt={HERO_SLIDES[activeSlide].title}
                  className="w-full h-full object-cover transition-all duration-700 ease-out transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                
                {/* Bottom slide info */}
                <div className="absolute bottom-6 left-6 right-28 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                    {HERO_SLIDES[activeSlide].type}
                  </span>
                  <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-white drop-shadow-md">
                    {HERO_SLIDES[activeSlide].title}
                  </h3>
                  <p className="text-xs text-stone-200 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{HERO_SLIDES[activeSlide].location}</span>
                    <span className="text-stone-400">•</span>
                    <span className="font-bold text-white">{HERO_SLIDES[activeSlide].price}</span>
                  </p>
                </div>

                {/* Slide Controls (01 - 03 < >) */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs font-mono font-medium">
                  <span>0{activeSlide + 1} / 0{HERO_SLIDES.length}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      id="hero-slide-prev"
                      onClick={prevSlide}
                      title="Previous Estate"
                      className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id="hero-slide-next"
                      onClick={nextSlide}
                      title="Next Estate"
                      className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Floating Pill: "10,000+ Verified Buyers & Sellers" */}
              <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl py-2.5 px-4 shadow-xl border border-stone-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block leading-tight">
                    Trusted by
                  </span>
                  <span className="font-heading font-extrabold text-sm text-[#0B3B2C] block">
                    10,000+ Clients
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
