'use client';

import { useState, useRef } from 'react';
import { FaPlay, FaDownload, FaHeart } from 'react-icons/fa';
import Footer from '@/components/footer';
import Background from '@/components/background';

const mockSounds = [
  { name: 'Flick Shot 1', file: '/sounds/flick1.mp3', author: 'AimerPro' },
  { name: 'Tracking Loop', file: '/sounds/track-loop.mp3', author: 'Zentra' },
  { name: 'Headshot Ping', file: '/sounds/headshot.mp3', author: 'SharpAim' },
  { name: 'Quick Tap', file: '/sounds/quick-tap.mp3', author: 'Xylo' },
  { name: 'Classic Aim', file: '/sounds/classic-aim.mp3', author: 'Nexus' },
  { name: 'Focus Mode', file: '/sounds/focus-mode.mp3', author: 'Clarity' },
  { name: 'Snap Reflex', file: '/sounds/snap-reflex.mp3', author: 'Kovaak' },
  { name: 'Speed Burst', file: '/sounds/speed-burst.mp3', author: 'Clickr' },
];

export default function Sounds() {
  const [query, setQuery] = useState('');
  const [likes, setLikes] = useState<number[]>(
    Array(mockSounds.length).fill(0)
  );
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const filteredSounds = mockSounds.filter((sound) =>
    sound.name.toLowerCase().includes(query.toLowerCase())
  );

  const handlePlay = (index: number) => {
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[index];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const handleLike = (index: number) => {
    setLikes((prev) => {
      const newLikes = [...prev];
      newLikes[index]++;
      return newLikes;
    });
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <header className="relative pt-6 px-8 flex items-center justify-between flex-wrap gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sounds..."
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400 max-w-md w-full"
          />
          <h1 className="font-extrabold text-6xl text-white text-center flex-grow text-nowrap">
            SOUNDS
          </h1>
          <div className="w-[260px]"></div>
        </header>

        <main className="flex-grow flex flex-col min-h-0 px-8 pt-6 pb-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSounds.length === 0 ? (
              <p className="col-span-full text-center text-zinc-400">
                No sounds found.
              </p>
            ) : (
              filteredSounds.map((sound, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 px-5 py-4 rounded-2xl shadow-xl border border-zinc-700 flex flex-col justify-between gap-3 hover:shadow-purple-500/10 transition-shadow duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold">{sound.name}</h2>
                    <p className="text-sm text-zinc-400">by {sound.author}</p>
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handlePlay(index)}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition"
                      aria-label={`Play ${sound.name}`}
                    >
                      <FaPlay />
                    </button>

                    <a
                      href={sound.file}
                      download
                      className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-full text-white transition"
                      aria-label={`Download ${sound.name}`}
                    >
                      <FaDownload />
                    </a>

                    <button
                      onClick={() => handleLike(index)}
                      className="flex items-center gap-1 text-zinc-300 hover:text-red-400 transition text-sm ml-auto"
                    >
                      <FaHeart className="text-red-500" />
                      <span>{likes[index]}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
