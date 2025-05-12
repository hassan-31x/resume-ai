"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { cascadeDeleteUser } from "@/lib/mongodb-utils"

/**
 * Action to delete a user and all related records
 * Uses manual cascade delete for MongoDB
 */
export const deleteUser = async () => {
  try {
    const session = await auth()
    const userId = session?.user?.id
    
    if (!userId) {
      return { error: "Unauthorized" }
    }
    
    // Use the cascade delete utility that handles MongoDB's lack of onDelete: Cascade
    const success = await cascadeDeleteUser(userId)
    
    if (!success) {
      return { error: "Failed to delete user" }
    }
    
    return { success: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { error: "Something went wrong" }
  }
} 