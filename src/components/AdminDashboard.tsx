import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  Mail,
  Star,
  ShieldCheck,
  Crown,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Eye,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Download,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  ArrowUpDown,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useAuth, KRISHNA_ADMIN_EMAIL } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { UserLoginRecord, Property, ViewingBooking, ContactInquiry } from '../types';
import { getStoredInquiries, INQUIRIES_STORAGE_KEY } from './ContactSection';

interface AdminDashboardProps {
  onOpenReportModal?: () => void;
  onOpenChatbot?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenReportModal,
  onOpenChatbot
}) => {
  const { user, getAllUserLogins, clearLoginHistory } = useAuth();
  const {
    properties,
    allBookings,
    reviews,
    togglePropertyVerification,
    togglePropertyFeatured,
    adminDeleteProperty,
    adminUpdateBookingStatus,
    setSelectedProperty,
    setIsDetailsOpen,
    setEditingProperty,
    setIsAddModalOpen,
    setActiveTab,
    deleteReview
  } = useProperty();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'properties' | 'bookings' | 'inquiries' | 'reviews'>('users');
  const [userLogins, setUserLogins] = useState<UserLoginRecord[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  
  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState('All');
  const [propertyVerificationFilter, setPropertyVerificationFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load user logins & inquiries
  const refreshData = () => {
    setUserLogins(getAllUserLogins());
    setInquiries(getStoredInquiries());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export full system data to JSON
  const handleExportAllData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      masterAdmin: {
        email: KRISHNA_ADMIN_EMAIL,
        contactEmail: 'krishnaagr047@gmail.com',
        phone: '+91 70738 17925',
        address: '568 narayan circle, bharatpur, Rajasthan, 321001',
        developer: 'Developed by Krishna'
      },
      stats: {
        totalUsers: userLogins.length,
        totalProperties: properties.length,
        totalBookings: allBookings.length,
        totalInquiries: inquiries.length,
        totalReviews: reviews.length
      },
      users: userLogins,
      properties: properties,
      bookings: allBookings,
      inquiries: inquiries,
      reviews: reviews
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eestates_full_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete website data exported successfully!');
  };

  // Filtered lists
  const filteredUsers = userLogins.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const filteredProperties = properties.filter((p) => {
    const q = propertySearch.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
      (p.ownerEmail && p.ownerEmail.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q);

    const matchesCategory =
      propertyCategoryFilter === 'All' || p.category === propertyCategoryFilter;

    const matchesVerification =
      propertyVerificationFilter === 'All' ||
      (propertyVerificationFilter === 'Verified' && p.isVerified) ||
      (propertyVerificationFilter === 'Demo' && (!p.isVerified || p.isDemo));

    return matchesSearch && matchesCategory && matchesVerification;
  });

  const filteredBookings = allBookings.filter((b) => {
    const q = bookingSearch.toLowerCase();
    return (
      b.propertyTitle.toLowerCase().includes(q) ||
      b.userName.toLowerCase().includes(q) ||
      b.userEmail.toLowerCase().includes(q) ||
      (b.propertyLocation ? b.propertyLocation.toLowerCase().includes(q) : false) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div id="admin-dashboard-container" className="min-w-full min-h-screen bg-stone-100/70 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Master Admin Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#07241B] via-[#0B3B2C] to-[#124b39] text-white p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  Master Admin Command Center
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Developed by Krishna
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Welcome, Krishna
                </h1>
                <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Full system oversight for EEstates. Access all registered user logins, your Master ID, uploaded property data, viewing schedules, and direct website inquiries.
                </p>
              </div>

              {/* Master Credentials Pill Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-stone-400 block font-medium">Logged-In Master Admin</span>
                    <span className="font-bold text-white truncate block">{user?.email || KRISHNA_ADMIN_EMAIL}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <div className="flex items-center gap-2.5 truncate">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-stone-400 block font-medium">Your Master ID (UID)</span>
                      <span className="font-mono font-bold text-emerald-300 truncate block text-[11px]">
                        {user?.uid || 'krishna_admin_master_id'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user?.uid || 'krishna_admin_master_id', 'Your Master ID')}
                    className="p-1 rounded-lg hover:bg-white/20 text-stone-300 hover:text-white transition-colors shrink-0"
                    title="Copy Master ID"
                  >
                    {copiedId === (user?.uid || 'krishna_admin_master_id') ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 border border-white/10">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-stone-400 block font-medium">Official Contact Email</span>
                    <span className="font-bold text-white truncate block">krishnaagr047@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
              {onOpenReportModal && (
                <button
                  id="admin-make-report-btn"
                  onClick={onOpenReportModal}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 transition-all font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.02]"
                >
                  <FileText className="w-4 h-4 text-stone-950" />
                  <span>Make Real Estate Report</span>
                </button>
              )}

              {onOpenChatbot && (
                <button
                  id="admin-ai-advisor-btn"
                  onClick={onOpenChatbot}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all font-bold text-xs flex items-center justify-center gap-2 border border-white/20"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>EEstates AI Advisor</span>
                </button>
              )}

              <button
                onClick={handleExportAllData}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white text-[#0B3B2C] hover:bg-stone-100 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4 text-[#0B3B2C]" />
                <span>Export Full Data (JSON)</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 transition-all font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload New Property</span>
              </button>

              <button
                onClick={() => setActiveTab('properties')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all font-semibold text-xs flex items-center justify-center gap-2 border border-white/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Catalog</span>
              </button>
            </div>

          </div>
        </div>

        {/* Metric KPI Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Users */}
          <div 
            onClick={() => setActiveSubTab('users')}
            className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeSubTab === 'users' ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/10 shadow-md' : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">User Logins</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0B3B2C] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{userLogins.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">Active IDs & Sessions</p>
          </div>

          {/* Card 2: Uploaded Properties */}
          <div 
            onClick={() => setActiveSubTab('properties')}
            className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeSubTab === 'properties' ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/10 shadow-md' : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Upload Data</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{properties.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">Properties in System</p>
          </div>

          {/* Card 3: Viewing Bookings */}
          <div 
            onClick={() => setActiveSubTab('bookings')}
            className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeSubTab === 'bookings' ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/10 shadow-md' : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{allBookings.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">Viewing Appointments</p>
          </div>

          {/* Card 4: Inquiries */}
          <div 
            onClick={() => setActiveSubTab('inquiries')}
            className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all ${
              activeSubTab === 'inquiries' ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/10 shadow-md' : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Inquiries</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{inquiries.length}</div>
            <p className="text-[11px] text-stone-500 mt-1">Direct to Contact Mail</p>
          </div>

          {/* Card 5: Reviews */}
          <div 
            onClick={() => setActiveSubTab('reviews')}
            className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all col-span-2 lg:col-span-1 ${
              activeSubTab === 'reviews' ? 'border-[#0B3B2C] ring-2 ring-[#0B3B2C]/10 shadow-md' : 'border-stone-200/80 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Reviews</span>
              <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 flex items-center gap-1.5">
              <span>{reviews.length}</span>
              <span className="text-xs font-normal text-stone-500">({averageRating}★)</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Client Feedback</p>
          </div>

        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-stone-200/80 pb-px overflow-x-auto">
          {[
            { id: 'users', label: 'All Users Login Information', icon: Users, count: userLogins.length },
            { id: 'properties', label: 'All Uploaded Website Data', icon: Building2, count: properties.length },
            { id: 'bookings', label: 'All Viewing Bookings', icon: Calendar, count: allBookings.length },
            { id: 'inquiries', label: 'Direct Inquiries (krishnaagr047@gmail.com)', icon: Mail, count: inquiries.length },
            { id: 'reviews', label: 'Client Reviews & Ratings', icon: Star, count: reviews.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-[#0B3B2C] text-[#0B3B2C] bg-white rounded-t-2xl shadow-sm'
                    : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-white/50 rounded-t-2xl'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B3B2C]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#0B3B2C] text-white' : 'bg-stone-200 text-stone-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: USERS LOGIN INFORMATION */}
        {activeSubTab === 'users' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0B3B2C]" />
                  <span>All Users Login Information</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                  Tracks all unique login identities, Firebase UID tokens, provider sessions, and activity timestamps.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, or UID..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C]"
                  />
                </div>
                <button
                  onClick={refreshData}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
                  title="Refresh User Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">User & Identity</th>
                    <th className="py-3.5 px-4">User ID (UID)</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Role & Status</th>
                    <th className="py-3.5 px-4">First Login</th>
                    <th className="py-3.5 px-4">Last Active</th>
                    <th className="py-3.5 px-4 text-center">Properties</th>
                    <th className="py-3.5 px-4 text-center">Bookings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-400 text-xs">
                        No user login records match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isMasterAdmin = u.email === KRISHNA_ADMIN_EMAIL || u.role === 'admin';
                      return (
                        <tr key={u.uid} className={`hover:bg-stone-50/80 transition-colors ${isMasterAdmin ? 'bg-amber-50/30' : ''}`}>
                          
                          {/* Name & Photo */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayName)}&background=0B3B2C&color=fff`}
                                alt={u.displayName}
                                className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>{u.displayName}</span>
                                  {isMasterAdmin && (
                                    <span title="Master Admin" className="shrink-0">
                                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-stone-400 capitalize">
                                  Auth: {u.provider || 'Firebase Auth'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* UID with copy button */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-stone-700 bg-stone-100 px-2 py-1 rounded text-[11px] max-w-[120px] truncate" title={u.uid}>
                                {u.uid}
                              </span>
                              <button
                                onClick={() => copyToClipboard(u.uid, 'User ID')}
                                className="p-1 rounded hover:bg-stone-200 text-stone-500 transition-colors"
                                title="Copy UID"
                              >
                                {copiedId === u.uid ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 whitespace-nowrap font-medium text-stone-800">
                            {u.email}
                          </td>

                          {/* Role & Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isMasterAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
                                <Crown className="w-3 h-3 text-amber-600" />
                                Master Admin
                              </span>
                            ) : u.role === 'agent' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold text-[11px]">
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                Verified Agent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                                Client User
                              </span>
                            )}
                          </td>

                          {/* First Login */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-xs">
                            {u.firstLogin ? new Date(u.firstLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </td>

                          {/* Last Active */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-stone-500 text-xs">
                            {u.lastActive ? new Date(u.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>

                          {/* Properties */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-center font-bold text-stone-800">
                            {u.propertiesCount || 0}
                          </td>

                          {/* Bookings */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-center font-bold text-stone-800">
                            {u.bookingsCount || 0}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
              <span>Showing {filteredUsers.length} of {userLogins.length} recorded accounts</span>
              <button
                onClick={() => {
                  if (window.confirm('Reset local user login cache? (Master Admin and demo accounts will remain)')) {
                    clearLoginHistory();
                    refreshData();
                    showToast('User login history refreshed.');
                  }
                }}
                className="text-stone-400 hover:text-red-600 transition-colors"
              >
                Clear Cache
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: ALL UPLOADED WEBSITE DATA (PROPERTIES) */}
        {activeSubTab === 'properties' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0B3B2C]" />
                  <span>All Uploaded Website Data (Properties)</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                  Complete repository of all property listings uploaded to this website. You can toggle verification, feature listings, or delete records.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0B3B2C] hover:bg-[#07241B] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload New Property</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  placeholder="Search title, location, owner..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C]"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={propertyCategoryFilter}
                  onChange={(e) => setPropertyCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C] bg-white font-medium"
                >
                  <option value="All">All Types</option>
                  <option value="House">Houses & Villas</option>
                  <option value="Apartment">Apartments</option>
                  <option value="Plot">Plots & Land</option>
                </select>

                {/* Verification Status Filter */}
                <select
                  value={propertyVerificationFilter}
                  onChange={(e) => setPropertyVerificationFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C] bg-white font-medium"
                >
                  <option value="All">All Verifications</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Demo">Demo / Not Verified</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length === 0 ? (
                <div className="col-span-full py-16 text-center text-stone-400 text-xs sm:text-sm">
                  No uploaded properties found matching the selected filters.
                </div>
              ) : (
                filteredProperties.map((prop) => {
                  const isVerified = prop.isVerified;
                  const isFeatured = prop.featured;

                  return (
                    <div
                      key={prop.id}
                      className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      {/* Image Header */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                        <img
                          src={prop.imageUrl}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                            {prop.category}
                          </span>
                          
                          {/* Verification Badge with Click-to-Toggle */}
                          <button
                            onClick={() => {
                              togglePropertyVerification(prop.id);
                              showToast(`Updated verification for "${prop.title}"`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 ${
                              isVerified
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-amber-500 text-stone-950 hover:bg-amber-600'
                            }`}
                            title="Click to toggle verification status"
                          >
                            {isVerified ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                <span>Not Verified / Demo</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Featured Star Toggle */}
                        <button
                          onClick={() => {
                            togglePropertyFeatured(prop.id);
                            showToast(`Toggled featured status for "${prop.title}"`);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                            isFeatured
                              ? 'bg-amber-400 text-stone-950 shadow-md scale-105'
                              : 'bg-black/40 text-white/70 hover:text-white'
                          }`}
                          title={isFeatured ? 'Featured listing (Click to unfeature)' : 'Click to feature'}
                        >
                          <Star className={`w-4 h-4 ${isFeatured ? 'fill-stone-950' : ''}`} />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md text-white font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                          ${prop.price.toLocaleString()}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-1">
                            <span className="truncate max-w-[150px]">{prop.id}</span>
                            <span className="text-stone-500 font-sans">{prop.status}</span>
                          </div>
                          
                          <h3 className="font-heading font-extrabold text-base text-stone-900 line-clamp-1">
                            {prop.title}
                          </h3>
                          
                          <p className="text-stone-500 text-xs flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>{prop.location}</span>
                          </p>
                        </div>

                        {/* Upload Owner Info */}
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Uploaded By:</span>
                            <span className="font-bold text-stone-800">{prop.ownerName || 'Verified Agency Agent'}</span>
                          </div>
                          {prop.ownerEmail && (
                            <div className="flex items-center justify-between text-[10px] text-stone-500">
                              <span className="text-stone-400">Owner Email:</span>
                              <span className="truncate max-w-[150px]">{prop.ownerEmail}</span>
                            </div>
                          )}
                        </div>

                        {/* Card Controls */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                          <button
                            onClick={() => {
                              setSelectedProperty(prop);
                              setIsDetailsOpen(true);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingProperty(prop);
                              setIsAddModalOpen(true);
                            }}
                            className="flex-1 py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${prop.title}" from the platform?`)) {
                                adminDeleteProperty(prop.id);
                                showToast(`Deleted "${prop.title}".`);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ALL VIEWING BOOKINGS */}
        {activeSubTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0B3B2C]" />
                  <span>All Viewing Bookings</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                  Schedule of all private architectural viewings and property walkthroughs submitted by clients.
                </p>
              </div>

              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search client, property, date..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C]"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">Property</th>
                    <th className="py-3.5 px-4">Client Name & Contact</th>
                    <th className="py-3.5 px-4">Scheduled Date & Slot</th>
                    <th className="py-3.5 px-4">Special Requests</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400 text-xs">
                        No viewing appointments recorded.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                        
                        {/* Property */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {b.propertyImage && (
                              <img
                                src={b.propertyImage}
                                alt={b.propertyTitle}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <div className="font-bold text-stone-900 max-w-[200px] truncate">{b.propertyTitle}</div>
                              <span className="text-[11px] text-stone-400 truncate block">{b.propertyLocation}</span>
                            </div>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-stone-900">{b.userName}</div>
                          <div className="text-[11px] text-stone-500">{b.userEmail}</div>
                          {b.userPhone && (
                            <div className="text-[11px] text-stone-400">{b.userPhone}</div>
                          )}
                        </td>

                        {/* Date & Slot */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-stone-800">{b.date}</div>
                          <div className="text-[11px] text-stone-500">{b.timeSlot}</div>
                        </td>

                        {/* Notes */}
                        <td className="py-3.5 px-4 max-w-xs text-xs text-stone-600 truncate">
                          {b.notes || 'No special notes'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1">
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => {
                                adminUpdateBookingStatus(b.id, 'confirmed');
                                showToast('Marked booking as confirmed.');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                            >
                              Confirm
                            </button>
                          )}

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                adminUpdateBookingStatus(b.id, 'cancelled');
                                showToast('Marked booking as cancelled.');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 font-semibold text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 4: DIRECT INQUIRIES (krishnaagr047@gmail.com) */}
        {activeSubTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#0B3B2C]" />
                  <span>Direct Inquiries (krishnaagr047@gmail.com)</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                  Messages submitted by prospective buyers and investors to Krishna’s official contact inbox.
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0B3B2C] text-xs font-bold">
                {inquiries.length} Inquiries Logged
              </div>
            </div>

            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs sm:text-sm">
                  No inquiries received yet. Visitors can submit messages via the Contact section.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 sm:p-6 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                      <div>
                        <span className="font-extrabold text-stone-900 text-sm sm:text-base mr-2">
                          {inq.name}
                        </span>
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-xs font-semibold text-[#0B3B2C] hover:underline"
                        >
                          {inq.email}
                        </a>
                        {inq.phone && (
                          <span className="text-xs text-stone-500 ml-2">
                            • {inq.phone}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-stone-800 uppercase tracking-wide mb-1">
                        Subject: {inq.subject}
                      </div>
                      <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                        {inq.message}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <a
                        href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.subject}`)}`}
                        className="px-4 py-2 rounded-xl bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-colors text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 5: CLIENT REVIEWS */}
        {activeSubTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>Client Reviews & Ratings</span>
                </h2>
                <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
                  Verified reviews and testimonials posted on uploaded properties.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{averageRating} Average Rating across {reviews.length} reviews</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => {
                const targetProp = properties.find((p) => p.id === rev.propertyId);
                return (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-stone-900 text-sm">{rev.userName}</div>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {targetProp && (
                        <div className="text-[11px] font-semibold text-[#0B3B2C] mb-2 truncate">
                          Property: {targetProp.title}
                        </div>
                      )}

                      <p className="text-stone-700 text-xs leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 text-[11px] text-stone-400">
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this review?')) {
                            deleteReview(rev.id);
                            showToast('Review deleted.');
                          }
                        }}
                        className="text-stone-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
