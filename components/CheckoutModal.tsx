"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Truck, Phone, MapPin, Loader2 } from "lucide-react";
import { ordersApi, getErrorMessage } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const { cartTotal, items, refreshCart, closeCart } = useCart();
  const toast = useToast();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("+998");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || address.length < 5) {
      toast.error("Yetkazib berish manzilini to'liq kiriting (kamida 5 belgi)");
      return;
    }

    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      toast.error("Telefon raqami formati: +998901234567 bo'lishi shart");
      return;
    }

    setSubmitting(true);
    try {
      const order = await ordersApi.create({
        address: address.trim(),
        phone: phone.trim(),
      });
      toast.success("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
      await refreshCart();
      onClose();
      closeCart();
      router.push(`/orders`);
    } catch (err) {
      const msg = getErrorMessage(err, "Buyurtma yaratishda xatolik yuz berdi");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Buyurtmani rasmiylashtirish</h3>
              <p className="text-xs text-slate-400">Yetkazib berish ma'lumotlarini kiriting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Yetkazib berish manzili
            </label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shahar, tuman, ko'cha, uy raqami, xonadon..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-400" />
              Telefon raqami (Aloqa uchun)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998901234567"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Format: +998 bilan boshlanishi va 13 ta belgidan iborat bo'lishi kerak.
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2 mt-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Mahsulotlar soni:</span>
              <span className="font-medium text-slate-200">
                {items.reduce((s, it) => s + it.quantity, 0)} dona
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-slate-200 pt-2 border-t border-slate-800">
              <span>Jami to'lov:</span>
              <span className="text-emerald-400 font-bold text-base">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Tasdiqlash</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
