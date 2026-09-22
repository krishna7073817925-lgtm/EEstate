import React from 'react';
import { ArrowRight, Filter, RefreshCw, Home, Building2, Trees, Sparkles, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { PropertyCategory, PropertyStatus } from '../types';

interface FeaturedPropertiesProps {
  onOpenAuth: () => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ onOpenAuth }) => {
  const {
    properties,
    filteredProperties,
    filters,
    setFilters,
    resetFilters,
    loadingProperties
  } = useProperty();

  // Category counts
  const countAll = properties.length;
  const countHouses = properties.filter((p) => p.category === 'House').length;
  const countApartments = properties.filter((p) => p.category === 'Apartment').length;
  const countPlots = properties.filter((p) => p.category === 'Plot').length;

  const categories: { label: string; count: number; value: 'All' | PropertyCategory; icon: any }[] = [
    { label: 'All Properties', count: countAll, value: 'All', icon: Sparkles },
    { label: 'Houses', count: countHouses, value: 'House', icon: Home },
    { label: 'Apartments', count: countApartments, value: 'Apartment', icon: Building2 },
    { label: 'Plots / Land', count: countPlots, value: 'Plot', icon: Trees },
  ];

  // Active filter checks
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    Boolean(filters.location?.trim()) ||
    Boolean(filters.searchQuery?.trim()) ||
    filters.priceRange !== 'All';

  return (
    <section id="featured-listings" className="py-16 sm:py-24 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3B2C] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0B3B2C]" />
              <span>Curated Architectural Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Explore our handpicked selection of exceptional villas, penthouses, and residential plots in prime locations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
              Showing <strong className="text-stone-900">{filteredProperties.length}</strong> of {properties.length} listings
            </span>

            {hasActiveFilters && (
              <button
                id="view-all-properties-btn"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Category & Status Filter Tabs Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
          
          {/* Category Pills: All, House, Apartment, Plot */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = filters.category === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`filter-cat-${cat.value.toLowerCase()}`}
                  onClick={() => setFilters(prev => ({ ...prev, category: cat.value }))}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B3B2C] text-white shadow-md shadow-[#0B3B2C]/20'
                      : 'bg-white text-stone-700 hover:text-stone-950 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls: Status Toggle & Sort By */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Filter (All, For Sale, For Rent) */}
            <div className="inline-flex items-center p-1 bg-stone-100 rounded-full border border-stone-200 text-xs">
              {(['All', 'For Sale', 'For Rent'] as const).map((st) => {
                const isSelected = filters.status === st;
                return (
                  <button
                    key={st}
                    id={`filter-status-${st.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setFilters(prev => ({ ...prev, status: st }))}
                    className={`px-3 py-1.5 rounded-full font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#0B3B2C] text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center gap-1.5 bg-white border border-stone-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:border-stone-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#0B3B2C]" />
              <select
                id="filter-sort-select"
                value={filters.sortBy || 'featured'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-transparent focus:outline-none cursor-pointer text-stone-800 pr-2"
              >
                <option value="featured">Featured Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Client Rating: Highest First</option>
                <option value="sqft">Size: Largest Sq Ft</option>
              </select>
            </div>

          </div>

        </div>

        {/* Active Filter Chips Pillbox (Removable) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Active Filters:</span>
            </span>

            {filters.category !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-800">
                <span>Category: {filters.category}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, category: 'All' }))}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.status !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-800">
                <span>Status: {filters.status}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, status: 'All' }))}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-800">
                <span>Location: "{filters.location}"</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {filters.priceRange !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-800">
                <span>
                  Budget: {filters.priceRange === 'under-500k' ? '<$500K' : filters.priceRange === '500k-1m' ? '$500K-$1M' : filters.priceRange === '1m-2m' ? '$1M-$2M' : '$2M+'}
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, priceRange: 'All' }))}
                  className="hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs font-bold text-[#0B3B2C] hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {loadingProperties ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-stone-200 animate-pulse space-y-4">
                <div className="aspect-[16/11] bg-stone-200 rounded-2xl" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
                <div className="h-8 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-stone-900">
              No matching properties found
            </h3>
            <p className="text-stone-500 text-sm mt-1 mb-6">
              We couldn't find any listings matching your current filter criteria. Try resetting filters to explore all available properties.
            </p>
            <button
              onClick={resetFilters}
              className="px-7 py-3 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-colors shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onOpenAuth={onOpenAuth}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
