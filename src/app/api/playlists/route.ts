import { eq, and, count } from 'drizzle-orm';
import { db } from '@/db';
import { playlists } from '@/db/schema/playlists';
import { likes } from '@/db/schema/likes';
import { NextResponse } from 'next/server';
// import { auth } from '@/lib/auth';

export async function GET() {
  // const session = await auth();
  // const user = session?.user;

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
      // likedByUser:
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
