import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUserById } from '@/app/actions/delete-user';
import { useSession } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/layouts/dialog/confirm-dialog';

export default function DeleteUserButton() {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    if (!session || !session.user || !session.user.id) {
      alert('User not logged in.');
      return;
    }

    setUserIdToDelete(session.user.id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) {
      alert('User ID is missing.');
      return;
    }

    setIsPending(true);

    const res = await deleteUserById(userIdToDelete);
    if (res.success) {
      alert('Account deleted successfully.');
      router.push('/');
    } else {
      alert(res.error || 'Something went wrong.');
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
        title="Delete Account"
      >
        <FaTrash className="w-4 h-4 text-red-500" />
      </button>

      {/* Use ConfirmDialog for user confirmation */}
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
