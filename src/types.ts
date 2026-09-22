export type PropertyCategory = 'House' | 'Apartment' | 'Plot';
export type PropertyStatus = 'For Sale' | 'For Rent';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: 'total' | 'month';
  location: string;
  category: PropertyCategory;
  status: PropertyStatus;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  gallery?: string[];
  amenities?: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  featured: boolean;
  isDemo?: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyImage?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  createdAt: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface UserLoginRecord {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'demo' | 'admin';
  firstLogin: string;
  lastActive: string;
  role: 'admin' | 'agent' | 'user';
  propertiesCount?: number;
  bookingsCount?: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface FilterState {
  category: 'All' | PropertyCategory;
  status: 'All' | PropertyStatus;
  location: string;
  priceRange: string;
  searchQuery: string;
  minBeds: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'sqft';
}
