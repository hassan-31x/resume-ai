import { db } from "@/lib/db"
import { isValidObjectId } from "@/lib/mongodb-utils"

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        // Validate if ID is a valid MongoDB ObjectId
        if (!isValidObjectId(userId)) {
            return null;
        }
        
        const getTwoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: { userId }
        })

        return getTwoFactorConfirmation
    } catch {
        return null
    }
}