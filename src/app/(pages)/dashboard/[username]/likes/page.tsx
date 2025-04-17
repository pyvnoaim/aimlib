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
  const { username: usernameFromUrl } = useParams();
  const [selectedTab, setSelectedTab] = useState<
    'playlists' | 'themes' | 'sounds' | 'crosshairs'
  >('playlists');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );
  const username = session?.user?.name;
  const userImage = session?.user?.image || '/default-avatar.png';
  const [likedResources, setLikedResources] = useState<LikedResource[]>([]);
  const [isLikesLoading, setIsLikesLoading] = useState(true);
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!username) router.push('/api/auth/signin');
    else if (usernameFromUrl !== username)
      router.push(`/dashboard/${username}/likes`);
  }, [status, username, usernameFromUrl, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchLikes = async () => {
      try {
        const res = await fetch('/api/likes/get-user-likes');
        const data = await res.json();
        setLikedResources(data);
      } catch {
        setToast({
          message: 'Failed to fetch likes',
          type: 'error',
          isVisible: true,
        });
      } finally {
        setIsLikesLoading(false);
      }
    };
    fetchLikes();
  }, [status]);

  const countByType = {
    playlists: likedResources.filter((r) => r.type === 'playlist').length,
    themes: likedResources.filter((r) => r.type === 'theme').length,
    sounds: likedResources.filter((r) => r.type === 'sound').length,
    crosshairs: likedResources.filter((r) => r.type === 'crosshair').length,
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const playSound = (fileUrl: string, id: string) => {
    const audio = new Audio(fileUrl);
    setCurrentlyPlayingId(id);
    audio.play();
    audio.onended = () => setCurrentlyPlayingId(null);
  };

  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'file';
    link.click();
    showToast('Downloading...', 'info');
  };

  const handleLike = async (resource: LikedResource) => {
    try {
      const response = await fetch('/api/likes/like-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: resource.id }),
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
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
          '.ogg',
          ''
        )}"`,
        'success'
      );
    } catch {
      showToast('Failed to toggle like', 'error');
    }
  };

  const navigateTo = (path: string) => {
    if (!username) router.push('/api/auth/signin');
    else router.push(`/dashboard/${username}${path}`);
  };

  const renderEmptyState = (text: string) => (
    <div className="text-center text-gray-400 py-10">{text}</div>
  );

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

    if (isLikesLoading) {
      return <p>Loading {type}s...</p>;
    }

    if (resources.length === 0) {
      return renderEmptyState(`You haven't liked any ${type}s yet.`);
    }

    return (
      <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
        <thead>
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
              className="bg-zinc-700 hover:bg-zinc-600 transition-all duration-300"
            >
              <td className="px-4 py-2">
                {resource.type === 'sound' && (
                  <button
                    onClick={() =>
                      currentlyPlayingId === resource.id
                        ? setCurrentlyPlayingId(null)
                        : playSound(resource.filePath, resource.id)
                    }
                    className="text-purple-400 p-2 hover:text-purple-300"
                  >
                    {currentlyPlayingId === resource.id ? (
                      <FaPause className="text-xl w-4 h-4" />
                    ) : (
                      <FaPlay className="text-xl w-4 h-4" />
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
              </td>
              <td className="px-4 py-2">
                {resource.name.replace(/\.(ogg|png)$/, '')}
              </td>
              <td className="px-4 py-2">{resource.likes}</td>
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
                <div className="flex gap-2">
                  {resource.type === 'sound' && (
                    <button
                      onClick={() => handleDownload(resource.filePath)}
                      className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                    >
                      <LuDownload className="w-4 h-4" />
                    </button>
                  )}
                  {resource.type === 'crosshair' && (
                    <button
                      onClick={() => handleDownload(resource.filePath)}
                      className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                    >
                      <LuDownload className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleLike(resource)}
                    className={`rounded-lg p-2 transition-all duration-300 ${
                      resource.isLiked
                        ? 'text-red-500 hover:bg-red-500/20'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (!username || usernameFromUrl !== username) return null;

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
                <span className="bg-clip-text text-transparent bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 text-4xl">
                  {username}
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Here&apos;s what you&apos;ve liked.
              </p>
            </div>
            <SignOutButton />
            <DeleteUserButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <ActionCard
              icon={<HiShieldCheck className="text-4xl text-red-500" />}
              title="Admin"
              description="Manage users and submits"
              onClick={() => navigateTo('/admin')}
              className="bg-white/5 border-red-500/50 hover:bg-red-500/30"
            />
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
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
