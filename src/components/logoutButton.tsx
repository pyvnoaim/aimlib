import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LuLogOut, LuLoader } from 'react-icons/lu';
import { Tooltip } from '@heroui/tooltip';

const LogoutButton = () => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="relative">
      <Tooltip
        closeDelay={0}
        classNames={{
          content: [
            'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
          ],
        }}
        content="Logout"
      >
        <button
          onClick={handleLogout}
          className="flex items-center text-white hover:bg-zinc-700 rounded-lg transition duration-300 p-2 disabled:opacity-50"
          disabled={isSubmitting}
          aria-label="Logout"
        >
          {isSubmitting ? (
            <LuLoader className="w-4 h-4 animate-spin" />
          ) : (
            <LuLogOut className="w-4 h-4" />
          )}
        </button>
      </Tooltip>

      {error && (
        <div className="absolute top-full mt-2 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
