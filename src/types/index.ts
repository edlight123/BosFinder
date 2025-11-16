/**
 * Type definitions for BòsFinder app
 */

// User roles
export type UserRole = 'client' | 'bos';

// Job request status
export type JobRequestStatus = 'open' | 'in_contact' | 'closed';

// User interface
export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  phoneNumber: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Bòs Profile interface
export interface BosProfile {
  id: string;
  userId: string;
  displayName: string;
  categories: string[]; // e.g., ["electrician", "plumber"]
  description: string;
  commune: string;
  city: string;
  ratingAverage: number; // 0-5
  ratingCount: number;
  priceRangeMin: number; // in HTG (Haitian Gourde)
  priceRangeMax: number;
  yearsOfExperience: number;
  whatsappNumber?: string;
  leadCredits: number; // Credits to unlock client contacts
  isVerified: boolean;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job Request interface
export interface JobRequest {
  id: string;
  clientId: string;
  clientName?: string; // Denormalized for easier display
  clientPhone?: string; // Only visible to Bòs who unlocked
  title: string;
  description: string;
  category: string;
  commune: string;
  city: string;
  preferredDate?: Date;
  status: JobRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Lead interface - tracks which Bòs have unlocked which job requests
export interface Lead {
  id: string;
  jobRequestId: string;
  bosId: string;
  hasUnlockedContact: boolean;
  unlockedAt?: Date;
  createdAt: Date;
}

// Review interface (for future implementation)
export interface Review {
  id: string;
  jobRequestId: string;
  bosId: string;
  clientId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

// Common categories (can be extended)
export const CATEGORIES = [
  'Plumber',
  'Electrician',
  'Mason',
  'Carpenter',
  'Painter',
  'Mechanic',
  'AC Technician',
  'Gardener',
  'Cleaner',
  'Other',
] as const;

// Common communes in Haiti (Port-au-Prince area, can be extended)
export const COMMUNES = [
  'Port-au-Prince',
  'Pétion-Ville',
  'Delmas',
  'Carrefour',
  'Croix-des-Bouquets',
  'Kenscoff',
  'Tabarre',
  'Cité Soleil',
  'Other',
] as const;
