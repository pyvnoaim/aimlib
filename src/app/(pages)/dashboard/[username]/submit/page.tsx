'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import Footer from '@/components/footer';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { ROLES } from '@/types/role';
import Loading from '@/components/loading';
import Background from '@/components/background';
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
    <div className="flex min-h-screen bg-zinc-900">
      <Background />
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

          <section className="bg-zinc-800 p-6 h-[646px] rounded-lg shadow-lg border border-zinc-700">
            <h2 className="text-xl font-bold mb-4">Submit Files</h2>
            <p className="text-gray-400">This feature is coming soon.</p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
