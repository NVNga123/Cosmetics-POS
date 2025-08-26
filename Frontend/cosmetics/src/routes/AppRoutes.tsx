// Định nghĩa các tuyến đường của ứng dụng
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { ProductPage } from '../features/products/ProductPage';
import { POSPage } from '../features/pos/POSPage';
import { OrderHistoryPage } from '../features/orders/OrderHistoryPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/pos" replace />} />
          <Route path="pos" element={<POSPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
};