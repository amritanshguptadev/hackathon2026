import { ArrowLeft, Filter, SlidersHorizontal, X, Search, Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import ProductCard from "../Home/ProductCard";
import PriceRangeFilter, { formatINR, parsePrice } from "../../../components/PriceRangeFilter";
import { DEMO_LISTINGS, IMAGES } from "../../../data/images";
import { API_URL } from "../../../config/api";

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Books & Notes",
  "Furniture",
  "Cycles & Bikes",
  "Hostel Essentials",
  "Appliances",
  "Clothing",
  "Sports & Fitness",
  "Stationery",
  "Free / Giveaway",
];

const CONDITIONS = ["Like New", "Good", "Fair"];

const LOCATIONS = [
  "All Locations",
  "North Hostel",
  "Library Area",
  "West Campus",
  "Block C",
  "East Block",
  "Main Gate",
  "Delhi University",
  "Mumbai University",
  "Christ University",
  "IIT Gandhinagar",
];

const STATUSES = ["Available", "Reserved", "Sold"];

function inferCategory(title = "", desc = "") {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes("macbook") || text.includes("laptop") || text.includes("headphone") || text.includes("keyboard") || text.includes("phone") || text.includes("charger")) return "Electronics";
  if (text.includes("book") || text.includes("calculus") || text.includes("notes") || text.includes("gate")) return "Books & Notes";
  if (text.includes("chair") || text.includes("table") || text.includes("bed") || text.includes("sofa") || text.includes("shelf")) return "Furniture";
  if (text.includes("cycle") || text.includes("bike")) return "Cycles & Bikes";
  if (text.includes("lamp") || text.includes("kettle") || text.includes("fridge") || text.includes("hostel")) return "Hostel Essentials";
  if (text.includes("microwave") || text.includes("oven") || text.includes("appliance")) return "Appliances";
  if (text.includes("free") || text.includes("giveaway")) return "Free / Giveaway";
  return "Hostel Essentials";
}

function inferCondition(meta = "", desc = "") {
  const text = `${meta} ${desc}`.toLowerCase();
  if (text.includes("like new") || text.includes("barely used") || text.includes("excellent")) return "Like New";
  if (text.includes("good condition") || text.includes("well maintained") || text.includes("good")) return "Good";
  if (text.includes("fair") || text.includes("used") || text.includes("refurbished")) return "Fair";
  return "Good";
}

function inferLocation(meta = "", seller = {}) {
  if (seller?.college) return seller.college;
  if (seller?.city) return seller.city;
  const match = meta.match(/•\s*(.*)$/);
  if (match && match[1] && !match[1].includes("Campus")) return match[1].trim();
  return "Main Gate";
}

function normalizeProduct(p, index) {
  const statuses = ["Available", "Available", "Reserved", "Sold"];
  const fallbackImages = Object.values(IMAGES.products);
  const rawPrice = p.price ?? "—";
  const numPrice = parsePrice(rawPrice);
  const isFree =
    rawPrice === 0 ||
    rawPrice === "0" ||
    rawPrice === "FREE" ||
    rawPrice === "Free" ||
    p.isFree ||
    (typeof p.category === "string" && p.category.toLowerCase().includes("free"));

  const title = p.title || p.name || "Campus listing";
  const desc = p.description || "";
  const meta =
    p.meta ||
    desc.slice(0, 48) ||
    `${p.condition || "Good condition"} • ${p.location || "Campus"}`;

  const category = p.category || inferCategory(title, desc);
  const condition = p.condition || inferCondition(meta, desc);
  const location = p.location || inferLocation(meta, p.seller);
  const status = p.status || statuses[index % statuses.length];

  return {
    _id: p._id || p.id || `item-${index}`,
    title,
    price: isFree ? "FREE" : (typeof rawPrice === "number" ? rawPrice.toLocaleString("en-IN") : rawPrice),
    numericPrice: isFree ? 0 : numPrice,
    isFree,
    image: p.image || fallbackImages[index % fallbackImages.length],
    meta,
    description: desc,
    category,
    condition,
    location,
    status,
    timeAgo: p.timeAgo || "Recently",
  };
}

export default function AllProducts() {
  const [rawProducts, setRawProducts] = useState(DEMO_LISTINGS);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dynamic bounds calculated from loaded products
  const [boundMin] = useState(0);
  const [boundMax, setBoundMax] = useState(50000);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Categories");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch live products & custom user listings
  useEffect(() => {
    const customListings = JSON.parse(localStorage.getItem("studx_user_listings") || "[]");

    Promise.all([
      fetch(`${API_URL}/api/featured-products`).then((r) => r.json()).catch(() => []),
      fetch(`${API_URL}/api/deals`).then((r) => r.json()).catch(() => []),
    ])
      .then(([featured, deals]) => {
        const fetched = [
          ...(Array.isArray(featured) ? featured : []),
          ...(Array.isArray(deals) ? deals : []),
        ];
        const baseItems = fetched.length > 0 ? fetched : DEMO_LISTINGS;
        const normalized = [
          ...customListings.map(normalizeProduct),
          ...baseItems.map(normalizeProduct),
        ];

        // Deduplicate by _id
        const unique = [];
        const seen = new Set();
        normalized.forEach((item) => {
          if (!seen.has(item._id)) {
            seen.add(item._id);
            unique.push(item);
          }
        });

        setRawProducts(unique);

        // Dynamically determine maximum price bound
        const prices = unique
          .map((p) => p.numericPrice)
          .filter((p) => p !== null && !isNaN(p) && p > 0);
        if (prices.length > 0) {
          const maxP = Math.max(50000, ...prices);
          const roundedMax = Math.ceil(maxP / 1000) * 1000;
          setBoundMax(roundedMax);
          setMaxPrice(roundedMax);
        }
      })
      .catch(() => {
        const normalized = [
          ...customListings.map(normalizeProduct),
          ...DEMO_LISTINGS.map(normalizeProduct),
        ];
        setRawProducts(normalized);
        const prices = normalized
          .map((p) => p.numericPrice)
          .filter((p) => p !== null && !isNaN(p) && p > 0);
        if (prices.length > 0) {
          const maxP = Math.max(50000, ...prices);
          const roundedMax = Math.ceil(maxP / 1000) * 1000;
          setBoundMax(roundedMax);
          setMaxPrice(roundedMax);
        }
      });
  }, []);

  // Update query params when category changes from external links
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Normalized product list
  const products = useMemo(() => {
    return rawProducts.map((p, idx) => (p.numericPrice !== undefined ? p : normalizeProduct(p, idx)));
  }, [rawProducts]);

  // Handle Condition Toggle
  const toggleCondition = (cond) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  // Handle Status Toggle
  const toggleStatus = (st) => {
    setSelectedStatuses((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  // Handle Price Change
  const handlePriceChange = ({ min, max }) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Handle Price Reset
  const handleResetPrice = () => {
    setMinPrice(boundMin);
    setMaxPrice(boundMax);
  };

  // Clear All Filters
  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setMinPrice(boundMin);
    setMaxPrice(boundMax);
    setSelectedConditions([]);
    setSelectedLocation("All Locations");
    setSelectedStatuses([]);
    setSortBy("featured");
    setSearchParams({});
  };

  // Filter Active Check
  const isPriceFilterActive = minPrice > boundMin || maxPrice < boundMax;
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (isPriceFilterActive ? 1 : 0) +
    selectedConditions.length +
    (selectedLocation !== "All Locations" ? 1 : 0) +
    selectedStatuses.length;

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchLoc = p.location?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchLoc) return false;
        }

        // 2. Category Filter
        if (selectedCategory && selectedCategory !== "All Categories") {
          if (selectedCategory === "Free / Giveaway") {
            if (!p.isFree) return false;
          } else {
            const catA = p.category?.toLowerCase() || "";
            const catB = selectedCategory.toLowerCase();
            if (!catA.includes(catB) && !catB.includes(catA)) return false;
          }
        }

        // 3. Price Range Filter
        if (p.isFree) {
          // Free items are controlled via Free / Giveaway category.
          // If price slider min is set above 0 and user is browsing paid items, exclude free items
          if (selectedCategory !== "Free / Giveaway" && minPrice > boundMin) {
            return false;
          }
        } else {
          const price = p.numericPrice;
          if (price !== null && !isNaN(price)) {
            if (price < minPrice || price > maxPrice) {
              return false;
            }
          }
        }

        // 4. Condition Filter
        if (selectedConditions.length > 0) {
          const cond = p.condition?.toLowerCase() || "";
          const matchesCond = selectedConditions.some((c) =>
            cond.includes(c.toLowerCase())
          );
          if (!matchesCond) return false;
        }

        // 5. Location Filter
        if (selectedLocation && selectedLocation !== "All Locations") {
          const loc = (p.location || "").toLowerCase();
          const selLoc = selectedLocation.toLowerCase();
          if (!loc.includes(selLoc) && !selLoc.includes(loc)) return false;
        }

        // 6. Status Filter
        if (selectedStatuses.length > 0) {
          const st = p.status || "Available";
          if (!selectedStatuses.includes(st)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return (a.numericPrice ?? 0) - (b.numericPrice ?? 0);
        }
        if (sortBy === "price-high") {
          return (b.numericPrice ?? 0) - (a.numericPrice ?? 0);
        }
        if (sortBy === "name-az") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    boundMin,
    selectedConditions,
    selectedLocation,
    selectedStatuses,
    sortBy,
  ]);

  // Render Filter Sidebar / Drawer Content
  const renderFilterControls = (isMobile = false) => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="block text-sm font-bold text-[var(--cm-ink)] mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-xl border border-[var(--cm-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:ring-2 focus:ring-[var(--cm-blue)]/20 cursor-pointer shadow-2xs"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-[var(--cm-border)]" />

      {/* Dual Price Range Filter */}
      <PriceRangeFilter
        min={boundMin}
        max={boundMax}
        minValue={minPrice}
        maxValue={maxPrice}
        step={100}
        onChange={handlePriceChange}
        onReset={handleResetPrice}
      />

      <hr className="border-[var(--cm-border)]" />

      {/* Condition Filter */}
      <div>
        <label className="block text-sm font-bold text-[var(--cm-ink)] mb-2.5">
          Condition
        </label>
        <div className="space-y-2">
          {CONDITIONS.map((cond) => {
            const checked = selectedConditions.includes(cond);
            return (
              <label
                key={cond}
                className="flex items-center gap-2.5 text-sm text-[var(--cm-ink)] cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCondition(cond)}
                  className="hidden"
                />
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors ${
                    checked
                      ? "bg-[var(--cm-blue)] border-[var(--cm-blue)] text-white"
                      : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}
                >
                  {checked && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-medium text-slate-700">{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-[var(--cm-border)]" />

      {/* Campus Location Filter */}
      <div>
        <label className="block text-sm font-bold text-[var(--cm-ink)] mb-2">
          Campus Location
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full rounded-xl border border-[var(--cm-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:ring-2 focus:ring-[var(--cm-blue)]/20 cursor-pointer shadow-2xs"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <hr className="border-[var(--cm-border)]" />

      {/* Product Status Filter */}
      <div>
        <label className="block text-sm font-bold text-[var(--cm-ink)] mb-2.5">
          Status
        </label>
        <div className="space-y-2">
          {STATUSES.map((st) => {
            const checked = selectedStatuses.includes(st);
            return (
              <label
                key={st}
                className="flex items-center gap-2.5 text-sm text-[var(--cm-ink)] cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleStatus(st)}
                  className="hidden"
                />
                <span
                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-md border transition-colors ${
                    checked
                      ? "bg-[var(--cm-blue)] border-[var(--cm-blue)] text-white"
                      : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}
                >
                  {checked && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-medium text-slate-700">{st}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={handleClearAllFilters}
          className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100/70 transition cursor-pointer"
        >
          <RotateCcw size={13} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[var(--cm-bg)]">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation & Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[var(--cm-border)]">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--cm-blue)] hover:text-[var(--cm-blue-dark)] transition md:hidden cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1
              className="text-2xl font-black text-[var(--cm-ink)] sm:text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Campus Marketplace
            </h1>
            <p className="mt-1 text-sm text-[var(--cm-slate)]">
              Browse textbook deals, tech, dorm furniture, and campus essentials.
            </p>
          </div>

          {/* Quick Search & Sort Bar */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 md:w-72">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings…"
                className="w-full rounded-xl border border-[var(--cm-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] focus:ring-2 focus:ring-[var(--cm-blue)]/20 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="relative flex lg:hidden items-center gap-2 rounded-xl bg-white border border-[var(--cm-border)] px-4 py-2.5 text-sm font-semibold text-[var(--cm-ink)] shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              aria-label="Open Filters"
            >
              <SlidersHorizontal size={16} className="text-[var(--cm-blue)]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cm-blue)] text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-[var(--cm-slate)]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[var(--cm-border)] bg-white px-3 py-2 text-xs font-bold text-[var(--cm-ink)] outline-none transition focus:border-[var(--cm-blue)] cursor-pointer shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="mt-8 flex items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24 rounded-2xl bg-white p-5 border border-[var(--cm-border)] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--cm-border)] mb-5">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[var(--cm-blue)]" />
                <h2 className="text-base font-bold text-[var(--cm-ink)]">Filters</h2>
              </div>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-[var(--cm-blue-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--cm-blue)]">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            {renderFilterControls(false)}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[var(--cm-slate)]">Active:</span>

                {/* Price Range Chip */}
                {isPriceFilterActive && (
                  <button
                    type="button"
                    onClick={handleResetPrice}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cm-blue-soft)] border border-[var(--cm-blue)]/20 px-3 py-1 text-xs font-semibold text-[var(--cm-blue)] hover:bg-[var(--cm-blue)]/10 transition cursor-pointer"
                  >
                    <span>Price: {formatINR(minPrice)} – {formatINR(maxPrice)}</span>
                    <X size={12} />
                  </button>
                )}

                {/* Category Chip */}
                {selectedCategory !== "All Categories" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All Categories")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <span>Category: {selectedCategory}</span>
                    <X size={12} />
                  </button>
                )}

                {/* Search Query Chip */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <span>Search: "{searchQuery}"</span>
                    <X size={12} />
                  </button>
                )}

                {/* Location Chip */}
                {selectedLocation !== "All Locations" && (
                  <button
                    type="button"
                    onClick={() => setSelectedLocation("All Locations")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <span>Location: {selectedLocation}</span>
                    <X size={12} />
                  </button>
                )}

                {/* Condition Chips */}
                {selectedConditions.map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <span>Condition: {cond}</span>
                    <X size={12} />
                  </button>
                ))}

                {/* Status Chips */}
                {selectedStatuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStatus(st)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <span>Status: {st}</span>
                    <X size={12} />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold text-rose-600 hover:underline ml-1 cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count & Mobile Sort Bar */}
            <div className="mb-4 flex items-center justify-between text-xs font-semibold text-[var(--cm-slate)]">
              <span>
                Showing <strong className="text-[var(--cm-ink)]">{filteredProducts.length}</strong> of {products.length} items
              </span>

              <div className="flex sm:hidden items-center gap-1">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-[var(--cm-border)] bg-white px-2 py-1 text-xs font-bold text-[var(--cm-ink)]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-dashed border-[var(--cm-border)] bg-white p-12 text-center shadow-2xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cm-blue-soft)] text-[var(--cm-blue)] mb-4">
                  <SlidersHorizontal size={28} />
                </div>
                <h3 className="text-lg font-bold text-[var(--cm-ink)]">
                  No listings found
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--cm-slate)]">
                  Try adjusting your price range or clearing active filters to see more campus listings.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  {isPriceFilterActive && (
                    <button
                      type="button"
                      onClick={handleResetPrice}
                      className="rounded-xl border border-[var(--cm-border)] bg-white px-4 py-2 text-xs font-bold text-[var(--cm-ink)] hover:bg-slate-50 transition cursor-pointer"
                    >
                      Reset Price Range
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="rounded-xl bg-[var(--cm-blue)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--cm-blue-dark)] transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[var(--cm-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[var(--cm-blue)]" />
                <h3 className="text-base font-bold text-[var(--cm-ink)]">Filter Listings</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {renderFilterControls(true)}
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-[var(--cm-border)] p-4 flex gap-3 bg-slate-50">
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="flex-1 rounded-xl border border-[var(--cm-border)] bg-white py-2.5 text-xs font-bold text-[var(--cm-ink)] hover:bg-slate-100 transition cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-xl bg-[var(--cm-blue)] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--cm-blue-dark)] transition cursor-pointer"
              >
                View Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
