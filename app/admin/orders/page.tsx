"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  Loader2,
  Calendar,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { ordersApi, getErrorMessage } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate, getStatusBadge } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Buyurtmalarni yuklashda xatolik"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast.success(`Buyurtma #${orderId} statusi "${newStatus}" ga o'zgartirildi`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Statusni yangilashda xatolik"));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "ALL" || o.status === selectedStatus;
    const term = search.toLowerCase();
    const matchesSearch =
      String(o.id).includes(term) ||
      o.phone?.toLowerCase().includes(term) ||
      o.address?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            Buyurtmalar boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Barcha mijozlarning buyurtmalari va holatlarini boshqarish
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Ro'yxatni yangilash
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buyurtma ID, mijoz ismi yoki telefon..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Barcha statuslar ({orders.length})</option>
            <option value="PENDING">Kutilmoqda (PENDING)</option>
            <option value="PAID">To'langan (PAID)</option>
            <option value="SHIPPED">Yuborilgan (SHIPPED)</option>
            <option value="DELIVERED">Yetkazildi (DELIVERED)</option>
            <option value="CANCELLED">Bekor qilingan (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-5 hover:border-slate-700/80 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-white font-mono">
                      #{order.id}
                    </span>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-semibold">
                      Statusni o'zgartirish:
                    </span>
                    <div className="relative">
                      <select
                        disabled={isUpdating}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer and Delivery info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px]">Mijoz:</span>
                      <span className="font-semibold">{order.user?.name || "Noma'lum"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px]">Telefon:</span>
                      <span className="font-mono font-semibold">{order.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-slate-500 block text-[10px]">Manzil:</span>
                      <span className="truncate">{order.address}</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Buyurtma qilingan mahsulotlar ({order.items?.length || 0}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {order.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700/50 flex items-center justify-center">
                          {it.product?.images?.[0] ? (
                            <img
                              src={it.product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {it.product?.title || `Mahsulot #${it.productId}`}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {it.quantity} dona x {formatPrice(it.price || it.product?.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Buyurtma summasi:</span>
                  <span className="text-base font-black text-indigo-400">
                    {formatPrice(order.totalPrice ?? order.total)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
            Buyurtmalar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}
