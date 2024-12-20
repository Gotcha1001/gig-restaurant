import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Check if the email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (existingUserByEmail) {
      console.warn(
        `User with email ${user.emailAddresses[0].emailAddress} already exists.`
      );
      return existingUserByEmail; // Return the existing user if found
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        profileType: "",
      },
    });

    return newUser;
  } catch (error) {
    if (error.code === "P2002") {
      console.error(
        "Unique constraint failed on the fields:",
        error.meta?.target
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};
