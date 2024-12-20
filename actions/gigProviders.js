"use server";

import { db } from "@/lib/prisma";

export async function getAllGigProviders() {
  try {
    const gigProviders = await db.gigProvider.findMany({
      include: {
        user: true,
      },
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
