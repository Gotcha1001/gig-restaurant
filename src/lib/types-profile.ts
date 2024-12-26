export interface BaseProfile {
  name: string;
  imageUrl: string;
  location: string;
  description?: string;
  website?: string;
  email?: string; // New field
  phoneNumber?: string;
  headerImage?: string;
  facebookUrl?: string; // New field
  instagramUrl?: string; // New field
}

export interface BandProfile extends BaseProfile {
  profileType: "band";
  genre: string;
  videoUrl?: string;
  services?: undefined;
}

export interface GigProviderProfile extends BaseProfile {
  profileType: "gigProvider";
  services: string;
  genre?: undefined;
  videoUrl?: undefined;
}

export type Profile = BandProfile | GigProviderProfile;

export interface ProfileResponse {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  description?: string;
  website?: string;
  genre?: string;
  services?: string;
  videoUrl?: string;
  email?: string; // New field
  phoneNumber?: string; // New field
  headerImage?: string; // Add this line
  facebookUrl?: string; // New field
  instagramUrl?: string; // New field
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileFormData {
  name: string;
  imageUrl: string;
  location: string;
  description?: string;
  website?: string;
  genre?: string;
  services?: string;
  videoUrl?: string;
  email?: string; // New field
  phoneNumber?: string; // New field
  headerImage?: string; // Add this line
  facebookUrl?: string; // New field
  instagramUrl?: string; // New field
}
