import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { UserLoginRecord } from '../types';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isDemo?: boolean;
  isAdmin?: boolean;
}

export const KRISHNA_ADMIN_EMAIL = 'krishna7073817925@gmail.com';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemoUser: () => Promise<void>;
  signInKrishnaAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
  isDemoUser: boolean;
  isAdmin: boolean;
  getAllUserLogins: () => UserLoginRecord[];
  clearLoginHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: AppUser = {
  uid: 'demo_user_alex_morgan',
  displayName: 'Alex Morgan',
  email: 'alex.morgan@eestates.com',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  isDemo: true,
  isAdmin: false
};

const KRISHNA_ADMIN_USER: AppUser = {
  uid: 'krishna_admin_master_id',
  displayName: 'Krishna',
  email: KRISHNA_ADMIN_EMAIL,
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  isDemo: false,
  isAdmin: true
};

const DEMO_STORAGE_KEY = 'eestates_demo_user_active';
export const USER_LOGINS_STORAGE_KEY = 'eestates_user_logins_history_v2';

const INITIAL_USER_LOGINS = [
  {
    uid: 'krishna_admin_master_id',
    email: KRISHNA_ADMIN_EMAIL,
    displayName: 'Krishna (System Developer & Master Admin)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    provider: 'admin' as const,
    firstLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastActive: new Date().toISOString(),
    role: 'admin' as const,
    propertiesCount: 4,
    bookingsCount: 6
  },
  {
    uid: 'demo_user_alex_morgan',
    email: 'alex.morgan@eestates.com',
    displayName: 'Alex Morgan (Demo Agent)',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    provider: 'demo' as const,
    firstLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    role: 'agent' as const,
    propertiesCount: 1,
    bookingsCount: 2
  },
  {
    uid: 'usr_priya_sharma_982',
    email: 'priya.sharma@gmail.com',
    displayName: 'Priya Sharma',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    provider: 'google' as const,
    firstLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    role: 'user' as const,
    propertiesCount: 0,
    bookingsCount: 1
  },
  {
    uid: 'usr_michael_vance_412',
    email: 'm.vance@luxuryrealty.io',
    displayName: 'Michael Vance',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    provider: 'google' as const,
    firstLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    role: 'agent' as const,
    propertiesCount: 2,
    bookingsCount: 3
  }
];

export const recordUserLogin = (appUser: AppUser, providerType: 'google' | 'demo' | 'admin') => {
  try {
    const raw = localStorage.getItem(USER_LOGINS_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : INITIAL_USER_LOGINS;
    const nowIso = new Date().toISOString();
    const index = existing.findIndex((u: any) => u.uid === appUser.uid || u.email === appUser.email);
    const isAdminUser = appUser.email === KRISHNA_ADMIN_EMAIL || appUser.isAdmin;

    if (index >= 0) {
      existing[index] = {
        ...existing[index],
        displayName: appUser.displayName || existing[index].displayName,
        email: appUser.email || existing[index].email,
        photoURL: appUser.photoURL || existing[index].photoURL,
        lastActive: nowIso,
        role: isAdminUser ? 'admin' : existing[index].role
      };
    } else {
      existing.unshift({
        uid: appUser.uid,
        email: appUser.email || 'unknown@domain.com',
        displayName: appUser.displayName || 'Website User',
        photoURL: appUser.photoURL || '',
        provider: providerType,
        firstLogin: nowIso,
        lastActive: nowIso,
        role: isAdminUser ? 'admin' : 'user',
        propertiesCount: 0,
        bookingsCount: 0
      });
    }
    localStorage.setItem(USER_LOGINS_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Could not record user login:', e);
  }
};

export const getAllUserLogins = (): UserLoginRecord[] => {
  try {
    const raw = localStorage.getItem(USER_LOGINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USER_LOGINS;
  } catch {
    return INITIAL_USER_LOGINS;
  }
};

export const clearLoginHistory = () => {
  try {
    localStorage.setItem(USER_LOGINS_STORAGE_KEY, JSON.stringify(INITIAL_USER_LOGINS));
  } catch (e) {
    console.warn(e);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage read error
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const isAdmin = currentUser.email?.toLowerCase() === KRISHNA_ADMIN_EMAIL.toLowerCase();
        const authedUser: AppUser = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          isDemo: false,
          isAdmin
        };
        setUser(authedUser);
        recordUserLogin(authedUser, 'google');
        try {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        } catch {
          // ignore
        }
      } else {
        try {
          const stored = localStorage.getItem(DEMO_STORAGE_KEY);
          if (stored) {
            setUser(JSON.parse(stored));
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      try {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      } catch {
        // ignore
      }
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        const isAdmin = cred.user.email?.toLowerCase() === KRISHNA_ADMIN_EMAIL.toLowerCase();
        const authedUser: AppUser = {
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          email: cred.user.email,
          photoURL: cred.user.photoURL,
          isDemo: false,
          isAdmin
        };
        setUser(authedUser);
        recordUserLogin(authedUser, 'google');
      }
    } catch (error: any) {
      console.error('Google Sign In error:', error);
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was interrupted or blocked. You can use Instant Demo or Admin Sign In.');
      } else {
        setAuthError(error?.message || 'Failed to sign in with Google');
      }
    }
  };

  const signInDemoUser = async () => {
    try {
      setAuthError(null);
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(DEMO_USER));
      } catch {
        // ignore
      }
      setUser(DEMO_USER);
      recordUserLogin(DEMO_USER, 'demo');
    } catch (error: any) {
      console.error('Demo sign in error:', error);
      setAuthError('Could not initialize demo account.');
    }
  };

  const signInKrishnaAdmin = async () => {
    try {
      setAuthError(null);
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(KRISHNA_ADMIN_USER));
      } catch {
        // ignore
      }
      setUser(KRISHNA_ADMIN_USER);
      recordUserLogin(KRISHNA_ADMIN_USER, 'admin');
    } catch (error: any) {
      console.error('Krishna admin sign in error:', error);
      setAuthError('Could not initialize Krishna admin account.');
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      try {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      } catch {
        // ignore
      }
      setUser(null);
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      setUser(null);
    }
  };

  const clearError = () => setAuthError(null);

  const isDemoUser = !!user?.isDemo;
  const isAdmin = !!user?.isAdmin || user?.email?.toLowerCase() === KRISHNA_ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInDemoUser, 
      signInKrishnaAdmin,
      logout, 
      authError, 
      clearError, 
      isDemoUser,
      isAdmin,
      getAllUserLogins,
      clearLoginHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
