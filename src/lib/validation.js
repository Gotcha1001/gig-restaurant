import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Band Name Required")
    .max(100, "Band Name Cannot Exceed 100 Characters"),
  genre: z
    .string()
    .min(1, "Band Genere Required")
    .max(100, "Band Genere Cannot Exceed 100 Characters"),
  location: z
    .string()
    .min(1, "Location Required")
    .max(100, "Location Cannot Exceed 100 Characters"),
  description: z
    .string()
    .max(500, "Description must be under 500 Characters")
    .optional(),
  website: z.string().url("Invalid URL format").optional(),
  videoUrl: z
    .string()
    .min(1, "VideoUrl Required")
    .max(100, "VideoUrl Cannot Exceed 100 Characters")
    .optional(),
  imageUrl: z
    .string()
    .min(1, "ImageUrl Required")
    .max(100, "ImageUrl Cannot Exceed 100 Characters")
    .optional(),
});

export const gigProviderSchema = z.object({
  name: z
    .string()
    .min(1, "Gig Provider Name is Required")
    .max(100, "Name Cannot Exceed 100 Characters"),
  services: z
    .string()
    .min(1, "Services Offered are Required")
    .max(500, "Services Cannot Exceed 500 Characters"),
  location: z
    .string()
    .min(1, "Location is Required")
    .max(100, "Location Cannot Exceed 100 Characters"),
  description: z
    .string()
    .max(500, "Description Cannot Exceed 500 Characters")
    .optional(),
  website: z.string().url("Invalid URL Format").optional(),
  imageUrl: z.string().url("Invalid URL Format").optional(),
});
