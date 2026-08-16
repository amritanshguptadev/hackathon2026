import './App.css';
import Home from './Pages/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './assets/components/Auth/SignupForm';
import ProductDetails from './assets/components/Product/ProductDetails';
import AllProducts from './assets/components/Product/AllProducts';
import Upcoming from './Pages/Upcoming';
import LoginForm from './assets/components/Auth/LoginForm';
import EmailVerification from './assets/components/Auth/EmailVerification';
import Profile from './Pages/Profile';
import ProductListing from './Pages/ProductListing';
import Messages from './Pages/Messages';
import Cart from './Pages/Cart';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--cm-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--cm-blue)] border-t-transparent"></div>
      </div>
    );
  }
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/" element={<Home />} />
      <Route path="/api/product/:id" element={<ProductDetails />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/all-products" element={<AllProducts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/product-listing" element={<PrivateRoute element={<ProductListing />} />} />
      <Route path="/sell" element={<PrivateRoute element={<ProductListing />} />} />
      <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
      <Route path="/messages/:conversationId" element={<PrivateRoute element={<Messages />} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
