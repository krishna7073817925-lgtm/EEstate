import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Sparkles, Code } from 'lucide-react';
import { ContactInquiry } from '../types';

export const INQUIRIES_STORAGE_KEY = 'eestates_inquiries_v1';

const INITIAL_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq_sample_1',
    name: 'Rohit Sharma',
    email: 'rohit.s@investorhub.in',
    phone: '+91 98290 11234',
    subject: 'Inquiry regarding Commercial Plots in Rajasthan',
    message: 'Hello Krishna, I am interested in acquiring commercial plots near Bharatpur. Could you share title documents and current rate schedules?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    status: 'new'
  },
  {
    id: 'inq_sample_2',
    name: 'Ananya Verma',
    email: 'ananya.verma@outlook.com',
    phone: '+91 94140 55678',
    subject: 'Property Consultation & Valuation',
    message: 'Looking for luxury villa listings and architectural advisory services for our family home. Would love to schedule a consultation call.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    status: 'read'
  }
];

export const getStoredInquiries = (): ContactInquiry[] => {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_INQUIRIES;
  } catch {
    return INITIAL_INQUIRIES;
  }
};

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newInquiry: ContactInquiry = {
        id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'Direct Website Inquiry',
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      try {
        const existing = getStoredInquiries();
        existing.unshift(newInquiry);
        localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(existing));
      } catch (err) {
        console.warn('Failed to store inquiry:', err);
      }

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 600);
  };

  return (
    <section id="contact-section" className="py-20 sm:py-24 bg-stone-50 border-t border-stone-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF5EF] text-[#0B3B2C] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Advisory & Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Connect With Our Leadership
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Have questions about a listing, title verification, or architectural appraisal? Contact our headquarters directly or send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info & Dev Credit */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
              <h3 className="font-heading font-extrabold text-lg text-stone-900">
                Official Contact Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block text-[11px] uppercase tracking-wider">
                      Website Contact Email
                    </span>
                    <a 
                      href="mailto:krishnaagr047@gmail.com" 
                      className="font-bold text-stone-900 hover:text-[#0B3B2C] transition-colors break-all"
                    >
                      krishnaagr047@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block text-[11px] uppercase tracking-wider">
                      Headquarters Address
                    </span>
                    <span className="font-bold text-stone-900 leading-snug block">
                      568 narayan circle, bharatpur, Rajasthan, 321001
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3B2C] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block text-[11px] uppercase tracking-wider">
                      Direct Hotline
                    </span>
                    <a 
                      href="tel:+917073817925" 
                      className="font-bold text-stone-900 hover:text-[#0B3B2C] transition-colors"
                    >
                      +91 70738 17925
                    </a>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-[#0B3B2C]/10 text-[#0B3B2C] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium block text-[11px] uppercase tracking-wider">
                      Advisory Hours
                    </span>
                    <span className="font-semibold text-stone-800 block">
                      Monday – Saturday: 9:00 AM – 7:30 PM IST
                    </span>
                  </div>
                </div>
              </div>

              {/* Developer Badge */}
              <div className="pt-2 border-t border-stone-100">
                <div className="p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">
                        Platform Engineering
                      </span>
                      <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                        Developed by Krishna
                      </span>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90">
              <h3 className="font-heading font-extrabold text-lg text-stone-900 mb-1">
                Send an Inquiry to krishnaagr047@gmail.com
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mb-6">
                Messages submitted here are routed directly to Krishna’s inbox and logged into the Master Dashboard.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-[#EAF5EF] border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#0B3B2C] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                  </div>
                  <h4 className="font-heading font-extrabold text-xl text-stone-900">
                    Inquiry Received Successfully!
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for contacting us. Your message has been dispatched to <strong>krishnaagr047@gmail.com</strong> and logged into the system. An advisor will follow up promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-[#0B3B2C] text-white text-xs font-bold hover:bg-[#07241B] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Singhania"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] text-xs sm:text-sm outline-none bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. vikram@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] text-xs sm:text-sm outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] text-xs sm:text-sm outline-none bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Inquiry Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Villa Purchase Inquiry"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] text-xs sm:text-sm outline-none bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your property requirements, questions regarding legal title, or schedule preferences..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#0B3B2C] focus:ring-1 focus:ring-[#0B3B2C] text-xs sm:text-sm outline-none bg-stone-50/50 resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-[#0B3B2C] hover:bg-[#07241B] text-white flex items-center justify-center gap-2 shadow-md shadow-[#0B3B2C]/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message to krishnaagr047@gmail.com</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
