import axios from "axios";
import {
  AuthResponse,
  Cart,
  Category,
  Order,
  OrderStatus,
  Product,
  ProductListResponse,
  ReviewListResponse,
  User,
} from "@/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://shop-api.globalstudent.uz";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor to attach bearer token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor with auto-refresh mechanism
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/login") &&
      !originalRequest.url?.includes("/api/auth/register") &&
      !originalRequest.url?.includes("/api/auth/refresh")
    ) {
      if (typeof window === "undefined") {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authUser");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Helper error extractor
export const getErrorMessage = (error: unknown, defaultMessage = "Xatolik yuz berdi"): string => {
  if (axios.isAxiosError(error)) {
    const resp = error.response?.data;
    if (resp?.message) {
      if (Array.isArray(resp.message)) return resp.message.join(", ");
      return resp.message;
    }
    if (resp?.error) return resp.error;
    if (resp?.errors) {
      const keys = Object.keys(resp.errors);
      if (keys.length > 0) {
        const first = resp.errors[keys[0]];
        return Array.isArray(first) ? first[0] : String(first);
      }
    }
  }
  if (error instanceof Error) return error.message;
  return defaultMessage;
};

// ======================== AUTH ========================
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/auth/login", credentials);
    return res.data;
  },
  register: async (payload: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/auth/register", payload);
    return res.data;
  },
  me: async (): Promise<User> => {
    const res = await api.get<User>("/api/auth/me");
    return res.data;
  },
  logout: async (refreshToken?: string): Promise<void> => {
    try {
      await api.post("/api/auth/logout", { refreshToken });
    } catch {
      // ignore
    }
  },
};

// ======================== PRODUCTS ========================
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "ratingAvg" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
    const res = await api.get<ProductListResponse>("/api/products", { params });
    return res.data;
  },
  getById: async (id: number | string): Promise<Product> => {
    const res = await api.get<Product>(`/api/products/${id}`);
    return res.data;
  },
  create: async (data: {
    title: string;
    description: string;
    price: number;
    oldPrice?: number | null;
    stock: number;
    categoryId: number;
    images?: string[];
  }): Promise<Product> => {
    const res = await api.post<Product>("/api/products", data);
    return res.data;
  },
  update: async (
    id: number | string,
    data: Partial<{
      title: string;
      description: string;
      price: number;
      oldPrice: number | null;
      stock: number;
      categoryId: number;
      images: string[];
    }>
  ): Promise<Product> => {
    const res = await api.patch<Product>(`/api/products/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string): Promise<{ success?: boolean }> => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
  },
  uploadImage: async (id: number | string, file: File): Promise<{ url?: string; images?: string[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/api/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

// ======================== CATEGORIES ========================
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/api/categories");
    return res.data;
  },
  create: async (data: { name: string; slug: string; imageUrl?: string }): Promise<Category> => {
    const res = await api.post<Category>("/api/categories", data);
    return res.data;
  },
  update: async (
    id: number | string,
    data: { name?: string; slug?: string; imageUrl?: string }
  ): Promise<Category> => {
    const res = await api.patch<Category>(`/api/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: number | string): Promise<{ success?: boolean }> => {
    const res = await api.delete(`/api/categories/${id}`);
    return res.data;
  },
  uploadImage: async (id: number | string, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/api/categories/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

// ======================== REVIEWS ========================
export const reviewsApi = {
  getByProduct: async (
    productId: number | string,
    page = 1,
    limit = 20
  ): Promise<ReviewListResponse> => {
    const res = await api.get<ReviewListResponse>(`/api/products/${productId}/reviews`, {
      params: { page, limit },
    });
    return res.data;
  },
  create: async (
    productId: number | string,
    data: { rating: number; text: string }
  ) => {
    const res = await api.post(`/api/products/${productId}/reviews`, data);
    return res.data;
  },
  delete: async (reviewId: number | string) => {
    const res = await api.delete(`/api/reviews/${reviewId}`);
    return res.data;
  },
};

// ======================== FAVORITES ========================
export const favoritesApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await api.get<Product[]>("/api/favorites");
    return res.data;
  },
  add: async (productId: number | string): Promise<{ message?: string }> => {
    const res = await api.post(`/api/favorites/${productId}`);
    return res.data;
  },
  remove: async (productId: number | string): Promise<{ message?: string }> => {
    const res = await api.delete(`/api/favorites/${productId}`);
    return res.data;
  },
};

// ======================== CART ========================
export const cartApi = {
  get: async (): Promise<Cart> => {
    const res = await api.get<Cart>("/api/cart");
    return res.data;
  },
  addItem: async (productId: number, quantity = 1): Promise<Cart> => {
    const res = await api.post<Cart>("/api/cart/items", { productId, quantity });
    return res.data;
  },
  updateItem: async (productId: number, quantity: number): Promise<Cart> => {
    const res = await api.patch<Cart>(`/api/cart/items/${productId}`, { quantity });
    return res.data;
  },
  removeItem: async (productId: number): Promise<Cart> => {
    const res = await api.delete<Cart>(`/api/cart/items/${productId}`);
    return res.data;
  },
  clear: async (): Promise<{ message?: string }> => {
    const res = await api.delete("/api/cart");
    return res.data;
  },
};

// ======================== ORDERS ========================
export const ordersApi = {
  create: async (data: { address: string; phone: string }): Promise<Order> => {
    const res = await api.post<Order>("/api/orders", data);
    return res.data;
  },
  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>("/api/orders");
    return res.data;
  },
  getById: async (id: number | string): Promise<Order> => {
    const res = await api.get<Order>(`/api/orders/${id}`);
    return res.data;
  },
  pay: async (id: number | string): Promise<Order> => {
    const res = await api.post<Order>(`/api/orders/${id}/pay`);
    return res.data;
  },
  cancel: async (id: number | string): Promise<Order> => {
    const res = await api.post<Order>(`/api/orders/${id}/cancel`);
    return res.data;
  },
  getAdminOrders: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>("/api/admin/orders");
    return res.data;
  },
  updateStatus: async (
    id: number | string,
    status: OrderStatus
  ): Promise<Order> => {
    const res = await api.patch<Order>(`/api/admin/orders/${id}/status`, { status });
    return res.data;
  },
};

// ======================== USERS & ADMIN ========================
export const usersApi = {
  updateProfile: async (data: { name: string }): Promise<User> => {
    const res = await api.patch<User>("/api/users/me", data);
    return res.data;
  },
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string; user?: User }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  getAdminUsers: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/api/admin/users");
    return res.data;
  },
  getAdminUserById: async (id: number | string): Promise<User> => {
    const res = await api.get<User>(`/api/admin/users/${id}`);
    return res.data;
  },
  getAdminUserOrders: async (id: number | string): Promise<Order[]> => {
    const res = await api.get<Order[]>(`/api/admin/users/${id}/orders`);
    return res.data;
  },
};
