import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Printer,
  Check,
  X,
  Search,
  ExternalLink,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Mail,
  Crown
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth, KRISHNA_ADMIN_EMAIL } from '../context/AuthContext';
import { Property } from '../types';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProperty?: Property | null;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialProperty
}) => {
  const { properties, allBookings, reviews } = useProperty();
  const { user } = useAuth();

  const [reportType, setReportType] = useState<string>('market-valuation');
  const [targetLocation, setTargetLocation] = useState<string>(
    initialProperty?.location || 'Bharatpur, Rajasthan, 321001'
  );
  const [selectedPropId, setSelectedPropId] = useState<string>(
    initialProperty?.id || 'all'
  );
  const [investorProfile, setInvestorProfile] = useState<string>('balanced');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedReport(null);
    setSources([]);

    setGenerationStep('Analyzing request & preparing Gemini 3.5 Flash context...');

    try {
      setTimeout(() => {
        setGenerationStep('Grounding with real-time Google Search data...');
      }, 900);

      const targetProp = properties.find((p) => p.id === selectedPropId);

      const platformStats = {
        totalProperties: properties.length,
        totalBookings: allBookings.length,
        totalReviews: reviews.length,
        activeAdmin: KRISHNA_ADMIN_EMAIL,
        agencyHeadquarters: '568 narayan circle, bharatpur, Rajasthan, 321001',
        contactEmail: 'krishnaagr047@gmail.com',
        developedBy: 'Developed by Krishna'
      };

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType:
            reportType === 'market-valuation'
              ? 'Comprehensive Real Estate Market Valuation & Price Benchmark Report'
              : reportType === 'portfolio-executive'
              ? 'Agency Portfolio Executive Performance & Asset Management Report'
              : reportType === 'investment-roi'
              ? 'High-Yield Property Investment Feasibility & Rental ROI Study'
              : 'Real Estate Due-Diligence & Structural Inspection Audit',
          targetLocation,
          propertyDetails: targetProp
            ? {
                title: targetProp.title,
                price: targetProp.price,
                category: targetProp.category,
                location: targetProp.location,
                beds: targetProp.beds,
                baths: targetProp.baths,
                sqft: targetProp.sqft,
                status: targetProp.status,
                isVerified: targetProp.isVerified
              }
            : null,
          platformStats,
          customInstructions: `${customInstructions} Investor profile: ${investorProfile}.`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report from Gemini server');
      }

      setGeneratedReport(data.reportMarkdown);
      setSources(data.sources || []);
    } catch (err: any) {
      console.error('Error generating report:', err);
      setErrorMessage(
        err.message || 'An error occurred while compiling the report. Please try again.'
      );
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopy = () => {
    if (!generatedReport) return;
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EEstates_Report_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#07241B] via-[#0B3B2C] to-[#124b39] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-heading font-extrabold tracking-tight">
                  EEstates Intelligence Report Studio
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Gemini 3.5 & Google Search Grounding
                </span>
              </div>
              <p className="text-stone-300 text-xs mt-0.5">
                Generate in-depth real estate valuation, market trend, and asset reports grounded in real-time web intelligence.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Configuration Form */}
          {!generatedReport && (
            <div className="space-y-5">
              
              {/* Report Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'market-valuation',
                      title: 'Market Valuation & Trend Benchmark',
                      desc: 'Current price/sqft, appreciation forecasts, and micro-market dynamics.',
                      icon: TrendingUp
                    },
                    {
                      id: 'portfolio-executive',
                      title: 'Agency Portfolio Executive Summary',
                      desc: 'Overall platform performance, listing health, and asset distribution.',
                      icon: Crown
                    },
                    {
                      id: 'investment-roi',
                      title: 'Investment Feasibility & Rental Yield',
                      desc: 'Cap rates, payback horizon, cashflow simulation, and tenancy profiles.',
                      icon: Building2
                    },
                    {
                      id: 'due-diligence',
                      title: 'Due Diligence & Risk Assessment',
                      desc: 'Zoning checks, infrastructure risks, legal encumbrance checklist.',
                      icon: ShieldCheck
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = reportType === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setReportType(item.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#0B3B2C] bg-[#F0F5F2] ring-2 ring-[#0B3B2C]/20 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isSelected
                                ? 'bg-[#0B3B2C] text-white'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-stone-900">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location & Property Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Target Geographic Location / Micro-Market
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={targetLocation}
                      onChange={(e) => setTargetLocation(e.target.value)}
                      placeholder="e.g. Bharatpur, Rajasthan, 321001"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C]"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Google Search grounding queries will prioritize this region.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                    Specific Property Focus (Optional)
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={(e) => setSelectedPropId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C] bg-white font-medium"
                  >
                    <option value="all">Entire EEstates Agency Catalog (All Properties)</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (${p.price.toLocaleString()} • {p.category})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Provides exact listing specifications to Gemini.
                  </span>
                </div>
              </div>

              {/* Investor Profile */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Investor Profile / Risk Appetite
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'conservative', label: 'Conservative (Capital Preservation)' },
                    { id: 'balanced', label: 'Balanced (Steady Rental + Growth)' },
                    { id: 'aggressive', label: 'High-Growth (Aggressive ROI)' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setInvestorProfile(p.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        investorProfile === p.id
                          ? 'border-[#0B3B2C] bg-[#0B3B2C] text-white shadow-sm'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Additional Research Directives (Optional)
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Include nearby expressway developments, school infrastructure, and water/electricity zoning..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm outline-none focus:border-[#0B3B2C]"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0B3B2C] hover:bg-[#07241B] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0B3B2C]/20 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{generationStep || 'Compiling Report with Gemini 3.5...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Executive Real Estate Report</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* Generated Report Viewer */}
          {generatedReport && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Report Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3B2C] block">
                    Intelligence Report Ready
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-stone-900">
                    {reportType === 'market-valuation'
                      ? 'Real Estate Market Valuation & Price Benchmark'
                      : reportType === 'portfolio-executive'
                      ? 'Agency Portfolio Executive Performance Report'
                      : reportType === 'investment-roi'
                      ? 'Investment Feasibility & Rental Yield Study'
                      : 'Due Diligence & Structural Audit'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Location: {targetLocation} • Prepared by EEstates Intelligence
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={handleCopy}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print / PDF</span>
                  </button>

                  <button
                    onClick={() => setGeneratedReport(null)}
                    className="px-3 py-2 rounded-xl bg-[#0B3B2C] text-white hover:bg-[#07241B] text-xs font-bold transition-colors"
                  >
                    New Report
                  </button>
                </div>
              </div>

              {/* Grounding Sources (Google Search) */}
              {sources.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-amber-900">
                    <Search className="w-3.5 h-3.5 text-amber-700" />
                    <span>Real-Time Google Search Grounding Sources ({sources.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-amber-200 text-stone-800 text-[11px] font-medium hover:bg-amber-100 hover:border-amber-300 transition-colors shadow-2xs"
                      >
                        <span className="truncate max-w-[220px]">{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Markdown Content Display */}
              <div className="prose prose-stone max-w-none p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans shadow-inner">
                {generatedReport}
              </div>

              {/* Formal Signature Stamp */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-extrabold text-[#0B3B2C] block">
                    EEstates Agency Intelligence Report
                  </span>
                  <span className="text-stone-600">
                    Headquarters: 568 narayan circle, bharatpur, Rajasthan, 321001 • Contact: krishnaagr047@gmail.com
                  </span>
                </div>
                <div className="text-emerald-800 font-bold shrink-0">
                  Developed by Krishna
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
