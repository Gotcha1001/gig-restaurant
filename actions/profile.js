"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createUserProfile({
  name,
  imageUrl,
  profileType,
  location,
  description,
  website,
  genre,
  services,
  videoUrl,
  email, // New field
  phoneNumber, // New field
  headerImage, // Add this
  facebookUrl, // New field
  instagramUrl, // New field
  bandMembers, // Add this
  photos, // Add this line only
}) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("User is not authenticated");
    }

    if (!name || !imageUrl || !profileType || !location) {
      throw new Error("Missing required fields");
    }

    // Upsert the user first
    const user = await db.user.upsert({
      where: { clerkUserId },
      update: {
        profileType,
        name,
        imageUrl,
      },
      create: {
        clerkUserId,
        email: "", // You'll need to get this from Clerk
        profileType,
        name,
        imageUrl,
      },
    });

    // Upsert the specific profile type
    let userProfile;
    if (profileType === "band") {
      userProfile = await db.band.upsert({
        where: { userId: user.id },
        update: {
          name,
          imageUrl,
          genre,
          location,
          description,
          website,
          videoUrl,
          email, // New field
          phoneNumber, // New field
          headerImage, // Add this
          facebookUrl, // New field
          instagramUrl, // New field
          bandMembers, // Add this
          photos, // Add this line only
        },
        create: {
          name,
          imageUrl,
          genre,
          location,
          description,
          website,
          videoUrl,
          email, // New field
          phoneNumber, // New field
          headerImage, // Add this
          facebookUrl, // New field
          instagramUrl, // New field
          bandMembers, // Add this
          photos, // Add this line only
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } else if (profileType === "gigProvider") {
      userProfile = await db.gigProvider.upsert({
        where: { userId: user.id },
        update: {
          name,
          imageUrl,
          services,
          location,
          description,
          website,
          email, // New field
          phoneNumber, // New field
          headerImage, // Add this
          facebookUrl, // New field
          instagramUrl, // New field
          photos, // Add this line only
        },
        create: {
          name,
          imageUrl,
          services,
          location,
          description,
          website,
          email, // New field
          phoneNumber, // New field
          headerImage, // Add this
          facebookUrl, // New field
          instagramUrl, // New field
          photos, // Add this line only
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } else {
      throw new Error("Invalid profile type");
    }

    return userProfile;
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("User is not authenticated");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
      include: {
        band: true,
        gigProvider: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return the complete profile data
    return {
      name: user.name || "",
      imageUrl: user.imageUrl || "",
      profileType: user.profileType,
      profile: user.band || user.gigProvider,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

//get all ids for both bands and gig providers
export async function getUserProfileById(userId) {
  if (!userId) {
    throw new Error("No user ID provided");
  }

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [{ id: userId }, { clerkUserId: userId }],
      },
      include: {
        band: true,
        gigProvider: true,
      },
    });

    if (!user) {
      throw new Error("User not found for ID " + userId);
    }

    return {
      name: user.name || "",
      imageUrl: user.imageUrl || "",
      profileType: user.profileType,
      profile: user.band || user.gigProvider || {},
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function getSharedProfiles() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    // Get the current user with their profile type
    const currentUser = await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        profileType: true,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Find shared profiles where:
    // 1. If current user is a band, show only gig provider profiles shared TO them
    // 2. If current user is a gig provider, show only band profiles shared TO them
    const sharedProfiles = await db.sharedProfile.findMany({
      where: {
        userId: {
          not: currentUser.id, // Don't show their own shared profiles
        },
        AND: [
          {
            // Only show profiles shared TO the current user
            user: {
              profileType:
                currentUser.profileType === "band" ? "gigProvider" : "band",
            },
          },
          {
            // Match the current user as the recipient
            sharedBy: currentUser.id,
          },
        ],
      },
      include: {
        user: {
          include: {
            band: true,
            gigProvider: true,
          },
        },
      },
      orderBy: {
        shareDate: "desc",
      },
    });

    return sharedProfiles;
  } catch (error) {
    console.error("Error fetching shared profiles:", error);
    throw error;
  }
}

export async function shareProfile(userId, profileType, shareMessage) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const currentUser = await db.user.findUnique({
      where: { clerkUserId },
      select: {
        id: true,
        profileType: true,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get the target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: {
        profileType: true,
      },
    });

    if (!targetUser) {
      throw new Error("Target user not found");
    }

    // Validate that we're sharing between different profile types
    if (currentUser.profileType === targetUser.profileType) {
      throw new Error("Cannot share profile to the same profile type");
    }

    // Create the shared profile record
    const sharedProfile = await db.sharedProfile.create({
      data: {
        userId: currentUser.id, // The profile being shared (current user's profile)
        sharedBy: userId, // The user it's being shared to (target user)
        profileType: currentUser.profileType,
        shareMessage,
      },
    });

    return sharedProfile;
  } catch (error) {
    console.error("Error sharing profile:", error);
    throw error;
  }
}

export async function deleteSharedProfile(profileId) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("Not authenticated");
    }

    // Get the current user
    const currentUser = await db.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Delete the shared profile, ensuring it belongs to the current user
    const deletedProfile = await db.sharedProfile.deleteMany({
      where: {
        AND: [
          { id: profileId },
          { sharedBy: currentUser.id }, // Only delete if current user is the recipient
        ],
      },
    });

    if (deletedProfile.count === 0) {
      throw new Error("Profile not found or unauthorized to delete");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting shared profile:", error);
    throw error;
  }
}

export async function getAllBands(searchQuery) {
  try {
    const bands = await db.band.findMany({
      where: searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { genre: { contains: searchQuery, mode: "insensitive" } },
              { location: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });
    return bands;
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw error;
  }
}

// actions/gigProviders.ts
export async function getAllGigProviders(searchQuery) {
  try {
    const gigProviders = await db.gigProvider.findMany({
      where: searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery, mode: "insensitive" } },
              { services: { contains: searchQuery, mode: "insensitive" } },
              { location: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });
    return gigProviders;
  } catch (error) {
    console.error("Error fetching gig providers:", error);
    throw error;
  }
}
