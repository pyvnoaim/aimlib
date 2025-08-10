'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Footer from '@/components/footer';
import Background from '@/components/background';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboardHeader';
import { ROLES } from '@/types/role';
import { User } from '@/types/user';
import { Avatar } from '@heroui/react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (!user || user.role !== ROLES.ADMIN) {
      router.replace('/');
      return;
    }

    setIsLoading(true);
    getUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, [status, user, router]);

  if (status === 'loading' || isLoading) {
    return <Loading />;
  }

  async function getUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">
      <Background />
      <div className="flex-grow h-screen flex flex-col z-10">
        <main className="flex-grow flex flex-col transition-all duration-300 p-8">
          <DashboardHeader
            userImage={user?.image || '/logo.png'}
            username={user?.name || 'User'}
            subtitle="Overview & Manage users."
          />

          <section className="bg-zinc-800 p-4 h-full rounded-lg shadow-lg border border-zinc-700">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="uppercase text-zinc-400 sticky top-0 bg-zinc-800/95 border-b border-zinc-700">
                  <th className="p-3"></th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-zinc-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-700 hover:bg-zinc-700/50 transition-colors"
                    >
                      <td className="p-3">
                        {user.image ? (
                          <Avatar
                            src={user.image}
                            showFallback
                            name={user.name.charAt(0).toUpperCase()}
                            radius="full"
                            className="w-8 h-8 rounded-full object-cover mx-auto"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-700 mx-auto" />
                        )}
                      </td>

                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
