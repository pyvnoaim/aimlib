// pages/protected.tsx or app/protected/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    // Redirect to the sign-in page if not authenticated
    router.push('/auth/signin');
    return null;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {session.user?.name}!</p>
    </div>
  );
};

export default ProtectedPage;
