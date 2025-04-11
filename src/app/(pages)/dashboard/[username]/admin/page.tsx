'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layouts/sidebar/sidebar';
import Footer from '@/components/layouts/footer/footer';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BiHeart } from 'react-icons/bi';
import {
  MdOutlineAdminPanelSettings,
  MdUpload,
  MdDashboard,
  MdEdit,
} from 'react-icons/md';
import SignOutButton from '@/components/ui/auth-buttons/logout-button';
import DeleteUserButton from '@/components/ui/auth-buttons/delete-user-button';
import ActionCard from '@/components/ui/dashboard-actioncards/actioncards';
import Image from 'next/image';

const Roles = {
  ADMIN: 'Admin',
  USER: 'User',
} as const;

type Role = (typeof Roles)[keyof typeof Roles];

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>(Roles.USER);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/get-all');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };

    fetchUsers();
  }, [status]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== session?.user?.name) {
      router.push(`/dashboard/${session.user.name}/admin`);
    }
  }, [session, status, usernameFromUrl, router]);

  const navigateTo = (path: string) => {
    const username = session?.user?.name;
    if (username) {
      router.push(`/dashboard/${username}${path}`);
    } else {
      router.push('/api/auth/signin');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);

    try {
      await fetch('/api/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newRole,
          currentUserId: session?.user?.id,
        }),
      });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Failed to update role.');
    }
  };

  if (status === 'loading' || !session?.user) return null;

  const username = session.user.name;
  const userImage = session.user.image || '/default-avatar.png';

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
              <p className="text-gray-400 text-lg">
                Manage users and submits here.
              </p>
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
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="overflow-auto">
              <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-400">
                    <th className="px-4 py-2">Avatar</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-zinc-700 transition-all duration-300"
                      >
                        <td className="px-4 py-2">
                          <Image
                            src={user.image || '/default-avatar.png'}
                            alt={`${user.name}'s Avatar`}
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                          />
                        </td>
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.role}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setShowModal(true);
                            }}
                            className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                          >
                            <MdEdit className="text-xl w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
              <div className="bg-zinc-800 p-6 rounded-xl w-96">
                <h2 className="text-xl font-bold mb-4">
                  Change Role for {selectedUser.name}
                </h2>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Role:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="bg-zinc-700 text-white rounded p-1 w-full"
                  >
                    <option value={Roles.ADMIN}>{Roles.ADMIN}</option>
                    <option value={Roles.USER}>{Roles.USER}</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRoleChange}
                    className="bg-purple-400 hover:bg-purple-300 px-4 py-2 rounded text-white transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}
