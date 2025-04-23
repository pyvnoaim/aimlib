import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/db/index';
import { resources, likes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json();

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { message: 'Filename is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'crosshairs', filename);

    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('File not found or already deleted:', fileError);
    }

    // Select the resource first to get its ID
    const existingResource = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.filePath, `/crosshairs/${filename}`))
      .limit(1);

    const resourceId = existingResource[0]?.id;

    if (resourceId) {
      await db.delete(likes).where(eq(likes.resourceId, resourceId));

      await db
        .update(resources)
        .set({ status: 'deleted' })
        .where(eq(resources.id, resourceId));
    }

    return NextResponse.json(
      {
        message: 'Crosshair soft-deleted successfully (and likes removed)',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error during soft deletion:', err);
    return NextResponse.json(
      { message: 'Failed to soft delete the crosshair' },
      { status: 500 }
    );
  }
}
