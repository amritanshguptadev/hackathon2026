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
        const mapped = data.slice(0, 6).map((item, i) => ({
          name: item.name,
          image: CATEGORY_IMAGES[i % CATEGORY_IMAGES.length].image,
        }));
        setCategories(mapped);
      })
      .catch(() => setCategories(CATEGORY_IMAGES));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <h2
        className="mb-5 text-xl font-bold text-[var(--cm-ink)] sm:text-2xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Explore Categories
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
        {categories.map((item) => (
          <Link
            key={item.name}
            to="/all-products"
            className="cm-card-hover flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-[var(--cm-border)]"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--cm-blue-soft)]"
            />
            <span className="text-center text-sm font-semibold text-[var(--cm-ink)]">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
