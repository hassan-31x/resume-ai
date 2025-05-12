import { db } from "@/lib/db"
import { isValidObjectId } from "@/lib/mongodb-utils"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email }
    })

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id: string) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return null;
    }
    
    const user = await db.user.findUnique({
      where: { id }
    })

    return user;
  } catch {
    return null;
  }
}