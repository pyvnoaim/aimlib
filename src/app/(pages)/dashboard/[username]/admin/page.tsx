'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdUpload, MdDashboard, MdEdit, MdContentCopy } from 'react-icons/md';
import AdminDeleteUserButton from '@/components/admin-delete-user-button';
import SignOutButton from '@/components/logout-button';
import DeleteUserButton from '@/components/delete-user-button';
import ActionCard from '@/components/actioncards';
import Toast from '@/components/toast';
import Image from 'next/image';
import { ROLES, Role } from '@/types/role';
import Loading from '@/components/loading';

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
  const params = useParams<{ username: string }>();
  const usernameFromUrl = params.username;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>(ROLES.USER);
  const [showModal, setShowModal] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'users' | 'submits'>('users');
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    if (session.user.role !== ROLES.ADMIN) {
      router.push('/unauthorized');
      return;
    }

    if (usernameFromUrl !== session.user.name) {
      router.push(`/dashboard/${session.user.name}/admin`);
      return;
    }
  }, [session, status, usernameFromUrl, router]);

  useEffect(() => {
    if (
      status === 'loading' ||
      !session?.user ||
      session.user.role !== ROLES.ADMIN
    )
      return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/users/get-users', {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch users');
        }

        const data: User[] = await res.json();
        setUsers(data);
        setFetchError(null);
      } catch (err) {
        console.error('Failed to load users:', err);
        setFetchError(
          typeof err === 'object' && err !== null && 'message' in err
            ? String(err.message)
            : 'Oops! Something went wrong while loading users.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [status, session]);

  const navigateTo = (path: string) => {
    const username = session?.user?.name;
    if (username) {
      router.push(`/dashboard/${username}${path}`);
    } else {
      router.push('/api/auth/signin');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !session?.user?.id) return;

    try {
      const res = await fetch('/api/users/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newRole,
          currentUserId: session.user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update role');
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        )
      );

      setShowModal(false);
      showToast(
        `Role updated to ${newRole} successfully for ${selectedUser.name}.`,
        'success'
      );
    } catch (error) {
      console.error('Failed to update role:', error);
      showToast(
        typeof error === 'object' && error !== null && 'message' in error
          ? String(error.message)
          : 'Failed to update role.',
        'error'
      );
    }
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return null;
  }

  const username = session.user.name;
  const userImage = session.user.image || '/default-avatar.png';
  const isAdmin = session.user.role === ROLES.ADMIN;

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
              <p className="text-gray-400 text-lg">Manage users and submits.</p>
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
              onClick={() => navigateTo('')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<AiFillHeart className="text-4xl text-purple-400" />}
              title="Likes"
              description="View your favorites"
              onClick={() => navigateTo('/likes')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            <ActionCard
              icon={<MdUpload className="text-4xl text-purple-400" />}
              title="Submit"
              description="Upload new content"
              onClick={() => navigateTo('/submit')}
              className="bg-white/5 border-purple-400/50 hover:bg-purple-400/30"
            />
            {isAdmin && (
              <ActionCard
                icon={<HiShieldCheck className="text-4xl text-red-500" />}
                title="Admin"
                description="Manage users and submits"
                onClick={() => navigateTo('/admin')}
                className="bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
              />
            )}
          </div>

          {fetchError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
              <p>{fetchError}</p>
              <button
                className="mt-2 text-sm underline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <div className="flex border-b border-zinc-600 mb-4">
              {['users', 'submits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as 'users' | 'submits')}
                  className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    selectedTab === tab
                      ? 'border-b-2 border-purple-400 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {selectedTab === 'users' && (
              <div className="overflow-auto max-h-[540px]">
                <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                  <thead className="sticky top-0 z-10">
                    <tr className="text-gray-400">
                      <th className="px-4 py-2">Avatar</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="bg-zinc-700 animate-pulse">
                          <td className="px-4 py-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-600" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-4 w-24 bg-zinc-600 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-4 w-32 bg-zinc-600 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="h-4 w-16 bg-zinc-600 rounded" />
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded bg-zinc-600" />
                              <div className="w-6 h-6 rounded bg-zinc-600" />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-4 text-gray-400"
                        >
                          No users yet. New users will appear here once they
                          register.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="bg-zinc-700 transition-all duration-300 hover:bg-zinc-600"
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
                          <td
                            className="px-4 py-2 relative"
                            onMouseEnter={() => setHoveredUserId(user.id)}
                            onMouseLeave={() => setHoveredUserId(null)}
                          >
                            <span>{user.name}</span>
                            {hoveredUserId === user.id && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(user.name);
                                  showToast(
                                    `Copied "${user.name}" to clipboard!`,
                                    'info'
                                  );
                                }}
                                className="absolute ml-2 mt-0.5 text-gray-400 hover:text-white transition-all duration-300"
                                title="Copy username"
                              >
                                <MdContentCopy className="text-lg" />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <span className="truncate max-w-[200px] inline-block">
                              {user.email}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                user.role === ROLES.ADMIN
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setNewRole(user.role);
                                  setShowModal(true);
                                }}
                                aria-label={`Edit role for ${user.name}`}
                                className="text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-300"
                                title="Edit role"
                              >
                                <MdEdit className="w-4 h-4" />
                              </button>
                              <AdminDeleteUserButton
                                userId={user.id}
                                userName={user.name}
                                onSuccess={() => {
                                  setUsers((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  showToast(
                                    `User ${user.name} deleted successfully.`,
                                    'success'
                                  );
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'submits' && (
              <div className="text-gray-400 text-sm p-4 border border-zinc-700 rounded-lg">
                <p>No submits to review yet.</p>
              </div>
            )}
          </div>

          {showModal && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
              <div
                className="bg-zinc-800 p-6 rounded-xl w-96 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">
                  Change Role for {selectedUser.name}
                </h2>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Role:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="bg-zinc-700 text-white rounded p-2 w-full"
                    autoFocus
                  >
                    <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
                    <option value={ROLES.USER}>{ROLES.USER}</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-zinc-600 hover:bg-zinc-500 px-4 py-2 rounded text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleRoleChange}
                    className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <FaCheck /> Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={handleCloseToast}
          />
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}
