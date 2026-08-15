import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORY_IMAGES } from "../../../data/images";

export default function CategorySection() {
  const [categories, setCategories] = useState(CATEGORY_IMAGES);

  useEffect(() => {
    fetch("http://localhost:3000/api/category")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const mapped = data.slice(0, 12).map((item, i) => ({
          name: item.name,
          image: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length].image,
          emoji: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length].emoji,
        }));
        setCategories(mapped);
      })
      .catch(() => setCategories(CATEGORY_IMAGES));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-xl font-bold text-[var(--cm-ink)] sm:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Explore Categories
        </h2>
        <Link
          to="/all-products"
          className="text-sm font-semibold text-[var(--cm-blue)] transition hover:underline"
        >
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 md:gap-4">
        {categories.map((item) => (
          <Link
            key={item.name}
            to="/all-products"
            className="group cm-card-hover flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-[var(--cm-border)] transition hover:ring-[var(--cm-blue)] hover:shadow-md"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--cm-blue-soft)] transition group-hover:ring-[var(--cm-blue)]"
              />
              {item.emoji && (
                <span className="absolute -bottom-1 -right-1 text-base leading-none">
                  {item.emoji}
                </span>
              )}
            </div>
            <span className="text-center text-xs font-semibold text-[var(--cm-ink)] leading-tight">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
