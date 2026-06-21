import { Document, Types } from "mongoose";
import { Request } from "express";

// User

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface SafeUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Property

export type PropertyType = "Apartment" | "House" | "Studio";
export type ListingType = "rent" | "sale";

export interface IProperty extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    country: string;
  };
  propertyType: PropertyType;
  listingType: ListingType;
  images: string[];
  owner: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

// Auth

export interface AuthResult {
  token: string;
  user: SafeUser;
}

// Request extensions
// Extend Express Request so req.user and req.property are typed everywhere

export interface AuthRequest extends Request {
  user: IUser;
}

export interface OwnerRequest extends AuthRequest {
  property: IProperty;
}

// Filter

export interface PropertyFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
}
