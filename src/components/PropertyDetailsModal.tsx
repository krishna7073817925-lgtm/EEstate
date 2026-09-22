import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  User,
  Mail,
  Shield,
  Edit3,
  Trash2,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Phone,
  Share2,
  Heart,
  Check,
  Building,
  Sparkles,
  Info,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { PropertyReviewsSection } from './PropertyReviewsSection';

interface PropertyDetailsModalProps {
  onOpenAuth: () => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const {
    selectedProperty,
    isDetailsOpen,
    setIsDetailsOpen,
    setIsBookingModalOpen,
    setEditingProperty,
    setIsAddModalOpen,
    deleteProperty,
    getPropertyRatingStats
  } = useProperty();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDetailsOpen || !selectedProperty) return null;

  const ratingStats = getPropertyRatingStats(selectedProperty.id);
  const isOwner = user && (user.uid === selectedProperty.ownerId || user.email === selectedProperty.ownerEmail);

  // Gallery array
  const galleryImages = selectedProperty.gallery && selectedProperty.gallery.length > 0
    ? selectedProperty.gallery
    : [selectedProperty.imageUrl];

  const currentImage = galleryImages[activeImageIdx] || selectedProperty.imageUrl;

  const formatPrice = (price: number, priceType: 'total' | 'month') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
    return priceType === 'month' ? `${formatted} / month` : formatted;
  };

  // Mortgage Calculator Math
  const isRental = selectedProperty.priceType === 'month';
  const downPaymentAmount = Math.round((selectedProperty.price * downPaymentPercent) / 100);
  const loanAmount = Math.max(0, selectedProperty.price - downPaymentAmount);
  // Standard 30-year fixed @ 6.5% interest rate
  const monthlyInterestRate = 0.065 / 12;
  const numPayments = 360;
  const monthlyPrincipalInterest = loanAmount > 0
    ? Math.round(
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numPayments)) /
        (Math.pow(1 + monthlyInterestRate, numPayments) - 1)
      )
    : 0;
  const monthlyPropertyTax = Math.round((selectedProperty.price * 0.011) / 12);
  const monthlyInsurance = Math.round((selectedProperty.price * 0.0035) / 12);
  const totalEstimatedMonthly = isRental
    ? selectedProperty.price
    : monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance;

  const handleNextPhoto = () => {
    setActiveImageIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevPhoto = () => {
    setActiveImageIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleBookClick = () => {
    if (!user) {
      onOpenAuth();
    } else {
      // Close details modal so booking modal has full focus without z-index clash
      setIsDetailsOpen(false);
      setIsBookingModalOpen(true);
    }
  };

  const handleEditClick = () => {
    setEditingProperty(selectedProperty);
    setIsDetailsOpen(false);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = async () => {
    let confirmed = true;
    try {
      confirmed = window.confirm(`Are you sure you want to delete "${selectedProperty.title}"? This action cannot be reversed.`);
    } catch {
      confirmed = true;
    }
    if (confirmed) {
      try {
        setIsDeleting(true);
        await deleteProperty(selectedProperty.id);
        setIsDetailsOpen(false);
      } catch (err) {
        console.error('Failed to delete property:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="property-details-modal"
        className="bg-white rounded-3xl max-w-5xl w-full my-auto overflow-hidden shadow-2xl relative border border-stone-200/80 flex flex-col max-h-[94vh]"
      >
        {/* Floating Top Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            title="Share Property"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            title="Save to favorites"
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
          </button>

          {/* Close Modal Button */}
          <button
            id="close-details-modal-btn"
            onClick={() => setIsDetailsOpen(false)}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* Photo Gallery Hero Section */}
          <div className="relative bg-stone-900 aspect-[16/10] sm:aspect-[21/10] w-full overflow-hidden select-none group">
            <img
              src={currentImage}
              alt={`${selectedProperty.title} photo ${activeImageIdx + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Photo navigation arrows if multi-photo */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-105"
                  title="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badges on Gallery */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#0B3B2C]/95 text-white backdrop-blur-md shadow-md">
                {selectedProperty.status}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wide bg-white/95 text-stone-900 backdrop-blur-md shadow-md">
                {selectedProperty.category}
              </span>
              {(selectedProperty.isDemo || selectedProperty.ownerId?.startsWith('demo_')) && (
                <>
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500 text-white flex items-center gap-1 shadow-md">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Demo</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-700 text-white flex items-center gap-1 shadow-md">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Not Verified</span>
                  </span>
                </>
              )}
              {selectedProperty.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-400 text-stone-900 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-stone-900" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {/* Bottom info strip on gallery */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
              <div className="space-y-1 max-w-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  Architectural Portfolio
                </span>
                <h2 className="font-serif-luxury text-xl sm:text-3xl text-white font-bold drop-shadow-md">
                  {selectedProperty.title}
                </h2>
              </div>

              {/* Photo counter */}
              {galleryImages.length > 1 && (
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-medium border border-white/20">
                  {activeImageIdx + 1} / {galleryImages.length}
                </div>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails Strip */}
          {galleryImages.length > 1 && (
            <div className="bg-stone-900 px-4 py-3 flex items-center gap-3 overflow-x-auto border-t border-stone-800">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx
                      ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-900/40'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Header: Title, Location & Price */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-stone-200">
              <div className="space-y-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-stone-950 tracking-tight">
                  {selectedProperty.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-stone-600 text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                    <span>{selectedProperty.location}</span>
                  </div>

                  <span className="text-stone-300">•</span>

                  {ratingStats.count > 0 ? (
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 text-xs font-bold text-stone-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{ratingStats.average.toFixed(1)}</span>
                      <span className="text-stone-400 font-normal">
                        ({ratingStats.count} {ratingStats.count === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">New Listing</span>
                  )}
                </div>
              </div>

              {/* Price Card */}
              <div className="md:text-right bg-stone-50 md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-stone-200">
                <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400 block">
                  Offering Price
                </span>
                <span className="font-heading font-extrabold text-2xl sm:text-4xl text-[#0B3B2C] block">
                  {formatPrice(selectedProperty.price, selectedProperty.priceType)}
                </span>
                {!isRental && (
                  <span className="text-xs text-stone-500 font-medium mt-1 block">
                    Est. ${totalEstimatedMonthly.toLocaleString()}/mo
                  </span>
                )}
              </div>
            </div>

            {/* Demo & Unverified Notice Banner */}
            {(selectedProperty.isDemo || selectedProperty.ownerId?.startsWith('demo_')) && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-extrabold text-sm text-amber-950">
                      Demo Account Listing • Not Verified
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                      Demo Mode
                    </span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    This property was published using a Demo Account for testing and simulation purposes. The listing details, host identity, and pricing are unverified. No real contracts or transactions apply.
                  </p>
                </div>
              </div>
            )}

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
              {selectedProperty.category === 'Plot' ? (
                <>
                  <div className="col-span-2">
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Property Type</span>
                    <span className="font-heading font-bold text-sm sm:text-base text-stone-900 mt-0.5 block">
                      Residential Building Plot
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Total Land Area</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Maximize2 className="w-4 h-4 text-[#0B3B2C]" />
                      <span className="font-heading font-bold text-sm sm:text-base text-stone-900">
                        {selectedProperty.sqft.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Bedrooms</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Bed className="w-4 h-4 text-[#0B3B2C]" />
                      <span className="font-heading font-bold text-sm sm:text-base text-stone-900">
                        {selectedProperty.beds} {selectedProperty.beds === 1 ? 'Bedroom' : 'Bedrooms'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Bathrooms</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Bath className="w-4 h-4 text-[#0B3B2C]" />
                      <span className="font-heading font-bold text-sm sm:text-base text-stone-900">
                        {selectedProperty.baths} {selectedProperty.baths === 1 ? 'Bath' : 'Baths'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Interior Living</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Maximize2 className="w-4 h-4 text-[#0B3B2C]" />
                      <span className="font-heading font-bold text-sm sm:text-base text-stone-900">
                        {selectedProperty.sqft.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-400 block">Property Class</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building className="w-4 h-4 text-[#0B3B2C]" />
                      <span className="font-heading font-bold text-sm sm:text-base text-stone-900">
                        {selectedProperty.category}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Narrative Description */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Property Overview
              </h3>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {selectedProperty.description}
              </p>
            </div>

            {/* Curated Luxury Amenities */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Features & Curated Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(selectedProperty.amenities || [
                  'High Ceilings & Floor-to-Ceiling Windows',
                  'Smart Climate & Lighting Automation',
                  'Dedicated Private Parking Space',
                  'Custom Chef Kitchen Millwork',
                  '24/7 Security & Surveillance Ready',
                  'Fiber Optic High-Speed Connectivity'
                ]).map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs sm:text-sm font-medium text-stone-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0B3B2C] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mortgage & Investment Estimator (For Sale properties) */}
            {!isRental && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#F5F8F6] to-[#EBF3EF] border border-[#0B3B2C]/15 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#0B3B2C]">
                    <Calculator className="w-5 h-5" />
                    <h3 className="font-heading font-bold text-lg text-stone-900">
                      Estimated Monthly Payment
                    </h3>
                  </div>
                  <span className="text-2xl font-extrabold text-[#0B3B2C]">
                    ${totalEstimatedMonthly.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-stone-600">/ month</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600">
                  Estimate based on 30-year fixed rate mortgage at 6.5% interest, with property taxes and insurance included.
                </p>

                {/* Down Payment Selector */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-2">
                    <span>Down Payment: {downPaymentPercent}% (${downPaymentAmount.toLocaleString()})</span>
                    <span>Loan: ${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {[10, 20, 30].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDownPaymentPercent(pct)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          downPaymentPercent === pct
                            ? 'bg-[#0B3B2C] text-white shadow-sm'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {pct}% Down
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block font-medium">Principal & Interest</span>
                    <span className="font-bold text-stone-900 text-sm">${monthlyPrincipalInterest.toLocaleString()}</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block font-medium">Property Taxes</span>
                    <span className="font-bold text-stone-900 text-sm">${monthlyPropertyTax.toLocaleString()}</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-400 block font-medium">Homeowners Insurance</span>
                    <span className="font-bold text-stone-900 text-sm">${monthlyInsurance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Verified Agent / Host Card */}
            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg shadow-sm ${
                  (selectedProperty.isDemo || selectedProperty.ownerId?.startsWith('demo_'))
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#0B3B2C] text-white'
                }`}>
                  {selectedProperty.ownerName?.[0] || 'E'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-base text-stone-900">
                      {selectedProperty.ownerName || 'EEstates Premier Advisor'}
                    </span>
                    {(selectedProperty.isDemo || selectedProperty.ownerId?.startsWith('demo_')) ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Demo Account (Not Verified)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0B3B2C] text-[10px] font-bold">
                        <Shield className="w-3 h-3" />
                        <span>Certified Agent</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    {selectedProperty.ownerEmail || 'advisors@eestates.com'}
                    {(selectedProperty.isDemo || selectedProperty.ownerId?.startsWith('demo_'))
                      ? ' • Demo Host (Simulation Listing)'
                      : ' • License #EE-948210'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <a
                  href={`mailto:${selectedProperty.ownerEmail || 'krishnaagr047@gmail.com'}?subject=Inquiry about ${encodeURIComponent(selectedProperty.title)}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0B3B2C]" />
                  <span>Email Host</span>
                </a>
                <a
                  href={`mailto:krishnaagr047@gmail.com?subject=Inquiry about ${encodeURIComponent(selectedProperty.title)}&body=Hello Krishna, I would like to inquire about "${encodeURIComponent(selectedProperty.title)}" located at ${encodeURIComponent(selectedProperty.location)}.`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Contact Krishna Headquarters directly"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Contact Headquarters</span>
                </a>
              </div>
            </div>

            {/* Property Reviews & Ratings System */}
            <PropertyReviewsSection property={selectedProperty} onOpenAuth={onOpenAuth} />

          </div>
        </div>

        {/* Modal Action Sticky Footer Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isOwner && (
              <>
                <button
                  id="modal-edit-property-btn"
                  onClick={handleEditClick}
                  className="px-4 py-2.5 rounded-full text-xs font-bold border border-stone-200 text-stone-800 hover:bg-stone-50 flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-[#0B3B2C]" />
                  <span>Edit Listing</span>
                </button>
                <button
                  id="modal-delete-property-btn"
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-full text-xs font-bold border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Listing'}</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="modal-book-viewing-btn"
              onClick={handleBookClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#0B3B2C] hover:bg-[#07241B] text-white transition-all shadow-md shadow-[#0B3B2C]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule a Private Viewing</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
