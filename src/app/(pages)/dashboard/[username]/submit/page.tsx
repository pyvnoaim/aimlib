'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { ROLES } from '@/types/role';
import Loading from '@/components/loading';

export default function SubmitDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const usernameFromUrl = params.username;

  const { user } = session || {};
  const username = user?.name || 'User';
  const userImage = user?.image || '/default-avatar.png';
  const isAdmin = user?.role === ROLES.ADMIN;

  useEffect(() => {
    if (status === 'loading') return;

    if (!user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== user?.name) {
      router.push(`/dashboard/${user.name}/submit`);
    }
  }, [user, status, usernameFromUrl, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (!user || usernameFromUrl !== user?.name) return null;

  const navigateTo = (path: string) => {
    if (!user?.name) {
      router.push('/api/auth/signin');
      return;
    }
    router.push(`/dashboard/${user.name}${path}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <Spotlight />
      <div className="group relative z-10">
        <Sidebar />
      </div>
      <div className="flex-grow h-screen flex flex-col z-10">
        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          <DashboardHeader
            userImage={userImage}
            username={username}
            subtitle="Upload new content."
          />

          <DashboardTabs
            isAdmin={isAdmin}
            navigateTo={navigateTo}
            currentPath="/submit"
          />

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Submit Files</h2>
            <p className="text-gray-400">This feature is coming soon.</p>
          </div>
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
