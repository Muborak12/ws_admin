"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import CheckoutModal from "@/components/CheckoutModal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Savatcha
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {items.length > 0
                ? `${items.length} xil mahsulot tanlandi`
                : "Savatchangiz bo'sh"}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Savatchani tozalash</span>
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Savatchani ko'rish uchun tizimga kiring
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Mahsulotlaringiz profilingiz bilan sinxronlanadi va istalgan qurilmangizda saqlanadi.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Tizimga kirish
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Savatchangizda hozircha mahsulot yo'q
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Katalogimizdan o'zingizga yoqqan gadjetlar yoki aksessuarlarni tanlang.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Do'konga qaytish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div
                  key={it.productId}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-5 hover:border-slate-700 transition-all"
                >
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                    {it.product?.images?.[0] ? (
                      <img
                        src={it.product.images[0]}
                        alt={it.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Rasm yo'q</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <Link
                      href={`/product/${it.productId}`}
                      className="text-base font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-2"
                    >
                      {it.product?.title || "Mahsulot"}
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">
                      Birlik narxi:{" "}
                      <span className="text-emerald-400 font-medium">
                        {formatPrice(it.product?.price)}
                      </span>
                    </p>
                  </div>

                  {/* Quantity & Delete */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
                      <button
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-white">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">
                        {formatPrice(
                          it.subtotal ||
                            (it.product?.price || 0) * it.quantity
                        )}
                      </span>
                      <button
                        onClick={() => removeItem(it.productId)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white">Xarid xulosasi</h3>

                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Mahsulotlar soni:</span>
                    <span className="text-white font-medium">
                      {items.reduce((s, it) => s + it.quantity, 0)} dona
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yetkazib berish:</span>
                    <span className="text-emerald-400 font-semibold">Bepul</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-4 border-t border-slate-800">
                    <span>Jami to'lov:</span>
                    <span className="text-indigo-400 text-xl font-black">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Buyurtma berish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Xavfsiz va kafolatlangan to'lov</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Butun respublika bo'ylab tezkor kuryer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
      <Footer />
    </div>
  );
}
