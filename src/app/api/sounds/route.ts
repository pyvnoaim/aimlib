// src/app/api/crosshairs/route.ts

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const crosshairDirectory = path.join(process.cwd(), 'public/sounds');
  const fileNames = fs.readdirSync(crosshairDirectory);

  // Filter nur .mp3-Dateien
  const sounds = fileNames.filter((file) => file.endsWith('.ogg'));

  return new Response(JSON.stringify(sounds), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
