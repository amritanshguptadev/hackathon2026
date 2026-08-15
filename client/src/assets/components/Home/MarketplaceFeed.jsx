import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";
import ProductCard from "./ProductCard";
import { DEMO_LISTINGS, IMAGES } from "../../../data/images";

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
      fetch("http://localhost:3000/api/featured-products").then((r) => r.json()),
      fetch("http://localhost:3000/api/deals").then((r) => r.json()),
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
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
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
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {listings.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[var(--cm-blue-soft)] p-5">
            <h3 className="mb-4 text-base font-bold text-[var(--cm-ink)]">
              Wanted by Students
            </h3>
            <ul className="space-y-3">
              {WANTED.map((text) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[var(--cm-blue)]">
                    <Search size={14} />
                  </span>
                  <p className="text-sm text-[var(--cm-ink)]">{text}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/product-listing"
              className="mt-4 flex w-full items-center justify-center rounded-full border border-[var(--cm-blue)] bg-white py-2.5 text-sm font-semibold text-[var(--cm-blue)] transition hover:bg-[var(--cm-blue)] hover:text-white"
            >
              Post a Request
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-[var(--cm-border)]">
            <h3 className="mb-4 text-base font-bold text-[var(--cm-ink)]">
              How It Works
            </h3>
            <ol className="space-y-3">
              {[
                "List your unused campus items",
                "Chat securely with buyers",
                "Meet on campus & exchange",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cm-blue)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm text-[var(--cm-slate)]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-[var(--cm-safety-border)] bg-[var(--cm-safety)] p-5">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-700" />
              <h3 className="text-base font-bold text-[var(--cm-ink)]">
                Campus Safety
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-amber-950/80">
              Always meet in public campus spots, never share OTPs, and verify
              items before paying.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
