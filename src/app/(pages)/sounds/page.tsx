'use client';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { LuDownload } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function Sounds() {
  const [sounds, setSounds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchSounds() {
      const response = await fetch('../api/sounds');
      const data = await response.json();
      setSounds(data);
      setLoading(false);
    }
    fetchSounds();
  }, []);

  const handlePlayPause = (sound: string) => {
    if (playingSound === sound) {
      audio?.pause();
      setPlayingSound(null);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(`/sounds/${sound}`);
      newAudio.play();
      setAudio(newAudio);
      setPlayingSound(sound);
      newAudio.onended = () => setPlayingSound(null);
    }
  };

  const filteredSounds = sounds.filter((sound) => {
    const title = sound.replace('.ogg', '');
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const SkeletonPlayButton = () => (
    <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse mt-4" />
  );
  const SkeletonTitle = () => (
    <div className="w-24 h-4 bg-gray-600 rounded-md animate-pulse mt-2" />
  );
  const SkeletonButton = () => (
    <div className="w-20 h-8 bg-gray-600 rounded-md animate-pulse mt-4" />
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 mt-5">
          <div className="flex flex-col items-center justify-center h-1/3">
            <h1 className="font-extrabold text-3xl text-center text-white">
              SOUNDS
            </h1>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2 bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full border border-purple-500/50 shadow-lg">
              <BiSearch className="text-md" />
              <input
                type="text"
                placeholder="Search sounds..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-md text-white placeholder-purple-300 w-full"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-5xl h-[600px] overflow-y-auto p-4 rounded-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
                {loading
                  ? Array(20)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300"
                        >
                          <SkeletonPlayButton />
                          <SkeletonTitle />
                          <SkeletonButton />
                        </div>
                      ))
                  : filteredSounds.map((sound, index) => (
                      <div
                        key={index}
                        className="group flex flex-col items-center justify-center p-6 rounded-lg shadow-xl bg-white/3 backdrop-blur-sm transition-all duration-300 border border-white hover:bg-white/10 hover:border-purple-400"
                      >
                        <button
                          onClick={() => handlePlayPause(sound)}
                          className="flex items-center justify-center m-3 text-purple-500 shadow-lg hover:text-purple-400 transition-all duration-300"
                        >
                          {playingSound === sound ? (
                            <FaPause size={20} />
                          ) : (
                            <FaPlay size={20} />
                          )}
                        </button>

                        {/* Sound Title */}
                        <h3 className="text-md md:text-md font-semibold text-center text-white mt-2 truncate">
                          {sound.replace('.ogg', '')}
                        </h3>

                        {/* Download Button */}
                        <div className="mt-4 w-full flex justify-center">
                          <a
                            href={`/sounds/${sound}`}
                            download
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-500/20 text-purple-500 px-2 py-1 rounded-md border border-purple-500/50 shadow-lg hover:border-purple-500 m-1"
                          >
                            <LuDownload size={20} />
                          </a>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>

          <div className="px-6 mt-auto">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
