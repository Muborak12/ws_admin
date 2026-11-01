import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = PackageOpen,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-sm hover:shadow"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
