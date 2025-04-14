import { useState } from 'react';
import { deleteUserById } from '@/app/actions/delete-user';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/layouts/dialog/confirm-dialog';
import Toast from '@/components/layouts/toast/toast';

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
  const [toast, setToast] = useState({
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsPending(true);

    const res = await deleteUserById(userId);
    if (res.success) {
      setToast({
        message: `User ${userName || 'account'} deleted successfully.`,
        type: 'success',
        isVisible: true,
      });

      onSuccess?.();
    } else {
      setToast({
        message: res.error || 'Something went wrong.',
        type: 'error',
        isVisible: true,
      });
    }

    setIsPending(false);
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </div>
  );
}
