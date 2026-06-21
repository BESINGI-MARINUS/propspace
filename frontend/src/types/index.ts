// Auth
export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Property
export type PropertyType = "Apartment" | "House" | "Studio";
export type ListingType = "rent" | "sale";

export interface PropertyOwner {
  _id: string;
  username: string;
  avatar: string;
  email?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: { city: string; country: string };
  propertyType: PropertyType;
  listingType: ListingType;
  images: string[];
  owner: PropertyOwner;
  createdAt: string;
  updatedAt: string;
}

// API payloads
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PropertyPayload {
  title: string;
  description: string;
  price: number;
  location: { city: string; country: string };
  propertyType: PropertyType;
  listingType: ListingType;
  images: string[];
}

export interface PropertyFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
}

// API responses
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PropertiesResponse {
  count: number;
  properties: Property[];
}

export interface PropertyResponse {
  property: Property;
}
