import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/db/index'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import Discord from 'next-auth/providers/discord'
import { ROLES } from '@/types/role'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      try {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .then((res) => res[0])

        if (dbUser) {
          session.user.id = dbUser.id
          if (dbUser.email) session.user.email = dbUser.email
          if (dbUser.name) session.user.name = dbUser.name
          if (dbUser.image) session.user.image = dbUser.image

          session.user.role = dbUser.role ?? ROLES.USER
        } else {
          console.error('User not found in database')
        }
      } catch (error) {
        console.error('Error fetching user from database:', error)
      }

      return session
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
