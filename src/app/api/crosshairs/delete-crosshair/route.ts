import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/db/index';
import { resources } from '@/db/schema';
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

    await fs.unlink(filePath);

    await db
      .delete(resources)
      .where(eq(resources.filePath, `/crosshairs/${filename}`));

    return NextResponse.json(
      {
        message:
          'Crosshair deleted successfully from both filesystem and database',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting file:', err);
    return NextResponse.json(
      { message: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
