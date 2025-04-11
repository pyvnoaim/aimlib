import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center backdrop-blur-xs z-50"
      onClick={onCancel}
    >
      <div
        className="bg-zinc-800 p-6 rounded-xl shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <p className="text-lg mb-4 text-gray-300">{message}</p>
        <div className="mt-4 flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded text-white transition-all duration-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-purple-400 hover:bg-purple-300 px-4 py-2 rounded text-white transition-all duration-300"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
