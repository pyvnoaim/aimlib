import { signOut, useSession } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session?.accessToken) {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Failed to revoke Discord token:', error);
      }
    }
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {session ? (
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded hover:[&>span]:translate-x-2"
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0 text-white" />
          <span className="ml-3 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 text-white">
            Log Out
          </span>
        </button>
      ) : null}
    </>
  );
};

export default LogoutButton;
