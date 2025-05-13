'use client';
import { signIn, useSession } from 'next-auth/react';
import { FiLogIn } from 'react-icons/fi';
import Link from 'next/link';
import { Avatar } from '@radix-ui/themes';

const SignInButton = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn('discord', {
      redirectTo: `/dashboard`,
    });
  };

  return (
    <div>
      {!session || !session.user ? (
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
        <Link href={`/dashboard`}>
          <div className="relative flex items-center group hover:bg-zinc-700 rounded-lg transition-all duration-300">
            <Avatar
              src={session.user.image ?? undefined}
              fallback={session.user.name?.charAt(0) || ''}
              size="2"
              variant="solid"
              radius="large"
              color="gray"
            />

            <div className="absolute inset-x-0 text-center">
              <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white font-bold text-lg">
                {session.user.name}
              </span>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default SignInButton;
