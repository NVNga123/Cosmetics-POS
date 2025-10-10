import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../features/admin/dashboard';
import { ProductManagement } from '../features/admin/productManagement';
import { OrderManagement } from '../features/admin/order/orderManagement.tsx';
import { UserManagement } from '../features/admin/userManagement';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="users" element={<UserManagement />} />
    </Routes>
  );
};