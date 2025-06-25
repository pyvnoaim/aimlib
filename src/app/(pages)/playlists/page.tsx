'use client';

import { useEffect, useState } from 'react';

import Footer from '@/components/footer';
import Background from '@/components/background';
import { FaPlay, FaHeart } from 'react-icons/fa';
import { Chip, Skeleton, user } from '@heroui/react';

import { Playlist } from '@/types/playlist';

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPlaylists() {
      try {
        const response = await fetch('/api/playlists');
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getPlaylists();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />

      <div className="flex-grow h-screen flex flex-col z-10 relative">
        <header className="pt-8">
          <div className="text-center">
            <h1 className="font-extrabold text-5xl md:text-6xl text-white">
              PLAYLISTS
            </h1>
          </div>
        </header>

        <main className="flex-grow flex flex-col transition-all duration-300 p-8">
          <section className="bg-zinc-800 p-4 h-full rounded-lg shadow-lg border border-zinc-700">
            <table className="w-full overflow-auto">
              <thead>
                <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800/50 backdrop-blur-sm">
                  <th className="p-2 text-center">Play</th>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Author</th>
                  <th className="p-2 text-center">Likes</th>
                  <th className="p-2 text-center">Aimtrainer</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr
                      key={`skeleton-${index}`}
                      className="border-b border-zinc-700"
                    >
                      {Array.from({ length: 6 }).map((__, cellIdx) => (
                        <td key={cellIdx} className="p-3 text-center">
                          <Skeleton className="w-20 h-5 mx-auto rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : playlists.length > 0 ? (
                  playlists.map((playlist) => (
                    <tr
                      key={playlist.id}
                      className="text-white text-sm text-left hover:bg-zinc-700/50 transition-all duration-300 border-b border-zinc-700"
                    >
                      <td className="p-3 text-center">
                        <button className="text-purple-400 hover:text-purple-300 transition-color duration-300">
                          <FaPlay />
                        </button>
                      </td>
                      <td className="p-3 text-center truncate max-w-[150px]">
                        {playlist.name}
                      </td>
                      <td className="p-3 text-center text-zinc-300 truncate max-w-[100px]">
                        <a
                          href={`https://x.com/${playlist.author}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-blue-400 transition-all duration-300"
                        >
                          @{playlist.author}
                        </a>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center items-center gap-1">
                          <span
                            className={`hover:scale-120 transition-all duration-300 ${
                              playlist.likedByUser
                                ? 'text-red-500'
                                : 'text-zinc-500'
                            }`}
                          >
                            ❤︎
                          </span>
                          {playlist.likes}
                        </div>
                      </td>
                      <td className="p-3 text-center capitalize text-sm text-zinc-200">
                        <Chip
                          color={
                            playlist.aimtrainer === "KovaaK's"
                              ? 'danger'
                              : 'primary'
                          }
                          size="sm"
                          radius="sm"
                          variant="flat"
                        >
                          {playlist.aimtrainer}
                        </Chip>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          className="text-zinc-400 hover:text-zinc-200 transition"
                          title="More actions"
                        ></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-4">
                      No playlists available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
