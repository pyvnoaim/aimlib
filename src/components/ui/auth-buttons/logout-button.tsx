import { signOut, useSession } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      redirectTo: '/',
    });
  };

  return (
    <>
      {session ? (
        <button
          onClick={handleLogout}
          className="flex items-center text-white hover:bg-white/10 rounded-lg transition duration-300 p-2"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      ) : null}
    </>
  );
};

export default LogoutButton;
