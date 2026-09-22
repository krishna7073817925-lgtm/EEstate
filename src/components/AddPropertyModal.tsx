import React, { useState, useEffect } from 'react';
import { X, Building, DollarSign, MapPin, Bed, Bath, Maximize2, Image as ImageIcon, Sparkles, Check, AlertTriangle, Crown } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { PropertyCategory, PropertyStatus } from '../types';
import { PRESET_IMAGE_OPTIONS } from '../data/initialProperties';

export const AddPropertyModal: React.FC = () => {
  const { user } = useAuth();
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingProperty,
    setEditingProperty,
    addProperty,
    updateProperty
  } = useProperty();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priceType, setPriceType] = useState<'total' | 'month'>('total');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [status, setStatus] = useState<PropertyStatus>('For Sale');
  const [beds, setBeds] = useState<number>(3);
  const [baths, setBaths] = useState<number>(2);
  const [sqft, setSqft] = useState<number>(2200);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_OPTIONS[0].url);
  const [customImage, setCustomImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setDescription(editingProperty.description);
      setPrice(editingProperty.price);
      setPriceType(editingProperty.priceType);
      setLocation(editingProperty.location);
      setCategory(editingProperty.category);
      setStatus(editingProperty.status);
      setBeds(editingProperty.beds);
      setBaths(editingProperty.baths);
      setSqft(editingProperty.sqft);
      setImageUrl(editingProperty.imageUrl);
    } else {
      // Reset defaults
      setTitle('');
      setDescription('');
      setPrice('');
      setPriceType('total');
      setLocation('');
      setCategory('House');
      setStatus('For Sale');
      setBeds(3);
      setBaths(2);
      setSqft(2200);
      setImageUrl(PRESET_IMAGE_OPTIONS[0].url);
      setCustomImage('');
    }
    setErrorMsg(null);
  }, [editingProperty, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be signed in to add or edit a property.');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Please enter a valid property title (at least 3 characters).');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Please enter a valid positive price.');
      return;
    }

    if (!location.trim() || location.trim().length < 2) {
      setErrorMsg('Please enter a valid location (e.g. Bharatpur, Rajasthan or Malibu, CA).');
      return;
    }

    const finalImage = customImage.trim() ? customImage.trim() : imageUrl;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        title: title.trim(),
        description: description.trim() || 'A premier property offering modern comfort and superb design.',
        price: Number(price),
        priceType,
        location: location.trim(),
        category,
        status,
        beds: category === 'Plot' ? 0 : Number(beds),
        baths: category === 'Plot' ? 0 : Number(baths),
        sqft: Number(sqft) || 1000,
        imageUrl: finalImage,
        gallery: editingProperty?.gallery && editingProperty.gallery.length > 0
          ? [finalImage, ...editingProperty.gallery.filter(g => g !== finalImage)]
          : [finalImage],
        amenities: editingProperty?.amenities && editingProperty.amenities.length > 0
          ? editingProperty.amenities
          : [
              'High Ceilings & Floor-to-Ceiling Windows',
              'Modern Climate Control & Smart HVAC',
              'Private Dedicated Parking Space',
              'Fiber Optic High-Speed Infrastructure'
            ]
      };

      if (editingProperty) {
        await updateProperty(editingProperty.id, payload);
      } else {
        await addProperty(payload);
      }

      handleClose();
    } catch (err: any) {
      console.error('Error saving property:', err);
      setErrorMsg(err?.message || 'Failed to save property listing. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingProperty(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="add-property-modal-card"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 my-auto max-h-[92vh] flex flex-col"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3B2C] mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>{editingProperty ? 'Edit Listing' : 'New Listing'}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-stone-900">
            {editingProperty ? 'Update Property Listing' : 'Publish Property to EEstates'}
          </h2>
          <p className="text-xs text-stone-500">
            Enter your property details below. It will immediately appear on the website and be searchable.
          </p>
        </div>

        {/* Master Admin Banner */}
        {user?.isAdmin && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start gap-2.5">
            <Crown className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-emerald-950 block">Master Admin Publishing (Krishna)</span>
              <p className="text-emerald-800 leading-normal">
                This listing will be published directly as an official <strong>Verified Agency Listing</strong> by Krishna ({user.email}).
              </p>
            </div>
          </div>
        )}

        {/* Demo Mode Banner */}
        {!user?.isAdmin && (user?.isDemo || user?.uid.startsWith('demo_')) && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-amber-950 block">Demo Mode Publishing</span>
              <p className="text-amber-800 leading-normal">
                This listing will be published immediately under your demo session and tagged as <strong>Demo</strong> & <strong>Not Verified</strong>. Visitors will see it in the property catalog and can book test viewings.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 space-y-4">
          
          {/* Title / Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Property Name / Title *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Sunset Villa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Property Category *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['House', 'Apartment', 'Plot'] as PropertyCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'Plot') {
                        setBeds(0);
                        setBaths(0);
                      }
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      category === cat
                        ? 'bg-[#0B3B2C] text-white border-[#0B3B2C]'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Listing Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['For Sale', 'For Rent'] as PropertyStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatus(st);
                      setPriceType(st === 'For Rent' ? 'month' : 'total');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      status === st
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price & Price Type */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1250000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Pricing Rate
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C] bg-white cursor-pointer"
              >
                <option value="total">Total Price ($)</option>
                <option value="month">Per Month ($/mo)</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Location (City, State / Address) *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Beverly Hills, CA"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
              />
            </div>
          </div>

          {/* Specifications (Beds, Baths, Sqft) */}
          {category === 'Plot' ? (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Plot Land Area (Square Feet) *
              </label>
              <div className="relative">
                <Maximize2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min={100}
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  placeholder="e.g. 15000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bedrooms
                </label>
                <div className="relative">
                  <Bed className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={0}
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Bathrooms
                </label>
                <div className="relative">
                  <Bath className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={0}
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Living Sq Ft
                </label>
                <div className="relative">
                  <Maximize2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min={50}
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full pl-8 pr-2 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image Selection with Presets + Custom URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              Select Curated Property Photo (or paste custom URL below)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGE_OPTIONS.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setImageUrl(opt.url);
                    setCustomImage('');
                  }}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    imageUrl === opt.url && !customImage
                      ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/20'
                      : 'border-transparent hover:opacity-90'
                  }`}
                >
                  <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                  {imageUrl === opt.url && !customImage && (
                    <div className="absolute inset-0 bg-[#0B3B2C]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="url"
                value={customImage}
                onChange={(e) => setCustomImage(e.target.value)}
                placeholder="Or paste custom image URL (https://...)"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-[#0B3B2C]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Property Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight architectural finishes, garden, view, or neighborhood amenities..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-2.5 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-all shadow-md shadow-[#0B3B2C]/20 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingProperty ? 'Update Listing' : 'Publish Property'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
