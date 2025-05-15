'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import Footer from '@/components/footer';
import Background from '@/components/background';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';

import { ROLES } from '@/types/role';

export default function LikesDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams() as { username: string };

  const user = session?.user;

  useEffect(() => {
    if (status !== 'authenticated') return;

    if (!user) {
      router.replace('/api/auth/signin');
    } else if (usernameFromUrl !== user.name) {
      router.replace(`/dashboard/${user.name}/likes`);
    }
  }, [status, user, usernameFromUrl, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (status !== 'authenticated' || !user || usernameFromUrl !== user.name) {
    return null;
  }

  const isAdmin = user.role === ROLES.ADMIN;

  const navigateTo = (path: string) => {
    if (!user?.name) {
      router.push('/api/auth/signin');
      return;
    }
    router.push(`/dashboard/${user.name}${path}`);
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <main className="flex-grow flex flex-col transition-all duration-300 p-8">
          <DashboardHeader
            userImage={user.image || '/default-avatar.png'}
            username={user.name || 'User'}
            subtitle="Likes you've given."
          />

          <DashboardTabs
            isAdmin={isAdmin}
            navigateTo={navigateTo}
            currentPath="/likes"
          />

          <section className="bg-zinc-800 p-4 h-full rounded-lg shadow-lg border border-zinc-700">
            <h2 className="text-xl font-bold mb-4">Likes</h2>
            <p className="text-gray-400">Everything you've liked.</p>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
