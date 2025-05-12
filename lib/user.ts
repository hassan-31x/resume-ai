import { auth } from "@/auth";
import { db } from "./db";

/**
 * Get the current authenticated user from the session
 */
export const getCurrentUser = async () => {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}; 