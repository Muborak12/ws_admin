export type FittingSlot = 'hat' | 'outerwear' | 'top' | 'bottom' | 'shoes';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  hoverImage?: string;
  isSale?: boolean;
  salePercentage?: number;
  tag?: string;
  description: string;
  inStock: boolean;
  fittingSlot: FittingSlot;
  colors: { name: string; hex: string }[];
  sizes: string[];
  mannequinColor?: string;
  mannequinLayer?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'UZS';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number;
  prefix: boolean;
}
