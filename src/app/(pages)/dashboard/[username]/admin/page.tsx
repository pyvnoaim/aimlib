'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import Footer from '@/components/footer';
import Background from '@/components/background';
import Loading from '@/components/loading';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardTabs } from '@/components/dashboard-tabs';
import Button from '@/components/button';
import Drawer from '@/components/drawer';
import Modal from '@/components/modal';
import { Avatar, Chip, Skeleton, addToast } from '@heroui/react';

import { ROLES } from '@/types/role';
import { User } from '@/types/user';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { username: usernameFromUrl } = useParams() as { username: string };

  const user = session?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // States to control modals
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  // Loading states for operations
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    if (user && usernameFromUrl !== user.name) {
      router.replace(`/dashboard/${user.name}/admin`);
      return;
    }
    if (!user) {
      router.replace('/api/auth/signin');
    } else if (usernameFromUrl !== user.name) {
      router.replace(`/dashboard/${user.name}/admin`);
    } else if (user.role === ROLES.ADMIN) {
      setIsLoading(true);
      getUsers()
        .then(setUsers)
        .finally(() => setIsLoading(false));
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

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    setIsUpdatingRole(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedUser.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }

      const result = await response.json();

      // Update the users list with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, role: selectedUser.role } : u
        )
      );

      setIsEditRoleModalOpen(false);
      setIsDrawerOpen(false);
      setSelectedUser(null);

      addToast({
        title: 'User role updated',
        description: 'User role updated successfully!',
        variant: 'solid',
        color: 'success',
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      addToast({
        title: 'User role updated',
        description: 'Failed to update user role!',
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeletingUser(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowSelfDelete: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      // Remove the user from the users list
      setUsers((prevUsers) =>
        prevUsers.filter((u) => u.id !== selectedUser.id)
      );

      // Close modals and drawer
      setIsDeleteUserModalOpen(false);
      setIsDrawerOpen(false);
      setSelectedUser(null);

      addToast({
        title: 'User deleted',
        description: 'User deleted successfully!',
        variant: 'solid',
        color: 'success',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      addToast({
        title: 'User deleted',
        description: 'Failed to delete user!',
        variant: 'solid',
        color: 'danger',
      });
    } finally {
      setIsDeletingUser(false);
    }
  };

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
                <tr className="uppercase text-sm text-zinc-400 sticky top-0 bg-zinc-800/50 backdrop-blur-sm">
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
                {isLoading
                  ? Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr
                          key={`skeleton-${index}`}
                          className="text-white text-sm text-left border-b border-zinc-700"
                        >
                          <td className="p-2 text-left">
                            <Skeleton className="w-8 h-8 rounded-full" />
                          </td>
                          <td className="p-2 text-center">
                            <Skeleton className="w-24 h-6 mx-auto rounded-lg" />
                          </td>
                          <td className="p-2 text-center">
                            <Skeleton className="w-36 h-6 mx-auto rounded-lg" />
                          </td>
                          <td className="p-2 text-center">
                            <Skeleton className="w-16 h-6 mx-auto rounded-lg" />
                          </td>
                          <td className="p-2 text-center">
                            <Skeleton className="w-28 h-6 mx-auto rounded-lg" />
                          </td>
                          <td className="p-2 text-center">
                            <Skeleton className="w-28 h-6 mx-auto rounded-lg" />
                          </td>
                          <td className="p-2 text-right">
                            <Skeleton className="w-12 h-6 ml-auto rounded-lg" />
                          </td>
                        </tr>
                      ))
                  : users.map((user) => (
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
                            color={
                              user.role === ROLES.ADMIN ? 'danger' : 'primary'
                            }
                            size="sm"
                            radius="sm"
                            variant="flat"
                          >
                            {user.role}
                          </Chip>
                        </td>
                        <td className="p-2 text-center">
                          {new Date(user.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {new Date(user.updatedAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            variant="outline"
                            color="primary"
                            size="sm"
                            radius="lg"
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </section>

          {/* Drawer */}
          <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
            {selectedUser ? (
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={selectedUser.image || '/default-avatar.png'}
                    showFallback
                    name={selectedUser.name?.charAt(0) || 'U'}
                    alt="User Avatar"
                    size="md"
                    radius="full"
                  />
                  <p className="text-xl font-semibold">{selectedUser.name}</p>
                </div>

                <p className="text-sm text-zinc-300">
                  Email: {selectedUser.email}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-300">Role:</span>
                  <Chip
                    color={
                      selectedUser.role === ROLES.ADMIN ? 'danger' : 'primary'
                    }
                    size="sm"
                    radius="sm"
                    variant="flat"
                  >
                    {selectedUser.role}
                  </Chip>
                </div>

                <div className="flex gap-3">
                  <Button
                    radius="lg"
                    variant="outline"
                    size="sm"
                    className="flex-grow"
                    onClick={() => setIsEditRoleModalOpen(true)}
                  >
                    Edit Role
                  </Button>

                  <Button
                    radius="lg"
                    variant="outline"
                    color="danger"
                    size="sm"
                    className="flex-grow"
                    onClick={() => setIsDeleteUserModalOpen(true)}
                  >
                    Delete User
                  </Button>
                </div>
              </div>
            ) : (
              <p className="p-4">No user selected</p>
            )}
          </Drawer>

          {/* Edit Role Modal */}
          <Modal
            isOpen={isEditRoleModalOpen}
            onClose={() => setIsEditRoleModalOpen(false)}
            title={`Edit Role for ${selectedUser?.name}`}
          >
            <div className="flex flex-col gap-6 p-6">
              <p className="text-zinc-300 text-sm">
                Change the role of this user. Be careful with admin roles as
                they have full access to the dashboard.
              </p>

              <div>
                <label
                  htmlFor="role-select"
                  className="block mb-2 text-sm font-medium text-zinc-400"
                >
                  Select Role
                </label>
                <select
                  id="role-select"
                  defaultValue={selectedUser?.role}
                  className="w-full p-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    if (selectedUser) {
                      setSelectedUser({
                        ...selectedUser,
                        role: e.target
                          .value as (typeof ROLES)[keyof typeof ROLES],
                      });
                    }
                  }}
                >
                  <option value={ROLES.USER}>User</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  radius="lg"
                  onClick={() => setIsEditRoleModalOpen(false)}
                  disabled={isUpdatingRole}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  variant="solid"
                  color="primary"
                  radius="lg"
                  onClick={handleUpdateRole}
                  disabled={isUpdatingRole}
                >
                  {isUpdatingRole ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Modal>

          {/* Delete User Modal */}
          <Modal
            isOpen={isDeleteUserModalOpen}
            onClose={() => setIsDeleteUserModalOpen(false)}
            title={`Delete User: ${selectedUser?.name}`}
          >
            <div className="p-6 flex flex-col gap-6">
              <p className="text-zinc-300 text-sm">
                Are you sure you want to delete{' '}
                <strong>{selectedUser?.name}</strong>? This action is
                irreversible and will permanently remove all their data.
              </p>

              <div className="flex items-center gap-4">
                <Avatar
                  src={selectedUser?.image || '/default-avatar.png'}
                  showFallback
                  name={selectedUser?.name?.charAt(0) || 'U'}
                  alt="User Avatar"
                  size="lg"
                  radius="full"
                />
                <div>
                  <p className="font-semibold">{selectedUser?.name}</p>
                  <p className="text-xs text-zinc-400">{selectedUser?.email}</p>
                  <Chip
                    color={
                      selectedUser?.role === ROLES.ADMIN ? 'danger' : 'primary'
                    }
                    size="sm"
                    radius="sm"
                    variant="flat"
                    className="mt-1"
                  >
                    {selectedUser?.role}
                  </Chip>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  radius="lg"
                  size="sm"
                  onClick={() => setIsDeleteUserModalOpen(false)}
                  disabled={isDeletingUser}
                >
                  Cancel
                </Button>

                <Button
                  variant="solid"
                  color="danger"
                  radius="lg"
                  size="sm"
                  onClick={handleDeleteUser}
                  disabled={isDeletingUser}
                >
                  {isDeletingUser ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            </div>
          </Modal>
        </main>
        <Footer />
      </div>
    </div>
  );
}
