"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { ordersApi, getErrorMessage } from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getStatusBadge } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Package,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  XCircle,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Buyurtmalarni yuklashda xatolik"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const handlePay = async (orderId: number) => {
    setActionId(orderId);
    try {
      await ordersApi.pay(orderId);
      toast.success("To'lov muvaffaqiyatli amalga oshirildi!");
      await loadOrders();
    } catch (err) {
      toast.error(getErrorMessage(err, "To'lovda xatolik yuz berdi"));
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm("Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz?")) return;
    setActionId(orderId);
    try {
      await ordersApi.cancel(orderId);
      toast.info("Buyurtma bekor qilindi");
      await loadOrders();
    } catch (err) {
      toast.error(getErrorMessage(err, "Bekor qilishda xatolik yuz berdi"));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Mening buyurtmalarim
              </h1>
              <p className="text-xs text-slate-400">
                Barcha rasmiylashtirilgan buyurtmalaringiz holati
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Asosiy sahifa
          </Link>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Buyurtmalarni ko'rish uchun tizimga kiring
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Siz qilgan buyurtmalar tarixi va yetkazib berish holatini ko'rish uchun hisobingizga kiring.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Tizimga kirish
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              const isActionLoading = actionId === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-6 backdrop-blur-xl hover:border-slate-700/80 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-white">
                          Buyurtma #{order.id}
                        </span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-xs font-bold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Jami to'lov</span>
                      <span className="text-lg font-black text-indigo-400">
                        {formatPrice(order.totalPrice ?? order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{order.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="font-mono">{order.phone}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Tarkibdagi mahsulotlar:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60"
                        >
                          <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700/50 flex items-center justify-center">
                            {it.product?.images?.[0] ? (
                              <img
                                src={it.product.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[9px] text-slate-500">Rasm</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">
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

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800/80">
                    {order.status === "PENDING" && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handlePay(order.id)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                        <span>Hozir to'lash</span>
                      </button>
                    )}

                    {(order.status === "PENDING" || order.status === "PAID") && (
                      <button
                        disabled={isActionLoading}
                        onClick={() => handleCancel(order.id)}
                        className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Bekor qilish</span>
                      </button>
                    )}

                    {order.status === "PAID" && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Buyurtma to'landi, yetkazishga tayyorlanmoqda
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Sizda hali buyurtmalar mavjud emas
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Savatchangizga mahsulot qo'shib, birinchi buyurtmangizni rasmiylashtiring.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Do'konga o'tish
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
