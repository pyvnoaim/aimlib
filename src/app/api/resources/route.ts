import { NextResponse } from 'next/server';
import { db } from '@/db';
import { resources } from '@/db/schema/resources';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allResources = await db
      .select()
      .from(resources)
      .orderBy(desc(resources.createdAt));

    return NextResponse.json(allResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
