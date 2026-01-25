import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            wholesaleAccount: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          return null
        }

        // Return user data for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          wholesaleAccountId: user.wholesaleAccount?.id || null,
          wholesaleStatus: user.wholesaleAccount?.status || null,
          companyName: user.wholesaleAccount?.companyName || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.wholesaleAccountId = user.wholesaleAccountId
        token.wholesaleStatus = user.wholesaleStatus
        token.companyName = user.companyName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.wholesaleAccountId = token.wholesaleAccountId as string | null
        session.user.wholesaleStatus = token.wholesaleStatus as string | null
        session.user.companyName = token.companyName as string | null
      }
      return session
    },
  },
})

// Type augmentation for NextAuth
declare module "next-auth" {
  interface User {
    role: string
    wholesaleAccountId: string | null
    wholesaleStatus: string | null
    companyName: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: string
      wholesaleAccountId: string | null
      wholesaleStatus: string | null
      companyName: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    wholesaleAccountId: string | null
    wholesaleStatus: string | null
    companyName: string | null
  }
}
