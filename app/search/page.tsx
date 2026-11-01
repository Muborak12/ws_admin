"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { Search, Loader2, ShoppingBag, ArrowLeft } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    async function doSearch() {
      if (!searchTerm.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await productsApi.getAll({
          search: searchTerm.trim(),
          limit: 40,
        });
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [searchTerm]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Qidiruv natijalari</h1>
              <p className="text-xs text-slate-400">
                "{searchTerm}" bo'yicha {products.length} ta mahsulot topildi
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Barcha mahsulotlar
          </Link>
        </div>

        <div className="relative max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mahsulot nomini kiriting..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">
            "{searchTerm}" bo'yicha hech narsa topilmadi
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Qidiruv so'zini to'g'ri yozganingizni tekshiring yoki umumiyroq so'zlardan foydalaning.
          </p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
