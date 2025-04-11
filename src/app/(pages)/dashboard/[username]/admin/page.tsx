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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const usernameFromUrl = params?.username;

  const username = session?.user?.name || 'User';
  const userImage = session?.user?.image || '/default-avatar.png';

  type Role = 'Admin' | 'User';

  type User = {
    id: string;
    name: string;
    email: string;
    role: Role;
    image: string;
  };

  type UserApiResponse = {
    id: string;
    name: string;
    email: string;
    role: Role;
    image: string;
  };

  const [editedUsers, setEditedUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>('User');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/get-all');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data: UserApiResponse[] = await res.json();

        const formattedUsers: User[] = data.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role === 'Admin' || u.role === 'User' ? u.role : 'User',
          image: u.image || '/default-avatar.png',
        }));

        setEditedUsers(formattedUsers);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/api/auth/signin');
    } else if (usernameFromUrl !== session?.user?.name) {
      router.push(`/dashboard/${session.user.name}/admin`);
    }
  }, [session, status, usernameFromUrl, router]);

  const handleDashboardClick = () =>
    router.push(`/dashboard/${session?.user?.name}`);
  const handleLikesClick = () =>
    router.push(`/dashboard/${session?.user?.name}/likes`);
  const handleSubmitClick = () =>
    router.push(`/dashboard/${session?.user?.name}/submit`);
  const handleAdminClick = () =>
    router.push(`/dashboard/${session?.user?.name}/admin`);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewRole('User');
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    const updated = [...editedUsers];
    const userIndex = updated.findIndex((u) => u.id === selectedUser.id);
    if (userIndex !== -1) {
      updated[userIndex].role = newRole;
      setEditedUsers(updated);
    }

    try {
      const res = await fetch('/api/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, newRole }),
      });

      if (!res.ok) throw new Error('Failed to update role');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to update role.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

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
              <p className="text-gray-400 text-lg">Manage your users here.</p>
            </div>
            <SignOutButton />
            <DeleteUserButton />
          </div>

          {/* Stats Section */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <ActionCard
              icon={<MdDashboard className="text-4xl text-blue-500" />}
              title="Dashboard"
              description="Overview"
              onClick={handleDashboardClick}
              className="bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30"
            />
            <ActionCard
              icon={<BiHeart className="text-4xl text-pink-500" />}
              title="Likes"
              description="View your favorites"
              onClick={handleLikesClick}
              className="bg-pink-500/20 border-pink-500/50 hover:bg-pink-500/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-green-500" />}
              title="Submit"
              description="Upload new content"
              onClick={handleSubmitClick}
              className="bg-green-500/20 border-green-500/50 hover:bg-green-500/30"
            />
            <ActionCard
              icon={
                <MdOutlineAdminPanelSettings className="text-4xl text-red-500" />
              }
              title="Admin"
              description="Manage users and submits"
              onClick={handleAdminClick}
              className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            />
          </div>

          {/* User Management Table */}
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
                  {loadingUsers ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : (
                    editedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="bg-zinc-700 hover:bg-zinc-600 transition-all duration-300"
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
                            onClick={() => openModal(user)}
                            className="text-blue-500 hover:text-blue-400 transition-all duration-300"
                          >
                            <MdEdit className="text-xl" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div
            className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-zinc-700 p-6 rounded-xl shadow-lg w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                Edit Role for {selectedUser.name}
              </h2>
              <select
                className="w-full p-2 bg-zinc-800 text-white rounded-xl"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 rounded-xl text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleChange}
                  className="px-4 py-2 bg-green-500 rounded-xl text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 transition-all duration-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}
