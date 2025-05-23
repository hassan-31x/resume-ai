import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/auth.config"
import { db } from "@/lib/db"
import { getUserById } from "@/utils/user"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "./utils/two-factor-confirmation"
import { getAccountByUserId } from "./utils/accounts"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!)

      if (!existingUser?.emailVerified) return false

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        if (!twoFactorConfirmation) return false

        // delete two factor confirmation for next login after successful login
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        })
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (session.user) {
        session.user.name = token.name
        session.user.email = token.email!
        session.user.isOAuth = token.isOAuth as boolean
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      const existingAccount = await getAccountByUserId(existingUser.id)

      token.isOAuth = !!existingAccount
      token.name = existingUser.name
      token.email = existingUser.email // name & email are assigned so latest data is reflected on UI once it is updated for a user
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})