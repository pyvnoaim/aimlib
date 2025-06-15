// Drawer.tsx
import { ReactNode } from 'react';
import { LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-80 bg-zinc-900 border border-zinc-700 rounded-l-lg shadow-2xl z-50 p-8 overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
          >
            <header className="flex items-center justify-end mb-6">
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="text-zinc-400 hover:text-red-500 transition-colors duration-300 rounded-md hover:bg-zinc-700"
              >
                <LuX className="w-6 h-6 " />
              </button>
            </header>

            <div className="flex-grow overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
