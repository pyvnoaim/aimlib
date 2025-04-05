'use client';
import { signIn, useSession } from 'next-auth/react';
import { FiLogIn } from 'react-icons/fi';
import Link from 'next/link';

const SignInButton = () => {
  const { data: session } = useSession();

  // Function to handle sign-in
  const handleSignIn = () => {
    // Sign in and redirect to the user dashboard after successful login
    signIn('discord', {
      callbackUrl: `/dashboard/${session?.user?.name}`, // Redirect to user dashboard after login
    });
  };

  return (
    <div>
      {/* If not signed in, show sign-in button */}
      {!session ? (
        <button
          onClick={handleSignIn}
          className="flex items-center p-2 rounded group hover:[&>span]:translate-x-2"
        >
          <FiLogIn className="w-4 h-4 flex-shrink-0 text-white" />
          <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
            Sign In
          </span>
        </button>
      ) : (
        // If signed in, show user avatar and name with link to their dashboard
        <Link href={`/dashboard/${session.user.name}`}>
          <div className="relative flex items-center group hover:bg-purple-500/20 border border-purple-500 hover:border-purple-500/50 rounded-full transition-all duration-300 ">
            <img
              src={session.user?.image || '/default-avatar.png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="absolute inset-x-0 text-center">
              <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold text-lg">
                {session.user?.name || 'User'}
              </span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SignInButton;
