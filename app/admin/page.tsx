"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  Layers,
  TrendingUp,
  ArrowRight,
  Plus,
  Loader2,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { productsApi, categoriesApi, ordersApi, usersApi } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getStatusBadge } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    usersCount: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [prodRes, catsRes, ordersRes, usersRes] = await Promise.allSettled([
          productsApi.getAll({ limit: 1 }),
          categoriesApi.getAll(),
          ordersApi.getAdminOrders(),
          usersApi.getAdminUsers(),
        ]);

        const productsCount =
          prodRes.status === "fulfilled" ? prodRes.value.meta?.total || 0 : 0;
        const categoriesCount =
          catsRes.status === "fulfilled" && Array.isArray(catsRes.value)
            ? catsRes.value.length
            : 0;
        const orders =
          ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value)
            ? ordersRes.value
            : [];
        const users =
          usersRes.status === "fulfilled" && Array.isArray(usersRes.value)
            ? usersRes.value
            : [];

        const totalRevenue = orders.reduce((sum, o) => {
          if (o.status === "PAID" || o.status === "DELIVERED" || o.status === "SHIPPED") {
            return sum + (o.totalPrice ?? o.total ?? 0);
          }
          return sum;
        }, 0);

        setStats({
          productsCount,
          categoriesCount,
          ordersCount: orders.length,
          usersCount: users.length,
          totalRevenue,
        });

        setRecentOrders(orders.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#e07a8b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-[#1c0f0a] min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>WS Boshqaruv Markazi</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs text-[#fbcfe8]/70 mt-1">
            WS Luxury Store statistikasi, savdo ko'rsatkichlari va tezkor amallar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/chat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#281813] hover:bg-[#3b2219] text-[#fbcfe8] text-xs font-bold border border-[#fbcfe8]/20 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4 text-[#e07a8b]" />
            <span>Jonli Chat</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#3b2219]/50 transition-all border border-white/10"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Mahsulot</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid (Brown & Pink palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products */}
        <div className="p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#fbcfe8]/70 uppercase">Jami mahsulotlar</span>
            <div className="w-9 h-9 rounded-xl bg-[#e07a8b]/15 text-[#e07a8b] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.productsCount}</div>
          <div className="flex items-center gap-1.5 text-xs text-[#c59b6d] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Omborda faol sotuvda</span>
          </div>
        </div>

        {/* Orders */}
        <div className="p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#fbcfe8]/70 uppercase">Buyurtmalar</span>
            <div className="w-9 h-9 rounded-xl bg-[#c59b6d]/15 text-[#c59b6d] flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.ordersCount}</div>
          <div className="text-xs text-[#fbcfe8]/60">
            Jami qabul qilingan
          </div>
        </div>

        {/* Users */}
        <div className="p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#fbcfe8]/70 uppercase">Mijozlar</span>
            <div className="w-9 h-9 rounded-xl bg-[#e07a8b]/15 text-[#e07a8b] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.usersCount}</div>
          <div className="text-xs text-[#fbcfe8]/60">
            Ro'yxatdan o'tgan foydalanuvchilar
          </div>
        </div>

        {/* Categories */}
        <div className="p-6 rounded-3xl bg-[#281813]/90 border border-[#fbcfe8]/15 backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#fbcfe8]/70 uppercase">Kategoriyalar</span>
            <div className="w-9 h-9 rounded-xl bg-[#8c583e]/20 text-[#c59b6d] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.categoriesCount}</div>
          <div className="text-xs text-[#fbcfe8]/60">
            Mavjud bo'limlar soni
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-[#25140d]/90 border border-[#fbcfe8]/15 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">So'nggi buyurtmalar</h2>
            <p className="text-xs text-[#fbcfe8]/60">
              Eng so'nggi rasmiylashtirilgan 6 ta buyurtma
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-[#e07a8b] hover:underline"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#fbcfe8]/15 text-[#fbcfe8]/60 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Buyurtma ID</th>
                  <th className="py-3 px-4">Mijoz / Telefon</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Summa</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fbcfe8]/10 text-[#fdf2f4]">
                {recentOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-[#341b12]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {order.user?.name || "Mijoz"}
                        </div>
                        <div className="text-[11px] text-[#fbcfe8]/60 font-mono">
                          {order.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#fbcfe8]/60">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#e07a8b]">
                        {formatPrice(order.totalPrice ?? order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="px-3.5 py-1.5 rounded-xl bg-[#3b2219] hover:bg-[#e07a8b] hover:text-white text-[#fbcfe8] font-bold transition-all"
                        >
                          Boshqarish
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#fbcfe8]/40">
            Hozircha buyurtmalar mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
}
