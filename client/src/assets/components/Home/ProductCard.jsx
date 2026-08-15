import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  Available: "bg-emerald-50 text-emerald-700",
  Reserved: "bg-orange-50 text-orange-700",
  Sold: "bg-slate-100 text-slate-500",
};

export default function ProductCard({ product }) {
  const status = product.status || "Available";
  const statusClass = STATUS_STYLES[status] || STATUS_STYLES.Available;
  const to = product._id ? `/api/product/${product._id}` : "/all-products";

  return (
    <Link
      to={to}
      className="cm-card-hover group block overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--cm-border)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--cm-bg)]">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--cm-slate)] shadow-sm transition hover:text-rose-500"
          aria-label="Save to wishlist"
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-[15px] font-bold text-[var(--cm-ink)]">
            {product.title}
          </h3>
          <p className="shrink-0 text-[15px] font-bold text-[var(--cm-ink)]">
            {product.price === 0 || product.price === "FREE"
              ? "FREE"
              : `₹${product.price}`}
          </p>
        </div>

        <p className="line-clamp-1 text-sm text-[var(--cm-slate)]">
          {product.meta ||
            `${product.condition || "Good condition"} • ${
              product.location || "Campus"
            }`}
        </p>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}
          >
            {status}
          </span>
          <span className="text-xs text-[var(--cm-slate)]">
            {product.timeAgo || "Recently"}
          </span>
        </div>
      </div>
    </Link>
  );
}
