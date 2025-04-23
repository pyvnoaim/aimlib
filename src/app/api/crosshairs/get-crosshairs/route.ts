import { db } from '@/db/index';
import { resources, likes } from '@/db/schema';
import { eq, and, ne, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

async function getExistingCrosshairResources() {
  return db
    .select()
    .from(resources)
    .where(
      and(eq(resources.type, 'crosshair'), ne(resources.status, 'deleted'))
    );
}

async function syncNewFilesWithDatabase(
  files: string[],
  existingFileNames: string[]
) {
  const newFiles = files.filter((file) => !existingFileNames.includes(file));

  if (newFiles.length > 0) {
    const newResources = newFiles.map((file) => ({
      name: file,
      type: 'crosshair',
      filePath: `/crosshairs/${file}`,
    }));

    await db.insert(resources).values(newResources);
  }
}

async function getLikesDataForResources(
  resourceIds: string[],
  userId?: string | null
) {
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

  return { likeCounts, likedByUser };
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const crosshairDir = path.join(process.cwd(), 'public', 'crosshairs');
    const files = fs
      .readdirSync(crosshairDir)
      .filter((file) => file.endsWith('.png'));

    const existingResources = await getExistingCrosshairResources();
    const existingFileNames = existingResources.map((res) => res.name);

    await syncNewFilesWithDatabase(files, existingFileNames);

    const crosshairResources = await getExistingCrosshairResources();
    const resourceIds = crosshairResources.map((res) => res.id);

    const { likeCounts, likedByUser } = await getLikesDataForResources(
      resourceIds,
      userId
    );

    const result = crosshairResources.map((res) => ({
      ...res,
      likes: likeCounts[res.id] || 0,
      isLiked: likedByUser.has(res.id),
    }));

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to fetch crosshairs with likes:', error);
    return new Response('Error fetching crosshairs', { status: 500 });
  }
}
