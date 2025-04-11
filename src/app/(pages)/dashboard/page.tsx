'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/api/auth/signin');
    } else {
      router.push(`/dashboard/${session.user.name}`);
    }
  }, [session, status, router]);

  return null;
}
