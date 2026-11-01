import React from 'react';
import { DeliveryStatus, PaymentStatus, ProductStatus, CustomerStatus, TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: DeliveryStatus | PaymentStatus | ProductStatus | CustomerStatus | TransactionStatus | string;
  type?: 'delivery' | 'payment' | 'product' | 'customer' | 'transaction';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'delivery' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'active':
        return {
          label: type === 'customer' ? 'Faol mijoz' : 'Mavjud',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500',
        };
      case 'vip':
        return {
          label: 'VIP mijoz',
          bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
          dot: 'bg-purple-500',
        };
      case 'inactive':
        return {
          label: 'Nofaol',
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
      case 'low_stock':
        return {
          label: 'Kam qoldi',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
          dot: 'bg-amber-500',
        };
      case 'out_of_stock':
        return {
          label: 'Tugagan',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
          dot: 'bg-rose-500',
        };
      case 'paid':
      case 'successful':
        return {
          label: 'To‘langan',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500',
        };
      case 'pending':
        return {
          label: 'Kutilmoqda',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
          dot: 'bg-amber-500',
        };
      case 'confirmed':
        return {
          label: 'Tasdiqlangan',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
          dot: 'bg-blue-500',
        };
      case 'shipping':
        return {
          label: 'Yetkazilmoqda',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
          dot: 'bg-indigo-500',
        };
      case 'delivered':
        return {
          label: 'Yetkazib berildi',
          bg: 'bg-teal-50 text-teal-700 border-teal-200/60',
          dot: 'bg-teal-500',
        };
      case 'cancelled':
      case 'failed':
        return {
          label: 'Bekor qilingan',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
          dot: 'bg-rose-500',
        };
      case 'refunded':
        return {
          label: 'Qaytarilgan',
          bg: 'bg-violet-50 text-violet-700 border-violet-200/60',
          dot: 'bg-violet-500',
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} transition-colors`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
