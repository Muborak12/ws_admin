import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, Customer, Order, Payment, DashboardStats, DeliveryStatus, PaymentStatus } from '../types';
import { initialProducts, initialCustomers, initialOrders, initialPayments } from '../data/initialData';
import toast from 'react-hot-toast';

interface AppContextType {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  payments: Payment[];
  stats: DashboardStats;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, deliveryStatus: DeliveryStatus, paymentStatus?: PaymentStatus) => void;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'nova_commerce_products',
  CUSTOMERS: 'nova_commerce_customers',
  ORDERS: 'nova_commerce_orders',
  PAYMENTS: 'nova_commerce_payments',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [globalSearch, setGlobalSearch] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  const stats = useMemo<DashboardStats>(() => {
    const totalRevenue = payments
      .filter((p) => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalCustomers: customers.length,
      revenueGrowth: 18.4,
      ordersGrowth: 12.8,
      productsGrowth: 8.5,
      customersGrowth: 14.2,
    };
  }, [payments, orders, products, customers]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    toast.success('Yangi mahsulot muvaffaqiyatli qo‘shildi!');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...productData } : item))
    );
    toast.success('Mahsulot ma’lumotlari yangilandi!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    toast.success('Mahsulot muvaffaqiyatli o‘chirildi!');
  };

  const updateOrderStatus = (
    orderId: string,
    deliveryStatus: DeliveryStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = { ...order, deliveryStatus };
          if (paymentStatus) {
            updated.paymentStatus = paymentStatus;
          }
          return updated;
        }
        return order;
      })
    );

    if (paymentStatus) {
      setPayments((prev) =>
        prev.map((pay) => {
          if (pay.orderId === orderId) {
            const mappedStatus =
              paymentStatus === 'paid'
                ? 'successful'
                : paymentStatus === 'pending'
                ? 'pending'
                : paymentStatus === 'refunded'
                ? 'refunded'
                : 'cancelled';
            return { ...pay, status: mappedStatus };
          }
          return pay;
        })
      );
    }

    toast.success('Buyurtma holati muvaffaqiyatli yangilandi!');
  };

  const resetAllData = () => {
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setOrders(initialOrders);
    setPayments(initialPayments);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    toast.success('Barcha ma’lumotlar boshlang‘ich holatga qaytarildi!');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        orders,
        payments,
        stats,
        globalSearch,
        setGlobalSearch,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
