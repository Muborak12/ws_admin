"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi, categoriesApi } from "@/lib/api";
import { Product, Category, ProductListResponse } from "@/types";
import {
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Site Config (from Admin Settings)
  const [siteConfig, setSiteConfig] = useState({
    siteName: "WS",
    heroTitle: "Eksklyuziv uslub va premium texnologiyalar",
    heroSubtitle: "WS platformasi orqali eng sara gadjetlar va nafis aksessuarlarni rasmiy kafolat bilan kashf eting.",
    announcement: "WS maxsus mavsumiy kolleksiyasi va 30% gacha chegirmalar",
  });

  // Filters & Pagination State
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"price" | "ratingAvg" | "createdAt" | "title">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Load site config & categories
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((cfg) => {
        if (cfg?.siteName) setSiteConfig(cfg);
      })
      .catch(() => {});

    categoriesApi
      .getAll()
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Fetch products when filters change
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
        sortBy,
        sortOrder,
      };
      if (selectedCategory !== "all") {
        params.categoryId = selectedCategory;
      }
      if (minPrice && !isNaN(Number(minPrice))) {
        params.minPrice = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        params.maxPrice = Number(maxPrice);
      }

      const res: ProductListResponse = await productsApi.getAll(params);
      setProducts(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalProducts(res.meta?.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, sortBy, sortOrder, minPrice, maxPrice]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#20120d] text-[#fdf2f4]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* ================= HERO SECTION (BROWN & SOFT PINK) ================= */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#3b2219] via-[#2d1811] to-[#45271d] border border-[#fbcfe8]/20 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Ambient Blush Pink Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#e07a8b]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#c59b6d]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fdf2f4]/10 border border-[#fbcfe8]/30 text-[#fbcfe8] text-xs font-bold backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#e07a8b] fill-[#e07a8b]" />
              <span>{siteConfig.announcement}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              {siteConfig.heroTitle}
            </h1>

            <p className="text-[#fbcfe8]/80 text-sm sm:text-base leading-relaxed">
              {siteConfig.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#3b2219]/60 transition-all flex items-center gap-2 group border border-[#fbcfe8]/20"
              >
                <span>Katalogni ko'rish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center gap-2 text-xs text-[#fbcfe8]/70">
                <Sparkles className="w-4 h-4 text-[#e07a8b]" />
                <span>100% original sertifikatlangan tovarlar</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CATEGORIES CHIPS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#e07a8b]" />
              Kategoriyalar bo'yicha saralash
            </h2>
            <span className="text-xs text-[#fbcfe8]/60 font-semibold">
              {categories.length} ta kategoriya
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPage(1);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white border-[#fbcfe8]/40 shadow-lg shadow-[#3b2219]/40"
                  : "bg-[#2d1912]/80 text-[#fbcfe8]/80 border-[#fbcfe8]/15 hover:border-[#e07a8b]/40 hover:text-white"
              }`}
            >
              Barcha tovarlar
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white border-[#fbcfe8]/40 shadow-lg shadow-[#3b2219]/40"
                    : "bg-[#2d1912]/80 text-[#fbcfe8]/80 border-[#fbcfe8]/15 hover:border-[#e07a8b]/40 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CATALOG WITH ADVANCED FILTERS ================= */}
        <div id="catalog" className="space-y-6 pt-2">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-[#281813]/80 border border-[#fbcfe8]/15 backdrop-blur-xl shadow-lg">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#fbcfe8]/80">
              <SlidersHorizontal className="w-4 h-4 text-[#e07a8b]" />
              <span>
                Jami topildi:{" "}
                <strong className="text-white font-bold">{totalProducts}</strong> ta mahsulot
              </span>
            </div>

            {/* Sorting & Price filter */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Min - Max price */}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min narx"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-24 px-3 py-1.5 rounded-xl bg-[#1b0d09] border border-[#fbcfe8]/15 text-xs text-white placeholder-[#fbcfe8]/30 focus:outline-none focus:border-[#e07a8b]"
                />
                <span className="text-[#fbcfe8]/40">-</span>
                <input
                  type="number"
                  placeholder="Max narx"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-24 px-3 py-1.5 rounded-xl bg-[#1b0d09] border border-[#fbcfe8]/15 text-xs text-white placeholder-[#fbcfe8]/30 focus:outline-none focus:border-[#e07a8b]"
                />
              </div>

              {/* Sort selector */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split("-") as [any, any];
                  setSortBy(sb);
                  setSortOrder(so);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1b0d09] border border-[#fbcfe8]/15 text-xs text-[#fdf2f4] focus:outline-none focus:border-[#e07a8b] cursor-pointer"
              >
                <option value="createdAt-desc">Eng yangilari</option>
                <option value="price-asc">Narx: Arzondan qimmatga</option>
                <option value="price-desc">Narx: Qimmatdan arzonga</option>
                <option value="ratingAvg-desc">Oliy reytingli</option>
                <option value="title-asc">Nomi bo'yicha (A-Z)</option>
              </select>

              {/* Reset button */}
              {(selectedCategory !== "all" || minPrice || maxPrice) && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 rounded-xl text-[#fbcfe8]/70 hover:text-white bg-[#1b0d09] border border-[#fbcfe8]/15 hover:border-[#e07a8b] transition-colors"
                  title="Filtrlarni tozalash"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-[#2a1711]/60 border border-[#fbcfe8]/10 p-4 space-y-4 animate-pulse"
                >
                  <div className="w-full aspect-square rounded-2xl bg-[#1b0d09]" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#3b2219] rounded-md w-3/4" />
                    <div className="h-3 bg-[#3b2219]/60 rounded-md w-1/2" />
                  </div>
                  <div className="h-8 bg-[#3b2219]/70 rounded-xl" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl bg-[#281813]/60 border border-[#fbcfe8]/15">
              <ShoppingBag className="w-12 h-12 text-[#fbcfe8]/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#fdf2f4]">
                Tanlangan filtrlar bo'yicha tovar topilmadi
              </h3>
              <p className="text-xs text-[#fbcfe8]/60 mt-1">
                Narx oralig'ini kengaytiring yoki boshqa kategoriyani tanlang.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-5 py-2 rounded-2xl bg-[#3b2219] text-xs font-bold text-white hover:bg-[#e07a8b] transition-colors"
              >
                Filtrlarni tozalash
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-2xl bg-[#281813] border border-[#fbcfe8]/15 text-[#fbcfe8] hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-2xl text-xs font-bold transition-all ${
                      page === p
                        ? "bg-gradient-to-tr from-[#e07a8b] to-[#3b2219] text-white shadow-lg shadow-[#3b2219]/40 border border-[#fbcfe8]/30"
                        : "bg-[#281813] border border-[#fbcfe8]/15 text-[#fbcfe8]/70 hover:text-white hover:border-[#e07a8b]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-2xl bg-[#281813] border border-[#fbcfe8]/15 text-[#fbcfe8] hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
