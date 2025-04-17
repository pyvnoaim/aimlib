import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { likes, resources } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, inArray, sql } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id as string;

  try {
    const userLikes = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, userId));

    if (userLikes.length === 0) {
      return NextResponse.json([]);
    }

    const likedResourceIds = userLikes.map((like) => like.resourceId);

    const likedResources = await db
      .select({
        id: resources.id,
        name: resources.name,
        filePath: resources.filePath,
        type: resources.type,
        createdAt: resources.createdAt,
        likes: sql<number>`(
          SELECT COUNT(*) FROM ${likes}
          WHERE ${likes.resourceId} = ${resources.id}
        )`,
      })
      .from(resources)
      .where(inArray(resources.id, likedResourceIds));

    const formattedLikes = likedResources.map((resource) => ({
      ...resource,
      isLiked: true,
    }));

    return NextResponse.json(formattedLikes);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
