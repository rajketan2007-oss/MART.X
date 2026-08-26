import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UIProvider } from './context/UIContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/common/Navbar';
import PromoStrip from './components/common/PromoStrip';
import CouponDrawer from './components/common/CouponDrawer';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/ToastContainer';

import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';

// Protected User Route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Admin Route
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-white text-extrad-dark font-sans selection:bg-extrad-pink selection:text-white">
                <PromoStrip />
                <Navbar />
                <CouponDrawer />
                <ToastContainer />

                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ListingPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/products"
                      element={
                        <AdminRoute>
                          <AdminProductsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <AdminRoute>
                          <AdminOrdersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <AdminUsersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/coupons"
                      element={
                        <AdminRoute>
                          <AdminCouponsPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </main>

                <Footer />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
