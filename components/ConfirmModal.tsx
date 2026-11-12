"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Hapus Data",
  cancelText = "Batalkan",
  variant = "danger"
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-[#131b2b] border border-slate-200/80 dark:border-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 ${
              variant === "danger" ? "bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400" : "bg-amber-50 dark:bg-amber-500/15 text-amber-500 dark:text-amber-400"
            }`}>
              <AlertTriangle size={40} />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed px-4">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl dark:shadow-none cursor-pointer ${
                  variant === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-100" : "bg-amber-500 hover:bg-amber-600 shadow-amber-100"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
