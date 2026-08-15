import { Heart, MessageCircle, User, Menu, X, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu.jsx";

export default function HeaderMain({ showSearchBar = true }) {
  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);
  const isAuthenticated = !!localStorage.getItem("token");

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cm-border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <span
            className="text-xl font-extrabold tracking-tight text-[var(--cm-blue)] sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Buykro
          </span>
        </Link>

        {showSearchBar && (
          <form
            onSubmit={handleSearch}
            className="relative mx-auto hidden min-w-0 flex-1 max-w-xl md:block"
          >
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cm-slate)]"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search textbooks, tech, furniture…"
              className="w-full rounded-full border border-[var(--cm-border)] bg-[var(--cm-bg)] py-2.5 pl-11 pr-4 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20"
            />
          </form>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/upcoming"
            className="rounded-full p-2.5 text-[var(--cm-slate)] transition hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)]"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>
          <Link
            to="/upcoming"
            className="hidden rounded-full p-2.5 text-[var(--cm-slate)] transition hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)] sm:inline-flex"
            aria-label="Messages"
          >
            <MessageCircle size={20} />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-full p-2.5 text-[var(--cm-slate)] transition hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)]"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--cm-blue)] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="rounded-full p-2.5 text-[var(--cm-slate)] transition hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)]"
            aria-label="Account"
          >
            <User size={20} />
          </Link>

          <Link
            to="/product-listing"
            className="ml-1 hidden rounded-full bg-[var(--cm-blue)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--cm-blue-dark)] sm:inline-flex"
          >
            Sell Item
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2.5 text-[var(--cm-slate)] md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--cm-border)] bg-white px-4 py-3 md:hidden">
          <MobileMenu />
        </div>
      )}
    </header>
  );
}
