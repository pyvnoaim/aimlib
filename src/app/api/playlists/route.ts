import { eq, and, count, sql } from 'drizzle-orm';
import { db } from '@/db';
import { playlists } from '@/db/schema/playlists';
import { likes } from '@/db/schema/likes';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  const playlistList = await db
    .select({
      id: playlists.id,
      name: playlists.name,
      author: playlists.author,
      twitterHandle: playlists.twitterHandle,
      aimtrainer: playlists.aimtrainer,
      shareCode: playlists.shareCode,
      createdAt: playlists.createdAt,
      updatedAt: playlists.updatedAt,
      likes: count(likes.id).as('likes'),
      likedByUser: userId
        ? sql`EXISTS (
            SELECT 1 FROM ${likes} 
            WHERE ${likes.resourceType} = 'playlist'
            AND ${likes.resourceId} = ${playlists.id}
            AND ${likes.userId} = ${userId}
          )`
        : sql`FALSE`,
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

  return NextResponse.json(playlistList, { status: 200 });
}
