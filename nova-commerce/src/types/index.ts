export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  image: string;
  rating: number;
  status: ProductStatus;
  createdAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'vip';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ordersCount: number;
  totalSpent: number;
  registeredAt: string;
  status: CustomerStatus;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type DeliveryStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAmount: number;
  date: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  shippingAddress: string;
}

export type PaymentMethod = 'card' | 'cash' | 'click' | 'payme';
export type TransactionStatus = 'successful' | 'pending' | 'cancelled' | 'refunded';

export interface Payment {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  subtotal: number;
  shipping: number;
  status: TransactionStatus;
  items: OrderItem[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}
