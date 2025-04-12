import { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa'; // Import the icons

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
    success: 'bg-white/10 backdrop-blur-xs text-white',
    error: 'bg-white/10 backdrop-blur-xs text-white',
    info: 'bg-white/10 backdrop-blur-xs text-white',
  };

  const toastIcons = {
    success: <FaCheckCircle className="w-5 h-5 mr-3 text-green-500" />,
    error: <FaTimesCircle className="w-5 h-5 mr-3 text-red-500" />,
    info: <FaInfoCircle className="w-5 h-5 mr-3 text-blue-500" />,
  };

  return (
    <div
      className={`fixed bottom-5 right-5 max-w-xs w-full p-4 rounded-lg shadow-lg transition-all z-50 ${toastStyles[type]}`}
    >
      <div className="flex items-center">
        {toastIcons[type]}
        <span>{message}</span>
        <button onClick={onClose} className="text-white ml-2">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
