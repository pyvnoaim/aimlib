import React from 'react';
import { Dialog, Flex, Button } from '@radix-ui/themes';

export interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'solid' | 'soft' | 'outline' | 'ghost';
  confirmColor?: 'gray' | 'blue' | 'green' | 'red' | 'orange';
  size?: 'small' | 'medium' | 'large';
  closeOnEscape?: boolean;
  description?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'solid',
  confirmColor = 'blue',
  size = 'medium',
  description,
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm();
    }
  };

  const sizeToWidth = {
    small: '350px',
    medium: '450px',
    large: '550px',
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <Dialog.Content
          maxWidth={sizeToWidth[size]}
          onKeyDown={handleKeyDown}
          className="bg-zinc-900 border border-zinc-700 shadow-2xl p-6 rounded-xl text-white"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          }}
        >
          <Dialog.Title className="text-xl font-semibold text-gray-100 mb-2">
            {title}
          </Dialog.Title>

          <Dialog.Description size="2" mb="4" className="text-gray-300">
            {message}
          </Dialog.Description>

          {description && (
            <div className="mt-2 mb-4 text-gray-400">{description}</div>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Button
              variant="soft"
              color="gray"
              onClick={onCancel}
              aria-label={cancelText}
              className="hover:bg-zinc-700 text-gray-300"
            >
              {cancelText}
            </Button>
            <Button
              variant={confirmVariant}
              color={confirmColor}
              onClick={onConfirm}
              aria-label={confirmText}
              className="hover:brightness-110"
            >
              {confirmText}
            </Button>
          </Flex>
        </Dialog.Content>
      </div>
    </Dialog.Root>
  );
};

export default ConfirmDialog;
