import { eq, and, count, sql } from 'drizzle-orm';
import { db } from '@/db';
import { playlists } from '@/db/schema/playlists';
import { likes } from '@/db/schema/likes';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const rawPlaylists = await db
      .select({
        id: playlists.id,
        name: playlists.name,
        author: playlists.author,
        twitterHandle: playlists.twitterHandle,
        aimtrainer: playlists.aimtrainer,
        shareCode: playlists.shareCode,
        createdAt: playlists.createdAt,
        updatedAt: playlists.updatedAt,
        isBenchmark: playlists.isBenchmark,
        benchmarkLink: playlists.benchmarkLink,
        likes: count(likes.id).as('likes'),
        likedByUser: userId
          ? sql<boolean>`EXISTS (
            SELECT 1 FROM ${likes}
            WHERE ${likes.resourceType} = 'playlist'
            AND ${likes.resourceId} = ${playlists.id}
            AND ${likes.userId} = ${userId}
          )`.as('likedByUser')
          : sql`FALSE`.as('likedByUser'),
      })
      .from(playlists)
      .leftJoin(
        likes,
        and(
          eq(likes.resourceType, 'playlist'),
          eq(likes.resourceId, playlists.id)
        )
      )
      .groupBy(playlists.id);

    const playlistList = rawPlaylists.map((playlist) => ({
      ...playlist,
      profileImageUrl: playlist.twitterHandle
        ? `https://unavatar.io/x/${playlist.twitterHandle}`
        : null,
    }));

    return NextResponse.json(playlistList, { status: 200 });
  } catch (error) {
    console.error('Error fetching playlists: ', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
