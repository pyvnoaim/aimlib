import { FaTrash } from 'react-icons/fa';
import { useTransition } from 'react';
import { deleteUserById } from '@/app/actions/delete-user';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DeleteUserButton() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!session || !session.user || !session.user.id) {
      alert('Benutzer nicht angemeldet.');
      return;
    }

    if (!confirm('Are you sure you want to delete your account?')) return;

    startTransition(async () => {
      const userId = session?.user?.id;
      if (!userId) {
        alert('Benutzer-ID fehlt.');
        return;
      }
      const res = await deleteUserById(userId as string);
      if (res.success) {
        router.push('/signout');
      } else {
        alert(res.error || 'Etwas ist schief gelaufen.');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center hover:bg-white/10 rounded-lg transition duration-300 p-2 disabled:opacity-50"
      disabled={isPending}
      title="Delete Account"
    >
      <FaTrash className="w-4 h-4 text-red-500" />
    </button>
  );
}
