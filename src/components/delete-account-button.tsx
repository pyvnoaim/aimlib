import { useState } from 'react';
import { deleteUserById } from '@/app/actions/delete-user';
import { useSession, signOut } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/confirm-dialog';

export default function DeleteUserButton() {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (!session || !session.user || !session.user.id) {
      return;
    }

    setUserIdToDelete(session.user.id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) {
      return;
    }

    setIsPending(true);

    const res = await deleteUserById(userIdToDelete);
    if (res.success) {
      await signOut({
        redirectTo: '/',
      });
    } else {
      console.error('Error deleting user:', res.error);
      alert('Error deleting user. Please try again later.');
    }

    setIsPending(false);
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="flex items-center hover:bg-white/10 rounded-lg transition duration-300 p-2 disabled:opacity-50"
        disabled={isPending}
      >
        <FaTrash className="w-4 h-4 text-red-500" title="Delete Account" />
      </button>

      <ConfirmDialog
        isOpen={isModalOpen}
        message="Are you sure you want to delete your account?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Account"
      />
    </div>
  );
}
