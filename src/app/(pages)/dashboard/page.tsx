'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/loading';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    const username = encodeURIComponent(!session.user.name);
    router.push(`/dashboard/${username}`);
  }, [session, status, router]);

  if (status === 'loading') {
    return <Loading />;
  }

  return null;
}
