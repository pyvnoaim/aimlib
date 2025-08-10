'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import Footer from '@/components/footer';
import Background from '@/components/background';
import { useDebounce } from '@/hooks/useDebounce';
import { FiLoader } from 'react-icons/fi';
import {
  FaPlay,
  FaEllipsisH,
  FaRegCopy,
  FaExternalLinkAlt,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaHeart,
} from 'react-icons/fa';
import {
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast,
  Tooltip,
  Avatar,
  Link,
} from '@heroui/react';
import { motion } from 'framer-motion';
import { PlaylistResource } from '@/types/resource';

export default function Playlists() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState<PlaylistResource[]>([]);
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

  async function toggleLike(playlistId: number, currentlyLiked: boolean) {
    try {
      const method = currentlyLiked ? 'DELETE' : 'POST';

      const response = await fetch('/api/likes', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType: 'playlist',
          resourceId: playlistId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      return true;
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }

  async function handleLike(id: number) {
    if (!user) return;

    const playlist = playlists.find((p) => p.id === id);
    if (!playlist) return;

    const newLikedState = !playlist.likedByUser;

    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likedByUser: newLikedState,
              likes: newLikedState ? p.likes + 1 : p.likes - 1,
            }
          : p
      )
    );

    const success = await toggleLike(id, playlist.likedByUser ?? false);

    if (!success) {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                likedByUser: playlist.likedByUser,
                likes: playlist.likes,
              }
            : p
        )
      );

      addToast({
        title: 'Error',
        description: 'Could not update like. Please try again.',
        variant: 'solid',
        color: 'danger',
      });
    }
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
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      const strA = valA?.toString().toLowerCase() ?? '';
      const strB = valB?.toString().toLowerCase() ?? '';
      if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
      if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPlaylists, sortField, sortDirection]);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <header className="relative pt-6 px-8 flex items-center justify-between flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search playlists & authors..."
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400  max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <h1 className="font-extrabold text-6xl text-white text-center">
            PLAYLISTS
          </h1>
          <div className="w-[260px]" />
        </header>

        <main className="flex-grow flex flex-col min-h-0 px-8 pt-6 pb-8">
          <section className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 flex flex-col min-h-0 flex-grow">
            <div className="overflow-auto flex-grow rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="uppercase text-sm text-zinc-500 bg-zinc-800/95 sticky top-0 z-10">
                    <th
                      className="px-1 py-3 text-center hover:text-white transition-colors duration-300"
                      onClick={() => handleSort('likes')}
                    >
                      Likes {getSortIcon('likes')}
                    </th>
                    <th className="px-1 py-3 text-center">Play</th>
                    {['name', 'author', 'aimtrainer'].map((field) => (
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
                    <tr>
                      <td colSpan={6} className="py-8">
                        <div className="flex flex-col items-center justify-center text-zinc-400">
                          <FiLoader className="w-4 h-4 animate-spin mb-2" />
                          <span className="text-sm">
                            Searching playlists...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : sortedPlaylists.length > 0 ? (
                    sortedPlaylists.map((playlist) => (
                      <tr
                        key={playlist.id}
                        className="text-white text-sm text-left hover:bg-zinc-700/50 transition-all duration-300 border-b border-zinc-700 last:border-b-0"
                      >
                        <td className="px-2 py-3 text-center">
                          {user ? (
                            <div className="flex justify-center items-center gap-1 min-w-[45px]">
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
                                  <FaHeart size={16} />
                                </motion.button>
                              </Tooltip>
                              <span className="inline-block w-6 text-right">
                                {playlist.likes}
                              </span>
                            </div>
                          ) : (
                            <div className="min-w-[45px] text-center">
                              {playlist.likes}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
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
                            className="text-zinc-500 hover:text-purple-400 transition-colors duration-300 inline-block"
                          >
                            <FaPlay />
                          </motion.a>
                        </td>
                        <td className="p-3 text-center truncate max-w-[150px]">
                          {playlist.name}
                        </td>
                        <td className="p-3 text-center align-middle">
                          <Tooltip
                            closeDelay={0}
                            classNames={{
                              content: [
                                'bg-zinc-800 text-white rounded-lg shadow-lg text-center border border-zinc-700',
                              ],
                            }}
                            content={`View ${playlist.author} on X`}
                          >
                            <Link
                              href={`https://x.com/${playlist.twitterHandle}`}
                              isExternal
                              className="text-white flex flex-col items-center justify-center gap-1 hover:text-purple-400 transition-colors duration-300"
                            >
                              <Avatar
                                src={playlist.profileImageUrl ?? ''}
                                alt={`${playlist.author} profile`}
                                showFallback
                                name={playlist.author.charAt(0)}
                                className="w-6 h-6 rounded-full object-cover border border-zinc-600"
                              />
                              <span className="truncate max-w-[110px] text-xs text-center">
                                @{playlist.author}
                              </span>
                            </Link>
                          </Tooltip>
                        </td>
                        <td className="p-3 text-center capitalize text-sm">
                          <Chip
                            size="sm"
                            className={`${
                              playlist.aimtrainer === "KovaaK's"
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg'
                                : playlist.aimtrainer === 'Aimlabs'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg'
                                : ''
                            }`}
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
                                <FaEllipsisH className="inline-block text-zinc-500 " />
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
