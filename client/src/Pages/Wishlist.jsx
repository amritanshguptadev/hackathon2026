import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "../assets/components/Home/Header";
import Footer from "../assets/components/Home/Footer";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../config/api";
import { DEMO_LISTINGS } from "../data/images";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Zap,
  Tag,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

export default function Wishlist() {
  const { favorites, removeFavorite, clearFavorites, favoriteCount, toggleFavorite } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(favorites.map((f) => f.category || "Campus Item"))];

  const filteredFavorites =
    selectedCategory === "All"
      ? favorites
      : favorites.filter((f) => (f.category || "Campus Item") === selectedCategory);

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toast.success(`🛒 Moved "${product.title?.slice(0, 28)}..." to your Campus Cart!`);
  };

  const handleMoveAllToCart = () => {
    if (favorites.length === 0) return;
    favorites.forEach((item) => addToCart(item, 1));
    toast.success(`🎉 Moved all ${favorites.length} items to your Campus Cart!`);
    navigate("/cart");
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("📋 Wishlist link copied to clipboard!");
    } else {
      toast.info("Share this URL with your campus friends!");
    }
  };

  const recommendedItems = DEMO_LISTINGS.filter(
    (item) => !favorites.some((f) => String(f._id) === String(item._id))
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <Header showSearchBar={true} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
              <span>/</span>
              <span className="text-indigo-600">Liked Items</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Liked Items
              <span className="inline-flex items-center justify-center text-sm font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                ❤️ {favoriteCount} {favoriteCount === 1 ? "item" : "items"}
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Saved second-hand campus gear, textbooks, laptops, and cycles from verified students.
            </p>
          </div>

          {/* Top Actions */}
          {favoriteCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handleShareWishlist}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                <Share2 size={15} />
                Share
              </button>
              <button
                onClick={clearFavorites}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-rose-200 bg-rose-50/50 text-xs font-bold text-rose-600 hover:bg-rose-100/60 transition cursor-pointer"
              >
                <Trash2 size={15} />
                Clear All
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full cm-gradient-btn text-xs font-extrabold text-white shadow-md transition active:scale-95 cursor-pointer"
              >
                <ShoppingCart size={16} />
                Move All to Cart
              </button>
            </div>
          )}
        </div>

        {/* Categories Filter Pills */}
        {favoriteCount > 0 && categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Liked Items Content */}
        {favoriteCount === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-white border border-indigo-100/80 p-8 sm:p-14 text-center shadow-xs mb-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-5 ring-8 ring-rose-50/40">
              <Heart size={38} className="fill-rose-500" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Liked Items List is Empty
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Tap the heart icon on any campus listing to bookmark items you love, monitor price drops, and buy before semester starts!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/all-products"
                className="w-full sm:w-auto cm-gradient-btn px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                Explore Marketplace <ArrowRight size={16} />
              </Link>
              <Link
                to="/sell"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-bold text-sm transition"
              >
                + List an Item to Sell
              </Link>
            </div>
          </div>
        ) : (
          /* Liked Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredFavorites.map((item, index) => {
              const prodId = item._id || item.id || `bk-fav-${index}`;
              const priceDisplay =
                item.price === 0 || item.price === "FREE"
                  ? "FREE"
                  : `₹${typeof item.price === "number" ? item.price.toLocaleString("en-IN") : item.price}`;

              return (
                <div
                  key={prodId}
                  className="rounded-3xl bg-white border border-indigo-100/90 shadow-2xs hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Header & Badges */}
                  <div className="relative aspect-[16/10] bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                    <Link to={`/api/product/${prodId}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/products/1.jpg";
                        }}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </Link>

                    {/* Remove from Liked Button */}
                    <button
                      onClick={() => removeFavorite(prodId)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-xs hover:bg-rose-50 transition cursor-pointer"
                      title="Remove from Liked"
                    >
                      <Heart size={16} className="fill-rose-500" />
                    </button>

                    {/* Condition Tag */}
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs">
                      {item.condition || "Verified"}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {item.category || "Campus Gear"}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <MapPin size={12} className="text-indigo-400" />
                          {item.campusLocation || item.location || "Campus Area"}
                        </span>
                      </div>

                      <Link to={`/api/product/${prodId}`}>
                        <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing and Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            2nd-Hand Price
                          </p>
                          <p className="text-xl font-extrabold text-indigo-700">
                            {priceDisplay}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          ✓ Free Hand-off
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-700 text-xs font-bold transition active:scale-95 cursor-pointer"
                        >
                          <ShoppingCart size={15} />
                          Add to Cart
                        </button>
                        <Link
                          to={`/api/product/${prodId}`}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl cm-gradient-btn text-white text-xs font-extrabold shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <Zap size={14} />
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommended Items Section */}
        {recommendedItems.length > 0 && (
          <div className="mt-8 pt-8 border-t border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Recommended For You
                </span>
                <h2
                  className="text-xl sm:text-2xl font-extrabold text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Popular Campus Picks
                </h2>
              </div>
              <Link
                to="/all-products"
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1"
              >
                Browse all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedItems.map((rec) => (
                <div
                  key={rec._id}
                  className="rounded-2xl bg-white border border-indigo-50 p-4 shadow-2xs hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div className="relative aspect-[4/3] bg-slate-50 rounded-xl p-2 mb-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={resolveImageUrl(rec.image)}
                      alt={rec.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/products/1.jpg";
                      }}
                      className="h-full w-full object-contain transition group-hover:scale-105"
                    />
                    <button
                      onClick={() => toggleFavorite(rec)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 hover:text-rose-500 shadow-2xs transition cursor-pointer"
                    >
                      <Heart size={14} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
                      {rec.title}
                    </h4>
                    <p className="text-sm font-extrabold text-indigo-700 mt-1">
                      ₹{rec.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(rec)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
