import { signIn, useSession } from 'next-auth/react';
import { FiLogIn } from 'react-icons/fi';

const SignInButton = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn('discord', { callbackUrl: '/' });
  };

  return (
    <div>
      {!session ? (
        <button
          onClick={handleSignIn}
          className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
        >
          <FiLogIn className="w-4 h-4 flex-shrink-0 text-white" />
          <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
            Sign In
          </span>
        </button>
      ) : (
        <div className="relative flex items-center">
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
      )}
    </div>
  );
};

export default SignInButton;
