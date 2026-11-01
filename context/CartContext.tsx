"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart, CartItem } from "@/types";
import { cartApi, getErrorMessage } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const data = await cartApi.get();
      setCart(data);
    } catch {
      // If error, ignore or reset
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    if (!isAuthenticated) {
      toast.info("Savatdan foydalanish uchun tizimga kiring");
      return;
    }
    try {
      const updated = await cartApi.addItem(productId, quantity);
      setCart(updated);
      toast.success("Mahsulot savatchaga qo'shildi!");
    } catch (err) {
      const msg = getErrorMessage(err, "Savatchaga qo'shishda xatolik");
      toast.error(msg);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    try {
      const updated = await cartApi.updateItem(productId, quantity);
      setCart(updated);
    } catch (err) {
      const msg = getErrorMessage(err, "Miqdorni o'zgartirishda xatolik");
      toast.error(msg);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const updated = await cartApi.removeItem(productId);
      setCart(updated);
      toast.info("Mahsulot savatchadan o'chirildi");
    } catch (err) {
      const msg = getErrorMessage(err, "Mahsulotni o'chirishda xatolik");
      toast.error(msg);
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      toast.info("Savatcha tozalandi");
    } catch (err) {
      const msg = getErrorMessage(err, "Savatchani tozalashda xatolik");
      toast.error(msg);
    }
  };

  const items = cart?.items || [];
  const cartCount = cart?.totalItems ?? items.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotal = cart?.totalPrice ?? items.reduce((acc, it) => acc + (it.subtotal || it.product.price * it.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        cartCount,
        cartTotal,
        loading,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
