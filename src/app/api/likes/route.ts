import { NextResponse } from 'next/server';
import { db } from '@/db';
import { likes } from '@/db/schema/likes';
import { playlists } from '@/db/schema/playlists';
import { benchmarks } from '@/db/schema/benchmarks';
import { sounds } from '@/db/schema/sounds';
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

    try {
      await db.insert(likes).values({
        userId: session.user.id,
        resourceType,
        resourceId: Number(resourceId),
      });
    } catch (error: unknown) {
      const dbError = error as { code?: string };
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ message: 'Already liked' }, { status: 200 });
      }
      throw error;
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all likes for the user
    const userLikes = await db
      .select()
      .from(likes)
      .where(eq(likes.userId, session.user.id))
      .orderBy(likes.createdAt);

    // Fetch resource details for each like
    const likesWithResources = await Promise.all(
      userLikes.map(async (like) => {
        let resource = null;

        try {
          switch (like.resourceType) {
            case 'playlist':
              const playlistResult = await db
                .select({
                  id: playlists.id,
                  name: playlists.name,
                  author: playlists.author,
                  twitterHandle: playlists.twitterHandle,
                  aimtrainer: playlists.aimtrainer,
                  shareCode: playlists.shareCode,
                  createdAt: playlists.createdAt,
                  updatedAt: playlists.updatedAt,
                })
                .from(playlists)
                .where(eq(playlists.id, like.resourceId))
                .limit(1);

              if (playlistResult.length > 0) {
                const playlist = playlistResult[0];
                resource = {
                  id: playlist.id,
                  name: playlist.name,
                  author: playlist.author,
                  twitterHandle: playlist.twitterHandle,
                  aimtrainer: playlist.aimtrainer,
                  shareCode: playlist.shareCode,
                  createdAt: playlist.createdAt,
                  updatedAt: playlist.updatedAt,
                };
              }
              break;

            case 'benchmark':
              const benchmarkResult = await db
                .select({
                  id: benchmarks.id,
                  name: benchmarks.name,
                  author: benchmarks.author,
                  twitterHandle: benchmarks.twitterHandle,
                  aimtrainer: benchmarks.aimtrainer,
                  shareCode: benchmarks.shareCode,
                  benchmarkLink: benchmarks.benchmarkLink,
                  createdAt: benchmarks.createdAt,
                  updatedAt: benchmarks.updatedAt,
                })
                .from(benchmarks)
                .where(eq(benchmarks.id, like.resourceId))
                .limit(1);

              if (benchmarkResult.length > 0) {
                const benchmark = benchmarkResult[0];
                resource = {
                  id: benchmark.id,
                  name: benchmark.name,
                  author: benchmark.author,
                  twitterHandle: benchmark.twitterHandle,
                  aimtrainer: benchmark.aimtrainer,
                  shareCode: benchmark.shareCode,
                  benchmarkLink: benchmark.benchmarkLink,
                  createdAt: benchmark.createdAt,
                  updatedAt: benchmark.updatedAt,
                };
              }
              break;

            case 'sound':
              const soundResult = await db
                .select({
                  id: sounds.id,
                  name: sounds.name,
                  submittedBy: sounds.submittedBy,
                  twitterHandle: sounds.twitterHandle,
                  filePath: sounds.filePath,
                  createdAt: sounds.createdAt,
                  updatedAt: sounds.updatedAt,
                })
                .from(sounds)
                .where(eq(sounds.id, like.resourceId))
                .limit(1);

              if (soundResult.length > 0) {
                const sound = soundResult[0];
                resource = {
                  id: sound.id,
                  name: sound.name,
                  submittedBy: sound.submittedBy,
                  twitterHandle: sound.twitterHandle,
                  filePath: sound.filePath,
                  createdAt: sound.createdAt,
                  updatedAt: sound.updatedAt,
                };
              }
              break;

            default:
              // Handle unknown resource types
              resource = null;
          }
        } catch (resourceError) {
          console.error(
            `Failed to fetch ${like.resourceType} ${like.resourceId}:`,
            resourceError
          );
          resource = null;
        }

        return {
          id: like.id,
          resourceType: like.resourceType,
          resourceId: like.resourceId,
          createdAt: like.createdAt,
          resource,
        };
      })
    );

    return NextResponse.json(likesWithResources, { status: 200 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}
