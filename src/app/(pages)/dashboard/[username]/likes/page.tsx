'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import { MdUpload, MdDashboard } from 'react-icons/md';
import { LuDownload } from 'react-icons/lu';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import DeleteUserButton from '@/components/ui/auth-buttons/delete-user-button';
import ActionCard from '@/components/ui/dashboard-actioncards/actioncards';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import Image from 'next/image';
import Toast from '@/components/layouts/toast/toast';
import { ROLES } from '@/types/role';
import Loading from '@/components/layouts/loading/loading';

type LikedResource = {
  id: string;
  name: string;
  filePath: string;
  type: 'sound' | 'playlist' | 'theme' | 'crosshair';
  createdAt: string;
  likes: number;
  isLiked: boolean;
};

export default function LikeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const usernameFromUrl = params.username;

  const [selectedTab, setSelectedTab] = useState<
    'playlists' | 'themes' | 'sounds' | 'crosshairs'
  >('playlists');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const [likedResources, setLikedResources] = useState<LikedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

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

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;

    const fetchLikes = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/likes/get-user-likes', {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch likes');
        }

        const data: LikedResource[] = await res.json();
        setLikedResources(data);
        setFetchError(null);
      } catch (err) {
        console.error('Failed to load likes:', err);
        setFetchError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String(err.message)
            : 'Oops! Something went wrong while loading your liked resources.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, [status, session]);

  const countByType = {
    playlists: likedResources.filter((r) => r.type === 'playlist').length,
    themes: likedResources.filter((r) => r.type === 'theme').length,
    sounds: likedResources.filter((r) => r.type === 'sound').length,
    crosshairs: likedResources.filter((r) => r.type === 'crosshair').length,
  };

  const playSound = (fileUrl: string, id: string) => {
    if (currentlyPlayingId) {
      setCurrentlyPlayingId(null);
    }

    const audio = new Audio(fileUrl);
    setCurrentlyPlayingId(id);

    audio.play();
    audio.onended = () => setCurrentlyPlayingId(null);
    audio.onerror = () => {
      setCurrentlyPlayingId(null);
      showToast('Failed to play sound', 'error');
    };
  };

  const handleDownload = (fileUrl: string, name: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = name || fileUrl.split('/').pop() || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloading ${name}...`, 'info');
    } catch (error) {
      showToast('Download failed', 'error');
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

      showToast(
        `You ${result.liked ? 'liked' : 'unliked'} "${resource.name.replace(
          /\.(ogg|png)$/,
          ''
        )}"`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
      showToast(
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Failed to toggle like.',
        'error'
      );
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);

    const userLocale = navigator.language || 'en-US';

    const is12HourFormat = new Intl.DateTimeFormat(userLocale, {
      hour: 'numeric',
    })
      .formatToParts(new Date())
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

  const ResourceTable = ({
    type,
  }: {
    type: 'sound' | 'playlist' | 'theme' | 'crosshair';
  }) => {
    const resources = likedResources.filter((r) => r.type === type);

    if (loading) {
      return (
        <div className="overflow-auto max-h-[540px]">
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
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="bg-zinc-700 animate-pulse">
                  <td className="px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-600" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-24 bg-zinc-600 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-16 bg-zinc-600 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="h-4 w-32 bg-zinc-600 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded bg-zinc-600" />
                      <div className="w-6 h-6 rounded bg-zinc-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (resources.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p className="mb-2">You haven&apos;t liked any {type}s yet.</p>
          <button
            onClick={() => router.push(`/${type}s`)}
            className="text-purple-400 hover:underline text-sm"
          >
            Explore the {type} library to find something you like
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-auto max-h-[540px]">
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
            {resources.map((resource) => (
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
                          : playSound(resource.filePath, resource.id)
                      }
                      className="text-purple-400 p-2 hover:text-purple-300 transition-colors"
                      title={
                        currentlyPlayingId === resource.id ? 'Pause' : 'Play'
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
                  <span>{resource.name.replace(/\.(ogg|png)$/, '')}</span>
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs ">
                    {resource.likes}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col text-xs text-gray-300">
                    <span className="font-semibold text-white">
                      {formatDate(resource.createdAt)}
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      (your local time)
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    {(resource.type === 'sound' ||
                      resource.type === 'crosshair') && (
                      <button
                        onClick={() =>
                          handleDownload(resource.filePath, resource.name)
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
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session?.user) {
    return null;
  }

  const username = session.user.name;
  const userImage = session.user.image || '/default-avatar.png';
  const isAdmin = session.user.role === ROLES.ADMIN;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          <div className="flex items-center gap-4 mb-8">
            <Image
              src={userImage}
              alt="User Profile"
              className="w-16 h-16 rounded-full"
              width={64}
              height={64}
            />
            <div className="flex-grow">
              <h1 className="font-extrabold text-4xl">
                Welcome back,{' '}
                <span className="text-purple-400 text-4xl">{username}</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Here&apos;s what you&apos;ve liked.
              </p>
            </div>
            <div className="flex gap-2">
              <SignOutButton />
              <DeleteUserButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <ActionCard
              icon={<MdDashboard className="text-4xl text-purple-400" />}
              title="Dashboard"
              description="Overview"
              onClick={() => navigateTo('')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<AiFillHeart className="text-4xl text-purple-400" />}
              title="Likes"
              description="View your favorites"
              onClick={() => navigateTo('/likes')}
              className="bg-purple-400/20 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-purple-400" />}
              title="Submit"
              description="Upload new content"
              onClick={() => navigateTo('/submit')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            {isAdmin && (
              <ActionCard
                icon={<HiShieldCheck className="text-4xl text-red-500" />}
                title="Admin"
                description="Manage users and submits"
                onClick={() => navigateTo('/admin')}
                className="bg-white/5 border-red-500/50 hover:bg-red-500/30"
              />
            )}
          </div>

          {fetchError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
              <p>{fetchError}</p>
              <button
                className="mt-2 text-sm underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <div className="flex border-b border-zinc-600 mb-4">
              {['playlists', 'themes', 'sounds', 'crosshairs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as typeof selectedTab)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 capitalize flex items-center ${
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

            {selectedTab === 'sounds' && <ResourceTable type="sound" />}
            {selectedTab === 'crosshairs' && <ResourceTable type="crosshair" />}
            {selectedTab === 'themes' && <ResourceTable type="theme" />}
            {selectedTab === 'playlists' && <ResourceTable type="playlist" />}
          </div>

          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={handleCloseToast}
          />
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
