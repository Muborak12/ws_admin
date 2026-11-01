"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Package,
  LogOut,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { productsApi, categoriesApi } from "@/lib/api";
import { Category, Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function Navbar() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { favorites } = useFavorites();
  const router = useRouter();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Categories menu
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await productsApi.getAll({ search: searchTerm, limit: 5 });
        setSearchResults(res.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#20120d]/85 border-b border-[#fbcfe8]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo WS */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3b2219] via-[#523124] to-[#e07a8b] p-0.5 shadow-xl shadow-[#3b2219]/50 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-[#23140f] flex items-center justify-center border border-[#fbcfe8]/20">
                <span className="text-transparent bg-gradient-to-tr from-[#fbcfe8] to-[#ffffff] bg-clip-text font-black text-xl tracking-tighter">
                  WS
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                WS <span className="text-[#e07a8b] text-base font-medium">Store</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#fbcfe8]/60 -mt-1">
                Luxury & Tech
              </span>
            </div>
          </Link>

          {/* Categories Button */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#2e1a13] hover:bg-[#3b2219] border border-[#fbcfe8]/15 text-[#fdf2f4] text-xs font-semibold transition-all shadow-sm"
            >
              <Layers className="w-4 h-4 text-[#e07a8b]" />
              <span>Kategoriyalar</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#fbcfe8]/60 transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 rounded-3xl bg-[#281813]/95 border border-[#fbcfe8]/20 backdrop-blur-2xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#fbcfe8]/60 px-3 py-2">
                    Barcha bo'limlar
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalog/${cat.id}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs text-[#fdf2f4] hover:text-white hover:bg-[#e07a8b]/20 border border-transparent hover:border-[#e07a8b]/30 transition-all"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-[#fbcfe8]/50 font-mono">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="WS katalogidan qidiring (telefonlar, noutbuklar...)"
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#2a1710]/90 border border-[#fbcfe8]/15 text-[#fdf2f4] placeholder-[#fbcfe8]/40 text-xs focus:outline-none focus:border-[#e07a8b] transition-all"
                />
                <Search className="w-4 h-4 text-[#fbcfe8]/50 absolute left-4 top-1/2 -translate-y-1/2" />
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-[#e07a8b] border-t-transparent rounded-full animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </form>

            {/* Live Search dropdown */}
            {isSearchOpen && searchTerm.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 rounded-3xl bg-[#281813]/98 border border-[#fbcfe8]/20 backdrop-blur-2xl shadow-2xl p-2 z-30 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchTerm("");
                        }}
                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#3b2219]/60 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#1b0d08] overflow-hidden shrink-0 border border-[#fbcfe8]/10 flex items-center justify-center">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="text-[10px] text-[#fbcfe8]/40">Rasm yo'q</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#fdf2f4] truncate group-hover:text-[#fbcfe8] transition-colors">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-[#e07a8b]">
                              {formatPrice(product.price)}
                            </span>
                            {product.category && (
                              <span className="text-[10px] text-[#fbcfe8]/60 bg-[#3b2219] px-2 py-0.5 rounded-md">
                                {product.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2.5 mt-1 text-xs font-bold text-[#e07a8b] hover:bg-[#e07a8b]/10 rounded-2xl transition-colors border-t border-[#fbcfe8]/10"
                    >
                      Barcha natijalarni ko'rish ("{searchTerm}") →
                    </button>
                  </div>
                ) : !isSearching ? (
                  <div className="py-6 text-center text-xs text-[#fbcfe8]/60">
                    "{searchTerm}" bo'yicha mahsulot topilmadi
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Action icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-2xl text-[#fbcfe8]/80 hover:text-white hover:bg-[#3b2219]/60 transition-all"
              title="Sevimlilar"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e07a8b] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#20120d]">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-2xl text-[#fbcfe8]/80 hover:text-white hover:bg-[#3b2219]/60 transition-all"
              title="Savatcha"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white text-[10px] font-black flex items-center justify-center ring-2 ring-[#20120d]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-[#2e1a13] border border-[#fbcfe8]/20 hover:border-[#e07a8b]/40 text-[#fdf2f4] text-xs font-semibold transition-all"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#e07a8b] to-[#3b2219] overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#fbcfe8]/60" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-3xl bg-[#281813]/98 border border-[#fbcfe8]/20 backdrop-blur-2xl shadow-2xl p-2 z-20 space-y-1">
                      <div className="px-3.5 py-2.5 border-b border-[#fbcfe8]/10 mb-1">
                        <p className="text-[10px] text-[#fbcfe8]/60 uppercase font-bold">Faol hisob</p>
                        <p className="text-xs font-black text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-[#fbcfe8]/50 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-amber-300 hover:bg-amber-400/10 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-[#fdf2f4] hover:bg-[#3b2219] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#e07a8b]" />
                        <span>Buyurtmalarim</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-[#fdf2f4] hover:bg-[#3b2219] transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#e07a8b]" />
                        <span>Mening profilim</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl text-xs text-[#e07a8b] hover:bg-[#e07a8b]/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Chiqish</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-[#fbcfe8] hover:text-white hover:bg-[#3b2219]/60 transition-all"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#e07a8b] to-[#3b2219] hover:opacity-90 shadow-lg shadow-[#3b2219]/50 transition-all"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
