import React, { useState } from 'react';
import { Home, Search, Plus, User as UserIcon, LogOut, Calendar, List, Menu, X, Building2, Crown, Sparkles, FileText, Bot } from 'lucide-react';
import { useAuth, KRISHNA_ADMIN_EMAIL } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenReportModal?: () => void;
  onOpenChatbot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onOpenReportModal, onOpenChatbot }) => {
  const { user, logout, signInKrishnaAdmin } = useAuth();
  const { activeTab, setActiveTab, setIsAddModalOpen, setEditingProperty } = useProperty();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isKrishnaAdmin = user?.isAdmin || user?.email === KRISHNA_ADMIN_EMAIL;

  const handleAddPropertyClick = () => {
    if (!user) {
      onOpenAuth();
    } else {
      setEditingProperty(null);
      setIsAddModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            id="site-logo"
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0B3B2C] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#0B3B2C] block leading-none">
                EEstates
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 block mt-0.5">
                Agency
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {[
              { id: 'home', label: 'Home' },
              { id: 'properties', label: 'Properties' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'blog', label: 'Blog' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'about') {
                      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.id === 'services') {
                      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.id === 'blog') {
                      document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.id === 'contact') {
                      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-[#0B3B2C] font-semibold' 
                      : 'text-stone-600 hover:text-[#0B3B2C]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0B3B2C] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Master Admin Direct Nav Tab */}
            {isKrishnaAdmin && (
              <button
                id="nav-link-admin-dashboard"
                onClick={() => setActiveTab('admin-dashboard')}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400'
                    : 'bg-amber-100/90 text-amber-950 hover:bg-amber-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-stone-950" />
                <span>Krishna Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Properties Browse / Search */}
            <button
              id="header-search-btn"
              onClick={() => {
                setActiveTab('properties');
                document.getElementById('featured-listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Search Properties"
              className="p-2 rounded-full text-stone-600 hover:text-[#0B3B2C] hover:bg-stone-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Make Report Button */}
            {onOpenReportModal && (
              <button
                id="header-make-report-btn"
                onClick={onOpenReportModal}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-all shadow-xs"
                title="Make Real Estate Market & Valuation Report"
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>Make Report</span>
              </button>
            )}

            {/* Add Property Button */}
            <button
              id="header-add-property-btn"
              onClick={handleAddPropertyClick}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F0F5F2] text-[#0B3B2C] hover:bg-[#E3EDE8] transition-colors border border-[#0B3B2C]/10"
            >
              <Plus className="w-4 h-4" />
              <span>List Property</span>
            </button>

            {/* Auth Button or User Profile */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full border transition-all ${
                    isKrishnaAdmin 
                      ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/20' 
                      : 'border-stone-200 hover:border-[#0B3B2C] bg-stone-50/80'
                  }`}
                >
                  <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                    {isKrishnaAdmin ? 'Krishna (Admin)' : (user.displayName?.split(' ')[0] || 'My Account')}
                  </span>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0B3B2C]/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0B3B2C] text-white flex items-center justify-center font-bold text-xs">
                      {isKrishnaAdmin ? 'K' : (user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U')}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-stone-100 mb-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {user.displayName || 'Logged In'}
                          </p>
                          {isKrishnaAdmin && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {user.email || 'Verified Account'}
                        </p>
                      </div>

                      {/* Master Admin Dashboard Button */}
                      {isKrishnaAdmin && (
                        <button
                          id="user-menu-admin-dashboard"
                          onClick={() => {
                            setActiveTab('admin-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-left mb-1 border border-amber-200"
                        >
                          <Crown className="w-4 h-4 text-amber-600" />
                          <span>Master Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        id="user-menu-my-listings"
                        onClick={() => {
                          setActiveTab('my-listings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] rounded-xl transition-colors text-left"
                      >
                        <List className="w-4 h-4 text-[#0B3B2C]" />
                        <span>My Properties</span>
                      </button>

                      <button
                        id="user-menu-my-bookings"
                        onClick={() => {
                          setActiveTab('my-bookings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] rounded-xl transition-colors text-left"
                      >
                        <Calendar className="w-4 h-4 text-[#0B3B2C]" />
                        <span>Viewing Bookings</span>
                      </button>

                      <button
                        id="user-menu-add-listing"
                        onClick={() => {
                          setEditingProperty(null);
                          setIsAddModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] rounded-xl transition-colors text-left"
                      >
                        <Plus className="w-4 h-4 text-[#0B3B2C]" />
                        <span>Add New Listing</span>
                      </button>

                      {onOpenReportModal && (
                        <button
                          id="user-menu-make-report"
                          onClick={() => {
                            onOpenReportModal();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] rounded-xl transition-colors text-left"
                        >
                          <FileText className="w-4 h-4 text-[#0B3B2C]" />
                          <span>Make Real Estate Report</span>
                        </button>
                      )}

                      {onOpenChatbot && (
                        <button
                          id="user-menu-ai-advisor"
                          onClick={() => {
                            onOpenChatbot();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#F0F5F2] hover:text-[#0B3B2C] rounded-xl transition-colors text-left"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>EEstates AI Advisor</span>
                        </button>
                      )}

                      <div className="h-px bg-stone-100 my-1" />

                      <button
                        id="user-menu-logout"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-admin-login-quick"
                  onClick={async () => {
                    await signInKrishnaAdmin();
                    setActiveTab('admin-dashboard');
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-100 hover:bg-amber-200 text-stone-950 transition-all border border-amber-300"
                  title="Direct login as Krishna (Master Admin)"
                >
                  <Crown className="w-3.5 h-3.5 text-stone-900" />
                  <span>Krishna Login</span>
                </button>

                <button
                  id="header-sign-in-btn"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-all shadow-sm shadow-[#0B3B2C]/20"
                >
                  <span>Sign In</span>
                  <span className="text-sm">→</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200/80 space-y-2 animate-in slide-in-from-top duration-200">
            {isKrishnaAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2.5 text-sm font-extrabold rounded-xl bg-amber-500 text-stone-950 shadow-sm"
              >
                👑 Krishna Master Dashboard
              </button>
            )}

            {[
              { id: 'home', label: 'Home' },
              { id: 'properties', label: 'Properties' },
              { id: 'about', label: 'About Us' },
              { id: 'services', label: 'Services' },
              { id: 'blog', label: 'Blog & Articles' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                  if (item.id === 'contact') {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`block w-full text-left px-4 py-2 text-sm font-medium rounded-lg ${
                  activeTab === item.id ? 'bg-[#F0F5F2] text-[#0B3B2C] font-bold' : 'text-stone-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Make Report & AI Advisor in Mobile Nav */}
            <div className="pt-2 flex flex-col gap-1.5 border-t border-stone-200">
              {onOpenReportModal && (
                <button
                  onClick={() => {
                    onOpenReportModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl bg-[#0B3B2C] text-white shadow-xs"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Make Real Estate Report</span>
                </button>
              )}

              {onOpenChatbot && (
                <button
                  onClick={() => {
                    onOpenChatbot();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-semibold rounded-xl bg-stone-100 text-stone-800"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Ask AI Advisor</span>
                </button>
              )}
            </div>

            {user && (
              <>
                <div className="h-px bg-stone-200 my-2" />
                <button
                  onClick={() => {
                    setActiveTab('my-listings');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-stone-800"
                >
                  My Properties
                </button>
                <button
                  onClick={() => {
                    setActiveTab('my-bookings');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-stone-800"
                >
                  My Viewing Bookings
                </button>
                <button
                  onClick={() => {
                    setIsAddModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-bold text-[#0B3B2C]"
                >
                  + Add New Property
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
