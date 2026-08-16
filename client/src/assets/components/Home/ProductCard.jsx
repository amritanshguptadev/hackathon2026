import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../../../config/api";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Reserved: "bg-amber-50 text-amber-700 border-amber-100",
  Sold: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart() || { addToCart: () => {} };
  const { isFavorite, toggleFavorite } = useWishlist() || {
    isFavorite: () => false,
    toggleFavorite: () => {},
  };

  const prodId = product._id || product.id;
  const isLiked = isFavorite(prodId);
  const status = product.status || "Available";
  const statusClass = STATUS_STYLES[status] || STATUS_STYLES.Available;
  const to = prodId ? `/api/product/${prodId}` : "/all-products";

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <Link
      to={to}
      className="cm-card-hover group block overflow-hidden rounded-2xl bg-white border border-indigo-50/80 shadow-2xs"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 p-2">
        <img
          src={resolveImageUrl(product.image)}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/products/1.jpg";
          }}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition active:scale-90 cursor-pointer ${
            isLiked
              ? "bg-white text-rose-500 hover:bg-rose-50 ring-2 ring-rose-100"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
          aria-label={isLiked ? "Remove from wishlist" : "Save to wishlist"}
          title={isLiked ? "Remove from Liked" : "Save to Liked"}
        >
          <Heart size={15} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
        </button>

        {/* Quick Add to Cart button on hover */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full cm-gradient-btn text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
          title="Add to Campus Cart"
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          <p className="shrink-0 text-[15px] font-extrabold text-indigo-700">
            {product.price === 0 || product.price === "FREE"
              ? "FREE"
              : `₹${product.price}`}
          </p>
        </div>

        <p className="line-clamp-1 text-xs text-slate-500">
          {product.meta ||
            `${product.condition || "Good condition"} • ${
              product.location || "Campus"
            }`}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${statusClass}`}
          >
            {status}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            {product.timeAgo || "Recently"}
          </span>
        </div>
      </div>
    </Link>
  );
}
