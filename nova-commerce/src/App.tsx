import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </AppProvider>
  );
};

export default App;
