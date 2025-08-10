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
import { BenchmarkResource } from '@/types/resource';

export default function Benchmarks() {
  const { data: session } = useSession();
  const [benchmarks, setBenchmarks] = useState<BenchmarkResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<
    'name' | 'likes' | 'author' | 'aimtrainer'
  >('likes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const user = session?.user;

  useEffect(() => {
    async function getBenchmarks() {
      try {
        const response = await fetch('/api/benchmarks');
        const data = await response.json();
        setBenchmarks(data);
      } catch (error) {
        console.error('Error fetching benchmarks:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getBenchmarks();
  }, []);

  async function toggleLike(benchmarkId: number, currentlyLiked: boolean) {
    try {
      const method = currentlyLiked ? 'DELETE' : 'POST';

      const response = await fetch('/api/likes', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType: 'benchmark',
          resourceId: benchmarkId,
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

    const benchmark = benchmarks.find((b) => b.id === id);
    if (!benchmark) return;

    const newLikedState = !benchmark.likedByUser;

    setBenchmarks((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              likedByUser: newLikedState,
              likes: newLikedState ? b.likes + 1 : b.likes - 1,
            }
          : b
      )
    );

    const success = await toggleLike(id, benchmark.likedByUser ?? false);

    if (!success) {
      setBenchmarks((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                likedByUser: benchmark.likedByUser,
                likes: benchmark.likes,
              }
            : b
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

  const filteredBenchmarks = useMemo(() => {
    const query = debouncedQuery.toLowerCase();
    return benchmarks.filter(
      (benchmark) =>
        benchmark.name.toLowerCase().includes(query) ||
        benchmark.author.toLowerCase().includes(query)
    );
  }, [benchmarks, debouncedQuery]);

  const sortedBenchmarks = useMemo(() => {
    return [...filteredBenchmarks].sort((a, b) => {
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
  }, [filteredBenchmarks, sortField, sortDirection]);

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <header className="relative pt-6 px-8 flex items-center justify-between flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search benchmarks..."
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-400  max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <h1 className="font-extrabold text-6xl text-white text-center">
            BENCHMARKS
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
                            Searching benchmarks...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : sortedBenchmarks.length > 0 ? (
                    sortedBenchmarks.map((benchmark) => (
                      <tr
                        key={benchmark.id}
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
                                  benchmark.likedByUser ? 'Unlike' : 'Like'
                                }
                              >
                                <motion.button
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.8 }}
                                  className={`transition-colors duration-300 text-lg ${
                                    benchmark.likedByUser
                                      ? 'text-red-500'
                                      : 'text-zinc-500'
                                  }`}
                                  onClick={() => handleLike(benchmark.id)}
                                  aria-label="Toggle like"
                                >
                                  <FaHeart size={16} />
                                </motion.button>
                              </Tooltip>
                              <span className="inline-block w-6 text-right">
                                {benchmark.likes}
                              </span>
                            </div>
                          ) : (
                            <div className="min-w-[45px] text-center">
                              {benchmark.likes}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <motion.a
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            href={
                              benchmark.aimtrainer === "KovaaK's"
                                ? `steam://run/824270/?action=jump-to-playlist;sharecode=${benchmark.shareCode}`
                                : `https://go.aimlab.gg/v1/redirects?link=aimlab://workshop?id=${benchmark.shareCode}&source=2DE9EC855CDEDDEF&link=steam://rungameid/714010`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-purple-400 transition-colors duration-300 inline-block"
                          >
                            <FaPlay />
                          </motion.a>
                        </td>
                        <td className="p-3 text-center truncate max-w-[150px]">
                          {benchmark.name}
                        </td>
                        <td className="p-3 text-center align-middle">
                          <Tooltip
                            closeDelay={0}
                            classNames={{
                              content: [
                                'bg-zinc-800 text-white rounded-lg shadow-lg text-center border border-zinc-700',
                              ],
                            }}
                            content={`View ${benchmark.author} on X`}
                          >
                            <Link
                              href={`https://x.com/${benchmark.twitterHandle}`}
                              isExternal
                              className="text-white flex flex-col items-center justify-center gap-1 hover:text-purple-400 transition-colors duration-300"
                            >
                              <Avatar
                                src={benchmark.profileImageUrl ?? ''}
                                alt={`${benchmark.author} profile`}
                                showFallback
                                name={benchmark.author.charAt(0)}
                                className="w-6 h-6 rounded-full object-cover border border-zinc-600"
                              />
                              <span className="truncate max-w-[110px] text-xs text-center">
                                @{benchmark.author}
                              </span>
                            </Link>
                          </Tooltip>
                        </td>
                        <td className="p-3 text-center capitalize text-sm">
                          <Chip
                            size="sm"
                            className={`${
                              benchmark.aimtrainer === "KovaaK's"
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg'
                                : benchmark.aimtrainer === 'Aimlabs'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg'
                                : ''
                            }`}
                          >
                            {benchmark.aimtrainer}
                          </Chip>
                        </td>
                        <td className="p-3 text-center">
                          {benchmark.aimtrainer === "KovaaK's" && (
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
                                aria-label="More Benchmark Actions"
                                variant="solid"
                                onAction={(key) => {
                                  if (key === 'copy') {
                                    navigator.clipboard.writeText(
                                      benchmark.shareCode
                                    );
                                    addToast({
                                      title: 'Sharecode copied',
                                      description: `${benchmark.name} by ${benchmark.author}`,
                                      variant: 'solid',
                                      color: 'success',
                                    });
                                  } else if (key === 'open') {
                                    const url = `https://kovaaks.com/kovaaks/playlists?search=${benchmark.shareCode}`;
                                    window.open(url, '_blank');
                                  } else if (key === 'sheet') {
                                    window.open(
                                      benchmark.benchmarkLink,
                                      '_blank'
                                    );
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
                                <DropdownItem
                                  key="sheet"
                                  className="text-white"
                                  startContent={<FaExternalLinkAlt />}
                                >
                                  Open Benchmark Sheet
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
                          ? 'No benchmarks match your search.'
                          : 'No benchmarks available.'}
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
