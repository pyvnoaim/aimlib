import { NextResponse } from 'next/server';
import { db } from '@/db';
import { likes } from '@/db/schema/likes';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resourceType, resourceId } = await req.json();

    if (!resourceType || !resourceId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    // Insert like - ignore if already exists
    try {
      await db.insert(likes).values({
        userId: session.user.id,
        resourceType,
        resourceId: Number(resourceId),
      });
    } catch (e: any) {
      // Handle unique constraint violation (already liked)
      if (e.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Already liked' }, { status: 200 });
      }
      throw e;
    }

    return NextResponse.json({ message: 'Liked' }, { status: 201 });
  } catch (error) {
    console.error('Error liking resource:', error);
    return NextResponse.json(
      { error: 'Failed to like resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resourceType, resourceId } = await req.json();

    if (!resourceType || !resourceId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      );
    }

    await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, session.user.id),
          eq(likes.resourceType, resourceType),
          eq(likes.resourceId, Number(resourceId))
        )
      );

    return NextResponse.json({ message: 'Unliked' }, { status: 200 });
  } catch (error) {
    console.error('Error unliking resource:', error);
    return NextResponse.json(
      { error: 'Failed to unlike resource' },
      { status: 500 }
    );
  }
}
