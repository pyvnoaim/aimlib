import { useEffect } from 'react';
import {
  MdOutlineCheckCircle,
  MdErrorOutline,
  MdInfoOutline,
} from 'react-icons/md';

type ToastProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
};

const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const toastStyles = {
    success: 'bg-zinc-700 text-white shadow-green-500 shadow-xs',
    error: 'bg-zinc-700 text-white shadow-red-500 shadow-xs',
    info: 'bg-zinc-700 text-white shadow-blue-500 shadow-xs',
  };

  const toastIcons = {
    success: <MdOutlineCheckCircle className="w-5 h-5 mr-3 text-green-500" />,
    error: <MdErrorOutline className="w-5 h-5 mr-3 text-red-500" />,
    info: <MdInfoOutline className="w-5 h-5 mr-3 text-blue-500" />,
  };

  return (
    <div
      className={`fixed bottom-5 right-5 max-w-xs w-full p-4 rounded-lg transition-all z-50 ${toastStyles[type]}`}
    >
      <div className="flex items-center">
        {toastIcons[type]}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-white hover:text-red-500 transition-all duration-300"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
