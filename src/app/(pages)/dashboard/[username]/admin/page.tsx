'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import Footer from '@/components/footer';
import Background from '@/components/background';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { Avatar } from '@heroui/avatar';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';

import { ROLES } from '@/types/role';
import { User } from '@/types/user';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams() as { username: string };

  const user = session?.user;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    if (!user) {
      router.replace('/api/auth/signin');
    } else if (usernameFromUrl !== user.name) {
      router.replace(`/dashboard/${user.name}/admin`);
    } else if (user.role === ROLES.ADMIN) {
      getUsers().then(setUsers);
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

  async function getUsers() {
    try {
      const response = await fetch('/api/users');
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
            userImage={user.image || '/default-avatar.png'}
            username={user.name || 'User'}
            subtitle="Manage users and submissions."
          />

          <DashboardTabs
            isAdmin={isAdmin}
            navigateTo={navigateTo}
            currentPath="/admin"
          />

          <section className="bg-zinc-800 p-4 h-full rounded-lg shadow-lg border border-zinc-700">
            <table className="w-full overflow-auto">
              <thead>
                <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800/50 backdrop-blur-sm   ">
                  <th className="p-2 text-left">Avatar</th>
                  <th className="p-2 text-center">Name</th>
                  <th className="p-2 text-center">Email</th>
                  <th className="p-2 text-center">Role</th>
                  <th className="p-2 text-center">Created At</th>
                  <th className="p-2 text-center">Updated At</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="text-white text-sm text-left hover:bg-zinc-700/50 transition-all duration-300 border-b border-zinc-700"
                  >
                    <td className="p-2 text-left">
                      <Avatar
                        src={user.image || '/default-avatar.png'}
                        showFallback
                        name={user.name?.charAt(0) || 'U'}
                        alt="Avatar"
                        size="sm"
                        radius="full"
                      />
                    </td>
                    <td className="p-2 text-center">{user.name}</td>
                    <td className="p-2 text-center">{user.email}</td>
                    <td className="p-2 text-center">
                      <Chip
                        color={user.role === ROLES.ADMIN ? 'danger' : 'primary'}
                        size="sm"
                        radius="sm"
                        variant="flat"
                      >
                        {user.role}
                      </Chip>
                    </td>
                    <td className="p-2 text-center">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-2 text-center">
                      {new Date(user.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="p-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        color="primary"
                        onClick={() => {
                          addToast({
                            title: 'Edit',
                            description: 'Edit user',
                            color: 'secondary',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
