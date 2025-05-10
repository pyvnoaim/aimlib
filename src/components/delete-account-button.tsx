'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ConfirmDialog from '@/components/confirm-dialog';
import { signOut, useSession } from 'next-auth/react';

export default function DeleteAccountButton() {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
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
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center hover:bg-white/10 rounded-lg transition duration-300 p-2 disabled:opacity-50"
        disabled={isSubmitting}
        title="Delete My Account"
      >
        <FaTrash className="w-4 h-4 text-red-500" />
      </button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Delete Your Account"
        message="Are you sure you want to delete your own account? This action is irreversible."
        onConfirm={handleDelete}
        onCancel={() => setShowDialog(false)}
        confirmText={isSubmitting ? 'Deleting...' : 'Yes, Delete'}
        cancelText="Cancel"
        confirmVariant="solid"
        confirmColor="red"
        closeOnEscape={!isSubmitting}
        size="medium"
        description={
          <>
            <p>
              This will permanently remove your account and all associated data.
            </p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        }
      />
    </>
  );
}
