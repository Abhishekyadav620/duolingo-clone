'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]); // Keep max 3 toasts

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500 border-emerald-600 text-white',
          icon: <Sparkles className="w-5 h-5" />
        };
      case 'error':
        return {
          bg: 'bg-rose-500 border-rose-600 text-white',
          icon: <AlertCircle className="w-5 h-5" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-400 border-amber-500 text-amber-950',
          icon: <AlertCircle className="w-5 h-5" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-500 border-sky-600 text-white',
          icon: <Info className="w-5 h-5" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((t) => {
            const style = getToastStyle(t.type);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`pointer-events-auto p-4 rounded-2xl border-b-4 shadow-xl flex items-center justify-between gap-3 font-bold text-sm select-none ${style.bg}`}
              >
                <div className="flex items-center gap-2.5">
                  {style.icon}
                  <span>{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  aria-label="Close notification"
                  className="p-1 hover:bg-black/10 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
