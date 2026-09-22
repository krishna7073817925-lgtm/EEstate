import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

export const BookingModal: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedProperty,
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookViewing,
    setActiveTab
  } = useProperty();

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(minDate);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isBookingModalOpen || !selectedProperty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!phone.trim()) {
      setErrorMsg('Please provide a contact phone number so our agent can confirm your viewing.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await bookViewing({
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        propertyLocation: selectedProperty.location,
        propertyImage: selectedProperty.imageUrl,
        userPhone: phone,
        date,
        timeSlot,
        notes: notes.trim()
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error booking viewing:', err);
      setErrorMsg(err?.message || 'Failed to submit viewing request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setIsSuccess(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="booking-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 my-auto"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="font-heading font-extrabold text-2xl text-stone-900">
              Viewing Scheduled!
            </h3>
            
            <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
              Your viewing for <strong className="text-stone-900">{selectedProperty.title}</strong> has been successfully booked for:
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-left text-xs sm:text-sm space-y-1.5 max-w-xs mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-500">Date:</span>
                <span className="font-bold text-stone-800">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Time:</span>
                <span className="font-bold text-stone-800">{timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Location:</span>
                <span className="font-bold text-stone-800 truncate max-w-[160px]">{selectedProperty.location}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('my-bookings');
                }}
                className="flex-1 py-3 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-colors flex items-center justify-center gap-2"
              >
                <span>View My Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-full text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3B2C] mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule a Tour</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-stone-900">
                Book a Viewing
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                For: {selectedProperty.title} ({selectedProperty.location})
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                {errorMsg}
              </div>
            )}

            {/* Date and Time Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium text-stone-800 focus:outline-none focus:border-[#0B3B2C] bg-white cursor-pointer"
                >
                  <option value="10:00 AM">10:00 AM - Morning</option>
                  <option value="11:30 AM">11:30 AM - Morning</option>
                  <option value="02:00 PM">02:00 PM - Afternoon</option>
                  <option value="03:30 PM">03:30 PM - Afternoon</option>
                  <option value="05:00 PM">05:00 PM - Evening</option>
                </select>
              </div>
            </div>

            {/* User Contact Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Phone Number (for confirmation SMS/call)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Special Inquiries or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Would like to see the garage and HVAC system..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
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
                {submitting ? 'Confirming...' : 'Confirm Viewing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
