'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiUser, BiBarChart, BiCog } from 'react-icons/bi';
import SignOutButton from '@/components/ui/buttons/logout-button';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/api/auth/signin');
    return null;
  }

  const username = session?.user?.name || 'User';
  const userImage = session?.user?.image || '/default-avatar.png';

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

        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={userImage}
              alt="User Profile"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-grow">
              <h1 className="font-extrabold text-4xl">
                Welcome Back, {username}!
              </h1>
              <p className="text-gray-400 text-lg">
                Here’s what’s happening today.
              </p>
            </div>
            {/* Sign Out Button */}
            <SignOutButton />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-4 bg-purple-500/20 p-4 rounded-xl border border-purple-500/50 shadow-lg">
              <BiUser className="text-4xl text-purple-500" />
              <div>
                <p className="text-lg font-semibold">Profile</p>
                <p className="text-sm text-gray-400">View and update details</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-blue-500/20 p-4 rounded-xl border border-blue-500/50 shadow-lg">
              <BiBarChart className="text-4xl text-blue-500" />
              <div>
                <p className="text-lg font-semibold">Activity</p>
                <p className="text-sm text-gray-400">Track your progress</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-green-500/20 p-4 rounded-xl border border-green-500/50 shadow-lg">
              <BiCog className="text-4xl text-green-500" />
              <div>
                <p className="text-lg font-semibold">Settings</p>
                <p className="text-sm text-gray-400">Manage preferences</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <p className="text-gray-400">No recent activity yet.</p>
          </div>

          {/* Footer */}
          <div className="mt-auto px-4 transition-all duration-300">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
