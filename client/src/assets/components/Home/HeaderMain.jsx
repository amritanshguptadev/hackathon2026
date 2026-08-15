import { Heart, MessageCircle, User, Menu, X, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu.jsx";
import { useSocket } from "../../../context/SocketContext";
import { useCart } from "../../../context/CartContext";

export default function HeaderMain({ showSearchBar = true }) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart() || { cartCount: 0 };
  const isAuthenticated = !!localStorage.getItem("token");
  const { totalUnreadCount } = useSocket() || { totalUnreadCount: 0 };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cm-border-indigo)] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 flex items-center">
          <img
            src="/images/logo.png"
            alt="BuyKaro"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
          />
        </Link>

        {showSearchBar && (
          <form
            onSubmit={handleSearch}
            className="relative mx-auto hidden min-w-0 flex-1 max-w-xl md:block"
          >
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search textbooks, tech, cycle, furniture…"
              className="w-full rounded-full border border-[var(--cm-border)] bg-[var(--cm-bg)] py-2.5 pl-11 pr-4 text-sm text-[var(--cm-ink)] outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </form>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/upcoming"
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <Link
            to={isAuthenticated ? "/messages" : "/login"}
            className="relative hidden rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 sm:inline-flex"
            aria-label={totalUnreadCount > 0 ? `Messages (${totalUnreadCount} unread)` : "Messages"}
          >
            <MessageCircle size={20} />
            {isAuthenticated && totalUnreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs animate-scale-in">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="rounded-full p-2.5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
            aria-label="Account"
          >
            <User size={20} />
          </Link>

          <Link
            to="/sell"
            className="ml-1 hidden rounded-full cm-gradient-btn px-5 py-2.5 text-sm font-bold shadow-md transition sm:inline-flex items-center gap-1.5"
          >
            <span>+ Sell Item</span>
          </Link>

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

      {menuOpen && (
        <div className="border-t border-[var(--cm-border)] bg-white px-4 py-3 md:hidden">
          <MobileMenu />
        </div>
      )}
    </header>
  );
}
