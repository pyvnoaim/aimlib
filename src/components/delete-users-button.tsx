import { useState } from 'react';
import { deleteUserById } from '@/app/actions/delete-user';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/confirm-dialog';

type DeleteUserButtonProps = {
  userId: string;
  userName?: string;
  onSuccess?: () => void;
};

export default function AdminDeleteUserButton({
  userId,
  userName,
  onSuccess,
}: DeleteUserButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsPending(true);

    const res = await deleteUserById(userId);
    if (res.success) {
      onSuccess?.();
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
        title={`Delete ${userName || 'User'}`}
      >
        <FaTrash className="w-4 h-4 text-red-500" />
      </button>

      <ConfirmDialog
        isOpen={isModalOpen}
        message={`Are you sure you want to delete ${
          userName || 'this user'
        }? This action is irreversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete User"
      />
    </div>
  );
}
