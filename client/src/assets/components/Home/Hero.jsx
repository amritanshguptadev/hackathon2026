import {
  Search,
  ShieldCheck,
  Zap,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  School,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const REAL_CAMPUS_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
    campus: "Dev Sanskriti Vishwavidyalaya (DSVV)",
    spot: "Central Library & Shantikunj Quad",
    activity: "Laptop & Tech Peer Exchange",
    badge: "💻 Up to 70% Off Student Tech",
    badgeColor: "from-blue-600 to-indigo-600",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
    campus: "Dev Sanskriti Vishwavidyalaya",
    spot: "Academic Block Book Bazaar",
    activity: "Second-hand Textbooks & Notes",
    badge: "📚 2,500+ Books & Notes Traded",
    badgeColor: "from-indigo-600 to-purple-600",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80",
    campus: "Dev Sanskriti Vishwavidyalaya",
    spot: "Mahakal Hostel & Sports Complex",
    activity: "Campus Cycles & Dorm Essentials",
    badge: "🚲 Instant Free Hand-off on Campus",
    badgeColor: "from-emerald-600 to-teal-600",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    campus: "Dev Sanskriti Vishwavidyalaya",
    spot: "Yagya Shala & Main Gate Area",
    activity: "Calculators, Lab Gear & Electronics",
    badge: "🛡️ 100% Verified DSVV Members",
    badgeColor: "from-rose-600 to-pink-600",
  },
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Auto-play slideshow timer (every 4 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % REAL_CAMPUS_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % REAL_CAMPUS_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? REAL_CAMPUS_SLIDES.length - 1 : prev - 1
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/all-products?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/all-products");
    }
  };

  const handleQuickTag = (tag) => {
    navigate(`/all-products?category=${encodeURIComponent(tag)}`);
  };

  const activeSlideData = REAL_CAMPUS_SLIDES[currentSlide];

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      {/* ── SPLIT HERO SHOWCASE WITH REAL CAMPUS SLIDESHOW ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-900/60 p-6 sm:p-10 lg:p-12">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-600/25 blur-[100px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── LEFT: Typography, Search & Badges (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-300 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Dev Sanskriti Vishwavidyalaya Marketplace</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The smartest way to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                buy &amp; sell
              </span>{" "}
              on campus.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join students across <strong className="text-white">Dev Sanskriti Vishwavidyalaya</strong> trading second-hand textbooks, electronics, cycles, and hostel gear with zero shipping fees &amp; instant physical hand-offs.
            </p>

            {/* Global Quick Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 sm:p-2 shadow-2xl backdrop-blur-md ring-2 ring-white/20 transition-all focus-within:ring-indigo-400 max-w-xl mx-auto lg:mx-0"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search laptops, cycles, books, lab gear…"
                className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full cm-gradient-btn text-white transition hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Popular:</span>
              {["Electronics", "Cycles", "Books & Notes", "Furniture", "Calculators"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTag(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition text-[11px] font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">100% Verified</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Campus Students</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                  <Zap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Zero Fees</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Free Hand-off</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Campus Spots</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Library / Hostels</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Real Indian Campus Interactive Slideshow (5 Cols) ── */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slideshow Container Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group">
              {REAL_CAMPUS_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.campus}
                    className="w-full h-full object-cover transform transition-transform duration-1000 scale-100 group-hover:scale-105"
                  />
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
                </div>
              ))}

              {/* Floating Top Badge: Campus Name */}
              <div className="absolute top-3 left-3 z-20 rounded-2xl bg-slate-900/90 backdrop-blur-md py-1.5 px-3 border border-white/20 shadow-xl flex items-center gap-2">
                <School size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-white tracking-tight">
                  {activeSlideData.campus}
                </span>
              </div>

              {/* Floating Top Right Tag */}
              <div className="absolute top-3 right-3 z-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md py-1.5 px-3 border border-white/20 shadow-xl text-[10.5px] font-extrabold text-white">
                {activeSlideData.badge}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-20 rounded-2xl bg-slate-900/90 backdrop-blur-md p-3.5 border border-white/20 shadow-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold truncate">
                    <MapPin size={13} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{activeSlideData.spot}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {activeSlideData.activity}
                  </p>
                </div>

                {/* Slideshow Arrow Navigation */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handlePrevSlide}
                    className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slide Indicators / Dots */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {REAL_CAMPUS_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? "w-6 bg-white shadow-xs"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
