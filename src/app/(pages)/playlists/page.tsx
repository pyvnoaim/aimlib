'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Footer from '@/components/footer';
import Background from '@/components/background';
import {
  FaPlay,
  FaEllipsisH,
  FaRegCopy,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import {
  Chip,
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { motion } from 'framer-motion';

import { Playlist } from '@/types/playlist';

export default function Playlists() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = session?.user;

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

  function handleLike(id: string) {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              likedByUser: !playlist.likedByUser,
              likes: playlist.likedByUser
                ? playlist.likes - 1
                : playlist.likes + 1,
            }
          : playlist
      )
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />

      <div className="flex-grow h-screen flex flex-col z-10">
        <header className="pt-8 flex-shrink-0">
          <div className="text-center">
            <h1 className="font-extrabold text-5xl md:text-6xl text-white">
              PLAYLISTS
            </h1>
          </div>
        </header>

        <main className="flex-grow flex flex-col min-h-0 p-8">
          <section className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 flex flex-col min-h-0 flex-grow">
            <div className="overflow-auto flex-grow">
              <table className="w-full">
                <thead>
                  <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800 z-10">
                    <th className="p-4 text-center">Play</th>
                    <th className="p-4 text-center">Name</th>
                    <th className="p-4 text-center">Author</th>
                    <th className="p-4 text-center">Likes</th>
                    <th className="p-4 text-center">Aimtrainer</th>
                    <th className="p-4 text-center">Actions</th>
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
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            href={
                              playlist.aimtrainer === "KovaaK's"
                                ? `steam://run/824270/?action=jump-to-playlist;sharecode=${playlist.shareCode}`
                                : `https://go.aimlab.gg/v1/redirects?link=aimlab://workshop?id=${playlist.shareCode}&source=2DE9EC855CDEDDEF&link=steam://rungameid/714010`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors duration-300 inline-block"
                          >
                            <FaPlay />
                          </motion.a>
                        </td>

                        <td className="p-3 text-center truncate max-w-[150px]">
                          {playlist.name}
                        </td>
                        <td className="p-3 text-center text-zinc-300 truncate max-w-[100px]">
                          <a
                            href={`https://x.com/${playlist.twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-blue-400 transition-all duration-300"
                          >
                            @{playlist.author}
                          </a>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            {user && (
                              <motion.span
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.9 }}
                                className={`transition-colors duration-300 text-md ${
                                  playlist.likedByUser
                                    ? 'text-red-500'
                                    : 'text-zinc-500'
                                }`}
                                onClick={() => handleLike(playlist.id)}
                              >
                                ❤︎
                              </motion.span>
                            )}
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
                          {playlist.aimtrainer === "KovaaK's" && (
                            <Dropdown
                              classNames={{
                                content:
                                  'bg-zinc-800 rounded-lg shadow-lg border border-zinc-700',
                              }}
                            >
                              <DropdownTrigger>
                                <FaEllipsisH className="inline-block text-zinc-500" />
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="More Playlist Actions"
                                variant="solid"
                                onAction={(key) => {
                                  if (key === 'copy') {
                                    navigator.clipboard.writeText(
                                      playlist.shareCode
                                    );
                                  } else if (key === 'open') {
                                    const url = `https://kovaaks.com/kovaaks/playlists?search=${playlist.shareCode}`;
                                    window.open(url, '_blank');
                                  }
                                }}
                              >
                                <DropdownItem
                                  key="copy"
                                  className="text-white"
                                  startContent={<FaRegCopy />}
                                >
                                  Copy Sharecode
                                </DropdownItem>
                                <DropdownItem
                                  key="open"
                                  className="text-white"
                                  startContent={<FaExternalLinkAlt />}
                                >
                                  Open Playlist
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center text-gray-500 py-4"
                      >
                        No playlists available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
