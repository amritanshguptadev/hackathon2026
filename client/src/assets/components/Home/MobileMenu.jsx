import {
  Heart,
  User,
  Package,
  MessageCircle,
  Tag,
  Bell,
  Settings,
  Edit,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useOrders } from "../../../context/OrderContext";
import { useAuth } from "../../../context/AuthContext";

export default function MobileMenu() {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const userName =
    profile?.name ||
    profile?.fullName ||
    localStorage.getItem("loggedInUser") ||
    user?.email?.split("@")[0] ||
    "Campus Student";

  const { totalUnreadCount } = useSocket() || { totalUnreadCount: 0 };
  const { favoriteCount } = useWishlist() || { favoriteCount: 0 };
  const { orderCount } = useOrders() || { orderCount: 0 };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-4 py-2">
      {isAuthenticated && (
        <Link
          to="/profile"
          className="flex items-center justify-between gap-3 rounded-2xl bg-indigo-50/70 p-3 border border-indigo-100"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">{userName}</p>
              <p className="text-[11px] text-slate-500">{profile?.college || "Campus Member"}</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-indigo-600">View Hub →</span>
        </Link>
      )}

      {/* Main 4-Grid */}
      <div className="grid grid-cols-4 gap-2">
        <Link
          to="/all-products"
          className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <ShoppingBag size={18} />
          Browse
        </Link>

        <Link
          to={isAuthenticated ? "/messages" : "/login"}
          className="relative flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <MessageCircle size={18} />
          Messages
          {isAuthenticated && totalUnreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white shadow-xs">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/wishlist"
          className="relative flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Heart size={18} className={favoriteCount > 0 ? "fill-rose-500 text-rose-500" : ""} />
          Wishlist
          {favoriteCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs">
              {favoriteCount}
            </span>
          )}
        </Link>

        <Link
          to={isAuthenticated ? "/orders" : "/login"}
          className="relative flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2.5 text-[11px] font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Package size={18} />
          Orders
          {orderCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white shadow-xs">
              {orderCount}
            </span>
          )}
        </Link>
      </div>

      {/* Secondary Account Options List */}
      <div className="space-y-1 pt-1 border-t border-slate-100 text-xs font-semibold text-slate-700">
        <Link
          to="/profile/edit"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Edit size={15} className="text-indigo-600" />
          <span>Edit Profile &amp; Campus Details</span>
        </Link>

        <Link
          to="/my-listings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Tag size={15} className="text-indigo-600" />
          <span>My Campus Listings</span>
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Bell size={15} className="text-indigo-600" />
          <span>Notifications &amp; Price Alerts</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
          <Settings size={15} className="text-slate-500" />
          <span>Settings &amp; Privacy</span>
        </Link>
      </div>

      {/* CTA Button */}
      <Link
        to="/sell"
        className="flex w-full items-center justify-center rounded-full cm-gradient-btn py-3 text-xs font-bold text-white shadow-md transition"
      >
        + Sell an Item on Campus
      </Link>

      {/* Auth Actions */}
      {!isAuthenticated ? (
        <div className="flex gap-2 pt-1">
          <Link
            to="/login"
            className="flex-1 rounded-full border border-indigo-200 py-2.5 text-center text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="flex-1 rounded-full bg-indigo-50 border border-indigo-200 py-2.5 text-center text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer"
        >
          <LogOut size={14} /> Sign Out
        </button>
      )}
    </div>
  );
}
