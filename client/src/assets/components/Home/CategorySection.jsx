import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { categoryService, FALLBACK_CATEGORIES } from "../../../services/categoryService";
import { wantedService } from "../../../services/wantedService";

const FALLBACK_WANTED = [
  "Looking for a second-hand cycle",
  "Need a mini fridge for hostel",
  "Wanted: Scientific calculator",
  "Looking for GATE prep books",
];

export default function CategorySection() {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [wantedList, setWantedList] = useState(FALLBACK_WANTED);

  useEffect(() => {
    categoryService?.getActiveCategories?.()
      .then((data) => {
        if (data && data.length > 0) setCategories(data);
      })
      .catch(() => {});

    wantedService?.getWantedPosts?.("Open")
      .then((posts) => {
        if (posts && posts.length > 0) {
          setWantedList(posts.slice(0, 4).map((p) => p.title));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        {/* ── LEFT: Categories ── */}
        <div className="flex-1 min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-lg font-bold text-[var(--cm-ink)] sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Explore Categories
            </h2>
            <Link
              to="/all-products"
              className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              See all <ChevronRight size={13} />
            </Link>
          </div>

          {/* Amazon-style compact grid */}
          <div className="rounded-2xl bg-white border border-indigo-100/90 overflow-hidden shadow-xs">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 divide-x divide-y divide-indigo-50">
              {categories.map((cat) => (
                <Link
                  key={cat.id || cat.name}
                  to={`/all-products?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center gap-1.5 px-2 py-3.5 transition hover:bg-gradient-to-b hover:from-indigo-50/60 hover:to-purple-50/40"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl shadow-2xs transition group-hover:scale-110"
                    style={{ backgroundColor: cat.color || "#eef2ff" }}
                  >
                    {cat.emoji || "📦"}
                  </span>
                  <span className="text-center text-[11px] font-semibold leading-tight text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Post a Request ── */}
        <div className="w-full lg:w-[270px] shrink-0">
          <div className="mb-3">
            <h2
              className="text-lg font-bold text-[var(--cm-ink)] sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Wanted by Students
            </h2>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-blue-50/80 p-4 border border-indigo-200/80 shadow-xs">
            <ul className="space-y-2.5 mb-4">
              {wantedList.map((text, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-2xs border border-indigo-100">
                    <Search size={12} />
                  </span>
                  <p className="text-xs leading-snug font-medium text-slate-800">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              to="/sell"
              className="flex w-full items-center justify-center rounded-full cm-gradient-btn py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              Browse Wanted Listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
