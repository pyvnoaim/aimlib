'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import Footer from '@/components/footer';
import Background from '@/components/background';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboardHeader';
import { addToast } from '@heroui/react';
import { LuCopy } from 'react-icons/lu';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

import type {
  PlaylistResource,
  BenchmarkResource,
  SoundResource,
  EnhancedLike,
} from '@/types/resource';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams() as { username: string };

  const user = session?.user;
  const [likes, setLikes] = useState<EnhancedLike[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchLikes() {
      try {
        const res = await fetch('/api/likes');
        if (!res.ok) throw new Error('Failed to fetch likes');
        const data = await res.json();
        setLikes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingLikes(false);
      }
    }

    fetchLikes();
  }, [status]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!user) {
      router.replace('/api/auth/signin');
    } else if (usernameFromUrl !== user.name) {
      router.replace(`/dashboard/${user.name}`);
    }
  }, [status, user, usernameFromUrl, router]);

  if (status === 'loading') return <Loading />;

  if (status !== 'authenticated' || !user || usernameFromUrl !== user.name)
    return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getAimtrainerBadgeColor = (aimtrainer: "KovaaK's" | 'Aimlabs') =>
    aimtrainer === "KovaaK's" ? 'bg-orange-600' : 'bg-blue-600';

  async function handleUnlike(
    resourceType: string,
    resourceId: number,
    likeId: string
  ) {
    try {
      const res = await fetch('/api/likes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType, resourceId }),
      });

      if (!res.ok) {
        const data = await res.json();
        addToast({
          title: 'Error',
          description: data.error || 'Failed to unlike',
          variant: 'solid',
          color: 'danger',
        });
        return;
      }

      setLikes((prev) => prev.filter((like) => like.id !== likeId));
      addToast({
        title: 'Unliked',
        description: `Removed like from ${resourceType}`,
        variant: 'solid',
        color: 'success',
      });
    } catch (error) {
      console.error('Failed to unlike:', error);
      addToast({
        title: 'Error',
        description: 'Something went wrong while unliking',
        variant: 'solid',
        color: 'danger',
      });
    }
  }

  const renderLikeItem = (like: EnhancedLike) => {
    const { resource } = like;

    switch (like.resourceType) {
      case 'playlist': {
        const playlist = resource as PlaylistResource;

        const copyShareCode = (code: string) => {
          navigator.clipboard.writeText(code);
          addToast({
            title: 'Sharecode copied',
            description: `${playlist.name} by ${playlist.author}`,
            variant: 'solid',
            color: 'success',
          });
        };

        return (
          <div
            key={like.id}
            className="bg-zinc-700 p-4 rounded-lg mb-3 border border-zinc-600 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-purple-400 text-xs px-2 py-1 rounded">
                  Playlist
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(like.createdAt)}
              </span>
            </div>

            {playlist ? (
              <>
                <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <p>
                    <span className="text-gray-400">Author:</span>{' '}
                    {playlist.author}
                  </p>
                  {playlist.twitterHandle && (
                    <p>
                      <span className="text-gray-400">Twitter:</span>{' '}
                      <a
                        href={`https://x.com/${playlist.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors duration-300"
                      >
                        @{playlist.twitterHandle}
                      </a>
                    </p>
                  )}

                  {playlist.shareCode && (
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">Share Code:</span>
                      <code className="bg-zinc-800 px-2 py-1 rounded text-xs">
                        {playlist.shareCode}
                      </code>
                      <button
                        onClick={() => copyShareCode(playlist.shareCode!)}
                        className="p-1 rounded hover:bg-zinc-700 focus:outline-none"
                      >
                        <LuCopy className="w-4 h-4 text-gray-300" />
                      </button>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-400">
                Playlist not found (ID: {like.resourceId})
              </p>
            )}

            <div className="flex">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="transition-colors duration-300 text-lg text-red-500"
                onClick={() =>
                  handleUnlike(like.resourceType, like.resourceId, like.id)
                }
                aria-label="Unlike"
              >
                <FaHeart size={16} />
              </motion.button>
            </div>
          </div>
        );
      }

      case 'benchmark': {
        const benchmark = resource as BenchmarkResource;

        const copyShareCode = (code: string) => {
          navigator.clipboard.writeText(code);
          addToast({
            title: 'Sharecode copied',
            description: `${benchmark.name} by ${benchmark.author}`,
            variant: 'solid',
            color: 'success',
          });
        };

        return (
          <div
            key={like.id}
            className="bg-zinc-700 p-4 rounded-lg mb-3 border border-zinc-600 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-purple-400 text-xs px-2 py-1 rounded">
                  Benchmark
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(like.createdAt)}
              </span>
            </div>
            {benchmark ? (
              <>
                <h3 className="font-semibold text-lg mb-2">{benchmark.name}</h3>
                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <p>
                    <span className="text-gray-400">Author:</span>{' '}
                    {benchmark.author}
                  </p>
                  {benchmark.twitterHandle && (
                    <p>
                      <span className="text-gray-400">Twitter:</span>{' '}
                      <a
                        href={`https://x.com/${benchmark.twitterHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors duration-300"
                      >
                        @{benchmark.twitterHandle}
                      </a>
                    </p>
                  )}
                </div>
                <a
                  href={benchmark.benchmarkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-purple-400 text-sm underline mb-4 transition-all duration-300"
                >
                  View Benchmark
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </>
            ) : (
              <p className="text-gray-400">
                Benchmark not found (ID: {like.resourceId})
              </p>
            )}
            <div className="flex">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="transition-colors duration-300 text-lg text-red-500"
                onClick={() =>
                  handleUnlike(like.resourceType, like.resourceId, like.id)
                }
                aria-label="Unlike"
              >
                <FaHeart size={16} />
              </motion.button>
            </div>
          </div>
        );
      }

      case 'sound': {
        const sound = resource as SoundResource;
        return (
          <div
            key={like.id}
            className="bg-zinc-700 p-4 rounded-lg mb-3 border border-zinc-600 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="bg-pink-600 text-xs px-2 py-1 rounded">
                Sound
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(like.createdAt)}
              </span>
            </div>

            {sound ? (
              <>
                <h3 className="font-semibold text-lg mb-2">{sound.name}</h3>
                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <p>
                    <span className="text-gray-400">Submitted by:</span>{' '}
                    {sound.submittedBy}
                  </p>
                  {sound.twitterHandle && (
                    <p>
                      <span className="text-gray-400">Twitter:</span> @
                      {sound.twitterHandle}
                    </p>
                  )}
                </div>
                <audio controls preload="none" className="w-full mb-4">
                  <source src={sound.filePath} />
                  Your browser does not support the audio element.
                </audio>

                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="transition-colors duration-300 text-lg text-red-500"
                    onClick={() =>
                      handleUnlike(like.resourceType, like.resourceId, like.id)
                    }
                    aria-label="Unlike"
                  >
                    <FaHeart size={16} />
                  </motion.button>
                </div>
              </>
            ) : (
              <p className="text-gray-400">
                Sound not found (ID: {like.resourceId})
              </p>
            )}
          </div>
        );
      }

      default:
        return (
          <div
            key={like.id}
            className="bg-zinc-700 p-4 rounded-lg mb-3 border border-zinc-600 flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="bg-gray-600 text-xs px-2 py-1 rounded">
                {like.resourceType}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(like.createdAt)}
              </span>
            </div>
            <p className="text-gray-400">Resource ID: {like.resourceId}</p>

            <div className="flex justify-end mt-auto">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="transition-colors duration-300 text-lg text-red-500"
                onClick={() =>
                  handleUnlike(like.resourceType, like.resourceId, like.id)
                }
                aria-label="Unlike"
              >
                <FaHeart size={16} />
              </motion.button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex flex-col flex-grow z-10">
        <main className="flex flex-col flex-grow p-8 overflow-hidden">
          <DashboardHeader
            userImage={user.image || '/logo.png'}
            username={user.name || 'User'}
            subtitle="Everything you need, right here."
          />

          <section className="bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-700 mb-8 max-h-48 overflow-auto">
            <h2 className="text-xl font-bold mb-4">User Info</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </section>

          <section className="bg-zinc-800 p-4 rounded-lg shadow-lg border border-zinc-700 flex flex-col flex-grow overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Liked Items</h2>
            <div className="flex-grow overflow-y-auto pr-2">
              {loadingLikes ? (
                <p className="text-gray-400">Loading likes...</p>
              ) : likes.length === 0 ? (
                <p className="text-gray-400">No likes yet.</p>
              ) : (
                likes.map((like) => (
                  <div key={like.id}>{renderLikeItem(like)}</div>
                ))
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
