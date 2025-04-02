'use client';

import { useSession } from 'next-auth/react';
import SignOutButton from '@/components/ui/buttons/logout-button'; // Import the SignInButton component
import SignInButton from '@/components/ui/buttons/login-button';

const Test = () => {
  const { data: session } = useSession(); // Access the session data

  return (
    <div className="flex justify-center items-center h-screen flex-col text-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4 text-2xl sm:text-3xl md:text-4xl">
        {session ? `Welcome, ${session.user?.name}!` : 'You are not logged in.'}
      </h1>

      {/* Display Discord profile picture if logged in */}
      {session?.user?.image && (
        <img
          src={session.user.image}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full mb-4 border-4 border-gray-500 shadow-lg"
        />
      )}

      {/* SignInButton or SignOutButton component will render based on session */}
      <div className="space-y-4">
        {session ? <SignOutButton /> : <SignInButton />}
      </div>
    </div>
  );
};

export default Test;
