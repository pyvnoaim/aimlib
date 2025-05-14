'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Footer from '@/components/footer';
import { Spotlight } from '@/components/spotlight-new';
import Loading from '@/components/loading';
import ConfirmDialog from '@/components/confirm-dialog';
import Dropdown from '@/components/dropdown';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import { ROLES, Role } from '@/types/role';
import { User } from '@/types/user';

import { Avatar, Badge } from '@radix-ui/themes';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('users');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state
  const username = session?.user.name || '';
  const userImage = session?.user.image || '';
  const isAdmin = session?.user.role === ROLES.ADMIN;

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
      <div className="flex items-center gap-3 border border-zinc-700 p-4 rounded-lg bg-zinc-800">
        <div className="flex-shrink-0">
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

  // Delete dialog description component
  const deleteDialogDescription = useMemo(() => {
    if (!selectedUser) return null;

    return (
      <div className="flex items-center gap-3 border border-zinc-700 p-4 rounded-lg bg-zinc-800">
        <div className="flex-shrink-0">
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
          <p className="text-sm text-red-400 mt-2">
            This action cannot be undone. The user will lose access to all their
            content.
          </p>
        </div>
      </div>
    );
  }, [selectedUser]);

  // Error message component
  const ErrorMessage = ({ message }: { message: string | null }) => {
    if (!message) return null;

    return (
      <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm">
        {message}
      </div>
    );
  };

  // Handlers
  const fetchUsers = async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data: User[] = await res.json();
      setUsers(data);
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
    const username = session?.user.name;
    if (username) {
      router.push(`/dashboard/${username}${path}`);
    } else {
      router.push('/api/auth/signin');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !session?.user.id) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update role');
      }

      const { user } = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: user.role } : u
        )
      );

      setShowRoleDialog(false);
    } catch (error) {
      console.error('Failed to update role:', error);
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to update user role. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to delete user. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
    setActionError(null);
  };

  const handleDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
    setActionError(null);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const userLocale = navigator.language || 'en-US';

    const is12HourFormat = new Intl.DateTimeFormat(userLocale, {
      hour: 'numeric',
    })
      .formatToParts(date)
      .some((part) => part.type === 'dayPeriod');

    const formatter = new Intl.DateTimeFormat(userLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: is12HourFormat ? 'h12' : 'h23',
    });

    return formatter.format(date);
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
      <Spotlight />
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      <div className="flex-grow h-screen flex flex-col z-10">
        <main className="flex-grow flex flex-col transition-all duration-300 p-6">
          <DashboardHeader
            userImage={userImage}
            username={username}
            subtitle="Manage users and submits."
          />

          <DashboardTabs
            isAdmin={isAdmin}
            navigateTo={navigateTo}
            currentPath="/admin"
          />

          {/* Main Content Section */}
          <section className="bg-zinc-800 p-6 rounded-xl shadow-lg border border-zinc-700">
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
              <div className="overflow-auto max-h-[550px]">
                {fetchError ? (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex flex-col items-center justify-center h-full">
                    <p className="text-center mb-2">{fetchError}</p>
                    <button
                      className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 transition-colors duration-300 rounded-lg text-white"
                      onClick={() => fetchUsers()}
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <table className="w-full table-auto text-left text-sm border-separate border-spacing-y-2">
                    <thead className="sticky top-0 z-10">
                      <tr className="text-gray-400">
                        <th className="px-4 py-2">Avatar</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Created At</th>
                        <th className="px-4 py-2">Updated At</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="bg-zinc-700/50 animate-pulse">
                            <td className="px-4 py-2">
                              <div className="w-8 h-8 rounded-full bg-zinc-600/50" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-5 w-32 bg-zinc-600/50 rounded" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-5 w-48 bg-zinc-600/50 rounded" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-6 w-16 bg-zinc-600/50 rounded-full" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-5 w-36 bg-zinc-600/50 rounded" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-5 w-36 bg-zinc-600/50 rounded" />
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-8 w-16 bg-zinc-600/50 rounded" />
                            </td>
                          </tr>
                        ))
                      ) : users.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
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
                              <span className="truncate">{user.email}</span>
                            </td>
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
                              <div className="flex flex-col text-xs text-gray-300">
                                <span className="text-white">
                                  {formatDate(user.createdAt)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex flex-col text-xs text-gray-300">
                                <span className="text-white">
                                  {formatDate(user.updatedAt)}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              <Dropdown
                                label="Edit"
                                items={[
                                  {
                                    label: 'Change Role',
                                    onClick: () => handleEditRole(user),
                                    disabled: session.user.id === user.id,
                                  },
                                  { type: 'separator' },
                                  {
                                    label: 'Delete User',
                                    color: 'red',
                                    onClick: () => handleDeleteConfirm(user),
                                    disabled: session.user.id === user.id,
                                  },
                                ]}
                                disabled={session.user.id === user.id}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
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
        confirmText={isSubmitting ? 'Saving...' : 'Save Changes'}
        cancelText="Cancel"
        confirmVariant="solid"
        confirmColor="green"
        closeOnEscape={!isSubmitting}
        size="medium"
        description={
          <>
            {roleDialogDescription}
            <ErrorMessage message={actionError} />
          </>
        }
      />

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}'s account?`}
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText={isSubmitting ? 'Deleting...' : 'Delete User'}
        cancelText="Cancel"
        confirmVariant="solid"
        confirmColor="red"
        closeOnEscape={!isSubmitting}
        size="medium"
        description={
          <>
            {deleteDialogDescription}
            <ErrorMessage message={actionError} />
          </>
        }
      />
    </div>
  );
}
