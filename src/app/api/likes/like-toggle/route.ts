import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { likes } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { resourceId } = await req.json();
  if (!resourceId) {
    return NextResponse.json(
      { message: 'Missing resourceId' },
      { status: 400 }
    );
  }

  const userId = session.user.id as string;

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.resourceId, resourceId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.resourceId, resourceId)));

    return NextResponse.json({ liked: false });
  } else {
    await db.insert(likes).values({
      userId,
      resourceId,
    });

    return NextResponse.json({ liked: true });
  }
}
