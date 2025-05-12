import { db } from "./db";

/**
 * Handles cascade deletion of user-related data in MongoDB
 * Since MongoDB with Prisma doesn't support onDelete: Cascade
 */
export const cascadeDeleteUser = async (userId: string) => {
  try {
    // Delete TwoFactorConfirmation
    await db.twoFactorConfirmation.deleteMany({
      where: { userId }
    });

    // Delete Accounts
    await db.account.deleteMany({
      where: { userId }
    });

    // Delete the User
    await db.user.delete({
      where: { id: userId }
    });

    return true;
  } catch (error) {
    console.error("Error during cascade delete user:", error);
    return false;
  }
};

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}; 