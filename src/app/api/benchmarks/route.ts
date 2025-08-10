import { eq, and, count, sql } from 'drizzle-orm';
import { db } from '@/db';
import { benchmarks } from '@/db/schema/benchmarks';
import { likes } from '@/db/schema/likes';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const rawBenchmarks = await db
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
        likes: count(likes.id).as('likes'),
        likedByUser: userId
          ? sql<boolean>`EXISTS (
            SELECT 1 FROM ${likes}
            WHERE ${likes.resourceType} = 'benchmark'
            AND ${likes.resourceId} = ${benchmarks.id}
            AND ${likes.userId} = ${userId}
          )`.as('likedByUser')
          : sql`FALSE`.as('likedByUser'),
      })
      .from(benchmarks)
      .leftJoin(
        likes,
        and(
          eq(likes.resourceType, 'playlist'),
          eq(likes.resourceId, benchmarks.id)
        )
      )
      .groupBy(benchmarks.id);

    const benchmarkList = rawBenchmarks.map((benchmark) => ({
      ...benchmark,
      profileImageUrl: benchmark.twitterHandle
        ? `https://unavatar.io/x/${benchmark.twitterHandle}`
        : null,
    }));

    return NextResponse.json(benchmarkList, { status: 200 });
  } catch (error) {
    console.error('Error fetching benchmarks: ', error);
    return NextResponse.json(
      { error: 'Failed to fetch benchmarks' },
      { status: 500 }
    );
  }
}
