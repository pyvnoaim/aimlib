import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';
import { Tooltip } from '@heroui/tooltip';

export default function DeleteAccountButton() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowSelfDelete: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete account');
      } else {
        await signOut({ redirectTo: '/' });
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Tooltip
        classNames={{
          content: [
            'bg-zinc-800 text-white bg-zinc-800 rounded-lg shadow-lg text-center border border-zinc-700',
          ],
        }}
        content="Delete Account"
      >
        <button
          className="flex items-center hover:bg-zinc-700 rounded-lg transition duration-300 p-2 disabled:opacity-50"
          disabled={isSubmitting}
          // onClick={handleDelete}
        >
          <FaTrash className="w-4 h-4 text-red-500" />
        </button>
      </Tooltip>
    </>
  );
}
