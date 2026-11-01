import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'O‘chirish',
  cancelText = 'Bekor qilish',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 text-sm font-medium text-white hover:bg-rose-700 transition shadow-sm"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
