"use server";

import { db } from "@/lib/prisma";

export async function getAllBands() {
  try {
    const bands = await db.band.findMany({
      include: {
        user: true,
      },
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
