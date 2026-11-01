export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  ordersCount?: number;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  images: string[];
  ratingAvg?: number;
  ratingCount?: number;
  categoryId: number;
  category?: Category;
  createdAt?: string;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewAuthor {
  id: number;
  name: string;
  avatarUrl?: string | null;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  author: ReviewAuthor;
  userId?: number;
}

export interface ReviewListResponse {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CartItem {
  productId: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id?: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  user?: User;
  items: OrderItem[];
  totalPrice?: number;
  total?: number;
  status: OrderStatus;
  address: string;
  phone: string;
  createdAt: string;
}
