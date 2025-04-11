'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiHeart } from 'react-icons/bi';
import {
  MdOutlineAdminPanelSettings,
  MdUpload,
  MdDashboard,
} from 'react-icons/md';
import DeleteUserButton from '@/components/ui/auth-buttons/delete-user-button';
import ActionCard from '@/components/ui/dashboard-actioncards/actioncards';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import Image from 'next/image';

export default function LikeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams();

  const username = session?.user?.name;
  const userImage = session?.user?.image || '/default-avatar.png';

  useEffect(() => {
    if (status === 'loading') return;

    if (!username) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== username) {
      router.push(`/dashboard/${username}/likes`);
    }
  }, [status, username, usernameFromUrl, router]);

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
      <Sidebar />

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
              icon={<MdDashboard className="text-4xl text-blue-500" />}
              title="Dashboard"
              description="Overview"
              onClick={() => navigateTo('')}
              className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30"
            />
            <ActionCard
              icon={<BiHeart className="text-4xl text-pink-500" />}
              title="Likes"
              description="View your favorites"
              onClick={() => navigateTo('/likes')}
              className="bg-pink-500/20 border-pink-500/50 hover:bg-pink-500/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-green-500" />}
              title="Submit"
              description="Upload new content"
              onClick={() => navigateTo('/submit')}
              className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30"
            />
            <ActionCard
              icon={
                <MdOutlineAdminPanelSettings className="text-4xl text-red-500" />
              }
              title="Admin"
              description="Manage users and submits"
              onClick={() => navigateTo('/admin')}
              className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            />
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Your Likes</h2>
            <p className="text-gray-400">
              This feature is coming soon! Stay tuned for updates.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
