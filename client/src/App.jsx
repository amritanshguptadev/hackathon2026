import './App.css';
import Home from './Pages/Home';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './assets/components/Auth/SignupForm';
import ProductDetails from './assets/components/Product/ProductDetails';
import AllProducts from './assets/components/Product/AllProducts';
import Wishlist from './Pages/Wishlist';
import Orders from './Pages/Orders';
import EditProfile from './Pages/EditProfile';
import MyListings from './Pages/MyListings';
import Notifications from './Pages/Notifications';
import Settings from './Pages/Settings';
import LoginForm from './assets/components/Auth/LoginForm';
import EmailVerification from './assets/components/Auth/EmailVerification';
import Profile from './Pages/Profile';
import ProductListing from './Pages/ProductListing';
import Messages from './Pages/Messages';
import Cart from './Pages/Cart';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
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
      <Route path="/verify-email" element={<Navigate to="/profile" replace />} />
      <Route path="/" element={<Home />} />
      <Route path="/api/product/:id" element={<ProductDetails />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/all-products" element={<AllProducts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/favorites" element={<Wishlist />} />
      <Route path="/liked" element={<Wishlist />} />
      <Route path="/saved" element={<PrivateRoute element={<Wishlist />} />} />
      <Route path="/upcoming" element={<Wishlist />} />
      <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
      <Route path="/my-orders" element={<PrivateRoute element={<Orders />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/profile/edit" element={<PrivateRoute element={<EditProfile />} />} />
      <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
      <Route path="/my-listings" element={<PrivateRoute element={<MyListings />} />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
      <Route path="/product-listing" element={<PrivateRoute element={<ProductListing />} />} />
      <Route path="/sell" element={<PrivateRoute element={<ProductListing />} />} />
      <Route path="/wanted/create" element={<PrivateRoute element={<ProductListing />} />} />
      <Route path="/messages" element={<PrivateRoute element={<Messages />} />} />
      <Route path="/messages/:conversationId" element={<PrivateRoute element={<Messages />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <AppRoutes />
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
