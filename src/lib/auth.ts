import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/index';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import Discord from 'next-auth/providers/discord';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: User;
  }
}

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
          .then((res) => res[0]);

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.email = dbUser.email ?? 'no-email@example.com';
          session.user.name = dbUser.name;
          session.user.image = dbUser.image;
          session.user.role = dbUser.role ?? 'User';
        }
      } catch (error) {
        console.error('Error fetching user from database:', error);
      }

      return session;
    },
  },
});
