import React, { useState } from 'react';
import { Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/currency';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { Eye, Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CustomersTableProps {
  customers: Customer[];
}

export const CustomersTable: React.FC<CustomersTableProps> = ({ customers }) => {
  const { orders } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerId === selectedCustomer.id)
    : [];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Mijoz</th>
              <th className="py-3.5 px-4">Elektron pochta</th>
              <th className="py-3.5 px-4">Telefon</th>
              <th className="py-3.5 px-4 text-center">Buyurtmalar</th>
              <th className="py-3.5 px-4">Jami xarajat</th>
              <th className="py-3.5 px-4">Ro‘yxatdan o‘tgan</th>
              <th className="py-3.5 px-4">Holat</th>
              <th className="py-3.5 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{customer.name}</div>
                      <div className="text-[11px] text-slate-400">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                  {customer.email}
                </td>
                <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                  {customer.phone}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {customer.ordersCount} ta
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {formatCurrency(customer.totalSpent)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                  {formatDate(customer.registeredAt)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={customer.status} type="customer" />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Batafsil ma’lumot"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title="Mijoz profili va buyurtmalari"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-slate-900">{selectedCustomer.name}</h4>
                  <StatusBadge status={selectedCustomer.status} type="customer" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedCustomer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedCustomer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Ro‘yxatdan o‘tgan: {formatDate(selectedCustomer.registeredAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-indigo-900 block font-medium">Jami buyurtmalar</span>
                  <span className="text-lg font-bold text-indigo-950">
                    {selectedCustomer.ordersCount} ta buyurtma
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-emerald-900 block font-medium">Jami xarajat</span>
                  <span className="text-lg font-bold text-emerald-950">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Mijozning buyurtmalar tarixi ({customerOrders.length})
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">Hozircha buyurtmalar yo‘q.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:border-slate-200 transition"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{ord.orderNumber}</div>
                        <div className="text-slate-400 text-[11px]">{formatDate(ord.date)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={ord.deliveryStatus} type="delivery" />
                        <span className="font-bold text-slate-900">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
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
