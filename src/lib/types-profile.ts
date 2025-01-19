import { Band, GigProvider } from "@prisma/client";

// Base profile with common fields
export interface BaseProfile {
  name: string;
  imageUrl: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  headerImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

// Band profile type with audioTracks as a JSON array
export interface BandProfile extends BaseProfile {
  profileType: "band";
  genre: string;
  services?: undefined;
<<<<<<< HEAD
  bandMembers?: string[]; // New field
  audioTracks?: string[];
=======
  bandMembers?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
  videoUrl?: string;
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
}

// Gig provider profile type with audioTracks as a JSON array
export interface GigProviderProfile extends BaseProfile {
  profileType: "gigProvider";
  services: string;
  genre?: undefined;
  videoUrl?: undefined;
  photos?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
}

// Unified profile type for either band or gig provider
export type Profile = BandProfile | GigProviderProfile;

// Profile response type returned from the backend
export interface ProfileResponse {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  website?: string;
  genre?: string;
  services?: string;
  videoUrl?: string;
  email?: string;
  phoneNumber?: string;
  headerImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bandMembers?: string[];
  photos?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
<<<<<<< HEAD
  audioTracks?: string[];
=======
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
}

// Form data used to create or update a profile
export interface ProfileFormData {
  name: string;
  imageUrl: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  website?: string;
  genre?: string;
  services?: string;
  videoUrl?: string;
<<<<<<< HEAD
  email?: string; // New field
  phoneNumber?: string; // New field
  headerImage?: string; // Add this line
  facebookUrl?: string; // New field
  instagramUrl?: string; // New field
  bandMembers?: string[]; // New field
  photos?: string[]; // Add this line only
  audioTracks?: string[];
=======
  email?: string;
  phoneNumber?: string;
  headerImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bandMembers?: string[];
  photos?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
>>>>>>> 0ab92bd7a3fc458774f0936e030608437230ab59
}

// Shared profile data structure
export interface SharedProfileData {
  id: string;
  userId: string;
  sharedBy: string;
  profileType: string;
  shareDate: Date;
  shareMessage?: string;
  user: {
    name: string;
    imageUrl: string;
    band?: Band | null;
    gigProvider?: GigProvider | null;
  };
}

// Data used when sharing a profile
export interface ShareProfileFormData {
  userId: string;
  profileType: string;
  shareMessage?: string;
}
