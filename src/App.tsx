/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider, useProperty } from './context/PropertyContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustBar } from './components/TrustBar';
import { FeaturedProperties } from './components/FeaturedProperties';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { CtaBanner } from './components/CtaBanner';
import { ContactSection } from './components/ContactSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookingModal } from './components/BookingModal';
import { AddPropertyModal } from './components/AddPropertyModal';
import { AuthModal } from './components/AuthModal';
import { MyListingsView } from './components/MyListingsView';
import { MyBookingsView } from './components/MyBookingsView';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { AiChatbot } from './components/AiChatbot';
import { Sparkles, FileText } from 'lucide-react';

function AppContent() {
  const { activeTab } = useProperty();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#1A1A1A] relative">
      {/* Navigation Header */}
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'admin-dashboard' ? (
          <AdminDashboard
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        ) : activeTab === 'my-listings' ? (
          <MyListingsView onOpenAuth={() => setIsAuthModalOpen(true)} />
        ) : activeTab === 'my-bookings' ? (
          <MyBookingsView onOpenAuth={() => setIsAuthModalOpen(true)} />
        ) : (
          <>
            <HeroSection />
            <TrustBar />
            <FeaturedProperties onOpenAuth={() => setIsAuthModalOpen(true)} />
            <AboutSection />
            <TestimonialsSection />
            <BlogSection />
            <CtaBanner 
              onContactClick={() => {
                document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
              }} 
            />
            <ContactSection />
          </>
        )}
      </main>

      {/* Deep Forest Green Footer */}
      <Footer />

      {/* Floating AI Chatbot & Report Trigger Button */}
      {!isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
          <button
            id="floating-make-report-btn"
            onClick={() => setIsReportModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-stone-900 border border-stone-200/90 shadow-lg hover:shadow-xl font-bold text-xs hover:border-[#0B3B2C] hover:scale-105 transition-all"
            title="Make Real Estate Market & Valuation Report"
          >
            <FileText className="w-4 h-4 text-[#0B3B2C]" />
            <span>Make Report</span>
          </button>
          
          <button
            id="floating-ai-chatbot-btn"
            onClick={() => setIsChatbotOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0B3B2C] hover:bg-[#07241B] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-xs font-bold ring-2 ring-emerald-500/20"
            title="Chat with EEstates AI Advisor"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI Advisor</span>
          </button>
        </div>
      )}

      {/* Modals & Popups */}
      <PropertyDetailsModal onOpenAuth={() => setIsAuthModalOpen(true)} />
      <BookingModal />
      <AddPropertyModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Report Studio & AI Chatbot */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      <AiChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AppContent />
      </PropertyProvider>
    </AuthProvider>
  );
}
