"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

export default function WishlistPage() {
  const { favorites, loading } = useFavorites();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Mening sevimlilarim
              </h1>
              <p className="text-xs text-slate-400">
                {favorites.length} ta yoqqan mahsulot saqlangan
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Do'konga qaytish
          </Link>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Sevimlilar ro'yxatini ko'rish uchun tizimga kiring
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Mahsulotlarni o'zingizning shaxsiy profilingizda saqlash va ularni keyinroq xarid qilish uchun hisobingizga kiring.
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
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-300">
              Sevimlilar ro'yxatingiz bo'sh
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Sizga yoqqan mahsulotlarning ustidagi yurakcha belgisini bosib, ularni bu yerda to'plashingiz mumkin.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Mahsulotlarni ko'rish
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
