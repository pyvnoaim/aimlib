import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';
import { Tooltip } from '@heroui/tooltip';
import Modal from '@/components/modal';

export default function DeleteAccountButton() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
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
        return;
      }

      await signOut({ redirectTo: '/' });
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setError(null);
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
        content="Delete Account"
      >
        <button
          className="flex items-center hover:bg-zinc-700 rounded-lg transition duration-300 p-2 disabled:opacity-50"
          disabled={isSubmitting}
          onClick={handleDeleteClick}
          aria-label="Delete Account"
        >
          <FaTrash className="w-4 h-4 text-red-500" />
        </button>
      </Tooltip>

      <Modal isOpen={showModal} onClose={handleCancel} title="Delete Account">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-white mb-1">
              Are you absolutely sure?
            </h3>
            <p className="text-zinc-300 text-sm">
              This action cannot be undone. Your account and all associated data
              will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-4 mb-6">
          <p className="text-zinc-300 text-sm">
            <strong className="text-white">
              This will permanently delete:
            </strong>
          </p>
          <ul className="text-zinc-400 text-sm mt-2 space-y-1">
            <li>• Your user profile and settings</li>
            <li>• All your posts and comments</li>
            <li>• Your account history and data</li>
          </ul>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-zinc-600 text-zinc-300 hover:bg-zinc-700 rounded-lg font-medium transition duration-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 min-w-[140px] justify-center"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="w-4 h-4" />
                Delete Forever
              </>
            )}
          </button>
        </div>
      </Modal>

      {error && (
        <div className="absolute top-full mt-2 left-0 bg-red-600 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-10 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
