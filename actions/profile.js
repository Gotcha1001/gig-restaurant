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
}) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      throw new Error("User is not authenticated");
    }

    if (!name || !imageUrl || !profileType || !location) {
      throw new Error("Missing required fields");
    }

    // First, ensure the user exists in your database
    let user = await db.user.findUnique({
      where: { clerkUserId },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await db.user.create({
        data: {
          clerkUserId,
          email: "", // You'll need to get this from Clerk
          profileType,
          name,
          imageUrl,
        },
      });
    } else {
      // Update the profileType if the user exists
      user = await db.user.update({
        where: { clerkUserId },
        data: {
          profileType, // Ensure profileType is updated
        },
      });
    }

    // Create the specific profile type
    let userProfile;
    if (profileType === "band") {
      userProfile = await db.band.create({
        data: {
          name,
          imageUrl,
          genre,
          location,
          description,
          website,
          videoUrl,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } else if (profileType === "gigProvider") {
      userProfile = await db.gigProvider.create({
        data: {
          name,
          imageUrl,
          services,
          location,
          description,
          website,
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
    console.error("Error creating profile:", error);
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
