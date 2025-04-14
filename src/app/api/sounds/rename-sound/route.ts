import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(req: NextRequest) {
  const { oldFilename, newName } = await req.json();
  const soundsDirectory = path.join(process.cwd(), 'public/sounds');

  const oldFilePath = path.join(soundsDirectory, oldFilename);
  const newFilePath = path.join(soundsDirectory, newName);

  try {
    fs.renameSync(oldFilePath, newFilePath);
    return NextResponse.json(
      { message: 'Sound renamed successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to rename sound', error },
      { status: 500 }
    );
  }
}
