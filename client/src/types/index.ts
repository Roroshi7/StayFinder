export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  // Optional profile fields
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  alternateEmail?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  images: string[];
  amenities: string[];
  host: User;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  guest: User;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  guests: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'host' | 'admin';
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
} 