'use client';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const redirectToUserDashboard = async () => {
      const session = await getSession();

      if (!session?.user) {
        router.push('/api/auth/signin');
      } else {
        router.push(`/dashboard/${session.user.name}`);
      }
    };

    redirectToUserDashboard();
  }, [router]);

  return null;
}
