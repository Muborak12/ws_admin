"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const fav = isFavorite(product.id);
  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <div className="group relative rounded-3xl bg-gradient-to-b from-[#2e1a13]/90 to-[#22130e]/95 border border-[#fbcfe8]/15 hover:border-[#e07a8b]/50 backdrop-blur-xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#e07a8b]/10">
      
      {/* Top Media Container */}
      <div className="relative w-full aspect-square rounded-2xl bg-[#1b0d09] overflow-hidden mb-3 border border-[#fbcfe8]/10 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="text-xs text-[#fbcfe8]/40">Rasm mavjud emas</div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-lg bg-[#e07a8b] text-white font-black text-[10px] tracking-wider uppercase shadow-md shadow-[#e07a8b]/30">
              -{discountPercent}%
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-[#c59b6d] text-[#20120d] font-black text-[10px] uppercase shadow-md">
              {product.stock} ta qoldi
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-[#3b2219] text-[#fbcfe8]/70 font-bold text-[10px] uppercase">
              Tugagan
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            fav
              ? "bg-[#e07a8b]/30 text-[#e07a8b] border border-[#e07a8b]/50"
              : "bg-[#281813]/70 text-[#fbcfe8]/60 hover:text-white border border-[#fbcfe8]/15 hover:bg-[#3b2219]"
          }`}
          title={fav ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-[#e07a8b]" : ""}`} />
        </button>
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#e07a8b] font-semibold truncate max-w-[60%]">
              {product.category?.name || "Kategoriya"}
            </span>
            <div className="flex items-center gap-1 text-[#c59b6d] font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-[#c59b6d] text-[#c59b6d]" />
              <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}</span>
              <span className="text-[10px] text-[#fbcfe8]/40">
                ({product.ratingCount ?? 0})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            href={`/product/${product.id}`}
            className="block text-xs sm:text-sm font-semibold text-[#fdf2f4] group-hover:text-[#fbcfe8] transition-colors line-clamp-2 leading-snug"
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-[#fbcfe8]/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-black text-white">
              {formatPrice(product.price)}
            </div>
            {product.oldPrice && product.oldPrice > product.price ? (
              <div className="text-[11px] text-[#fbcfe8]/40 line-through">
                {formatPrice(product.oldPrice)}
              </div>
            ) : (
              <div className="text-[10px] text-[#fbcfe8]/50">Kafolat mavjud</div>
            )}
          </div>

          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={product.stock === 0}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-[#3b2219] to-[#e07a8b] hover:opacity-95 text-white shadow-lg shadow-[#3b2219]/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            title="Savatchaga qo'shish"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
