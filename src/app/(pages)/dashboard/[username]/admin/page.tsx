'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import AdminDeleteUserButton from '@/components/delete-users-button';
import SignOutButton from '@/components/logout-button';
import DeleteUserButton from '@/components/delete-account-button';
import ActionCard from '@/components/menu-cards';
import Loading from '@/components/loading';
import ConfirmDialog from '@/components/confirm-dialog';
import { ROLES, Role } from '@/types/role';
import { AiFillHeart } from 'react-icons/ai';
import { HiShieldCheck } from 'react-icons/hi';
import { MdUpload, MdDashboard, MdEdit } from 'react-icons/md';
import { Avatar, Badge } from '@radix-ui/themes';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  image: string;
};

type TabType = 'users' | 'submits';

export default function AdminDashboard() {
  // Session & routing hooks
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const usernameFromUrl = params.username;

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role>(ROLES.USER);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('users');
  const [loading, setLoading] = useState(true);

  // Derived state
  const username = session?.user?.name || '';
  const userImage = session?.user?.image || '/default-avatar.png';
  const isAdmin = session?.user?.role === ROLES.ADMIN;

  // Auth & permission checks
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

  // Data fetching
  useEffect(() => {
    if (
      status === 'loading' ||
      !session?.user ||
      session.user.role !== ROLES.ADMIN
    )
      return;

    fetchUsers();
  }, [status, session]);

  // Role dialog description component
  const roleDialogDescription = useMemo(() => {
    if (!selectedUser) return null;

    return (
      <div className="flex items-center gap-3 border  border-zinc-700 p-4 rounded-lg bg-zinc-800">
        <div className="flex-shrink-0 ">
          <Avatar
            src={selectedUser.image}
            fallback={selectedUser.name.charAt(0)}
            size="3"
            variant="solid"
            radius="full"
            color="gray"
          />
        </div>
        <div className="flex-grow">
          <p className="font-medium text-white">{selectedUser.name}</p>
          <p className="text-sm text-gray-400">{selectedUser.email}</p>
        </div>
        <div>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as Role)}
            className="bg-zinc-700 text-white rounded p-2"
            autoFocus
          >
            <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
            <option value={ROLES.USER}>{ROLES.USER}</option>
          </select>
        </div>
      </div>
    );
  }, [selectedUser, newRole]);

  // Handlers
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

      setShowRoleDialog(false);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  // Loading state
  if (status === 'loading') {
    return <Loading />;
  }

  // Auth check
  if (!session?.user || session.user.role !== ROLES.ADMIN) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="group">
        <Sidebar />
      </div>

      <div className="flex-grow h-screen flex flex-col">
        <Spotlight />

        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          {/* Header Section */}
          <section className="flex items-center gap-4 mb-8">
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
          </section>

          {/* Action Cards Section */}
          <section
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
          </section>

          {/* Error Message */}
          {fetchError && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6">
              <p>{fetchError}</p>
              <button
                className="mt-2 text-sm underline"
                onClick={() => fetchUsers()}
              >
                Try again
              </button>
            </div>
          )}

          {/* Main Content Section */}
          <section className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            {/* Tabs */}
            <div className="flex border-b border-zinc-600 mb-4">
              {['users', 'submits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as TabType)}
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

            {/* Users Tab Content */}
            {selectedTab === 'users' && (
              <div className="overflow-auto h-[525px]">
                <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                  <thead className="sticky top-0 z-10">
                    <tr className="text-gray-400">
                      <th className="px-4 py-2">Avatar</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Likes</th>
                      <th className="px-4 py-2">Role</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(20)].map((_, i) => (
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
                            <Avatar
                              src={user.image}
                              fallback={user.name.charAt(0)}
                              size="2"
                              variant="solid"
                              radius="full"
                              color="gray"
                            />
                          </td>
                          <td className="px-4 py-2 relative">
                            <span>{user.name}</span>
                          </td>
                          <td className="px-4 py-2">
                            <span className="truncate max-w-[200px] inline-block">
                              {user.email}
                            </span>
                          </td>
                          <td className="px-4 py-2">coming soon</td>
                          <td className="px-4 py-2">
                            <Badge
                              variant="soft"
                              radius="large"
                              color={
                                user.role === ROLES.ADMIN
                                  ? 'red'
                                  : user.role === ROLES.USER
                                  ? 'blue'
                                  : 'gray'
                              }
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEditRole(user)}
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

            {/* Submits Tab Content */}
            {selectedTab === 'submits' && (
              <div className="text-gray-400 text-sm p-4 border border-zinc-700 rounded-lg">
                <p>No submits to review yet.</p>
              </div>
            )}
          </section>
        </main>

        <div className="px-6">
          <Footer />
        </div>
      </div>

      {/* Role Change Dialog */}
      <ConfirmDialog
        isOpen={showRoleDialog}
        title="Change User Role"
        message={`Are you sure you want to change ${selectedUser?.name}'s role?`}
        onConfirm={handleRoleChange}
        onCancel={() => setShowRoleDialog(false)}
        confirmText="Save Changes"
        cancelText="Cancel"
        confirmVariant="solid"
        confirmColor="green"
        closeOnEscape={true}
        size="medium"
        description={roleDialogDescription}
      />
    </div>
  );
}
