import React from 'react';
import { X, ShieldCheck, User, Sparkles, AlertCircle, Crown, Lock } from 'lucide-react';
import { useAuth, KRISHNA_ADMIN_EMAIL } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInDemoUser, signInKrishnaAdmin, authError, clearError } = useAuth();

  if (!isOpen) return null;

  const handleGoogleClick = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleDemoClick = async () => {
    await signInDemoUser();
    onClose();
  };

  const handleKrishnaAdminClick = async () => {
    await signInKrishnaAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-stone-100 my-auto text-center"
      >
        <button
          onClick={() => {
            clearError();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#0B3B2C] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0B3B2C]/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </div>

        <h2 className="font-heading font-extrabold text-2xl text-stone-900 tracking-tight">
          Welcome to EEstates
        </h2>
        
        <p className="text-stone-500 text-xs sm:text-sm mt-1 mb-6 leading-relaxed">
          Sign in to list properties, schedule exclusive private viewings, or access the Master Admin Dashboard.
        </p>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>{authError}</div>
          </div>
        )}

        <div className="space-y-3">
          {/* Master Admin Sign In */}
          <button
            id="krishna-admin-sign-in-btn"
            onClick={handleKrishnaAdminClick}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 transition-all font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md shadow-amber-500/20 border border-amber-400"
          >
            <Crown className="w-4 h-4 text-stone-950" />
            <div className="text-left">
              <span className="block leading-tight font-extrabold">Instant Master Admin (Krishna)</span>
              <span className="block text-[10px] font-normal text-stone-900/80">{KRISHNA_ADMIN_EMAIL}</span>
            </div>
          </button>

          {/* Real Google Sign In via Firebase */}
          <button
            id="google-sign-in-btn"
            onClick={handleGoogleClick}
            className="w-full py-3.5 px-4 rounded-2xl border border-stone-200 hover:border-[#0B3B2C] hover:bg-stone-50 transition-all font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Demo Sign In Button for Agent */}
          <button
            id="demo-sign-in-btn"
            onClick={handleDemoClick}
            className="w-full py-3 px-4 rounded-2xl bg-[#0B3B2C] hover:bg-[#07241B] text-white transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Instant Demo Agent (Alex Morgan)</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-[#0B3B2C]" />
          <span>Secured by Google Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
};
