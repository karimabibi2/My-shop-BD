
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CategoryProvider } from './context/CategoryContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'sonner';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Cart = lazy(() => import('./pages/Cart'));
const Profile = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Addresses = lazy(() => import('./pages/Addresses'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-[#e62e04] border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading MY shopBD...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <CategoryProvider>
              <Router>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/landing" element={<LandingPage />} />
                  </Routes>
                </Suspense>
              </Router>
            </CategoryProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
