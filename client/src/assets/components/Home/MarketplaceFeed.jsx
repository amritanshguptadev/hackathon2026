import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";
import ProductCard from "./ProductCard";
import { DEMO_LISTINGS, IMAGES } from "../../../data/images";
import { API_URL } from "../../../config/api";

const WANTED = [
  "Looking for a second-hand cycle",
  "Need a mini fridge for hostel",
  "Wanted: Scientific calculator",
];

function normalizeProduct(p, index) {
  const statuses = ["Available", "Available", "Reserved", "Sold"];
  const fallbackImages = Object.values(IMAGES.products);
  return {
    _id: p._id,
    title: p.title || p.name || "Campus listing",
    price: p.price ?? "—",
    image: p.image || fallbackImages[index % fallbackImages.length],
    meta:
      p.description?.slice(0, 48) ||
      `${p.condition || "Good condition"} • Campus`,
    status: p.status || statuses[index % statuses.length],
    timeAgo: p.timeAgo || ["2h ago", "5h ago", "1d ago", "2d ago"][index % 4],
  };
}

export default function MarketplaceFeed() {
  const [listings, setListings] = useState(DEMO_LISTINGS);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/featured-products`).then((r) => r.json()),
      fetch(`${API_URL}/api/deals`).then((r) => r.json()),
    ])
      .then(([featured, deals]) => {
        const merged = [
          ...(Array.isArray(featured) ? featured : []),
          ...(Array.isArray(deals) ? deals : []),
        ];
        if (merged.length === 0) return;
        setListings(merged.slice(0, 6).map(normalizeProduct));
      })
      .catch(() => setListings(DEMO_LISTINGS));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h2
          className="text-xl font-bold text-[var(--cm-ink)] sm:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recently Listed
        </h2>
        <Link
          to="/all-products"
          className="text-sm font-semibold text-[var(--cm-blue)] hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {listings.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
