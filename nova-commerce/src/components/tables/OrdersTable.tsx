import React, { useState } from 'react';
import { Order, DeliveryStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/currency';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { Eye, MapPin, Phone, Mail, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  const { updateOrderStatus } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const deliveryStatuses: { value: DeliveryStatus; label: string }[] = [
    { value: 'pending', label: 'Kutilmoqda' },
    { value: 'confirmed', label: 'Tasdiqlangan' },
    { value: 'shipping', label: 'Yetkazilmoqda' },
    { value: 'delivered', label: 'Yetkazib berildi' },
    { value: 'cancelled', label: 'Bekor qilingan' },
  ];

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Buyurtma raqami</th>
              <th className="py-3.5 px-4">Mijoz ismi</th>
              <th className="py-3.5 px-4">Sana</th>
              <th className="py-3.5 px-4">Umumiy summa</th>
              <th className="py-3.5 px-4">To‘lov holati</th>
              <th className="py-3.5 px-4">Buyurtma holati</th>
              <th className="py-3.5 px-4 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">{order.customerName}</div>
                  <div className="text-xs text-slate-400">{order.customerPhone}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {formatDate(order.date)}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <select
                    value={order.deliveryStatus}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value as DeliveryStatus)
                    }
                    className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {deliveryStatuses.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="Batafsil ko‘rish"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Buyurtma tafsilotlari — ${selectedOrder.orderNumber}`}
          description={`Sana: ${formatDate(selectedOrder.date)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-wrap gap-4 justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Buyurtma holati</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.deliveryStatus} type="delivery" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">To‘lov holati</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.paymentStatus} type="payment" />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Jami summa</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mijoz ma’lumotlari
              </h4>
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-semibold text-sm text-slate-900">{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customerEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.shippingAddress}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Buyurtma qilingan mahsulotlar ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100"
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
                <span>{formatCurrency(selectedOrder.totalAmount - selectedOrder.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Yetkazib berish narxi</span>
                <span>
                  {selectedOrder.shippingAmount === 0
                    ? 'Bepul'
                    : formatCurrency(selectedOrder.shippingAmount)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Yakuniy summa</span>
                <span className="text-indigo-600">{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
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
