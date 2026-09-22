import React, { useState } from 'react';
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight, Edit3, Trash2, Calendar, Star, Camera, Sparkles, AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { Property } from '../types';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: Property;
  onOpenAuth: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onOpenAuth }) => {
  const { user } = useAuth();
  const {
    setSelectedProperty,
    setIsDetailsOpen,
    setIsBookingModalOpen,
    setEditingProperty,
    setIsAddModalOpen,
    deleteProperty,
    getPropertyRatingStats
  } = useProperty();
  const [isDeleting, setIsDeleting] = useState(false);

  const ratingStats = getPropertyRatingStats(property.id);
  const isOwner = user && (user.uid === property.ownerId || user.email === property.ownerEmail);

  const formatPrice = (price: number, priceType: 'total' | 'month') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);

    return priceType === 'month' ? `${formatted} / mo` : formatted;
  };

  const handleCardClick = () => {
    setSelectedProperty(property);
    setIsDetailsOpen(true);
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onOpenAuth();
      return;
    }
    setSelectedProperty(property);
    setIsDetailsOpen(false);
    setIsBookingModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProperty(property);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    let confirmed = true;
    try {
      confirmed = window.confirm(`Are you sure you want to delete "${property.title}"? This cannot be undone.`);
    } catch {
      confirmed = true;
    }
    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteProperty(property.id);
      } catch (err) {
        console.error('Failed to delete property:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const photoCount = property.gallery?.length || 1;

  return (
    <div
      id={`property-card-${property.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:shadow-stone-300/40 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Property Photo & Badges */}
      <div className="relative aspect-[16/11] overflow-hidden bg-stone-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-center">
          {/* Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md ${
            property.status === 'For Sale' 
              ? 'bg-[#0B3B2C]/95 text-white' 
              : 'bg-emerald-800/95 text-white'
          }`}>
            {property.status}
          </span>

          {/* Category Badge */}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-white/95 text-stone-900 backdrop-blur-md shadow-sm">
            {property.category}
          </span>

          {/* Demo & Not Verified Badges */}
          {(property.isDemo || property.ownerId?.startsWith('demo_')) ? (
            <>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/95 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                <span>Demo</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-700/95 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span>Not Verified</span>
              </span>
            </>
          ) : (
            property.isVerified !== false && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-700/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5" />
                <span>Verified</span>
              </span>
            )
          )}
        </div>

        {/* Photo count pill */}
        {photoCount > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[11px] font-medium border border-white/20">
            <Camera className="w-3 h-3" />
            <span>{photoCount}</span>
          </div>
        )}

        {/* Owner Controls Overlay if owned by logged-in user */}
        {isOwner && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full text-white shadow-md">
            <button
              onClick={handleEditClick}
              title="Edit Property"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete Property"
              className="p-1.5 rounded-full hover:bg-red-500/80 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Property Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#0B3B2C] transition-colors line-clamp-1">
              {property.title}
            </h3>
            {ratingStats.count > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{ratingStats.average.toFixed(1)}</span>
                <span className="text-stone-400 font-normal">({ratingStats.count})</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#0B3B2C] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {(property.isDemo || property.ownerId?.startsWith('demo_')) && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Demo Account Listing • Not Verified</span>
            </div>
          )}
        </div>

        {/* Specs Row */}
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 py-3 border-y border-stone-100">
          {property.category === 'Plot' ? (
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="text-stone-500">Zoned Residential</span>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.sqft.toLocaleString()} sq ft plot</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.beds} {property.beds === 1 ? 'Bed' : 'Beds'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.baths} {property.baths === 1 ? 'Bath' : 'Baths'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.sqft.toLocaleString()} sq ft</span>
              </div>
            </>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="font-heading font-extrabold text-lg sm:text-xl text-[#0B3B2C]">
              {formatPrice(property.price, property.priceType)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookClick}
              title="Schedule Viewing"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B3B2C] bg-[#EAF5EF] hover:bg-[#D8EDE2] transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            <button
              onClick={handleCardClick}
              title="View Details"
              className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 group-hover:bg-[#0B3B2C] group-hover:text-white transition-all flex items-center justify-center shrink-0"
            >
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
