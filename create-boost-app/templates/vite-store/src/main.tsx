import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './components/HomePage';
import CartPage from './components/CartPage';
import ProductDetailPage from './components/ProductDetailPage';
import AdminPage from './components/AdminPage';
import WishlistPage from './components/WishlistPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import NotFoundPage from './components/NotFoundPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

