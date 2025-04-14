import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { soundId } = body;

    if (!soundId) {
      return NextResponse.json(
        { message: 'Sound ID is required' },
        { status: 400 }
      );
    }

    if (soundId.includes('/') || soundId.includes('\\')) {
      return NextResponse.json(
        { message: 'Invalid sound ID' },
        { status: 400 }
      );
    }

    const soundFilePath = path.join(process.cwd(), 'public', 'sounds', soundId);

    console.log(soundFilePath);

    if (fs.existsSync(soundFilePath)) {
      fs.unlinkSync(soundFilePath);
      return NextResponse.json(
        { message: 'Sound deleted successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: 'Sound not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting sound:', error);
    return NextResponse.json(
      { message: 'Failed to delete sound' },
      { status: 500 }
    );
  }
}
