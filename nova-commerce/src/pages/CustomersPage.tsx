import React, { useState, useMemo } from 'react';
import {
  Users,
  UserCheck,
  ShoppingBag,
  Calculator,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { CustomersTable } from '../components/tables/CustomersTable';
import { OrdersTable } from '../components/tables/OrdersTable';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency } from '../utils/currency';
import { DeliveryStatus } from '../types';

export const CustomersPage: React.FC = () => {
  const { customers, orders, globalSearch } = useApp();

  const [activeTab, setActiveTab] = useState<'customers' | 'orders'>('customers');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<DeliveryStatus | 'all'>('all');

  const stats = useMemo(() => {
    const totalSpentSum = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageOrderValue = orders.length > 0 ? Math.round(totalSpentSum / orders.length) : 0;
    const newCustomersCount = customers.filter(
      (c) => new Date(c.registeredAt) > new Date('2026-02-01')
    ).length;

    return {
      totalCustomers: customers.length,
      newCustomers: newCustomersCount,
      totalOrders: orders.length,
      averageOrderValue,
    };
  }, [customers, orders]);

  const effectiveCustomerSearch = customerSearch || globalSearch;
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(effectiveCustomerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(effectiveCustomerSearch.toLowerCase()) ||
        c.phone.toLowerCase().includes(effectiveCustomerSearch.toLowerCase());

      const matchesStatus =
        customerStatusFilter === 'all' || c.status === customerStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, effectiveCustomerSearch, customerStatusFilter]);

  const effectiveOrderSearch = orderSearch || globalSearch;
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(effectiveOrderSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(effectiveOrderSearch.toLowerCase()) ||
        o.customerPhone.toLowerCase().includes(effectiveOrderSearch.toLowerCase());

      const matchesStatus =
        orderStatusFilter === 'all' || o.deliveryStatus === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, effectiveOrderSearch, orderStatusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Mijozlar va buyurtmalar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Xaridorlar bazasi, buyurtmalar oqimi va yetkazib berish jarayonini boshqaring.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Jami mijozlar"
          value={`${stats.totalCustomers} nafar`}
          subtext="Faol xaridorlar soni"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Yangi mijozlar"
          value={`${stats.newCustomers} nafar`}
          subtext="So‘nggi oyda qo‘shilgan"
          icon={UserCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Jami buyurtmalar"
          value={`${stats.totalOrders} ta`}
          subtext="Barcha holatlar bo‘yicha"
          icon={ShoppingBag}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="O‘rtacha buyurtma"
          value={formatCurrency(stats.averageOrderValue)}
          subtext="Har bir xarid uchun"
          icon={Calculator}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('customers')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'customers'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mijozlar ro‘yxati</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {customers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition -mb-px flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buyurtmalar tarixi</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {orders.length}
          </span>
        </button>
      </div>

      {activeTab === 'customers' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Ism, email yoki telefon..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={customerStatusFilter}
                onChange={(e) => setCustomerStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              >
                <option value="all">Barcha mijozlar</option>
                <option value="active">Faol mijozlar</option>
                <option value="vip">VIP mijozlar</option>
                <option value="inactive">Nofaol mijozlar</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {filteredCustomers.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="Mijoz topilmadi"
                  description="Kiritilgan so‘rov bo‘yicha hech qanday mijoz topilmadi."
                  actionText="Filtrlarni tozalash"
                  onAction={() => {
                    setCustomerSearch('');
                    setCustomerStatusFilter('all');
                  }}
                />
              </div>
            ) : (
              <CustomersTable customers={filteredCustomers} />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buyurtma raqami yoki mijoz..."
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { label: 'Barchasi', value: 'all' },
                { label: 'Kutilmoqda', value: 'pending' },
                { label: 'Tasdiqlangan', value: 'confirmed' },
                { label: 'Yetkazilmoqda', value: 'shipping' },
                { label: 'Yetkazib berildi', value: 'delivered' },
                { label: 'Bekor qilingan', value: 'cancelled' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setOrderStatusFilter(btn.value as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    orderStatusFilter === btn.value
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {filteredOrders.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="Buyurtma topilmadi"
                  description="Ushbu holat yoki qidiruv so‘rovi bo‘yicha buyurtmalar mavjud emas."
                  actionText="Barcha buyurtmalarni ko‘rsatish"
                  onAction={() => {
                    setOrderSearch('');
                    setOrderStatusFilter('all');
                  }}
                />
              </div>
            ) : (
              <OrdersTable orders={filteredOrders} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
