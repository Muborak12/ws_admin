import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { ProductCard } from '../components/products/ProductCard';
import { OrdersTable } from '../components/tables/OrdersTable';
import { monthlyRevenueData } from '../data/initialData';
import { formatCurrency } from '../utils/currency';
import { Product } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, products, orders, deleteProduct } = useApp();

  const featuredProducts = products.slice(0, 4);
  const recentOrders = orders.slice(0, 5);

  const formatTooltipValue = (value: any) => {
    return [formatCurrency(Number(value) || 0), 'Daromad'];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-10 lg:p-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Maxsus mavsumiy taklif</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Yangi kolleksiya bilan tanishing
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Siz uchun eng sara mahsulotlar, ajoyib takliflar va maxsus chegirmalar! Do‘koningiz savdolarini yangi bosqichga ko‘taring.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 group"
              >
                <span>Mahsulotlarni ko‘rish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Yangi kolleksiya"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white block">Premium audio aksessuarlar</span>
                  <span className="text-indigo-200 text-[10px]">Eksklyuziv chegirmada</span>
                </div>
                <span className="px-2.5 py-1 bg-white text-slate-900 rounded-lg font-bold text-[11px]">
                  -25%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Jami daromad"
          value={formatCurrency(stats.totalRevenue)}
          change={stats.revenueGrowth}
          icon={DollarSign}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Jami buyurtmalar"
          value={`${stats.totalOrders} ta`}
          change={stats.ordersGrowth}
          icon={ShoppingBag}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Jami mahsulotlar"
          value={`${stats.totalProducts} ta`}
          change={stats.productsGrowth}
          icon={Package}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Jami mijozlar"
          value={`${stats.totalCustomers} nafar`}
          change={stats.customersGrowth}
          icon={Users}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Oylik daromad dinamikasi</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              So‘nggi 6 oylik umumiy tushumlar va sotuv hajmi tahlili
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-600" />
            <span>Muntazam o‘sish darajasi: +18.4%</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#f1f5f9' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)} mln`}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Mashhur mahsulotlar</h3>
            <p className="text-xs text-slate-500 mt-0.5">Mijozlar tomonidan eng ko‘p xarid qilinayotgan tovarlar</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Barchasini ko‘rish</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onEdit={() => navigate('/products')}
              onDelete={(p: Product) => deleteProduct(p.id)}
              onView={() => navigate('/products')}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">So‘nggi buyurtmalar</h3>
            <p className="text-xs text-slate-500 mt-0.5">Yangi tushgan buyurtmalar va yetkazib berish holati</p>
          </div>
          <button
            onClick={() => navigate('/customers')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>Barcha buyurtmalar</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  );
};
