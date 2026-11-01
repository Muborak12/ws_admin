"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi, categoriesApi } from "@/lib/api";
import { Product, Category } from "@/types";
import { ChevronRight, ArrowLeft, Loader2, ShoppingBag } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = use(params);
  const slugOrId = resolved.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const categories = await categoriesApi.getAll();
        const found = categories.find(
          (c) => String(c.id) === slugOrId || c.slug === slugOrId
        );
        setCategory(found || null);

        const categoryId = found ? found.id : !isNaN(Number(slugOrId)) ? Number(slugOrId) : undefined;
        const res = await productsApi.getAll({
          categoryId,
          limit: 50,
        });
        setProducts(res.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slugOrId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Asosiy
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold">
            {category ? category.name : "Katalog"}
          </span>
        </nav>

        {/* Category Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {category ? category.name : "Mahsulotlar katalogi"}
            </h1>
            <p className="text-sm text-slate-400">
              Ushbu bo'limda {products.length} ta mahsulot mavjud
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Barcha mahsulotlar
          </Link>
        </div>

        {/* Product Grid */}
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
              Bu kategoriyada tovarlar topilmadi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Boshqa kategoriyalarni ko'rib chiqing.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
