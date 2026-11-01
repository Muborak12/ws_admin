"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { productsApi, reviewsApi, getErrorMessage } from "@/lib/api";
import { Product, Review } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  MessageSquare,
  Trash2,
  Send,
  Loader2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);
  const router = useRouter();

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, revData] = await Promise.all([
          productsApi.getById(productId),
          reviewsApi.getByProduct(productId),
        ]);
        setProduct(prodData);
        setSelectedImage(prodData.images?.[0] || "");
        setReviews(revData.data || []);
      } catch (err) {
        toast.error("Mahsulot ma'lumotlarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Sharh qoldirish uchun avval tizimga kiring");
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 3) {
      toast.error("Sharh matni kamida 3 belgidan iborat bo'lishi kerak");
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewsApi.create(productId, {
        rating,
        text: reviewText.trim(),
      });
      toast.success("Sharhingiz qabul qilindi!");
      setReviewText("");
      // Refresh reviews
      const updated = await reviewsApi.getByProduct(productId);
      setReviews(updated.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Sharh qoldirishda xatolik yuz berdi"));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Haqiqatan ham bu sharhni o'chirmoqchimisiz?")) return;
    try {
      await reviewsApi.delete(reviewId);
      toast.info("Sharh o'chirildi");
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      toast.error(getErrorMessage(err, "Sharhni o'chirishda xatolik"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">Mahsulot topilmadi</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Asosiy sahifaga qaytish
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const fav = isFavorite(product.id);
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            Asosiy
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {product.category && (
            <>
              <Link
                href={`/catalog/${product.category.id}`}
                className="hover:text-white transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </>
          )}
          <span className="text-slate-200 truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          
          {/* Images Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-slate-500">Rasm yo'q</span>
              )}

              {/* Wishlist overlay button */}
              <button
                onClick={() => toggleFavorite(product)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-xl transition-all shadow-xl ${
                  fav
                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/40"
                    : "bg-slate-900/70 text-slate-400 hover:text-white border border-white/10 hover:bg-slate-900"
                }`}
              >
                <Heart className={`w-5 h-5 ${fav ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 scale-105"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center gap-3">
                {product.category && (
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                    {product.category.name}
                  </span>
                )}

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}</span>
                  <span className="text-slate-500">({reviews.length} sharh)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Price Block */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <>
                      <span className="text-sm text-slate-500 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold">
                        Tejamkorlik: {discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Oyiga {formatPrice(Math.round(product.price / 12))} dan 12 oyga
                  bo'lib to'lash imkoni
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tavsifi
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {product.description || "Ushbu mahsulot haqida tavsif berilmagan."}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Holat:</span>
                {product.stock > 0 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Omborda mavjud ({product.stock} dona)
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold">Tugagan</span>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart Button */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 99, q + 1))
                    }
                    className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product.id, quantity)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Savatchaga qo'shish ({formatPrice(product.price * quantity)})</span>
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <Truck className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Tezkor yetkazish
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Rasmiy kafolat
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                  <RotateCcw className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-400 block font-medium">
                    14 kunlik qaytarish
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <div className="pt-10 border-t border-slate-800 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              Xaridorlar fikrlari ({reviews.length})
            </h2>
          </div>

          {/* Add Review Form */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white mb-3">
              Mahsulot haqida o'z fikringizni bildiring
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Baholang (1 dan 5 gacha)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-amber-400 ml-2">
                      {rating} yulduz
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Sharhingiz
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Mahsulot sifati, yetkazib berilishi haqida o'rtoqlashing..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingReview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Sharhni yuborish</span>
                </button>
              </form>
            ) : (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-400 mb-3">
                  Sharh qoldirish uchun tizimga kirishingiz lozim.
                </p>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  Tizimga kirish
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80 text-sm text-slate-400">
                Hozircha hech kim sharh qoldirmagan. Birinchi bo'lib fikr bildiring!
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                        {rev.author?.avatarUrl ? (
                          <img
                            src={rev.author.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          rev.author?.name?.charAt(0).toUpperCase() || "F"
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {rev.author?.name || "Mijoz"}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-700"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Delete button if owner or admin */}
                      {(isAdmin || user?.id === rev.author?.id) && (
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Sharhni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {rev.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
