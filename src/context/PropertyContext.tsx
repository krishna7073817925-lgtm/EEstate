import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { Property, ViewingBooking, FilterState, PropertyCategory, PropertyStatus, PropertyReview } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { useAuth, KRISHNA_ADMIN_EMAIL } from './AuthContext';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  loadingProperties: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'featured'>) => Promise<string>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  
  // Bookings
  userBookings: ViewingBooking[];
  loadingBookings: boolean;
  bookViewing: (booking: Omit<ViewingBooking, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;

  // Reviews & Ratings
  reviews: PropertyReview[];
  getPropertyReviews: (propertyId: string) => PropertyReview[];
  getPropertyRatingStats: (propertyId: string) => { average: number; count: number };
  canUserReview: (propertyId: string) => { allowed: boolean; reason?: 'login_required' | 'must_book_or_own' };
  submitReview: (params: { propertyId: string; rating: number; comment: string }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  
  // Active Selected Property & Modals
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  isDetailsOpen: boolean;
  setIsDetailsOpen: (open: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  editingProperty: Property | null;
  setEditingProperty: (prop: Property | null) => void;
  activeTab: 'home' | 'properties' | 'about' | 'services' | 'blog' | 'my-listings' | 'my-bookings' | 'admin-dashboard';
  setActiveTab: (tab: 'home' | 'properties' | 'about' | 'services' | 'blog' | 'my-listings' | 'my-bookings' | 'admin-dashboard') => void;
  allBookings: ViewingBooking[];
  togglePropertyVerification: (propertyId: string) => Promise<void>;
  togglePropertyFeatured: (propertyId: string) => Promise<void>;
  adminDeleteProperty: (propertyId: string) => Promise<void>;
  adminUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => Promise<void>;
}

const initialFilterState: FilterState = {
  category: 'All',
  status: 'All',
  location: '',
  priceRange: 'All',
  searchQuery: '',
  minBeds: 0,
  sortBy: 'featured',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [userBookings, setUserBookings] = useState<ViewingBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [reviews, setReviews] = useState<PropertyReview[]>([]);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'properties' | 'about' | 'services' | 'blog' | 'my-listings' | 'my-bookings' | 'admin-dashboard'>('home');
  const [allBookings, setAllBookings] = useState<ViewingBooking[]>([]);

  const PUBLISHED_PROPERTIES_STORAGE_KEY = 'eestates_published_properties_v3';
  const LEGACY_DEMO_STORAGE_KEY = 'eestates_demo_published_properties_v2';

  const getInitialDemoProperties = (): Property[] => [
    {
      id: 'prop_demo_sample_1',
      title: 'Malibu Coastal Panorama Villa',
      description: 'An exclusive oceanfront sample residence published to demonstrate the listing, verification, and appointment pipeline.',
      price: 8950000,
      priceType: 'total',
      location: 'Malibu Coast, California',
      category: 'House',
      status: 'For Sale',
      beds: 5,
      baths: 6,
      sqft: 6800,
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: [
        'Infinity Oceanfront Pool',
        'Private Coastal Access Walkway',
        'Smart Home Automation',
        'Chef Gaggenau Kitchen',
        'Wine Tasting Cellar'
      ],
      ownerId: 'demo_user_alex_morgan',
      ownerName: 'Alex Morgan',
      ownerEmail: 'alex.morgan@eestates.com',
      featured: true,
      isDemo: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const getStoredPublishedProperties = (): Property[] => {
    try {
      const raw = localStorage.getItem(PUBLISHED_PROPERTIES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      const legacyRaw = localStorage.getItem(LEGACY_DEMO_STORAGE_KEY);
      if (legacyRaw) {
        const legacyList = JSON.parse(legacyRaw);
        localStorage.setItem(PUBLISHED_PROPERTIES_STORAGE_KEY, JSON.stringify(legacyList));
        return legacyList;
      }
      const initial = getInitialDemoProperties();
      localStorage.setItem(PUBLISHED_PROPERTIES_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return getInitialDemoProperties();
    }
  };

  const persistPublishedProperties = (list: Property[]) => {
    try {
      localStorage.setItem(PUBLISHED_PROPERTIES_STORAGE_KEY, JSON.stringify(list));
      localStorage.setItem(LEGACY_DEMO_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not persist published properties:', e);
    }
  };

  const mergeListsWithPublishedProperties = (serverProperties: Property[]): Property[] => {
    const locals = getStoredPublishedProperties();
    const serverIds = new Set(serverProperties.map((p) => p.id));
    const newLocals = locals.filter((d) => !serverIds.has(d.id));
    return [...newLocals, ...serverProperties];
  };

  // Real-time listener for properties collection
  useEffect(() => {
    const colRef = collection(db, 'properties');

    const unsubscribe = onSnapshot(
      colRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // If empty in Firestore, seed initial properties so the site looks gorgeous immediately
          try {
            for (let i = 0; i < INITIAL_PROPERTIES.length; i++) {
              const seedProp = INITIAL_PROPERTIES[i];
              const docId = `prop_${i + 1}`;
              await setDoc(doc(db, 'properties', docId), {
                ...seedProp,
                id: docId
              });
            }
          } catch (err) {
            console.warn('Initial seeding note:', err);
            // Fallback in memory if permissions wait
            const merged = mergeListsWithPublishedProperties(INITIAL_PROPERTIES.map((p, idx) => ({ ...p, id: `prop_${idx + 1}` })));
            setProperties(merged);
            setLoadingProperties(false);
            return;
          }
        } else {
          const list: Property[] = snapshot.docs.map((d) => {
            const data = d.data() as Omit<Property, 'id'>;
            const seedMatch = INITIAL_PROPERTIES.find(
              (ip) => ip.title?.toLowerCase() === data.title?.toLowerCase()
            );
            return {
              id: d.id,
              ...data,
              gallery: data.gallery && data.gallery.length > 0 
                ? data.gallery 
                : (seedMatch?.gallery || [data.imageUrl]),
              amenities: data.amenities && data.amenities.length > 0 
                ? data.amenities 
                : (seedMatch?.amenities || ['Premium Finishes', 'Central AC', 'Security System', 'Designer Kitchen'])
            };
          });
          const merged = mergeListsWithPublishedProperties(list);
          setProperties(merged);
          setLoadingProperties(false);
        }
      },
      (error) => {
        console.error('Error fetching properties:', error);
        // Fallback gracefully to memory properties if offline
        const merged = mergeListsWithPublishedProperties(INITIAL_PROPERTIES.map((p, idx) => ({ ...p, id: `prop_${idx + 1}` })));
        setProperties(merged);
        setLoadingProperties(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const DEMO_BOOKINGS_KEY = 'eestates_demo_bookings_v2';

  const getSeedDemoBookings = (): ViewingBooking[] => [
    {
      id: 'book_demo_1',
      propertyId: 'prop_1',
      propertyTitle: 'The Bel Air Horizon Estate',
      propertyLocation: 'Bel Air, Los Angeles, CA',
      propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      userId: 'demo_user_alex_morgan',
      userName: 'Alex Morgan',
      userEmail: 'alex.morgan@eestates.com',
      userPhone: '+1 (310) 555-0192',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '10:00 AM - 11:30 AM',
      notes: 'Private architectural walkthrough and structural inspection.',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    },
    {
      id: 'book_demo_2',
      propertyId: 'prop_2',
      propertyTitle: 'Skyline Residence at 432 Park',
      propertyLocation: 'Midtown Manhattan, New York, NY',
      propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      userId: 'demo_user_alex_morgan',
      userName: 'Alex Morgan',
      userEmail: 'alex.morgan@eestates.com',
      userPhone: '+1 (310) 555-0192',
      date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      timeSlot: '02:00 PM - 03:30 PM',
      notes: 'Private lift foyer and sunset lighting walkthrough.',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ];

  // Real-time listener for user bookings
  useEffect(() => {
    if (!user) {
      setUserBookings([]);
      setLoadingBookings(false);
      return;
    }

    // If demo user or unauthenticated with Firebase Auth, load from local storage
    if (user.isDemo || !auth.currentUser) {
      try {
        const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
        if (stored) {
          setUserBookings(JSON.parse(stored));
        } else {
          const seeds = getSeedDemoBookings();
          localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(seeds));
          setUserBookings(seeds);
        }
      } catch (err) {
        console.warn('Storage read error for demo bookings:', err);
        setUserBookings(getSeedDemoBookings());
      }
      setLoadingBookings(false);
      return;
    }

    setLoadingBookings(true);
    const bookingsCol = collection(db, 'bookings');
    const q = query(bookingsCol, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookingsList: ViewingBooking[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ViewingBooking, 'id'>)
        }));
        setUserBookings(bookingsList);
        setLoadingBookings(false);
      },
      (error) => {
        console.error('Error listening to bookings:', error);
        setLoadingBookings(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listener for all bookings for Master Admin Krishna
  useEffect(() => {
    const demoSeed = getSeedDemoBookings();
    let localDemo: ViewingBooking[] = [];
    try {
      const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
      localDemo = stored ? JSON.parse(stored) : demoSeed;
    } catch {
      localDemo = demoSeed;
    }

    try {
      const bookingsCol = collection(db, 'bookings');
      const unsubscribe = onSnapshot(
        bookingsCol,
        (snapshot) => {
          const fsList: ViewingBooking[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ViewingBooking, 'id'>)
          }));
          const fsIds = new Set(fsList.map((b) => b.id));
          const combined = [...fsList, ...localDemo.filter((b) => !fsIds.has(b.id))];
          setAllBookings(combined);
        },
        () => {
          setAllBookings(localDemo);
        }
      );
      return () => unsubscribe();
    } catch {
      setAllBookings(localDemo);
    }
  }, [user]);

  // Admin Toggle Property Verification
  const togglePropertyVerification = async (propertyId: string) => {
    const target = properties.find((p) => p.id === propertyId);
    if (!target) return;
    const newStatus = !target.isVerified;

    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, isVerified: newStatus, updatedAt: new Date().toISOString() } : p))
    );

    try {
      const list = getStoredPublishedProperties();
      const updated = list.map((p) =>
        p.id === propertyId ? { ...p, isVerified: newStatus, updatedAt: new Date().toISOString() } : p
      );
      persistPublishedProperties(updated);
    } catch (e) {
      console.warn('Local props update failed:', e);
    }

    try {
      if (db) {
        const docRef = doc(db, 'properties', propertyId);
        await updateDoc(docRef, { isVerified: newStatus, updatedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Firestore verification update fallback:', err);
    }
  };

  // Admin Toggle Property Featured
  const togglePropertyFeatured = async (propertyId: string) => {
    const target = properties.find((p) => p.id === propertyId);
    if (!target) return;
    const newFeatured = !target.featured;

    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, featured: newFeatured, updatedAt: new Date().toISOString() } : p))
    );

    try {
      const list = getStoredPublishedProperties();
      const updated = list.map((p) =>
        p.id === propertyId ? { ...p, featured: newFeatured, updatedAt: new Date().toISOString() } : p
      );
      persistPublishedProperties(updated);
    } catch (e) {
      console.warn('Local props featured update failed:', e);
    }

    try {
      if (db) {
        const docRef = doc(db, 'properties', propertyId);
        await updateDoc(docRef, { featured: newFeatured, updatedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Firestore featured update fallback:', err);
    }
  };

  // Admin Delete Any Property
  const adminDeleteProperty = async (propertyId: string) => {
    await deleteProperty(propertyId);
  };

  // Admin Update Any Booking Status
  const adminUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setAllBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
    setUserBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));

    try {
      const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
      if (stored) {
        const list: ViewingBooking[] = JSON.parse(stored);
        const updated = list.map((b) => (b.id === bookingId ? { ...b, status } : b));
        localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Demo booking status update error:', e);
    }

    try {
      if (db) {
        const docRef = doc(db, 'bookings', bookingId);
        await updateDoc(docRef, { status });
      }
    } catch (err) {
      console.warn('Firestore booking status update skipped:', err);
    }
  };

  // Initial seed reviews for rich demonstration
  const SEED_REVIEWS: PropertyReview[] = [
    {
      id: 'rev_seed_1',
      propertyId: 'prop_1',
      userId: 'user_david_m',
      userName: 'David Miller',
      rating: 5,
      comment: 'Attended a private viewing with agent Sarah last week. The oceanfront views and natural daylight in the main salon are truly remarkable.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'rev_seed_2',
      propertyId: 'prop_1',
      userId: 'user_elena_k',
      userName: 'Elena Rostova',
      rating: 5,
      comment: 'Impeccable architectural finishes. The outdoor infinity pool and private patio are in immaculate condition.',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'rev_seed_3',
      propertyId: 'prop_2',
      userId: 'user_marcus_b',
      userName: 'Marcus Bennett',
      rating: 5,
      comment: 'Toured the penthouse yesterday. The skyline vistas over Manhattan and the private lift foyer exceeded our highest expectations.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'rev_seed_4',
      propertyId: 'prop_3',
      userId: 'user_chloe_t',
      userName: 'Chloe Taylor',
      rating: 4,
      comment: 'We visited the plot with our architect. Solid soil conditions, clean title records, and ready utility connections.',
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
    }
  ];

  // Real-time listener for reviews collection
  useEffect(() => {
    const reviewsCol = collection(db, 'reviews');
    const unsubscribe = onSnapshot(
      reviewsCol,
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            for (const seedRev of SEED_REVIEWS) {
              await setDoc(doc(db, 'reviews', seedRev.id), seedRev);
            }
          } catch (err) {
            console.warn('Initial reviews seeding note:', err);
            setReviews(SEED_REVIEWS);
            return;
          }
        } else {
          const list: PropertyReview[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PropertyReview, 'id'>)
          }));
          setReviews(list);
        }
      },
      (error) => {
        console.warn('Reviews listener notice:', error);
        setReviews(SEED_REVIEWS);
      }
    );

    return () => unsubscribe();
  }, []);

  // Check review eligibility: user must have listed or booked the property
  const canUserReview = (propertyId: string): { allowed: boolean; reason?: 'login_required' | 'must_book_or_own' } => {
    if (!user) {
      return { allowed: false, reason: 'login_required' };
    }
    const prop = properties.find((p) => p.id === propertyId);
    const isOwner = prop && (prop.ownerId === user.uid || (user.email && prop.ownerEmail === user.email));
    const hasBooking = userBookings.some((b) => b.propertyId === propertyId);

    if (isOwner || hasBooking) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'must_book_or_own' };
  };

  const getPropertyReviews = (propertyId: string): PropertyReview[] => {
    return reviews
      .filter((r) => r.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getPropertyRatingStats = (propertyId: string): { average: number; count: number } => {
    const propReviews = reviews.filter((r) => r.propertyId === propertyId);
    if (propReviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = propReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    const avg = Number((sum / propReviews.length).toFixed(1));
    return { average: avg, count: propReviews.length };
  };

  const submitReview = async ({
    propertyId,
    rating,
    comment
  }: {
    propertyId: string;
    rating: number;
    comment: string;
  }): Promise<void> => {
    if (!user) throw new Error('You must be signed in to submit a review.');
    const eligibility = canUserReview(propertyId);
    if (!eligibility.allowed) {
      throw new Error('Only clients who have scheduled a viewing or listed this property can submit a review.');
    }

    const reviewId = `review_${propertyId}_${user.uid}`;
    const reviewData: PropertyReview = {
      id: reviewId,
      propertyId,
      userId: user.uid,
      userName: user.displayName || 'Verified Client',
      userPhoto: user.photoURL || undefined,
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'reviews', reviewId), reviewData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `reviews/${reviewId}`);
    }
  };

  const deleteReview = async (reviewId: string): Promise<void> => {
    if (!user) throw new Error('You must be signed in to delete a review.');
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  // Add new property
  const addProperty = async (
    data: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'featured' | 'isDemo' | 'isVerified'>
  ): Promise<string> => {
    if (!user) {
      throw new Error('You must be signed in to list a property. Please sign in as Krishna (Master Admin), Google, or Instant Demo.');
    }

    const isKrishnaAdmin = !!user.isAdmin || user.email?.toLowerCase() === KRISHNA_ADMIN_EMAIL.toLowerCase();
    const isDemo = !isKrishnaAdmin && (!!user.isDemo || user.uid.startsWith('demo_'));
    const newId = isDemo ? `prop_demo_${Date.now()}` : `prop_${Date.now()}`;

    const ownerName = isKrishnaAdmin
      ? (user.displayName || 'Krishna (Master Admin)')
      : (user.displayName || (isDemo ? 'Alex Morgan' : 'Property Host'));

    const ownerEmail = isKrishnaAdmin
      ? (user.email || KRISHNA_ADMIN_EMAIL)
      : (user.email || (isDemo ? 'alex.morgan@eestates.com' : ''));

    const newProperty: Property = {
      ...data,
      id: newId,
      ownerId: user.uid,
      ownerName,
      ownerEmail,
      featured: isKrishnaAdmin,
      isDemo: isDemo,
      isVerified: isKrishnaAdmin ? true : !isDemo, // Krishna is always verified; demo is not verified
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Always persist to local storage first so the listing is never lost
    const currentLocals = getStoredPublishedProperties();
    const updatedLocals = [newProperty, ...currentLocals.filter((p) => p.id !== newId)];
    persistPublishedProperties(updatedLocals);

    // 2. Immediately update state so it appears in the catalog, search, and "My Listings"
    setProperties((prev) => [newProperty, ...prev.filter((p) => p.id !== newId)]);

    // 3. Attempt Firestore cloud write
    try {
      if (db) {
        await setDoc(doc(db, 'properties', newId), newProperty);
      }
    } catch (error) {
      console.warn('Firestore property sync notice (saved locally in persistent storage):', error);
      // Saved locally in persistent storage so we do not block the user with a fatal publishing error
    }

    return newId;
  };

  // Update existing property
  const updateProperty = async (id: string, updates: Partial<Property>): Promise<void> => {
    if (!user) throw new Error('You must be logged in to update a property');

    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );

    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
    }

    // Update in local published storage
    const currentLocals = getStoredPublishedProperties();
    const updatedLocals = currentLocals.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    persistPublishedProperties(updatedLocals);

    try {
      if (db) {
        const docRef = doc(db, 'properties', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('Firestore update property notice:', error);
    }
  };

  // Delete property
  const deleteProperty = async (id: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to delete a property');

    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
      setIsDetailsOpen(false);
    }

    // Delete from local published storage
    const currentLocals = getStoredPublishedProperties();
    const updatedLocals = currentLocals.filter((p) => p.id !== id);
    persistPublishedProperties(updatedLocals);

    try {
      if (db) {
        await deleteDoc(doc(db, 'properties', id));
      }
    } catch (error) {
      console.warn('Firestore delete property notice:', error);
    }
  };

  // Book a viewing
  const bookViewing = async (
    booking: Omit<ViewingBooking, 'id' | 'createdAt' | 'status' | 'userId' | 'userName' | 'userEmail'>
  ): Promise<void> => {
    if (!user) throw new Error('You must be signed in to book a viewing.');
    const bookingId = `book_${Date.now()}`;
    const newBooking: ViewingBooking = {
      ...booking,
      id: bookingId,
      userId: user.uid,
      userName: user.displayName || 'Valued Client',
      userEmail: user.email || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Optimistically update local bookings list
    setUserBookings((prev) => [newBooking, ...prev]);

    if (user.isDemo || !auth.currentUser) {
      try {
        const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
        const currentList: ViewingBooking[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify([newBooking, ...currentList]));
      } catch (err) {
        console.warn('Error saving demo booking to storage:', err);
      }
      return;
    }

    try {
      await setDoc(doc(db, 'bookings', bookingId), newBooking);
    } catch (error) {
      console.warn('Firestore setDoc notice on bookViewing:', error);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to cancel a booking');

    // Optimistically update local state immediately so UI updates with zero latency
    setUserBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    if (user.isDemo || !auth.currentUser) {
      try {
        const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
        const currentList: ViewingBooking[] = stored ? JSON.parse(stored) : userBookings;
        const updated = currentList.map((b) =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        );
        localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error updating demo booking status in storage:', err);
      }
      return;
    }

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled'
      });
    } catch (error) {
      console.warn('Firestore update warning on cancelBooking:', error);
    }
  };

  // Delete / Remove booking
  const deleteBooking = async (bookingId: string): Promise<void> => {
    if (!user) throw new Error('You must be logged in to remove a booking');

    // Optimistically remove from state
    setUserBookings((prev) => prev.filter((b) => b.id !== bookingId));

    if (user.isDemo || !auth.currentUser) {
      try {
        const stored = localStorage.getItem(DEMO_BOOKINGS_KEY);
        const currentList: ViewingBooking[] = stored ? JSON.parse(stored) : userBookings;
        const updated = currentList.filter((b) => b.id !== bookingId);
        localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error removing demo booking from storage:', err);
      }
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (error) {
      console.warn('Firestore delete warning on deleteBooking:', error);
    }
  };

  // Filtered properties computation
  const filteredProperties = properties.filter((prop) => {
    // Category filter: House, Apartment, Plot
    if (filters.category !== 'All' && prop.category !== filters.category) {
      return false;
    }

    // Status filter: For Sale, For Rent
    if (filters.status !== 'All' && prop.status !== filters.status) {
      return false;
    }

    // Min beds filter
    if (filters.minBeds > 0 && prop.beds < filters.minBeds) {
      return false;
    }

    // Location query
    if (filters.location.trim()) {
      const locMatch = prop.location.toLowerCase().includes(filters.location.toLowerCase().trim());
      if (!locMatch) return false;
    }

    // Search query (title or description)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match = prop.title.toLowerCase().includes(q) || prop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Price range filter
    if (filters.priceRange !== 'All') {
      if (filters.priceRange === 'under-500k' && prop.price > 500000) return false;
      if (filters.priceRange === '500k-1m' && (prop.price < 500000 || prop.price > 1000000)) return false;
      if (filters.priceRange === '1m-2m' && (prop.price < 1000000 || prop.price > 2000000)) return false;
      if (filters.priceRange === 'over-2m' && prop.price < 2000000) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (filters.sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (filters.sortBy === 'rating') {
      const ratingA = getPropertyRatingStats(a.id).average;
      const ratingB = getPropertyRatingStats(b.id).average;
      return ratingB - ratingA;
    }
    if (filters.sortBy === 'sqft') {
      return (b.sqft || 0) - (a.sqft || 0);
    }
    // Default: 'featured' -> featured first, then newest
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
  });

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        loadingProperties,
        filters,
        setFilters,
        resetFilters,
        addProperty,
        updateProperty,
        deleteProperty,
        userBookings,
        loadingBookings,
        bookViewing,
        cancelBooking,
        deleteBooking,
        reviews,
        getPropertyReviews,
        getPropertyRatingStats,
        canUserReview,
        submitReview,
        deleteReview,
        selectedProperty,
        setSelectedProperty,
        isDetailsOpen,
        setIsDetailsOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        editingProperty,
        setEditingProperty,
        activeTab,
        setActiveTab,
        allBookings,
        togglePropertyVerification,
        togglePropertyFeatured,
        adminDeleteProperty,
        adminUpdateBookingStatus
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
