import { db } from '@/db/index';
import { resources, likes } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const soundResources = await db
      .select()
      .from(resources)
      .where(eq(resources.type, 'sound'));

    const resourceIds = soundResources.map((res) => res.id);

    const likesData = await db
      .select()
      .from(likes)
      .where(inArray(likes.resourceId, resourceIds));

    const likeCounts: Record<string, number> = {};
    const likedByUser = new Set<string>();

    for (const like of likesData) {
      likeCounts[like.resourceId] = (likeCounts[like.resourceId] || 0) + 1;
      if (like.userId === userId) {
        likedByUser.add(like.resourceId);
      }
    }

    const result = soundResources.map((res) => ({
      ...res,
      likes: likeCounts[res.id] || 0,
      isLiked: likedByUser.has(res.id),
    }));

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch sounds with likes:', error);
    return new Response('Error fetching sounds', { status: 500 });
  }
}
