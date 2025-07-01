'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

import Footer from '@/components/footer';
import Background from '@/components/background';
import { useDebounce } from '@/hooks/useDebounce';

import {
  FaPlay,
  FaEllipsisH,
  FaRegCopy,
  FaExternalLinkAlt,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from 'react-icons/fa';

import {
  Chip,
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast,
  Tooltip,
} from '@heroui/react';

import { motion } from 'framer-motion';
import { Playlist } from '@/types/playlist';

export default function Playlists() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<
    'name' | 'likes' | 'author' | 'aimtrainer'
  >('likes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

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
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === id
          ? {
              ...playlist,
              likedByUser: !playlist.likedByUser,
            }
          : playlist
      )
    );
  }

  function handleSort(field: typeof sortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  const getSortIcon = (field: typeof sortField) => {
    if (field !== sortField) return null;

    if (field === 'likes') {
      return sortDirection === 'asc' ? (
        <FaSortAmountUp className="inline ml-1" />
      ) : (
        <FaSortAmountDown className="inline ml-1" />
      );
    }

    return sortDirection === 'asc' ? (
      <FaSortAlphaDown className="inline ml-1" />
    ) : (
      <FaSortAlphaUp className="inline ml-1" />
    );
  };

  const filteredPlaylists = useMemo(() => {
    const query = debouncedQuery.toLowerCase();
    return playlists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(query) ||
        playlist.author.toLowerCase().includes(query)
    );
  }, [playlists, debouncedQuery]);

  const sortedPlaylists = useMemo(() => {
    return [...filteredPlaylists].sort((a, b) => {
      const valueA = a[sortField]?.toString().toLowerCase() ?? '';
      const valueB = b[sortField]?.toString().toLowerCase() ?? '';
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPlaylists, sortField, sortDirection]);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <header className="pt-6 px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search playlists & authors..."
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <h1 className="flex-1 text-center font-extrabold text-4xl md:text-6xl text-white">
            PLAYLISTS
          </h1>
          <div className="flex-1" />
        </header>

        <main className="flex-grow flex flex-col min-h-0 px-8 pt-6 pb-8">
          <section className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 flex flex-col min-h-0 flex-grow">
            <div className="overflow-auto flex-grow">
              <table className="w-full">
                <thead>
                  <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800 z-10">
                    <th className="p-4 text-center">Play</th>
                    {['name', 'author', 'likes', 'aimtrainer'].map((field) => (
                      <th
                        key={field}
                        className="p-4 text-center cursor-pointer select-none hover:text-white transition-colors duration-300"
                        onClick={() => handleSort(field as typeof sortField)}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                        {getSortIcon(field as typeof sortField)}
                      </th>
                    ))}
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
                  ) : sortedPlaylists.length > 0 ? (
                    sortedPlaylists.map((playlist) => (
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
                          <Tooltip
                            closeDelay={0}
                            classNames={{
                              content: [
                                'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
                              ],
                            }}
                            content={`View ${playlist.author} on X`}
                          >
                            <a
                              href={`https://x.com/${playlist.twitterHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-purple-400 transition-color duration-300"
                            >
                              @{playlist.author}
                            </a>
                          </Tooltip>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-2 min-w-[60px]">
                            {user && (
                              <Tooltip
                                closeDelay={0}
                                classNames={{
                                  content: [
                                    'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
                                  ],
                                }}
                                content={
                                  playlist.likedByUser ? 'Unlike' : 'Like'
                                }
                              >
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  className={`transition-colors duration-300 text-lg ${
                                    playlist.likedByUser
                                      ? 'text-red-500'
                                      : 'text-zinc-500'
                                  }`}
                                  onClick={() => handleLike(playlist.id)}
                                  aria-label="Toggle like"
                                >
                                  ❤︎
                                </motion.button>
                              </Tooltip>
                            )}
                            <span className="inline-block w-6 text-right">
                              {playlist.likes}
                            </span>
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
                                <FaEllipsisH className="inline-block text-zinc-500 cursor-pointer" />
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="More Playlist Actions"
                                variant="solid"
                                onAction={(key) => {
                                  if (key === 'copy') {
                                    navigator.clipboard.writeText(
                                      playlist.shareCode
                                    );
                                    addToast({
                                      title: 'Sharecode copied',
                                      description: `${playlist.name} by ${playlist.author}`,
                                      variant: 'solid',
                                      color: 'success',
                                    });
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
                        {searchQuery
                          ? 'No playlists match your search.'
                          : 'No playlists available.'}
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
