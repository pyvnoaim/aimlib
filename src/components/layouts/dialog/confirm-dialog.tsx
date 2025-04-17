import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
        {title && (
          <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        )}
        <p className="text-lg mb-4 text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded text-white transition-all duration-300 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded text-white transition-all duration-300 flex items-center gap-2"
          >
            <FaCheck /> Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
