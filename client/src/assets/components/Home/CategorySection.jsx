import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", emoji: "💻", color: "#e8f0fe" },
  { name: "Books & Notes", emoji: "📚", color: "#fef9e7" },
  { name: "Furniture", emoji: "🪑", color: "#fdf2f8" },
  { name: "Cycles & Bikes", emoji: "🚲", color: "#e8f5e9" },
  { name: "Hostel Essentials", emoji: "🏠", color: "#fff3e0" },
  { name: "Appliances", emoji: "🔌", color: "#e3f2fd" },
  { name: "Clothing", emoji: "👕", color: "#f3e5f5" },
  { name: "Sports & Fitness", emoji: "⚽", color: "#e8f5e9" },
  { name: "Stationery", emoji: "✏️", color: "#fffde7" },
  { name: "Musical Instruments", emoji: "🎸", color: "#fce4ec" },
  { name: "Lab Equipment", emoji: "🔬", color: "#e0f7fa" },
  { name: "Food & Kitchen", emoji: "🍳", color: "#fff8e1" },
  { name: "Photography", emoji: "📷", color: "#f1f8e9" },
  { name: "Gaming", emoji: "🎮", color: "#ede7f6" },
  { name: "Bags & Travel", emoji: "🎒", color: "#e8eaf6" },
  { name: "Tools & Hardware", emoji: "🔧", color: "#efebe9" },
];

const WANTED = [
  "Looking for a second-hand cycle",
  "Need a mini fridge for hostel",
  "Wanted: Scientific calculator",
  "Looking for GATE prep books",
];

export default function CategorySection() {
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
              className="flex items-center gap-0.5 text-xs font-semibold text-[var(--cm-blue)] hover:underline"
            >
              See all <ChevronRight size={13} />
            </Link>
          </div>

          {/* Amazon-style compact grid */}
          <div className="rounded-2xl bg-white ring-1 ring-[var(--cm-border)] overflow-hidden">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 divide-x divide-y divide-[var(--cm-border)]">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  to="/all-products"
                  className="group flex flex-col items-center gap-1.5 px-2 py-3 transition hover:bg-[var(--cm-blue-soft)]"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl shadow-sm transition group-hover:scale-110"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.emoji}
                  </span>
                  <span className="text-center text-[10px] font-medium leading-tight text-[var(--cm-ink)] group-hover:text-[var(--cm-blue)]">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Post a Request ── */}
        <div className="w-full lg:w-[260px] shrink-0">
          <div className="mb-3">
            <h2
              className="text-lg font-bold text-[var(--cm-ink)] sm:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Wanted by Students
            </h2>
          </div>

          <div className="rounded-2xl bg-[var(--cm-blue-soft)] p-4 ring-1 ring-[var(--cm-border)]">
            <ul className="space-y-2.5 mb-4">
              {WANTED.map((text) => (
                <li key={text} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[var(--cm-blue)] shadow-sm">
                    <Search size={12} />
                  </span>
                  <p className="text-xs leading-snug text-[var(--cm-ink)]">{text}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/sell"
              className="flex w-full items-center justify-center rounded-full bg-[var(--cm-blue)] py-2.5 text-xs font-bold text-white shadow transition hover:bg-blue-700"
            >
              + Post a Request
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
