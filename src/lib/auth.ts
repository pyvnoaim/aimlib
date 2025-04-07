import { DrizzleAdapter } from '@auth/drizzle-adapter';
import DiscordProvider from 'next-auth/providers/discord';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.name = user.name;
      session.user.image = user.image;

      const userRole = await db
        .select()
        .from(users)
        .where({ id: user.id })
        .limit(1);

      session.user.role = userRole[0]?.role || 'user';
      return session;
    },
  },
};
