import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { playlists } from '@/db/schema/playlists';
import { likes } from '@/db/schema/likes';
import { eq, and, count } from 'drizzle-orm';
import type { Playlist } from '@/types/playlist';

async function getLikesSummary(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceType = searchParams.get('resourceType');
  const summary = searchParams.get('summary') === 'true';

  if (!resourceType || !summary) {
    return NextResponse.json(
      { error: 'Missing resourceType or summary=true query param' },
      { status: 400 }
    );
  }

  let resourceTable;
  switch (resourceType) {
    case 'playlist':
      resourceTable = playlists;
      break;
    default:
      return NextResponse.json(
        { error: `Unsupported resourceType: ${resourceType}` },
        { status: 400 }
      );
  }

  const session = await auth();
  const userId = session?.user?.id;

  const resources = await db.select().from(resourceTable);

  const likeCounts = await db
    .select({
      resourceId: likes.resourceId,
      count: count(),
    })
    .from(likes)
    .where(eq(likes.resourceType, resourceType))
    .groupBy(likes.resourceId);

  const countMap = new Map(likeCounts.map((l) => [l.resourceId, l.count]));

  let likedSet = new Set<string>();
  if (userId) {
    const userLikes = await db
      .select({ resourceId: likes.resourceId })
      .from(likes)
      .where(
        and(eq(likes.resourceType, resourceType), eq(likes.userId, userId))
      );

    likedSet = new Set(userLikes.map((l) => l.resourceId));
  }

  const result: Playlist[] = resources.map((item) => ({
    id: item.id,
    name: item.name,
    author: item.author,
    twitterHandle: item.twitterHandle,
    aimtrainer: item.aimtrainer,
    shareCode: item.shareCode ?? '',
    createdAt: item.createdAt
      ? item.createdAt.toISOString()
      : new Date(0).toISOString(),
    updatedAt: item.updatedAt
      ? item.updatedAt.toISOString()
      : new Date(0).toISOString(),
    likes: countMap.get(item.id) || 0,
    likedByUser: likedSet.has(item.id),
  }));

  return NextResponse.json(result);
}

async function addLike(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resourceId, resourceType } = await req.json();

  if (!resourceId || !resourceType) {
    return NextResponse.json(
      { error: 'Missing resourceId or resourceType' },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(likes)
    .where(
      and(
        eq(likes.resourceId, resourceId),
        eq(likes.resourceType, resourceType),
        eq(likes.userId, session.user.id)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: 'Like already exists' }, { status: 409 });
  }

  await db.insert(likes).values({
    resourceId,
    resourceType,
    userId: session.user.id,
  });

  return NextResponse.json({ success: true });
}

async function removeLike(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { resourceId, resourceType } = await req.json();

  if (!resourceId || !resourceType) {
    return NextResponse.json(
      { error: 'Missing resourceId or resourceType' },
      { status: 400 }
    );
  }

  await db
    .delete(likes)
    .where(
      and(
        eq(likes.resourceId, resourceId),
        eq(likes.resourceType, resourceType),
        eq(likes.userId, session.user.id)
      )
    );

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  try {
    return await getLikesSummary(req);
  } catch (error) {
    console.error('GET /api/likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await addLike(req);
  } catch (error) {
    console.error('POST /api/likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    return await removeLike(req);
  } catch (error) {
    console.error('DELETE /api/likes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
