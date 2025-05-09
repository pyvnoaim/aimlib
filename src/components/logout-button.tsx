'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';
import ConfirmDialog from '@/components/confirm-dialog';

const LogoutButton = () => {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
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
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center text-white hover:bg-white/10 rounded-lg transition-all duration-300 p-2 disabled:opacity-50"
        disabled={isSubmitting}
        title="Logout"
      >
        <FiLogOut className="w-4 h-4" />
      </button>

      <ConfirmDialog
        isOpen={showDialog}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        onConfirm={handleLogout}
        onCancel={() => setShowDialog(false)}
        confirmText={isSubmitting ? 'Logging out...' : 'Log Out'}
        cancelText="Cancel"
        confirmVariant="solid"
        confirmColor="gray"
        closeOnEscape={!isSubmitting}
        size="medium"
        description={
          <>
            <p>You can log back in at any time using your credentials.</p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        }
      />
    </>
  );
};

export default LogoutButton;
