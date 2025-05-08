import { useState } from 'react';
import { deleteUserById } from '@/app/actions/delete-user';
import { useSession, signOut } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/confirm-dialog';
import Toast from '@/components/toast';

export default function DeleteUserButton() {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const handleDelete = () => {
    if (!session || !session.user || !session.user.id) {
      setToast({
        message: 'User not logged in.',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    setUserIdToDelete(session.user.id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) {
      setToast({
        message: 'User ID is missing.',
        type: 'error',
        isVisible: true,
      });
      return;
    }

    setIsPending(true);

    const res = await deleteUserById(userIdToDelete);
    if (res.success) {
      await signOut({
        redirectTo: '/',
      });

      setToast({
        message: 'Account deleted successfully.',
        type: 'success',
        isVisible: true,
      });
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </div>
  );
}
