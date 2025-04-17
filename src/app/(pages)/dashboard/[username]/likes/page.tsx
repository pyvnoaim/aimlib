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
import { FaPlay, FaPause, FaDownload, FaHeart } from 'react-icons/fa';
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

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!username) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== username) {
      router.push(`/dashboard/${username}/likes`);
    }
  }, [status, username, usernameFromUrl, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const fetchLikes = async () => {
      try {
        const res = await fetch('/api/likes/get-user-likes');
        const data = await res.json();
        setLikedResources(data);
      } catch {
        showToast('Failed to fetch likes', 'error');
      } finally {
        setIsLikesLoading(false);
      }
    };
    fetchLikes();
  }, [status]);

  const playSound = (fileUrl: string, id: string) => {
    const audio = new Audio(fileUrl);
    setCurrentlyPlayingId(id);
    audio.play();
    audio.onended = () => setCurrentlyPlayingId(null);
  };

  const handleDownload = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop() || 'sound.ogg';
    link.click();
    showToast('Downloading sound...', 'info');
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

  if (!username || usernameFromUrl !== username) return null;

  const navigateTo = (path: string) => {
    if (!username) {
      router.push('/api/auth/signin');
    } else {
      router.push(`/dashboard/${username}${path}`);
    }
  };

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
              <p className="text-gray-400 text-lg">Here’s what you’ve liked.</p>
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
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 capitalize ${
                    selectedTab === tab
                      ? 'border-b-2 border-purple-400 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {selectedTab === 'sounds' && (
              <div className="text-gray-300 text-sm">
                {isLikesLoading ? (
                  <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Play</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Likes</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index} className="animate-pulse bg-zinc-700">
                          <td className="px-4 py-2">
                            <div className="w-6 h-6 bg-zinc-600 rounded-full" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="w-32 h-4 bg-zinc-600 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="w-10 h-4 bg-zinc-600 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 bg-zinc-600 rounded" />
                              <div className="w-6 h-6 bg-zinc-600 rounded" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : likedResources.filter((r) => r.type === 'sound').length ===
                  0 ? (
                  <p>You haven’t liked any sounds yet.</p>
                ) : (
                  <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-400 sticky top-0 z-10 backdrop-blur-lg">
                        <th className="px-4 py-2">Play</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Likes</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {likedResources
                        .filter((r) => r.type === 'sound')
                        .map((sound) => (
                          <tr
                            key={sound.id}
                            className="bg-zinc-700 hover:bg-zinc-600 transition-all"
                          >
                            <td className="px-4 py-2">
                              <button
                                onClick={() =>
                                  currentlyPlayingId === sound.id
                                    ? setCurrentlyPlayingId(null)
                                    : playSound(sound.filePath, sound.id)
                                }
                                className="text-purple-400 p-2 hover:text-purple-300"
                              >
                                {currentlyPlayingId === sound.id ? (
                                  <FaPause className="text-xl w-4 h-4" />
                                ) : (
                                  <FaPlay className="text-xl w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-2">
                              {sound.name.replace('.ogg', '')}
                            </td>
                            <td className="px-4 py-2">{sound.likes}</td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDownload(sound.filePath)}
                                  className="text-white hover:bg-white/10 rounded-lg p-2"
                                >
                                  <FaDownload className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleLike(sound)}
                                  className={`rounded-lg p-2 ${
                                    sound.isLiked
                                      ? 'text-red-500 hover:bg-red-500/20'
                                      : 'text-white hover:bg-white/10'
                                  }`}
                                >
                                  <FaHeart
                                    className={`w-4 h-4 ${
                                      sound.isLiked ? 'text-red-500' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {selectedTab !== 'sounds' && (
              <div className="text-gray-300 text-sm">
                <p>You haven’t liked any {selectedTab} yet.</p>
              </div>
            )}
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
