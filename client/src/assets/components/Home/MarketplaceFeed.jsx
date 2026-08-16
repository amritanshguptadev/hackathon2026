import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";
import ProductCard from "./ProductCard";
import { DEMO_LISTINGS, IMAGES } from "../../../data/images";
import { productService } from "../../../services/productService";

const WANTED = [
  "Looking for a second-hand cycle",
  "Need a mini fridge for hostel",
  "Wanted: Scientific calculator",
];

function normalizeProduct(p, index) {
  const statuses = ["Available", "Available", "Reserved", "Sold"];
  const fallbackImages = Object.values(IMAGES.products);
  return {
    _id: p._id || p.id,
    id: p._id || p.id,
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
    productService.getProducts({ limit: 6 })
      .then((data) => {
        if (data && data.length > 0) {
          setListings(data.map(normalizeProduct));
        } else {
          setListings(DEMO_LISTINGS);
        }
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
