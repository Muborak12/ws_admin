import React, { useState } from 'react';
import { Payment } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/currency';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { Eye, CreditCard, Wallet, Smartphone, Banknote, ShieldCheck } from 'lucide-react';

interface PaymentsTableProps {
  payments: Payment[];
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const getMethodBadge = (method: Payment['method']) => {
    switch (method) {
      case 'click':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <Smartphone className="w-3.5 h-3.5" />
            Click
          </span>
        );
      case 'payme':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <Wallet className="w-3.5 h-3.5" />
            Payme
          </span>
        );
      case 'card':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CreditCard className="w-3.5 h-3.5" />
            Bank kartasi
          </span>
        );
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Banknote className="w-3.5 h-3.5" />
            Naqd pul
          </span>
        );
      default:
        return method;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Tranzaksiya ID</th>
              <th className="py-3.5 px-4">Mijoz</th>
              <th className="py-3.5 px-4">Buyurtma</th>
              <th className="py-3.5 px-4">To‘lov sanasi</th>
              <th className="py-3.5 px-4">To‘lov usuli</th>
              <th className="py-3.5 px-4">Summa</th>
              <th className="py-3.5 px-4">To‘lov holati</th>
              <th className="py-3.5 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-indigo-600 text-xs">
                  {payment.transactionId}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">{payment.customerName}</div>
                  <div className="text-xs text-slate-400">{payment.customerPhone}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                  {payment.orderNumber}
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                  {formatDateTime(payment.date)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getMethodBadge(payment.method)}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={payment.status} type="transaction" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Tranzaksiya tafsilotlari"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title={`Tranzaksiya tafsilotlari — ${selectedPayment.transactionId}`}
          description={`To‘lov sanasi: ${formatDateTime(selectedPayment.date)}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">To‘lov holati</span>
                <div className="mt-1">
                  <StatusBadge status={selectedPayment.status} type="transaction" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">To‘lov usuli</span>
                <div className="mt-1">{getMethodBadge(selectedPayment.method)}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Buyurtma raqami:</span>
                <span className="font-mono font-bold text-slate-800">{selectedPayment.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Xaridor:</span>
                <span className="font-semibold text-slate-800">{selectedPayment.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telefon:</span>
                <span className="text-slate-700">{selectedPayment.customerPhone}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sotib olingan mahsulotlar ({selectedPayment.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedPayment.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{item.productName}</p>
                        <p className="text-[11px] text-slate-400">
                          {formatCurrency(item.price)} × {item.quantity} dona
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-bold text-xs text-slate-900">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Oraliq summa</span>
                <span>{formatCurrency(selectedPayment.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Yetkazib berish</span>
                <span>{selectedPayment.shipping === 0 ? 'Bepul' : formatCurrency(selectedPayment.shipping)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Yakuniy summa</span>
                <span className="text-indigo-600 font-extrabold text-base">
                  {formatCurrency(selectedPayment.amount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50">
              <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Simulyatsiya qilingan xavfsiz tranzaksiya yozuvi.</span>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
