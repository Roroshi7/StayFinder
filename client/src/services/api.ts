import axios from 'axios';
import { ApiResponse, AuthResponse, Booking, Listing, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },
  updateProfile: async (profileData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', profileData);
    return response.data;
  },
  becomeHost: async () => {
    const response = await api.post<ApiResponse<User>>('/auth/become-host');
    return response.data;
  },
};

// Listings API
export const listings = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Listing[]>>('/listings');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Listing>>(`/listings/${id}`);
    return response.data;
  },
  create: async (listingData: Partial<Listing>) => {
    const response = await api.post<ApiResponse<Listing>>('/listings', listingData);
    return response.data;
  },
  update: async (id: string, listingData: Partial<Listing>) => {
    const response = await api.put<ApiResponse<Listing>>(`/listings/${id}`, listingData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{}>>(`/listings/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookings = {
  create: async (bookingData: {
    listing: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<{}>>(`/bookings/${id}`);
    return response.data;
  },
  getHostBookings: async () => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings/host');
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.put<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return response.data;
  },
}; 