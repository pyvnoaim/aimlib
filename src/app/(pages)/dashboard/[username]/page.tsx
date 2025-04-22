'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import { MdUpload, MdDashboard } from 'react-icons/md';
import DeleteUserButton from '@/components/ui/auth-buttons/delete-user-button';
import ActionCard from '@/components/ui/dashboard-actioncards/actioncards';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import Image from 'next/image';
import { ROLES } from '@/types/role';
import Loading from '@/components/layouts/loading/loading';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams();

  const { user } = session || {};
  const username = user?.name || 'User';
  const userImage = user?.image || '/default-avatar.png';
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    if (status === 'loading') return;

    if (!user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== user?.name) {
      router.push(`/dashboard/${user.name}`);
    }
  }, [user, status, usernameFromUrl, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (!user || usernameFromUrl !== user?.name) {
    return null;
  }

  const navigateTo = (path: string) => {
    if (!user?.name) {
      router.push('/api/auth/signin');
      return;
    }
    router.push(`/dashboard/${user.name}${path}`);
  };

  const handleDashboardClick = () => navigateTo('');
  const handleLikesClick = () => navigateTo('/likes');
  const handleSubmitClick = () => navigateTo('/submit');
  const handleAdminClick = () => navigateTo('/admin');

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

          <div
            className={`grid ${
              isAdmin ? 'grid-cols-4' : 'grid-cols-3'
            } gap-6 mb-8`}
          >
            <ActionCard
              icon={<MdDashboard className="text-4xl text-purple-400" />}
              title="Dashboard"
              description="Overview"
              onClick={handleDashboardClick}
              className="bg-purple-400/20 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<AiFillHeart className="text-4xl text-purple-400" />}
              title="Likes"
              description="View your favorites"
              onClick={handleLikesClick}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-purple-400" />}
              title="Submit"
              description="Upload new content"
              onClick={handleSubmitClick}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            {isAdmin && (
              <ActionCard
                icon={<HiShieldCheck className="text-4xl text-red-500" />}
                title="Admin"
                description="Manage users and submits"
                onClick={handleAdminClick}
                className="bg-white/5 border-red-500/50 hover:bg-red-500/30"
              />
            )}
          </div>

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity yet.</p>
          </div>
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
