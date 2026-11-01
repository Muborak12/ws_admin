"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Product, CartItem, FilterState, FittingSlot, Currency } from "@/types/store";
import { PRODUCTS, CURRENCIES } from "@/data/products";

interface FittingRoomState {
  isOpen: boolean;
  isMinimized: boolean;
  equipped: Record<FittingSlot, Product | null>;
  userPicks: Product[];
  draggedProduct: Product | null;
  isDraggingOver: boolean;
  apiKey: string;
  isApiKeyModalOpen: boolean;
}

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "info" | "warn";
}

interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Fitting Room
  fittingRoom: FittingRoomState;
  openFittingRoom: () => void;
  closeFittingRoom: () => void;
  toggleFittingRoom: () => void;
  minimizeFittingRoom: () => void;
  equipItem: (product: Product) => void;
  unequipSlot: (slot: FittingSlot) => void;
  clearOutfit: () => void;
  isEquipped: (productId: string) => boolean;
  equipFullLook: (items: Product[]) => void;
  setDraggedProduct: (product: Product | null) => void;
  setIsDraggingOver: (isOver: boolean) => void;
  setApiKey: (key: string) => void;
  setIsApiKeyModalOpen: (open: boolean) => void;
  outfitTotal: number;
  equippedCount: number;

  // Theme & Settings
  theme: "dark" | "light";
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number) => string;
  language: string;
  setLanguage: (lang: string) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: "success" | "info" | "warn") => void;
}

const initialFilters: FilterState = {
  search: "",
  category: "All Categories",
  minPrice: 1,
  maxPrice: 500,
  inStockOnly: false,
  sortBy: "featured",
};

const initialEquipped: Record<FittingSlot, Product | null> = {
  hat: null,
  outerwear: null,
  top: null,
  bottom: null,
  shoes: null,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(["camel-wool-trench-coat"]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [language, setLanguage] = useState<string>("EN");

  // Virtual Fitting Room State
  const [fittingRoom, setFittingRoom] = useState<FittingRoomState>({
    isOpen: false,
    isMinimized: false,
    equipped: {
      ...initialEquipped,
      outerwear: PRODUCTS.find((p) => p.id === "camel-wool-trench-coat") || null,
      top: PRODUCTS.find((p) => p.id === "heavyweight-washed-tshirt") || null,
      bottom: PRODUCTS.find((p) => p.id === "pleated-wool-wide-trousers") || null,
      shoes: PRODUCTS.find((p) => p.id === "retro-runner-leather-sneakers") || null,
    },
    userPicks: [
      PRODUCTS[0], // Camel Wool Trench Coat
      PRODUCTS[1], // Army Green Puffer Jacket
      PRODUCTS[5], // Heavyweight Washed T-Shirt
      PRODUCTS[7], // Pleated Wool Wide Trousers
      PRODUCTS[8], // Retro Runner
    ],
    draggedProduct: null,
    isDraggingOver: false,
    apiKey: "",
    isApiKeyModalOpen: false,
  });

  // Handle dark mode initial class
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("store_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // default to dark as per prompt requirements
        document.documentElement.classList.add("dark");
      }

      // Load cart & wishlist from localStorage
      const savedCart = localStorage.getItem("store_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("store_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      try {
        localStorage.setItem("store_theme", next);
      } catch (e) {}
      return next;
    });
  };

  const showToast = (message: string, type: "success" | "info" | "warn" = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3200);
  };

  // Filter handlers
  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    showToast("Filters reset to default", "info");
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Category
      if (filters.category !== "All Categories" && item.category !== filters.category) {
        return false;
      }

      // Price range
      if (item.price < filters.minPrice || item.price > filters.maxPrice) {
        return false;
      }

      // In stock
      if (filters.inStockOnly && !item.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, filters]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const selColor = color || product.colors[0]?.name;
    const selSize = size || product.sizes[0] || "M";

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selSize && item.selectedColor === selColor
      );

      let nextCart: CartItem[];
      if (existingIndex > -1) {
        nextCart = [...prev];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + quantity,
        };
      } else {
        nextCart = [...prev, { product, quantity, selectedColor: selColor, selectedSize: selSize }];
      }

      try {
        localStorage.setItem("store_cart", JSON.stringify(nextCart));
      } catch (e) {}
      return nextCart;
    });

    showToast(`Added "${product.name}" to bag`, "success");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const nextCart = prev.filter((item) => item.product.id !== productId);
      try {
        localStorage.setItem("store_cart", JSON.stringify(nextCart));
      } catch (e) {}
      return nextCart;
    });
    showToast("Item removed from bag", "info");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const nextCart = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      try {
        localStorage.setItem("store_cart", JSON.stringify(nextCart));
      } catch (e) {}
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("store_cart");
    } catch (e) {}
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isFavorited = prev.includes(productId);
      const next = isFavorited ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem("store_wishlist", JSON.stringify(next));
      } catch (e) {}
      showToast(
        isFavorited ? "Removed from wishlist" : "Added to your wishlist",
        isFavorited ? "info" : "success"
      );
      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Fitting Room operations
  const openFittingRoom = () => {
    setFittingRoom((prev) => ({ ...prev, isOpen: true, isMinimized: false }));
  };

  const closeFittingRoom = () => {
    setFittingRoom((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleFittingRoom = () => {
    setFittingRoom((prev) => ({ ...prev, isOpen: !prev.isOpen, isMinimized: false }));
  };

  const minimizeFittingRoom = () => {
    setFittingRoom((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const equipItem = (product: Product) => {
    setFittingRoom((prev) => {
      const slot = product.fittingSlot;
      const isAlreadyWorn = prev.equipped[slot]?.id === product.id;

      const nextEquipped = {
        ...prev.equipped,
        [slot]: isAlreadyWorn ? null : product,
      };

      // Add to user picks if not already there
      const picks = prev.userPicks.some((p) => p.id === product.id)
        ? prev.userPicks
        : [product, ...prev.userPicks];

      return {
        ...prev,
        isOpen: true,
        isMinimized: false,
        equipped: nextEquipped,
        userPicks: picks,
      };
    });

    showToast(
      isEquipped(product.id) ? `Unequipped ${product.name}` : `Equipped ${product.name} on mannequin`,
      "success"
    );
  };

  const unequipSlot = (slot: FittingSlot) => {
    const item = fittingRoom.equipped[slot];
    setFittingRoom((prev) => ({
      ...prev,
      equipped: { ...prev.equipped, [slot]: null },
    }));
    if (item) showToast(`Removed ${item.name} from outfit`, "info");
  };

  const clearOutfit = () => {
    setFittingRoom((prev) => ({
      ...prev,
      equipped: initialEquipped,
    }));
    showToast("Cleared mannequin outfit", "info");
  };

  const equipFullLook = (items: Product[]) => {
    setFittingRoom((prev) => {
      const nextEquipped = { ...prev.equipped };
      items.forEach((item) => {
        nextEquipped[item.fittingSlot] = item;
      });
      return {
        ...prev,
        isOpen: true,
        isMinimized: false,
        equipped: nextEquipped,
      };
    });
    showToast("Equipped curated full look!", "success");
  };

  const isEquipped = (productId: string) => {
    return Object.values(fittingRoom.equipped).some((item) => item?.id === productId);
  };

  const setDraggedProduct = (product: Product | null) => {
    setFittingRoom((prev) => ({ ...prev, draggedProduct: product }));
  };

  const setIsDraggingOver = (isOver: boolean) => {
    setFittingRoom((prev) => ({ ...prev, isDraggingOver: isOver }));
  };

  const setApiKey = (key: string) => {
    setFittingRoom((prev) => ({ ...prev, apiKey: key }));
    showToast("Virtual stylist key saved", "success");
  };

  const setIsApiKeyModalOpen = (open: boolean) => {
    setFittingRoom((prev) => ({ ...prev, isApiKeyModalOpen: open }));
  };

  const outfitTotal = useMemo(() => {
    return Object.values(fittingRoom.equipped).reduce(
      (sum, item) => sum + (item ? item.price : 0),
      0
    );
  }, [fittingRoom.equipped]);

  const equippedCount = useMemo(() => {
    return Object.values(fittingRoom.equipped).filter(Boolean).length;
  }, [fittingRoom.equipped]);

  // Price formatting
  const formatPrice = (amount: number) => {
    const cfg = CURRENCIES[currency];
    const converted = amount * cfg.rate;
    if (currency === "UZS") {
      return `${Math.round(converted).toLocaleString()} ${cfg.symbol}`;
    }
    return `${cfg.symbol}${converted.toFixed(0)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        filters,
        setFilter,
        resetFilters,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        fittingRoom,
        openFittingRoom,
        closeFittingRoom,
        toggleFittingRoom,
        minimizeFittingRoom,
        equipItem,
        unequipSlot,
        clearOutfit,
        isEquipped,
        equipFullLook,
        setDraggedProduct,
        setIsDraggingOver,
        setApiKey,
        setIsApiKeyModalOpen,
        outfitTotal,
        equippedCount,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
        language,
        setLanguage,
        quickViewProduct,
        setQuickViewProduct,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
