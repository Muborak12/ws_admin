import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  ShoppingBag,
  Receipt,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { PaymentsTable } from '../components/tables/PaymentsTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../utils/currency';
import { TransactionStatus, PaymentMethod } from '../types';

export const PaymentsPage: React.FC = () => {
  const { payments, globalSearch } = useApp();

  const [activeTab, setActiveTab] = useState<'transactions' | 'purchased_items'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');

  const stats = useMemo(() => {
    const totalSuccessful = payments
      .filter((p) => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);

    const successfulCount = payments.filter((p) => p.status === 'successful').length;

    const pendingTotal = payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const refundedTotal = payments
      .filter((p) => p.status === 'refunded')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalSuccessful,
      successfulCount,
      pendingTotal,
      refundedTotal,
    };
  }, [payments]);

  const effectiveSearch = searchQuery || globalSearch;

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.transactionId.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        p.orderNumber.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        p.customerName.toLowerCase().includes(effectiveSearch.toLowerCase());

      const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, effectiveSearch, methodFilter, statusFilter]);

  const allPurchasedItems = useMemo(() => {
    const itemsList: Array<{
      id: string;
      productName: string;
      productImage: string;
      customerName: string;
      customerPhone: string;
      quantity: number;
      price: number;
      total: number;
      date: string;
      status: TransactionStatus;
      transactionId: string;
      orderNumber: string;
    }> = [];

    payments.forEach((p) => {
      p.items.forEach((item, idx) => {
        itemsList.push({
          id: `${p.id}-${idx}`,
          productName: item.productName,
          productImage: item.productImage,
          customerName: p.customerName,
          customerPhone: p.customerPhone,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          date: p.date,
          status: p.status,
          transactionId: p.transactionId,
          orderNumber: p.orderNumber,
        });
      });
    });

    return itemsList;
  }, [payments]);

  const filteredPurchasedItems = useMemo(() => {
    return allPurchasedItems.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        item.customerName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        item.orderNumber.toLowerCase().includes(effectiveSearch.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allPurchasedItems, effectiveSearch, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          To‘lovlar va xaridlar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Barcha moliyaviy operatsiyalar, tushumlar va mijozlar xaridlari tahlili.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Jami tushum"
          value={formatCurrency(stats.totalSuccessful)}
          subtext="Muvaffaqiyatli to‘langan"
          icon={CreditCard}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Muvaffaqiyatli to‘lovlar"
          value={`${stats.successfulCount} ta`}
          subtext="Tranzaksiyalar soni"
          icon={CheckCircle}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Kutilayotgan to‘lovlar"
          value={formatCurrency(stats.pendingTotal)}
          subtext="Jarayondagi summalar"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Qaytarilgan mablag‘"
          value={formatCurrency(stats.refundedTotal)}
          subtext="Bekor qilingan xaridlar"
          icon={RotateCcw}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>To‘lovlar jadvali</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {payments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('purchased_items')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'purchased_items'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sotib olingan mahsulotlar</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {allPurchasedItems.length}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tranzaksiya, mijoz yoki buyurtma..."
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {activeTab === 'transactions' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="all">Barcha to‘lov usullari</option>
                <option value="click">Click</option>
                <option value="payme">Payme</option>
                <option value="card">Bank kartasi</option>
                <option value="cash">Naqd pul</option>
              </select>
            </div>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          >
            <option value="all">Barcha holatlar</option>
            <option value="successful">Muvaffaqiyatli</option>
            <option value="pending">Kutilmoqda</option>
            <option value="cancelled">Bekor qilingan</option>
            <option value="refunded">Qaytarilgan</option>
          </select>
        </div>
      </div>

      {activeTab === 'transactions' ? (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {filteredPayments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="To‘lov yozuvi topilmadi"
                description="Berilgan parametrlar bo‘yicha to‘lovlar mavjud emas."
                actionText="Filtrlarni tozalash"
                onAction={() => {
                  setSearchQuery('');
                  setMethodFilter('all');
                  setStatusFilter('all');
                }}
              />
            </div>
          ) : (
            <PaymentsTable payments={filteredPayments} />
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {filteredPurchasedItems.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="Xarid yozuvi topilmadi"
                description="Hech qanday mahsulot xaridi topilmadi."
                actionText="Filtrlarni tozalash"
                onAction={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Mahsulot</th>
                    <th className="py-3.5 px-4">Xaridor</th>
                    <th className="py-3.5 px-4">Buyurtma</th>
                    <th className="py-3.5 px-4 text-center">Miqdori</th>
                    <th className="py-3.5 px-4">Birlik narxi</th>
                    <th className="py-3.5 px-4">Jami narxi</th>
                    <th className="py-3.5 px-4">Sana</th>
                    <th className="py-3.5 px-4">To‘lov holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredPurchasedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100"
                          />
                          <span className="font-semibold text-slate-900 text-xs">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">{item.customerName}</div>
                        <div className="text-[11px] text-slate-400">{item.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                        {item.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 text-xs">
                        {item.quantity} dona
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-xs whitespace-nowrap">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} type="transaction" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
