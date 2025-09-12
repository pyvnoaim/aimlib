import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db/index';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import Discord from 'next-auth/providers/discord';
import { ROLES, Role } from '@/types/role';

declare module 'next-auth' {
  interface User {
    role?: Role;
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
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile: any) {
        const avatar = profile.avatar as string | null;
        const discriminator = profile.discriminator as string | undefined;

        const imageUrl = avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${avatar}.${
              avatar.startsWith('a_') ? 'gif' : 'png'
            }`
          : `https://cdn.discordapp.com/embed/avatars/${
              parseInt(discriminator ?? '0') % 5
            }.png`;

        return {
          id: profile.id as string,
          name: profile.username as string,
          email: profile.email as string | null,
          image: imageUrl,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, profile }) {
      const avatar = (profile as any)?.avatar as string | null;
      const discriminator = (profile as any)?.discriminator as
        | string
        | undefined;

      const imageUrl = avatar
        ? `https://cdn.discordapp.com/avatars/${
            (profile as any).id
          }/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}`
        : `https://cdn.discordapp.com/embed/avatars/${
            parseInt(discriminator ?? '0') % 5
          }.png`;

      if (user.id) {
        await db
          .update(users)
          .set({ image: imageUrl })
          .where(eq(users.id, user.id)); // user.id is guaranteed string by our module augmentation
      }

      return true;
    },

    async session({ session, user }) {
      try {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .then((res) => res[0]);

        if (dbUser) {
          session.user.id = dbUser.id;
          if (dbUser.email) session.user.email = dbUser.email;
          if (dbUser.name) session.user.name = dbUser.name;
          if (dbUser.image) session.user.image = dbUser.image;

          session.user.role = dbUser.role ?? ROLES.USER;
        } else {
          console.error('User not found in database');
        }
      } catch (error) {
        console.error('Error fetching user from database:', error);
      }

      return session;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
