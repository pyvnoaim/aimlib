'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiHeart, BiUpload, BiBell, BiUser } from 'react-icons/bi';
import SignOutButton from '@/components/ui/buttons/logout-button';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username;

  const username = session?.user?.name || 'User';
  const userImage = session?.user?.image || '/default-avatar.png';

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== session?.user?.name) {
      router.push(`/dashboard/${session.user.name}/likes`);
    }
  }, [session, status, usernameFromUrl, router]);

  if (!session?.user || usernameFromUrl !== session?.user?.name) return null;

  // Handlers for stat cards
  const handleDashboardClick = () => {
    router.push(`/dashboard/${session?.user?.name}`);
  };

  const handleLikesClick = () => {
    router.push(`/dashboard/${session?.user?.name}/likes`);
  };

  const handleSubmitClick = () => {
    router.push(`/dashboard/${session?.user?.name}/submit`);
  };

  const handleUserClick = () => {
    router.push(`/dashboard/${session?.user?.name}/admin`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      {/* Sidebar */}
      <div className="group">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow h-screen flex flex-col">
        {/* Spotlight */}
        <Spotlight />

        {/* Main */}
        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          {/* User Info */}
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
                Here’s what’s happening today.
              </p>
            </div>
            <SignOutButton />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Dashboard */}
            <div
              className="flex items-center gap-4 bg-blue-500/20 p-4 rounded-xl border border-blue-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-blue-500/30"
              onClick={handleDashboardClick}
            >
              <BiBell className="text-4xl text-blue-500" />
              <div>
                <p className="text-lg font-semibold">Dashboard</p>
                <p className="text-sm text-gray-400">Overview & stats</p>
              </div>
            </div>

            {/* Likes */}
            <div
              className="flex items-center gap-4 bg-pink-500/20 p-4 rounded-xl border border-pink-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-pink-500/30"
              onClick={handleLikesClick}
            >
              <BiHeart className="text-4xl text-pink-500" />
              <div>
                <p className="text-lg font-semibold">Likes</p>
                <p className="text-sm text-gray-400">View your favorites</p>
              </div>
            </div>

            {/* Submit */}
            <div
              className="flex items-center gap-4 bg-green-500/20 p-4 rounded-xl border border-green-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-green-500/30"
              onClick={handleSubmitClick}
            >
              <BiUpload className="text-4xl text-green-500" />
              <div>
                <p className="text-lg font-semibold">Submit</p>
                <p className="text-sm text-gray-400">Upload new content</p>
              </div>
            </div>

            {/* User */}
            <div
              className="flex items-center gap-4 bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/50 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-yellow-500/30"
              onClick={handleUserClick}
            >
              <BiUser className="text-4xl text-yellow-500" />
              <div>
                <p className="text-lg font-semibold">User</p>
                <p className="text-sm text-gray-400">Manage users (Admin)</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity yet.</p>
          </div>
        </main>

        {/* Footer */}
        <div className="px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}
