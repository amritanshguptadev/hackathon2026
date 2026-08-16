import {
  Heart,
  MessageCircle,
  User,
  Menu,
  X,
  Search,
  ShoppingCart,
  Package,
  Tag,
  Settings,
  LogOut,
  Bell,
  Edit,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu.jsx";
import { useSocket } from "../../../context/SocketContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";

export default function HeaderMain({ showSearchBar = true }) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { cartCount } = useCart() || { cartCount: 0 };
  const { favoriteCount } = useWishlist() || { favoriteCount: 0 };
  const { user, profile, logout, isAuthenticated } = useAuth();
  const { totalUnreadCount } = useSocket() || { totalUnreadCount: 0 };

  const userName =
    profile?.name ||
    profile?.fullName ||
    localStorage.getItem("loggedInUser") ||
    user?.email?.split("@")[0] ||
    "Campus Student";

  const userCollege =
    profile?.college ||
    profile?.university ||
    localStorage.getItem("college") ||
    "Campus Member";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/all-products?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cm-border-indigo)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <img
            src="/images/logo.png"
            alt="BuyKaro"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
          />
        </Link>

        {/* Right Navigation Actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Wishlist / Liked Items */}
          <Link
            to="/wishlist"
            className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label={`Liked Items (${favoriteCount})`}
            title="Your Liked Items"
          >
            <Heart size={20} className={favoriteCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
            {favoriteCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {favoriteCount > 9 ? "9+" : favoriteCount}
              </span>
            )}
          </Link>

          {/* Messages */}
          <Link
            to={isAuthenticated ? "/messages" : "/login"}
            className="relative hidden rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
            aria-label={totalUnreadCount > 0 ? `Messages (${totalUnreadCount} unread)` : "Messages"}
            title="Campus Chat & Offers"
          >
            <MessageCircle size={20} />
            {isAuthenticated && totalUnreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs animate-scale-in">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <Link
            to={isAuthenticated ? "/notifications" : "/login"}
            className="relative hidden rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
            aria-label="Notifications"
            title="Campus Alerts & Meetups"
          >
            <Bell size={20} />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Cart"
            title="Your Campus Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`flex items-center gap-1.5 rounded-full p-1.5 sm:px-2.5 sm:py-1.5 transition cursor-pointer border ${
                userDropdownOpen
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "border-transparent text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              aria-label="User account menu"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={14} className="hidden sm:block text-slate-400" />
            </button>

            {/* Dropdown Card */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-indigo-100/90 animate-scale-in z-50 divide-y divide-slate-100">
                {/* User Info Header */}
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={12} className="text-emerald-500" /> {userCollege}
                  </p>
                </div>

                {/* Main Account Links */}
                <div className="py-1 text-xs font-semibold text-slate-700">
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <User size={15} className="text-indigo-600" />
                    <span>My Profile Hub</span>
                  </Link>

                  <Link
                    to="/profile/edit"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Edit size={15} className="text-indigo-600" />
                    <span>Edit Profile Details</span>
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Package size={15} className="text-indigo-600" />
                    <span>Your Orders &amp; Meetups</span>
                  </Link>

                  <Link
                    to="/my-listings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Tag size={15} className="text-indigo-600" />
                    <span>My Campus Listings</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Heart size={15} className="text-rose-500" />
                    <span>Liked Items ({favoriteCount})</span>
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Bell size={15} className="text-indigo-600" />
                    <span>Notifications &amp; Alerts</span>
                  </Link>
                </div>

                {/* Settings & Logout */}
                <div className="pt-1 text-xs font-semibold text-slate-700">
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50/70 hover:text-indigo-600 transition"
                  >
                    <Settings size={15} className="text-slate-500" />
                    <span>Account Settings</span>
                  </Link>

                  {isAuthenticated ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition"
                    >
                      <span>Log In / Sign Up</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sell Button */}
          <Link
            to="/sell"
            className="ml-1 hidden rounded-full cm-gradient-btn px-5 py-2.5 text-sm font-bold shadow-md transition sm:inline-flex items-center gap-1.5"
          >
            <span>+ Sell Item</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2.5 text-slate-600 md:hidden hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Subtle brand gradient bottom border accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-80" />

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="border-t border-[var(--cm-border)] bg-white px-4 py-3 md:hidden">
          <MobileMenu />
        </div>
      )}
    </header>
  );
}
