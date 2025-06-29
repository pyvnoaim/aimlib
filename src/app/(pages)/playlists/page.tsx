'use client';

import { useSession } from 'next-auth/react';
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
} from '@heroui/react';
import { motion } from 'framer-motion';

import Footer from '@/components/footer';
import Background from '@/components/background';
import { usePlaylistSort } from '@/hooks/use-playlist-sort';
import { usePlaylistFilter } from '@/hooks/use-playlist-filter';
import { usePlaylistData } from '@/hooks/use-playlist-data';

export default function Playlists() {
  const { data: session } = useSession();
  const user = session?.user;

  const { playlists, isLoading, error, handleLike } = usePlaylistData();
  const { searchQuery, setSearchQuery, filteredPlaylists, hasActiveFilter } =
    usePlaylistFilter(playlists);
  const { sortField, sortDirection, sortedPlaylists, handleSort, getSortIcon } =
    usePlaylistSort(filteredPlaylists);

  const renderSortIcon = (field: typeof sortField) => {
    const iconType = getSortIcon(field);
    if (!iconType) return null;

    const iconMap = {
      'sort-amount-up': <FaSortAmountUp className="inline ml-1" />,
      'sort-amount-down': <FaSortAmountDown className="inline ml-1" />,
      'sort-alpha-down': <FaSortAlphaDown className="inline ml-1" />,
      'sort-alpha-up': <FaSortAlphaUp className="inline ml-1" />,
    };

    return iconMap[iconType];
  };

  const handlePlaylistAction = (action: string, playlist: any) => {
    switch (action) {
      case 'copy':
        addToast({
          title: `Copied sharecode "${playlist.shareCode}"`,
          variant: 'solid',
          color: 'success',
        });
        navigator.clipboard.writeText(playlist.shareCode).catch((err) => {
          console.error('Failed to copy sharecode:', err);
          addToast({
            title: 'Failed to copy sharecode',
            description: err,
            variant: 'solid',
            color: 'danger',
          });
        });
        break;
      case 'open':
        const url = `https://kovaaks.com/kovaaks/playlists?search=${playlist.shareCode}`;
        window.open(url, '_blank');
        break;
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-zinc-900 text-white items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Playlists
          </h2>
          <p className="text-zinc-300">{error}</p>
        </div>
      </div>
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
          <div className="flex pb-6 w-2xl gap-4 items-center">
            <input
              type="text"
              placeholder="Search playlists & authors..."
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full md:w-1/2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <section className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 flex flex-col min-h-0 flex-grow">
            <div className="overflow-auto flex-grow">
              <table className="w-full">
                <thead>
                  <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800 z-10">
                    <th className="p-4 text-center">Play</th>

                    <th
                      className="p-4 text-center cursor-pointer select-none hover:text-white transition-colors"
                      onClick={() => handleSort('name')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSort('name')}
                    >
                      Name {renderSortIcon('name')}
                    </th>

                    <th
                      className="p-4 text-center cursor-pointer select-none hover:text-white transition-colors"
                      onClick={() => handleSort('author')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSort('author')
                      }
                    >
                      Author {renderSortIcon('author')}
                    </th>

                    <th
                      className="p-4 text-center cursor-pointer select-none hover:text-white transition-colors"
                      onClick={() => handleSort('likes')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSort('likes')
                      }
                    >
                      Likes {renderSortIcon('likes')}
                    </th>

                    <th
                      className="p-4 text-center cursor-pointer select-none hover:text-white transition-colors"
                      onClick={() => handleSort('aimtrainer')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSort('aimtrainer')
                      }
                    >
                      Aimtrainer {renderSortIcon('aimtrainer')}
                    </th>

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
                            aria-label={`Play ${playlist.name} playlist`}
                          >
                            <FaPlay />
                          </motion.a>
                        </td>
                        <td
                          className="p-3 text-center truncate max-w-[150px]"
                          title={playlist.name}
                        >
                          {playlist.name}
                        </td>
                        <td className="p-3 text-center text-zinc-300 truncate max-w-[100px]">
                          <a
                            href={`https://x.com/${playlist.twitterHandle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-blue-400 transition-all duration-300"
                            title={`View @${playlist.twitterHandle} on Twitter`}
                          >
                            @{playlist.author}
                          </a>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-2">
                            {user && (
                              <motion.button
                                whileHover={{ scale: 1.3 }}
                                whileTap={{ scale: 0.9 }}
                                className={`transition-colors duration-300 text-md ${
                                  playlist.likedByUser
                                    ? 'text-red-500'
                                    : 'text-zinc-500'
                                } hover:text-red-400`}
                                onClick={() => handleLike(playlist.id)}
                                aria-label={`${
                                  playlist.likedByUser ? 'Unlike' : 'Like'
                                } ${playlist.name}`}
                              >
                                ❤︎
                              </motion.button>
                            )}
                            <span>{playlist.likes}</span>
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
                                <button
                                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                                  aria-label="More actions"
                                >
                                  <FaEllipsisH />
                                </button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="More Playlist Actions"
                                variant="solid"
                                onAction={(key) =>
                                  handlePlaylistAction(key as string, playlist)
                                }
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
                        className="text-center text-gray-500 py-8"
                      >
                        {hasActiveFilter
                          ? `No playlists found matching "${searchQuery}"`
                          : 'No playlists available'}
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
