import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import ProductCard from "../Home/ProductCard";
import { DEMO_LISTINGS, IMAGES } from "../../../data/images";
import { API_URL } from "../../../config/api";

function normalizeProduct(p, index) {
  const statuses = ["Available", "Available", "Reserved", "Sold"];
  const fallbackImages = Object.values(IMAGES.products);
  return {
    _id: p._id || `item-${index}`,
    title: p.title || p.name || "Campus listing",
    price: p.price ?? "—",
    image: p.image || fallbackImages[index % fallbackImages.length],
    meta:
      p.description?.slice(0, 48) ||
      `${p.condition || "Good condition"} • Campus`,
    status: p.status || statuses[index % statuses.length],
    timeAgo: p.timeAgo || "Recently",
  };
}

export default function AllProducts() {
  const [products, setProducts] = useState(DEMO_LISTINGS);
  const navigate = useNavigate();

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
        setProducts(merged.map(normalizeProduct));
      })
      .catch(() => setProducts(DEMO_LISTINGS));
  }, []);

  return (
    <main className="min-h-screen bg-[var(--cm-bg)]">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-[var(--cm-blue)] md:hidden"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1
          className="text-2xl font-bold text-[var(--cm-ink)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          All Listings
        </h1>
        <p className="mt-1 text-[var(--cm-slate)]">
          Browse campus deals on Buykro — textbooks, tech, furniture & more.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
