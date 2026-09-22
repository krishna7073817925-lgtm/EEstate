import React from 'react';
import { Plus, Building, ArrowLeft, AlertCircle } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { PropertyCard } from './PropertyCard';

interface MyListingsViewProps {
  onOpenAuth: () => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { properties, setIsAddModalOpen, setEditingProperty, setActiveTab } = useProperty();

  if (!user) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <Building className="w-12 h-12 text-[#0B3B2C] mx-auto mb-4" />
        <h2 className="font-heading font-extrabold text-2xl text-stone-900 mb-2">
          Sign In to Manage Your Listings
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          You need to be signed in to view, create, edit, or remove your property listings.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-full bg-[#0B3B2C] text-white font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const myListings = properties.filter(
    (p) => p.ownerId === user.uid || (user.email && p.ownerEmail?.toLowerCase() === user.email.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-stone-200">
        <div>
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#0B3B2C] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
            My Property Listings
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage your listed houses, apartments, and plots. Changes are synced across the database.
          </p>
        </div>

        <button
          id="my-listings-add-btn"
          onClick={() => {
            setEditingProperty(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-all shadow-md shadow-[#0B3B2C]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Demo Mode Banner */}
      {(user.isDemo || user.uid.startsWith('demo_')) && (
        <div className="mb-8 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 flex items-start gap-3.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-amber-950">Demo Publishing Enabled</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">Unverified Demo</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              You are signed in as Demo Account (Alex Morgan). Properties published here are saved and displayed with <strong>Demo</strong> and <strong>Not Verified</strong> tags across the entire property catalog.
            </p>
          </div>
        </div>
      )}

      {/* Grid or Empty State */}
      {myListings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-100 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
            No properties listed yet
          </h3>
          <p className="text-stone-500 text-sm mb-6">
            You haven't added any properties to your portfolio. Publish your first house, apartment, or plot now.
          </p>
          <button
            onClick={() => {
              setEditingProperty(null);
              setIsAddModalOpen(true);
            }}
            className="px-6 py-3 rounded-full bg-[#0B3B2C] text-white font-bold text-xs"
          >
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myListings.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}

    </div>
  );
};
