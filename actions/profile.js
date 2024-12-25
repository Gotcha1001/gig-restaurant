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
