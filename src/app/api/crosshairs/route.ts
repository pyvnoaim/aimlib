// src/app/api/crosshairs/route.ts

import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const crosshairDirectory = path.join(process.cwd(), 'public/crosshairs');
  const fileNames = fs.readdirSync(crosshairDirectory);

  // Filter nur .png-Dateien
  const crosshairs = fileNames.filter((file) => file.endsWith('.png'));

  return new Response(JSON.stringify(crosshairs), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
