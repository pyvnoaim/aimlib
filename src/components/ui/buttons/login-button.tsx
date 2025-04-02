import { signIn } from 'next-auth/react';
import { FiLogIn } from 'react-icons/fi';

const SignInButton = () => {
  return (
    <div>
      {/* Sign In Button */}
      <button
        onClick={() => signIn('discord')}
        className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
      >
        <FiLogIn className="w-4 h-4 flex-shrink-0 text-white" />
        <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
          Sign In
        </span>
      </button>
    </div>
  );
};

export default SignInButton;
