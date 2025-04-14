import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json();

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { message: 'Filename is required' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', 'sounds', filename);
    await fs.unlink(filePath);

    return NextResponse.json(
      { message: 'Sound deleted successfully' },
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
