// Drawer.tsx
import { ReactNode } from 'react';
import { LuX } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/button';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function Drawer({
  isOpen,
  onClose,
  children,
  title,
}: DrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-80 border border-zinc-700 bg-zinc-800 shadow-xl z-50 p-6 overflow-y-auto rounded-l-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button aligned top-right */}
            <div className="flex items-center justify-between mb-4">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              <LuX
                className="h-5 w-5 hover:text-red-500 transition-all duration-300 cursor-pointer"
                onClick={onClose}
              />
            </div>

            {/* Render dynamic content here */}
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
