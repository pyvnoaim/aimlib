'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { LuDownload } from 'react-icons/lu';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import { ROLES } from '@/types/role';

type LikedResource = {
  id: string;
  name: string;
  filePath: string;
  type: 'sound' | 'playlist' | 'theme' | 'crosshair';
  createdAt: string;
  likes: number;
  isLiked: boolean;
};

type TabType = 'playlists' | 'themes' | 'sounds' | 'crosshairs';

export default function LikeDashboard() {
  // Session & routing hooks
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const usernameFromUrl = params.username;

  // State management
  const [selectedTab, setSelectedTab] = useState<TabType>('playlists');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [likedResources, setLikedResources] = useState<LikedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Derived state
  const username = session?.user?.name || '';
  const userImage = session?.user?.image || '';
  const isAdmin = session?.user?.role === ROLES.ADMIN;

  // Auth & permission checks
  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    if (usernameFromUrl !== session.user.name) {
      router.push(`/dashboard/${session.user.name}/likes`);
      return;
    }
  }, [session, status, usernameFromUrl, router]);

  // Data fetching
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;

    fetchLikedResources();
  }, [status, session]);

  const fetchLikedResources = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch liked resources');
      }

      const data = await res.json();

      if (data.likedResources) {
        setLikedResources(data.likedResources);
      } else {
        throw new Error('No liked resources found for this user');
      }
    } catch (err) {
      console.error('Failed to load liked resources:', err);
      setFetchError(
        typeof err === 'object' && err !== null && 'message' in err
          ? String(err.message)
          : 'Oops! Something went wrong while loading your liked resources.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Count resources by type
  const countByType = {
    playlists: likedResources.filter((r) => r.type === 'playlist').length,
    themes: likedResources.filter((r) => r.type === 'theme').length,
    sounds: likedResources.filter((r) => r.type === 'sound').length,
    crosshairs: likedResources.filter((r) => r.type === 'crosshair').length,
  };

  // Handlers
  const playSound = (fileUrl: string, id: string) => {
    if (currentlyPlayingId === id) {
      setCurrentlyPlayingId(null);
      return;
    }

    const audio = new Audio(fileUrl);
    setCurrentlyPlayingId(id);

    audio.play();
    audio.onended = () => setCurrentlyPlayingId(null);
    audio.onerror = () => setCurrentlyPlayingId(null);
  };

  const handleDownload = (fileUrl: string, name: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = name || fileUrl.split('/').pop() || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleLike = async (resource: LikedResource) => {
    try {
      const res = await fetch('/api/likes/like-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to toggle like');
      }

      const result = await res.json();

      setLikedResources((prev) =>
        result.liked
          ? prev.map((r) =>
              r.id === resource.id
                ? { ...r, isLiked: true, likes: result.likes }
                : r
            )
          : prev.filter((r) => r.id !== resource.id)
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const navigateTo = (path: string) => {
    const username = session?.user?.name;
    if (username) {
      router.push(`/dashboard/${username}${path}`);
    } else {
      router.push('/api/auth/signin');
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const userLocale = navigator.language || 'en-US';

    const is12HourFormat = new Intl.DateTimeFormat(userLocale, {
      hour: 'numeric',
    })
      .formatToParts(date)
      .some((part) => part.type === 'dayPeriod');

    const formatter = new Intl.DateTimeFormat(userLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: is12HourFormat ? 'h12' : 'h23',
    });

    return formatter.format(date);
  };

  // Loading state
  if (status === 'loading') {
    return <Loading />;
  }

  // Auth check
  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <Spotlight />
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      <div className="flex-grow h-screen flex flex-col z-10">
        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          <DashboardHeader
            userImage={userImage}
            username={username}
            subtitle="View your favorites."
          />

          <DashboardTabs
            isAdmin={isAdmin}
            navigateTo={navigateTo}
            currentPath="/likes"
          />

          {/* Main Content Section */}
          <section className="bg-zinc-800 h-[646px] p-6 rounded-lg shadow-lg border border-zinc-700">
            {/* Tabs */}
            <div className="flex border-b border-zinc-600 mb-4">
              {['playlists', 'themes', 'sounds', 'crosshairs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as TabType)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 capitalize ${
                    selectedTab === tab
                      ? 'border-b-2 border-purple-400 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {countByType[tab as keyof typeof countByType] > 0 && (
                    <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                      {countByType[tab as keyof typeof countByType]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Resource Content */}
            <div className="overflow-auto h-[540px]">
              {fetchError ? (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex flex-col items-center justify-center h-full">
                  <p className="text-center mb-2">{fetchError}</p>
                  <button
                    className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 transition-colors duration-300 rounded-lg text-white"
                    onClick={() => fetchLikedResources()}
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                  <thead className="sticky top-0 z-10">
                    <tr className="text-gray-400">
                      <th className="px-4 py-2">Preview</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Likes</th>
                      <th className="px-4 py-2">Liked At</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(10)].map((_, i) => (
                        <tr key={i} className="bg-zinc-700/50 animate-pulse">
                          <td className="px-4 py-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-600/50" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-5 w-32 bg-zinc-600/50 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-5 w-12 bg-zinc-600/50 rounded-full" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-5 w-40 bg-zinc-600/50 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-600/50" />
                              <div className="w-8 h-8 rounded-lg bg-zinc-600/50" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : likedResources.filter(
                        (r) => r.type === (selectedTab as LikedResource['type'])
                      ).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <p className="text-gray-400 mb-2">
                            You haven&apos;t liked any {selectedTab} yet.
                          </p>
                          <button
                            onClick={() => router.push(`/${selectedTab}`)}
                            className="text-purple-400 hover:underline text-sm"
                          >
                            Explore the {selectedTab} library
                          </button>
                        </td>
                      </tr>
                    ) : (
                      likedResources
                        .filter(
                          (resource) =>
                            resource.type ===
                            (selectedTab as LikedResource['type'])
                        )
                        .map((resource) => (
                          <tr
                            key={resource.id}
                            className="bg-zinc-700 transition-all duration-300 hover:bg-zinc-600"
                          >
                            <td className="px-4 py-2">
                              {resource.type === 'sound' && (
                                <button
                                  onClick={() =>
                                    currentlyPlayingId === resource.id
                                      ? setCurrentlyPlayingId(null)
                                      : playSound(
                                          resource.filePath,
                                          resource.id
                                        )
                                  }
                                  className="text-purple-400 p-2 hover:text-purple-300 transition-colors"
                                  title={
                                    currentlyPlayingId === resource.id
                                      ? 'Pause'
                                      : 'Play'
                                  }
                                >
                                  {currentlyPlayingId === resource.id ? (
                                    <FaPause className="w-4 h-4" />
                                  ) : (
                                    <FaPlay className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              {resource.type === 'crosshair' && (
                                <div className="w-8 h-8">
                                  <Image
                                    src={resource.filePath}
                                    alt="Crosshair Preview"
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              {(resource.type === 'playlist' ||
                                resource.type === 'theme') && (
                                <div className="w-8 h-8 flex items-center justify-center bg-zinc-600 rounded-lg">
                                  <span className="text-xs capitalize">
                                    {resource.type.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-2 relative">
                              <span>
                                {resource.name.replace(/\.(ogg|png)$/, '')}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs">
                                {resource.likes}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex flex-col text-xs text-gray-300">
                                <span className="text-white">
                                  {formatDate(resource.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-3">
                                {(resource.type === 'sound' ||
                                  resource.type === 'crosshair') && (
                                  <button
                                    onClick={() =>
                                      handleDownload(
                                        resource.filePath,
                                        resource.name
                                      )
                                    }
                                    aria-label={`Download ${resource.name}`}
                                    className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                                    title="Download"
                                  >
                                    <LuDownload className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleLike(resource)}
                                  aria-label={`Unlike ${resource.name}`}
                                  className="text-red-500 hover:bg-red-500/20 rounded-lg p-2 transition-all duration-300"
                                  title="Unlike"
                                >
                                  <FaHeart className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
