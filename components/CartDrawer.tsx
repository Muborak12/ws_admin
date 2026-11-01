"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    items,
    cartTotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Savatcha</h2>
                  <p className="text-xs text-slate-400">
                    {items.length > 0
                      ? `${items.length} xil mahsulot tanlandi`
                      : "Savatchangiz bo'sh"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
                    title="Savatchani tozalash"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500 mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200">
                    Savatchangiz hozircha bo'sh
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Katalogimizdan o'zingizga yoqqan mahsulotlarni tanlab savatga qo'shing.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Xarid qilishni boshlash
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all group"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/50 flex items-center justify-center">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-500">Rasm yo'q</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.productId}`}
                            onClick={closeCart}
                            className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition-colors line-clamp-1"
                          >
                            {item.product?.title || "Mahsulot"}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-emerald-400 mt-0.5">
                          {formatPrice(item.product?.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-md hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-md hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-slate-300">
                          {formatPrice(
                            item.subtotal ||
                              (item.product?.price || 0) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-800 bg-slate-950/70 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Yetkazib berish:</span>
                    <span className="text-emerald-400 font-semibold">Bepul</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                    <span>Jami summa:</span>
                    <span className="text-indigo-400 text-lg">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Buyurtma berish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% xavfsiz to'lov va tezkor xizmat</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
