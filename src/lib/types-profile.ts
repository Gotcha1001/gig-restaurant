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
  bandMembers?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
  videoUrl?: string;
}

// Gig provider profile type with audioTracks as a JSON array
export interface GigProviderProfile extends BaseProfile {
  profileType: "gigProvider";
  services: string;
  genre?: undefined;
  videoUrl?: undefined;
<<<<<<< HEAD
  photos?: string[]; // Add this line
  audioTracks?: AudioTrack[];
=======
  photos?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
>>>>>>> 6de478af6a1c1ba029c6f6556a4df8a64f4cd7a3
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
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
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
  email?: string;
  phoneNumber?: string;
  headerImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bandMembers?: string[];
  photos?: string[];
  audioTracks?: { url: string; name: string }[]; // Adjusted to match the Prisma JSON format
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
<<<<<<< HEAD
=======

// Audio track data used for tracks in band and gig provider profiles
>>>>>>> 6de478af6a1c1ba029c6f6556a4df8a64f4cd7a3
export interface AudioTrack {
  name: string;
  url: string;
}
