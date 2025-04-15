import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const crosshairDirectory = path.join(process.cwd(), 'public/sounds');

  try {
    const fileNames = await fs.readdir(crosshairDirectory);

    const sounds = fileNames.filter((file) => file.endsWith('.ogg'));

    return new Response(JSON.stringify(sounds), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading sound files:', error);
    return new Response('Failed to fetch sound files', { status: 500 });
  }
}
