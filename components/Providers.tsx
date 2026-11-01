"use client";

import React from "react";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
