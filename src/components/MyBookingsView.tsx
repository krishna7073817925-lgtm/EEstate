import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  XCircle,
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { ViewingBooking } from '../types';

interface MyBookingsViewProps {
  onOpenAuth: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const {
    userBookings,
    cancelBooking,
    deleteBooking,
    setActiveTab,
    setSelectedProperty,
    setIsDetailsOpen,
    setIsBookingModalOpen,
    properties
  } = useProperty();

  const [bookingToCancel, setBookingToCancel] = useState<ViewingBooking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<ViewingBooking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  if (!user) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-3xl bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center mx-auto mb-4 border border-[#0B3B2C]/10">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-stone-900 mb-2">
          Sign In to View Your Bookings
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Access your scheduled property viewings, private tour itineraries, and appointment statuses.
        </p>
        <button
          id="bookings-sign-in-prompt-btn"
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-full bg-[#0B3B2C] text-white font-bold text-xs hover:bg-[#07241B] transition-colors shadow-sm"
        >
          Sign In or Continue as Demo
        </button>
      </div>
    );
  }

  const confirmedCount = userBookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = userBookings.filter((b) => b.status === 'cancelled').length;

  const displayedBookings = userBookings.filter((b) => {
    if (activeStatusTab === 'confirmed') return b.status === 'confirmed';
    if (activeStatusTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const confirmCancelAction = async () => {
    if (!bookingToCancel) return;
    try {
      setIsProcessing(true);
      await cancelBooking(bookingToCancel.id);
      showToast(`Appointment for "${bookingToCancel.propertyTitle}" has been cancelled.`);
      setBookingToCancel(null);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDeleteAction = async () => {
    if (!bookingToDelete) return;
    try {
      setIsProcessing(true);
      await deleteBooking(bookingToDelete.id);
      showToast(`Appointment removed from your schedule.`, 'info');
      setBookingToDelete(null);
    } catch (err) {
      console.error('Failed to remove booking:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) {
      setSelectedProperty(prop);
      setIsDetailsOpen(true);
    } else {
      setActiveTab('properties');
    }
  };

  const handleBookAgain = (propertyId: string) => {
    const prop = properties.find((p) => p.id === propertyId);
    if (prop) {
      setSelectedProperty(prop);
      setIsBookingModalOpen(true);
    } else {
      setActiveTab('properties');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0B3B2C] text-white rounded-2xl shadow-xl text-xs font-semibold border border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pb-6 mb-8 border-b border-stone-200">
        <button
          id="back-to-home-from-bookings"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#0B3B2C] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 tracking-tight">
                My Viewing Bookings
              </h1>
              {user.isDemo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-stone-500 text-sm mt-1">
              Manage your private property walkthroughs, review upcoming times, or cancel appointments.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('properties')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#F0F5F2] text-[#0B3B2C] hover:bg-[#E3EDE8] transition-colors border border-[#0B3B2C]/10 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Browse More Listings</span>
          </button>
        </div>

        {/* Filter Tabs */}
        {userBookings.length > 0 && (
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveStatusTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStatusTab === 'all'
                  ? 'bg-[#0B3B2C] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Appointments ({userBookings.length})
            </button>
            <button
              onClick={() => setActiveStatusTab('confirmed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStatusTab === 'confirmed'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Upcoming ({confirmedCount})
            </button>
            <button
              onClick={() => setActiveStatusTab('cancelled')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeStatusTab === 'cancelled'
                  ? 'bg-stone-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        )}
      </div>

      {/* Bookings List or Empty State */}
      {displayedBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-stone-100 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-stone-900 mb-2">
            {activeStatusTab === 'all'
              ? 'No Viewings Scheduled'
              : activeStatusTab === 'confirmed'
              ? 'No Upcoming Viewings'
              : 'No Cancelled Viewings'}
          </h3>
          <p className="text-stone-500 text-sm mb-6">
            {activeStatusTab === 'all'
              ? "You haven't requested any property viewings yet. Explore our portfolio and schedule a private walkthrough."
              : activeStatusTab === 'confirmed'
              ? 'You have no confirmed upcoming appointments.'
              : 'You have no cancelled appointments.'}
          </p>
          <button
            onClick={() => setActiveTab('properties')}
            className="px-6 py-3 rounded-full bg-[#0B3B2C] text-white font-bold text-xs hover:bg-[#07241B] transition-colors"
          >
            Explore Properties
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBookings.map((b) => {
            const isConfirmed = b.status === 'confirmed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id}
                id={`booking-card-${b.id}`}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isCancelled
                    ? 'border-stone-200 bg-stone-50/50 opacity-90'
                    : 'border-stone-200/90 shadow-sm hover:shadow-md hover:border-[#0B3B2C]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {b.propertyImage ? (
                    <img
                      src={b.propertyImage}
                      alt={b.propertyTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-stone-100"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
                      <Calendar className="w-8 h-8 text-stone-400" />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-200 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {isConfirmed ? 'Confirmed Viewing' : 'Cancelled'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-stone-900 leading-snug">
                      {b.propertyTitle}
                    </h3>

                    {b.propertyLocation && (
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0B3B2C] shrink-0" />
                        <span className="truncate">{b.propertyLocation}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700 pt-1">
                      <span className="flex items-center gap-1.5 bg-stone-100/80 px-2.5 py-1 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-[#0B3B2C]" />
                        <span>{b.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-stone-100/80 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-[#0B3B2C]" />
                        <span>{b.timeSlot}</span>
                      </span>
                    </div>

                    {b.notes && (
                      <p className="text-[11px] text-stone-500 italic pt-0.5 line-clamp-1">
                        "{b.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                  <button
                    onClick={() => handleViewProperty(b.propertyId)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B3B2C] bg-[#EAF5EF] hover:bg-[#D8EDE2] transition-colors flex items-center gap-1"
                  >
                    <span>View Property</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {isConfirmed && (
                    <button
                      id={`cancel-booking-btn-${b.id}`}
                      onClick={() => setBookingToCancel(b)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-stone-400 group-hover:text-red-600" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {isCancelled && (
                    <>
                      <button
                        onClick={() => handleBookAgain(b.propertyId)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Book Again</span>
                      </button>

                      <button
                        onClick={() => setBookingToDelete(b)}
                        className="p-2 rounded-xl text-xs font-bold text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In-App Confirmation Modal for Cancelling Appointment */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200/60">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-extrabold text-xl text-stone-900 mb-1">
              Cancel Viewing Appointment?
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mb-4 leading-relaxed">
              Are you sure you want to cancel your scheduled viewing for{' '}
              <strong className="text-stone-800 font-semibold">{bookingToCancel.propertyTitle}</strong> on{' '}
              <span className="font-medium text-stone-700">{bookingToCancel.date}</span> at{' '}
              <span className="font-medium text-stone-700">{bookingToCancel.timeSlot}</span>?
            </p>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 mb-6 text-xs text-stone-600">
              You can reschedule another viewing anytime or browse other properties.
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-full text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                id="confirm-cancel-appointment-modal-btn"
                type="button"
                onClick={confirmCancelAction}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Cancelling...' : 'Yes, Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal for Removing from History */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-150">
            <h3 className="font-heading font-extrabold text-lg text-stone-900 mb-2">
              Remove from Schedule?
            </h3>
            <p className="text-stone-500 text-xs mb-5">
              This will remove the cancelled viewing for <strong>{bookingToDelete.propertyTitle}</strong> from your list.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:bg-stone-100"
              >
                Keep in List
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full text-xs font-bold bg-stone-900 text-white hover:bg-stone-800"
              >
                {isProcessing ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
