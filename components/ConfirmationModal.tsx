
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800"
        >
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-50 text-red-500' : 
              type === 'warning' ? 'bg-amber-50 text-amber-500' : 
              'bg-blue-50 text-blue-500'
            }`}>
              <AlertTriangle size={32} />
            </div>
            
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-col w-full gap-2 mt-2">
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                  type === 'danger' ? 'bg-red-500 text-white shadow-red-100 dark:shadow-none' :
                  type === 'warning' ? 'bg-amber-500 text-white shadow-amber-100 dark:shadow-none' :
                  'bg-blue-500 text-white shadow-blue-100 dark:shadow-none'
                }`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
              >
                {cancelText}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
