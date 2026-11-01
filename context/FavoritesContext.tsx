"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { favoritesApi, getErrorMessage } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface FavoritesContextType {
  favorites: Product[];
  favoriteIds: Set<number>;
  loading: boolean;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const data = await favoritesApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setFavorites(list);
      setFavoriteIds(new Set(list.map((p) => p.id)));
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = (productId: number) => favoriteIds.has(productId);

  const toggleFavorite = async (product: Product) => {
    if (!isAuthenticated) {
      toast.info("Sevimlilarga qo'shish uchun avval tizimga kiring");
      return;
    }
    const exists = favoriteIds.has(product.id);
    // Optimistic update
    if (exists) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      setFavorites((prev) => prev.filter((p) => p.id !== product.id));
      try {
        await favoritesApi.remove(product.id);
        toast.info("Sevimlilardan olib tashlandi");
      } catch (err) {
        // Rollback
        refreshFavorites();
        toast.error(getErrorMessage(err, "Xatolik yuz berdi"));
      }
    } else {
      setFavoriteIds((prev) => new Set(prev).add(product.id));
      setFavorites((prev) => [product, ...prev]);
      try {
        await favoritesApi.add(product.id);
        toast.success("Sevimlilarga qo'shildi ❤️");
      } catch (err) {
        // Rollback
        refreshFavorites();
        toast.error(getErrorMessage(err, "Xatolik yuz berdi"));
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
};
