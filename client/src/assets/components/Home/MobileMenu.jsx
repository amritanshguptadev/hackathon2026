import { Heart, User, Package, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";

export default function MobileMenu() {
  const isAuthenticated = !!localStorage.getItem("token");
  const userName = localStorage.getItem("loggedInUser") || "Guest";
  const { totalUnreadCount } = useSocket() || { totalUnreadCount: 0 };

  return (
    <div className="space-y-4 py-2">
      {isAuthenticated && (
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl bg-[var(--cm-blue-soft)] px-3 py-2.5"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              userName
            )}&background=2563EB&color=fff&rounded=true&size=40`}
            alt=""
            className="h-9 w-9 rounded-full"
          />
          <span className="font-semibold text-[var(--cm-ink)]">{userName}</span>
        </Link>
      )}

      <div className="grid grid-cols-4 gap-2">
        <Link
          to="/all-products"
          className="flex flex-col items-center gap-1 rounded-xl bg-[var(--cm-bg)] py-3 text-xs font-medium text-[var(--cm-slate)]"
        >
          <Package size={20} />
          Browse
        </Link>
        <Link
          to={isAuthenticated ? "/messages" : "/login"}
          className="relative flex flex-col items-center gap-1 rounded-xl bg-[var(--cm-bg)] py-3 text-xs font-medium text-[var(--cm-slate)]"
        >
          <MessageCircle size={20} />
          Messages
          {isAuthenticated && totalUnreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--cm-blue)] px-1 text-[10px] font-bold text-white shadow-xs">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </span>
          )}
        </Link>
        <Link
          to="/upcoming"
          className="flex flex-col items-center gap-1 rounded-xl bg-[var(--cm-bg)] py-3 text-xs font-medium text-[var(--cm-slate)]"
        >
          <Heart size={20} />
          Wishlist
        </Link>
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className="flex flex-col items-center gap-1 rounded-xl bg-[var(--cm-bg)] py-3 text-xs font-medium text-[var(--cm-slate)]"
        >
          <User size={20} />
          Account
        </Link>
      </div>

      <Link
        to="/product-listing"
        className="flex w-full items-center justify-center rounded-full bg-[var(--cm-blue)] py-3 text-sm font-semibold text-white"
      >
        Sell Item
      </Link>

      {!isAuthenticated && (
        <div className="flex gap-2">
          <Link
            to="/login"
            className="flex-1 rounded-full border border-[var(--cm-border)] py-2.5 text-center text-sm font-semibold text-[var(--cm-ink)]"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="flex-1 rounded-full bg-[var(--cm-blue-soft)] py-2.5 text-center text-sm font-semibold text-[var(--cm-blue)]"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
