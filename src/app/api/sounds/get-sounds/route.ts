import fs from 'fs/promises';
import path from 'path';
import { db } from '@/db/index';
import { resources } from '@/db/schema';
import { eq } from 'drizzle-orm';

type SoundData = {
  name: string;
  type: string;
  filePath: string;
  createdAt: Date;
  duration?: number;
  size?: number;
};

export const dynamic = 'force-dynamic';

export async function GET() {
  const crosshairDirectory = path.join(process.cwd(), 'public/sounds');
  const soundsToInsert: SoundData[] = [];

  try {
    const fileNames = await fs.readdir(crosshairDirectory);
    const sounds = fileNames.filter((file) => file.endsWith('.ogg'));

    const existingSounds = await db
      .select()
      .from(resources)
      .where(eq(resources.type, 'sound'));

    const existingSoundNames = new Set(
      existingSounds.map((sound) => sound.name)
    );

    for (const file of sounds) {
      const filePath = path.join(crosshairDirectory, file);
      if (!existingSoundNames.has(file)) {
        const soundData: SoundData = {
          name: file,
          type: 'sound',
          filePath: `/sounds/${file}`,
          createdAt: new Date(),
          size: (await fs.stat(filePath)).size,
        };
        soundsToInsert.push(soundData);
      }
    }

    if (soundsToInsert.length > 0) {
      await db.insert(resources).values(soundsToInsert);
    }

    return new Response(JSON.stringify(sounds), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading sound files or inserting into DB:', error);
    return new Response('Failed to fetch or insert sound files', {
      status: 500,
    });
  }
}
