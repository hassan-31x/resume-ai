import { db } from "@/lib/db"

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findUnique({
      where: { token }
    })

    return resetPasswordToken
  } catch {
    return null;
  }
}

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findFirst({
      where: { email }
    })

    return resetPasswordToken
  } catch {
    return null;
  }
}