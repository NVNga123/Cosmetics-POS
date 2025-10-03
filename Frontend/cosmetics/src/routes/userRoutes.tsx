import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Products } from '../pages/Product/Products';
import { ProductDetail } from '../pages/Product/ProductDetail';
import { Cart } from '../pages/Cart';
import { Orders } from '../pages/Order/Orders.tsx';
import { Invoice } from '../pages/Invoice';
import { SalesScreen } from '../pages/Sale/SalesScreen.tsx';

export const UserRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="products" element={<Products/>}/>
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="cart" element={<Cart />} />
      <Route path="orders" element={<Orders />} />
      <Route path="invoice/:id" element={<Invoice />} />
      <Route path="sales" element={<SalesScreen />} />
    </Routes>
  );
};