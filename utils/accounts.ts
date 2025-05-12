import { db } from "@/lib/db";
import { isValidObjectId } from "@/lib/mongodb-utils";

export const getAccountByUserId = async (userId: string) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!isValidObjectId(userId)) {
      return null;
    }

    const account = await db.account.findFirst({
      where: {
        userId,
      },
    });

    return account;
  } catch {
    return null;
  }
};
