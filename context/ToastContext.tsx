"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (msg: string) => showToast(msg, "success"),
    [showToast]
  );
  const error = useCallback(
    (msg: string) => showToast(msg, "error"),
    [showToast]
  );
  const info = useCallback(
    (msg: string) => showToast(msg, "info"),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all animate-slide-up duration-300 ${
              toast.type === "success"
                ? "bg-neutral-900/90 text-emerald-300 border-emerald-500/30"
                : toast.type === "error"
                ? "bg-neutral-900/90 text-rose-300 border-rose-500/30"
                : "bg-neutral-900/90 text-cyan-300 border-cyan-500/30"
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <p className="text-sm font-medium text-neutral-100 flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
