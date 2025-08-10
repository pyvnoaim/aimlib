'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LuUserRound, LuShield } from 'react-icons/lu';
import { Tooltip } from '@heroui/tooltip';
import { ROLES } from '@/types/role';

const AdminButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user;

  if (status !== 'authenticated' || !user) return null;

  const userDashboardPath = `/dashboard/${user.name}`;
  const isOnUserDashboard = pathname === userDashboardPath;
  const isOnAdminDashboard = pathname === '/dashboard/admin';

  if (user.role === ROLES.ADMIN && isOnUserDashboard) {
    const goToAdmin = () => router.push('/dashboard/admin');

    return (
      <Tooltip
        closeDelay={0}
        classNames={{
          content: [
            'bg-zinc-800 text-white rounded-lg shadow-lg text-center border border-zinc-700',
          ],
        }}
        content="Admin Panel"
      >
        <button
          onClick={goToAdmin}
          className="flex items-center text-white hover:bg-zinc-700 rounded-lg transition duration-300 p-2"
          aria-label="Admin Panel"
        >
          <LuShield className="w-4 h-4" />
        </button>
      </Tooltip>
    );
  }

  if (isOnAdminDashboard) {
    const goToUser = () => router.push(userDashboardPath);

    return (
      <Tooltip
        closeDelay={0}
        classNames={{
          content: [
            'bg-zinc-800 text-white rounded-lg shadow-lg text-center border border-zinc-700',
          ],
        }}
        content="User Dashboard"
      >
        <button
          onClick={goToUser}
          className="flex items-center text-white hover:bg-zinc-700 rounded-lg transition duration-300 p-2"
          aria-label="User Dashboard"
        >
          <LuUserRound className="w-4 h-4" />
        </button>
      </Tooltip>
    );
  }

  return null;
};

export default AdminButton;
